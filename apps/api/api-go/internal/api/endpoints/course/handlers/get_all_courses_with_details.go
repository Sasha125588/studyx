package handlers

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"github.com/studyx-api/internal/api/endpoints/course/model"

	"github.com/studyx-api/internal/api"
)


type GetAllCoursesWithDetailsRequest struct {
	model.GetAllCoursesFilters
}

func (req GetAllCoursesWithDetailsRequest) Validate(_ *api.Context) error {
	if req.Limit < 0 || req.Limit > 1000 {
        return errors.New("limit must be between 0 and 1000")
    }

    if req.Offset < 0 {
        return errors.New("offset must be >= 0")
    }

	return nil
}

type GetAllCoursesWithDetailsResponse struct {
	Courses []model.FormattedCourseWithDetails `json:"courses"`
	Total int64 `json:"total"`
}

type CourseWithDetailsGetter interface {
    GetAllWithDetails(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.FormattedCourseWithDetails, int64, error)
}

func GetAllWithDetails(svc CourseWithDetailsGetter) func(*api.Context, *GetAllCoursesWithDetailsRequest) (*GetAllCoursesWithDetailsResponse, int) {
	return func(ctx *api.Context, req *GetAllCoursesWithDetailsRequest) (*GetAllCoursesWithDetailsResponse, int) {

		filters := model.GetAllCoursesFilters{
			Author: req.Author,
			Skill:  req.Skill,
			Sort:   req.Sort,
			Limit:  req.Limit,
			Offset: req.Offset,
		}

		courses, count, err := svc.GetAllWithDetails(ctx.Context, filters)
		if err != nil {
			// TODO: обробити помилку
			slog.Error("Failed to get all courses", "error", err.Error())
			return nil, http.StatusInternalServerError
		}

		return &GetAllCoursesWithDetailsResponse{
			Courses: courses,
			Total: count,
		}, http.StatusOK
	}
}
