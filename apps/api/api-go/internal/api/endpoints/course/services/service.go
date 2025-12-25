package services

import (
	"encoding/json"

	"github.com/studyx-api/internal/api/endpoints/course/model"
	"github.com/studyx-api/internal/lib/supabase"
)


type courseService struct {
	supabase *supabase.Client
}

func NewCourseService(supabase *supabase.Client) *courseService {
	return &courseService{
		supabase: supabase,
	}
}

func (s *courseService) GetAll(author, skill, sort string) ([]model.Course, error) {
	data, _, err := s.supabase.Client.From("courses").Select("*", "", false).Execute()
	if err != nil {
		return nil, err
	}

	var courses []model.Course
	err = json.Unmarshal(data, &courses)
	if err != nil {
		return nil, err
	}

	return courses, nil
}
