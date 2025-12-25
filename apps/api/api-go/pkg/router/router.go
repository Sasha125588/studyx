package router

import "net/http"

type Router struct {
	mux *http.ServeMux
}

func New() *Router {
	return &Router{
		mux: http.NewServeMux(),
	}
}

type Registrable interface {
	register(router *Router)
}

func (r *Router) Add(handlers ...Registrable) {
	for _, handler := range handlers {
		handler.register(r)
	}
}

func (r* Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	r.mux.ServeHTTP(w, req)
}