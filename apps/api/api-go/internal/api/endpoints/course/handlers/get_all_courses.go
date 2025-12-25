package handlers

import (
	"log/slog"
	"net/http"

	"github.com/studyx-api/internal/api"
	"github.com/studyx-api/internal/api/endpoints/course/model"
)

type GetAllCoursesRequest struct {
	Author string `query:"author"`
	Skill  string `query:"skill"`
	Sort   string `query:"sort"`
}

func (req GetAllCoursesRequest) Validate(_ *api.Context) error {
	// if req.Author == "" && req.Skill == "" {
	// 	return errors.New("author or skill is required")
	// }
	return nil
}

type GetAllCoursesResponse struct {
	Courses []model.Course `json:"courses"`
}

type CourseGetter interface {
    GetAll(author, skill, sort string) ([]model.Course, error)
}

func GetAllCourses(svc CourseGetter) func(*api.Context, *GetAllCoursesRequest) (*GetAllCoursesResponse, int) {
	return func(ctx *api.Context, req *GetAllCoursesRequest) (*GetAllCoursesResponse, int) {
		courses, err := svc.GetAll(req.Author, req.Skill, req.Sort)
		if err != nil {
			// TODO: обробити помилку
			slog.Error("Failed to get all courses", "error", err.Error())
			return &GetAllCoursesResponse{
				Courses: []model.Course{},
			}, http.StatusInternalServerError
		}

		return &GetAllCoursesResponse{
			Courses: courses,
		}, http.StatusOK
	}
}
