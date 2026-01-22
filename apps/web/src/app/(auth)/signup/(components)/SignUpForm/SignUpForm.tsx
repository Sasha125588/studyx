'use client'

// import { SocialLoginButtons } from '@/components/common/SocialLoginButtons/SocialLoginButtons'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@studyx/ui/base'

import { useIntl } from '@/app/(contexts)/intl'

import { IntlText } from '@/components/common/IntlText/IntlText'
import { useSignUpForm } from './hooks/useSignUpForm'

export function SignUpForm() {
  const { form, functions, state } = useSignUpForm()
  const i18n = useIntl()

  return (
    <Form {...form}>
      <form
        className="p-6 md:p-8"
        onSubmit={(event) => {
          event.preventDefault()
          functions.onSubmit()
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">
              <IntlText path="form.signup.title" />
            </h1>
            <p className="text-muted-foreground text-balance">
              <IntlText path="form.signup.description" />
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">
                  <IntlText path="field.email.label" />
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    aria-label="Email"
                    type="email"
                    placeholder={i18n.formatMessage({
                      id: 'field.email.placeholder',
                    })}
                    disabled={state.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">
                  <IntlText path="field.name.label" />
                </FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    aria-label="Name"
                    type="text"
                    placeholder={i18n.formatMessage({
                      id: 'field.name.placeholder',
                    })}
                    disabled={state.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">
                  <IntlText path="field.password.label" />
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    aria-label="Password"
                    type="password"
                    placeholder={i18n.formatMessage({
                      id: 'field.password.placeholder',
                    })}
                    disabled={state.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">
                  <IntlText path="field.confirmPassword.label" />
                </FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    aria-label="Confirm Password"
                    type="password"
                    placeholder={i18n.formatMessage({
                      id: 'field.confirmPassword.placeholder',
                    })}
                    disabled={state.loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={state.loading}
          >
            {state.loading ? <IntlText path="loading" /> : <IntlText path="button.createAccount" />}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              <IntlText path="form.orContinueWith" />
            </span>
          </div>
          {/* <SocialLoginButtons /> */}
          <div className="text-center text-sm">
            <IntlText path="form.alreadyHaveAccount" />
            {' '}
            <Button
              type="button"
              variant="link"
              className="h-auto cursor-pointer p-0"
              onClick={functions.goToSignIn}
            >
              <IntlText path="button.login" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
