package model

import (
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
		"2006-01-02T15:04:05.999999Z", // с Z
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
