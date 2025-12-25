package router

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"reflect"
)


type Validator[T Context] interface {
	Validate(ctx T) error
}

func POST[T Context, S Validator[T], U any](pattern string, handlers ...PreparedHandlerFunc[T, S, U]) *Handler[T] {
	return &Handler[T]{
		regFunc: func(r *Router, opts *HandlerOptions[T]) {
			handleWithDecode(r, "POST", opts.prefix+pattern, opts, handlers...)
		},
	}
}

func GET[T Context, S Validator[T], U any](pattern string, handlers ...PreparedHandlerFunc[T, S, U]) *Handler[T] {
	return &Handler[T]{
		regFunc: func(r *Router, opts *HandlerOptions[T]) {
			handleWithDecode(r, "GET", opts.prefix+pattern, opts, handlers...)
		},
	}
}

func handleWithDecode[T Context, S Validator[T], U any](
	r *Router,
	method, pattern string,
	options *HandlerOptions[T],
	handlers ...PreparedHandlerFunc[T, S, U],
) {
	patternWithMethod := method + " " + pattern

	// https://arc.net/l/quote/kdxxhrfh about zero-length T array
	ctxType := reflect.TypeOf([0]T{}).Elem()
	if ctxType.Kind() != reflect.Ptr {
		panic(fmt.Sprintf(
			"\"%s\" handler ctx has not pointer type: (%s). Possible solution is to use (*%s).",
			patternWithMethod,
			ctxType.Name(),
			ctxType.Name(),
		))
	}

	r.mux.HandleFunc(patternWithMethod, func(w http.ResponseWriter, req *http.Request) {
		ctxPointer := reflect.New(ctxType.Elem())
		ctx := ctxPointer.Interface().(T)

		ctx.SetCancellableCtx(context.WithCancel(context.Background()))
		ctx.SetHTTPWriter(w)
		ctx.SetHTTPRequest(req)

		for _, ph := range options.preHandlers {
			select {
			case <-ctx.Done():
				return
			default:
				ph(ctx)
			}
		}

		decodedReq := *new(S)

		err := ctx.Decode(&decodedReq)
		if err != nil {
			if options.errHandler != nil {
				data := options.errHandler(ctx, err)

				select {
				case <-ctx.Done():
					return
				default:
					err = ctx.WriteResponse(http.StatusBadRequest, data)
					if err != nil {
						log.Println("error writing decode error response:", err)
					}
				}
			}
			return
		}

		for _, h := range handlers {
			select {
			case <-ctx.Done():
				return
			default:
				resp, statusCode := h(ctx, &decodedReq)
				if resp != (*U)(nil) {
					err = ctx.WriteResponse(statusCode, resp)
					if err != nil {
						log.Println("error writing response:", err)
						return
					}
				}
			}
		}
	})
}