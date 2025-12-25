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
	"github.com/studyx-api/internal/api/endpoints/course/services"
	"github.com/studyx-api/internal/api/endpoints/health"
	"github.com/studyx-api/internal/lib/supabase"
	"github.com/studyx-api/pkg/router"

	zfg "github.com/chaindead/zerocfg"
	"github.com/chaindead/zerocfg/env"
)

var (
	supabaseURL = zfg.Str("supabase.url", "https://hiumfpqtebwwjepqojsd.supabase.co", "Supabase URL")
	supabaseKey = zfg.Str("supabase.api.key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdW1mcHF0ZWJ3d2plcHFvanNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Nzg2NzUsImV4cCI6MjA3MDI1NDY3NX0.r8X2qOOomWYICpr7xmSEcKNY5eoM9JGlcdOSUpglu6A", "Supabase API Key")
)

func main() {
	err := zfg.Parse(
		env.New(),
	)
	if err != nil {
		panic(err)
	}

	supabaseClient := supabase.NewClient(*supabaseURL, *supabaseKey)

	courseService := services.NewCourseService(supabaseClient)

	r := router.New()

	r.Add(router.GET("/health", health.Handle))

	r.Add(router.NewGroup("/api/v1", 
		router.GET("/courses", handlers.GetAllCourses(courseService)),
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
