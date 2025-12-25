package handlers

import (
	"github.com/studyx-api/internal/api"
	"github.com/studyx-api/internal/api/endpoints/course/services"
	"github.com/studyx-api/pkg/router"
)

func RegisterCourseRoutes(svc services.CourseService) *router.Handler[*api.Context] {
	return router.NewGroup("/courses",
		router.GET("/", GetAllCourses(svc)),
		router.GET("/with-details", GetAllWithDetails(svc)),
	).SetErrHandler(api.ErrHandler)
}

