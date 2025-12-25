package supabase

import (
	"fmt"

	"github.com/supabase-community/supabase-go"
)

type Client struct {
	Client *supabase.Client
}

func NewClient(apiURL, apiKey string) *Client {
	client, err := supabase.NewClient(apiURL, apiKey, &supabase.ClientOptions{})
	if err != nil {
		fmt.Println("Failed to initalize the client: ", err)
	}
	
	return &Client{ client }
}