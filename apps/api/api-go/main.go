package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/studyx-api/internal/api"
	"github.com/studyx-api/internal/api/endpoints/course/handlers"
	"github.com/studyx-api/internal/api/endpoints/course/repository"
	"github.com/studyx-api/internal/api/endpoints/course/services"
	"github.com/studyx-api/internal/api/endpoints/health"
	"github.com/studyx-api/internal/lib/supabase"
	"github.com/studyx-api/pkg/router"

	zfg "github.com/chaindead/zerocfg"
	"github.com/chaindead/zerocfg/env"
	"github.com/joho/godotenv"
)

var (
	supabaseURL = zfg.Str("supabase.url", "", "Supabase URL")
	supabaseKey = zfg.Str("supabase.api.key", "", "Supabase API Key")
)

func main() {
	err := godotenv.Load()
	if err != nil {
		slog.Warn("Failed to load .env file", "error", err.Error())
		panic(err)
	}

	err = zfg.Parse(
		env.New(),
	)
	if err != nil {
		panic(err)
	}

	supabaseClient := supabase.NewClient(*supabaseURL, *supabaseKey)

	courseRepository := repository.NewRepository(supabaseClient)
	courseService := services.NewCourseService(courseRepository)

	r := router.New()

	r.Add(router.GET("/health", health.Handle))

	// API v1 routes
	r.Add(router.NewGroup("/api/v1",
		handlers.RegisterCourseRoutes(courseService),
	).SetErrHandler(api.ErrHandler))

	httpSrv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		err := httpSrv.ListenAndServe()
		if !errors.Is(err, http.ErrServerClosed) {
			slog.Error("Failed to start http", "error", err.Error())
			os.Exit(3)
		}
	}()

	slog.Info(fmt.Sprintf(`HTTP started on port %v`, "8080"))

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	err = httpSrv.Shutdown(context.Background())
	if err != nil {
		slog.Error("HTTP shutdown", "error", err.Error())
	}

	slog.Warn("HTTP gracefully stopped!")
}
