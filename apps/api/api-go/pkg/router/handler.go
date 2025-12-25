package router

type Handler[T Context] struct {
	options HandlerOptions[T]
	regFunc RegFunc[T]
}

type RegFunc[T Context] func(router *Router, options *HandlerOptions[T])

type HandlerOptions[T Context] struct {
	errHandler ErrHandlerFunc[T]
	preHandlers []HandlerFunc[T]
	prefix string
}

type HandlerFunc[T Context] func(ctx T)

type PreparedHandlerFunc[T Context, V Validator[T], R any] func(ctx T, req *V) (*R, int) // return (response, status code)

type ErrHandlerFunc[T Context] func(ctx T, err error) any

func (h *Handler[T]) SetErrHandler(errHandler ErrHandlerFunc[T]) *Handler[T] {
	h.options.errHandler = errHandler
	return h
}

func (h *Handler[T]) SetPreHandlers(preHandlers ...HandlerFunc[T]) *Handler[T] {
	h.options.preHandlers = preHandlers
	return h
}

func (h *Handler[T]) register(router *Router) {
	h.regFunc(router, &h.options)
}