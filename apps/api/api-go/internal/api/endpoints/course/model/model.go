package model

import (
	"encoding/json"
	"strings"
	"time"
)

type SupabaseTime struct {
	time.Time
}

func (st *SupabaseTime) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), `"`)
	if s == "null" || s == "" {
		return nil
	}

	formats := []string{
		"2006-01-02T15:04:05.999999",  // без timezone (Supabase default)
		"2006-01-02T15:04:05.999999Z", // з Z
		"2006-01-02T15:04:05Z07:00",   // RFC3339
		"2006-01-02T15:04:05",         // без мікросекунд
	}

	var err error
	for _, format := range formats {
		st.Time, err = time.Parse(format, s)
		if err == nil {
			return nil
		}
	}
	return err
}

type Course struct {
	ID          int64        `json:"id"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	EduProgram  string       `json:"edu_program"`
	Slug        string       `json:"slug"`
	CreatedAt   SupabaseTime `json:"created_at"`
	UpdatedAt   SupabaseTime `json:"updated_at"`
}

type CourseWithDetails struct {
	Course
	CourseAuthors []CourseAuthor `json:"course_authors"`
	Modules       []Module       `json:"modules"`
	CourseSkills  []CourseSkill  `json:"course_skills"`
}

type CourseAuthor struct {
	ID         int64           `json:"id"`
	CourseID   int64           `json:"course_id"`
	UserID     json.RawMessage `json:"user_id"`   
	OrderIndex int             `json:"order_index"`
	CreatedAt  SupabaseTime    `json:"created_at"`
}


func (ca *CourseAuthor) GetAuthor() *User {
	if len(ca.UserID) == 0 {
		return nil
	}
	var user User
	if err := json.Unmarshal(ca.UserID, &user); err != nil {
		return nil
	}
	return &user
}

type User struct {
	ID            string       `json:"id"`
	Name          string       `json:"name"`
	Email         string       `json:"email"`
	EmailVerified bool         `json:"emailVerified"`
	Image         *string      `json:"image"`
	CreatedAt     SupabaseTime `json:"createdAt"`
	UpdatedAt     SupabaseTime `json:"updatedAt"`
}

type Module struct {
	ID          int64        `json:"id"`
	CourseID    *int64       `json:"course_id"`
	Name        *string      `json:"name"`
	Description *string      `json:"description"`
	CreatedAt   SupabaseTime `json:"created_at"`
	Lessons     []Lesson     `json:"lessons"`
}

type Lesson struct {
	ID         int64        `json:"id"`
	ModuleID   int64        `json:"module_id"`
	Title      *string      `json:"title"`
	Content    *string      `json:"content"`
	Type       *string      `json:"type"`
	OrderIndex *int         `json:"order_index"`
	CreatedAt  SupabaseTime `json:"created_at"`
	UpdatedAt  *SupabaseTime `json:"updated_at"`
}

type CourseSkill struct {
	ID         int64        `json:"id"`
	CourseID   int64        `json:"course_id"`
	SkillID    json.RawMessage `json:"skill_id"`
	OrderIndex int          `json:"order_index"`
	CreatedAt  SupabaseTime `json:"created_at"`
}

func (cs *CourseSkill) GetSkill() *Skill {
	if len(cs.SkillID) == 0 {
		return nil
	}
	var skill Skill
	if err := json.Unmarshal(cs.SkillID, &skill); err != nil {
		return nil
	}
	return &skill
}

type Skill struct {
	ID        int64        `json:"id"`
	Name      string       `json:"name"`
	Slug      string       `json:"slug"`
	CreatedAt SupabaseTime `json:"created_at"`
}

type FormattedCourseWithDetails struct {
	Course
	Authors []User   `json:"authors"`
	Modules []Module `json:"modules"`
	Skills  []Skill  `json:"skills"`
}

type GetAllCoursesFilters struct {
	Author string `query:"author"`
	Skill  string `query:"skill"`
	Sort   string `query:"sort"`
	Limit  int    `query:"limit"`
    Offset int    `query:"offset"`
}