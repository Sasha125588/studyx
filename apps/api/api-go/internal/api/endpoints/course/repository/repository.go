package repository

import (
	"context"

	"github.com/studyx-api/internal/api/endpoints/course/model"
	"github.com/studyx-api/internal/lib/supabase"
	"github.com/supabase-community/postgrest-go"
)

type Repository interface {
    GetAll(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.Course, int64, error)
    GetAllWithDetails(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.FormattedCourseWithDetails, int64, error)
}

type supabaseRepository struct {
    client *supabase.Client
}

func NewRepository(client *supabase.Client) Repository {
    return &supabaseRepository{client: client}
}

func (r *supabaseRepository) GetAll(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.Course, int64, error) {
    query := r.client.Client.From("courses").Select("*", "exact", false)

    if filters.Author != "" {
        query.Filter("author", "=", filters.Author)
    }
    if filters.Skill != "" {
        query.Filter("skill", "=", filters.Skill)
    }
    
    query = applySorting(query, filters.Sort)
    
    if filters.Limit > 0 {
        to := filters.Offset + filters.Limit - 1
        query = query.Range(filters.Offset, to, "")
    }

    var courses []model.Course
    count, err := query.ExecuteToWithContext(ctx, &courses)
    
    if err != nil {
        return nil, 0, err
    }

    return courses, count, nil
}

func (r *supabaseRepository) GetAllWithDetails(ctx context.Context, filters model.GetAllCoursesFilters) ([]model.FormattedCourseWithDetails, int64, error) {
	selectQuery := `*,course_authors(user_id(*)),modules(*,lessons(*)),course_skills(skill_id(*))`
	
	query := r.client.Client.From("courses").Select(selectQuery, "exact", false)
	
	query = applySorting(query, filters.Sort)
	
	if filters.Limit > 0 {
		query = query.Range(filters.Offset, filters.Offset+filters.Limit-1, "")
	}

	var courses []model.CourseWithDetails
	count, err := query.ExecuteToWithContext(ctx, &courses)
	if err != nil {
		return nil, 0, err
	}

	formattedCourses := make([]model.FormattedCourseWithDetails, len(courses))
	for i, course := range courses {
		formattedCourses[i] = *formatCourseWithDetails(course)
	}

	return formattedCourses, count, nil
}

func formatCourseWithDetails(course model.CourseWithDetails) *model.FormattedCourseWithDetails {
	authors := make([]model.User, 0, len(course.CourseAuthors))
	for _, ca := range course.CourseAuthors {
		if author := ca.GetAuthor(); author != nil && author.ID != "" {
			authors = append(authors, *author)
		}
	}

	skills := make([]model.Skill, 0, len(course.CourseSkills))
	for _, cs := range course.CourseSkills {
		if skill := cs.GetSkill(); skill != nil && skill.ID != 0 {
			skills = append(skills, *skill)
		}
	}

	return &model.FormattedCourseWithDetails{
		Course:  course.Course,
		Authors: authors,
		Modules: course.Modules,
		Skills:  skills,
	}
}

func applySorting(query *postgrest.FilterBuilder, sortValue string) *postgrest.FilterBuilder {
    switch sortValue {
    case "newest", "new", "спочатку нові":
        return query.Order("created_at", &postgrest.OrderOpts{Ascending: false})

    case "oldest", "old", "спочатку старі":
        return query.Order("created_at", &postgrest.OrderOpts{Ascending: true})

    case "title_asc", "alphabet_asc", "за алфавітом (А-Я)":
        return query.Order("title", &postgrest.OrderOpts{Ascending: true})

    case "title_desc", "alphabet_desc", "за алфавітом (Я-А)":
        return query.Order("title", &postgrest.OrderOpts{Ascending: false})

    case "popularity", "popular", "за популярністю":
        return query.Order("id", &postgrest.OrderOpts{Ascending: false})

    case "progress", "за прогресом":
        return query.Order("id", &postgrest.OrderOpts{Ascending: true})

    default:
        return query.Order("created_at", &postgrest.OrderOpts{Ascending: true})
    }
}