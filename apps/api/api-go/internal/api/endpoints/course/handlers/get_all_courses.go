package handlers

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"github.com/studyx-api/internal/api/endpoints/course/model"

	"github.com/studyx-api/internal/api"
)
type GetAllCoursesRequest struct {
	model.GetAllCoursesFilters
}

func (req GetAllCoursesRequest) Validate(_ *api.Context) error {
	if req.Limit < 0 || req.Limit > 1000 {
        return errors.New("limit must be between 0 and 1000")
    }
    
    if req.Offset < 0 {
        return errors.New("offset must be >= 0")
    }

	return nil
}

type GetAllCoursesResponse struct {
	Courses []model.Course `json:"courses"`
	Total int64 `json:"total"`
}

type CourseGetter interface {
    GetAll(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.Course, int64, error)
}

func GetAllCourses(svc CourseGetter) func(*api.Context, *GetAllCoursesRequest) (*GetAllCoursesResponse, int) {
	return func(ctx *api.Context, req *GetAllCoursesRequest) (*GetAllCoursesResponse, int) {

		filters := model.GetAllCoursesFilters{
			Author: req.Author,
			Skill:  req.Skill,
			Sort:   req.Sort,
			Limit:  req.Limit,
			Offset: req.Offset,
		}

		courses, count, err := svc.GetAll(ctx.Context, filters)
		if err != nil {
			slog.Error("Failed to get all courses", "error", err.Error())
			return nil, http.StatusInternalServerError
		}

		return &GetAllCoursesResponse{
			Courses: courses,
			Total: count,
		}, http.StatusOK
	}
}
