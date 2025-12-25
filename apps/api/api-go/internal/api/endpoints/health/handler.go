package health

import (
	"net/http"

	"github.com/studyx-api/internal/api"
)


func Validate(_ *api.Context) error {
	return nil
}

type HealthResponse struct {
	Message string `json:"message"`
}

func Handle(_ *api.Context, _ *api.NoRequest) (*HealthResponse, int) {
	return &HealthResponse{
		Message: "OK",
	}, http.StatusOK

}