package api

type NoRequest struct{}

func (NoRequest) Validate(_ *Context) error { return nil }