package router

func NewGroup[T Context](prefix string, handlers ...*Handler[T]) *Handler[T] {
	return &Handler[T]{
		regFunc: func(router *Router, options *HandlerOptions[T]) {
			for _, handler := range handlers {
				if handler.options.errHandler == nil {
					handler.options.errHandler = options.errHandler
				}
				if handler.options.preHandlers == nil {
					handler.options.preHandlers = options.preHandlers
				}
				
				handler.options.prefix = options.prefix + prefix
				handler.register(router)
			}
		},
	}
}