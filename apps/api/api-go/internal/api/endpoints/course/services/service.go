package services

import (
	"context"

	"github.com/studyx-api/internal/api/endpoints/course/model"
	"github.com/studyx-api/internal/api/endpoints/course/repository"
)

type CourseService interface {
    GetAll(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.Course, int64, error)
	GetAllWithDetails(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.FormattedCourseWithDetails, int64, error)
}

type courseService struct {
	repo repository.Repository
}

func NewCourseService(repo repository.Repository) CourseService {
	return &courseService{
		repo,
	}
}

func (s *courseService) GetAll(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.Course, int64, error) {
	courses, count, err := s.repo.GetAll(ctx, filters)
	if err != nil {		
		return nil, 0, err
	}

	return courses, count, nil
}

func (s *courseService) GetAllWithDetails(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.FormattedCourseWithDetails, int64, error) {
	courses, count, err := s.repo.GetAllWithDetails(ctx, filters)
	if err != nil {
		return nil, 0, err
	}

	return courses, count, nil
}