package api

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/studyx-api/pkg/query"
	"github.com/studyx-api/pkg/router"
)

type Context struct {
	context.Context
	cancel context.CancelFunc
	w      http.ResponseWriter
	r      *http.Request
}

// Check for implementation
var _ router.Context = (*Context)(nil)

type Validator interface {
	Validate(ctx *Context) error
}

func (ctx *Context) SetCancellableCtx(baseCtx context.Context, cancel context.CancelFunc) {
	ctx.Context = baseCtx
	ctx.cancel = cancel
}

func (ctx *Context) SetHTTPWriter(w http.ResponseWriter) {
	ctx.w = w
}

func (ctx *Context) SetHTTPRequest(r *http.Request) {
	ctx.r = r
}

func (ctx *Context) StopChain() {
	ctx.cancel()
}

func (ctx *Context) Decode(dest any) error {
	var decoder interface {
		Decode(any) error
	}

	if ctx.r.Method == "POST" {
		decoder = json.NewDecoder(ctx.r.Body)
	} else {
		decoder = query.NewDecoder(ctx.r.URL.Query())
	}

	err := decoder.Decode(dest)
	if err != nil {
		return err
	}

	return dest.(Validator).Validate(ctx)
}

func (ctx *Context) SetHeader(key string, value string) {
	ctx.w.Header().Set(key, value)
}

func (ctx *Context) WriteResponse(statusCode int, resp any) error {
	ctx.StopChain()

	data, err := json.Marshal(resp)
	if err != nil {
		return err // TODO: handle
	}

	if ctx.w.Header().Get("Content-Type") == "" {
		ctx.w.Header().Set("Content-Type", "application/json; charset=utf-8")
	}

	ctx.w.WriteHeader(statusCode)

	_, err = ctx.w.Write(data)
	if err != nil {
		return err // TODO: handle
	}

	return nil
}