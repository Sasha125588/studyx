import { Card, CardContent } from '@studyx/ui/base'

import { SignUpForm } from './(components)/SignUpForm/SignUpForm'

function SignUpPage() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        <Card className="w-full overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <SignUpForm />
            <div className="bg-violet-200 dark:bg-indigo-800/40" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignUpPage
