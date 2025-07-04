import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useAuth from '@/utils/hooks/useAuth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { Notification, toast } from '@/components/ui'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
  signUpUrl?: string
}

type SignInFormSchema = {
  employeeId: string
  branch: string
  password: string
  rememberMe: boolean
}

const validationSchema = Yup.object().shape({
  employeeId: Yup.string().required('يرجى إدخال الرقم الوظيفي'),
  branch: Yup.string().required('يرجى إدخال اسم الفرع'),
  password: Yup.string().required('يرجى إدخال كلمة المرور'),
  rememberMe: Yup.boolean(),
})

const SignInForm = (props: SignInFormProps) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up',
  } = props

  const [message, setMessage] = useTimeOutMessage()
  const { signIn } = useAuth()

  const onSignIn = async (
    values: SignInFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const { employeeId, branch, password } = values
    setSubmitting(true)

    const result = await signIn({ employeeId, branch, password })

    if (result?.status === 'failed') {
      setMessage(result.message)
      toast.push(<Notification title={result.message} type="danger" />)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          employeeId: '',
          branch: '',
          password: '',
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="الرقم الوظيفي"
                invalid={!!(errors.employeeId && touched.employeeId)}
                errorMessage={errors.employeeId}
              >
                <Field
                  type="text"
                  name="employeeId"
                  placeholder="أدخل الرقم الوظيفي"
                  autoComplete="off"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="اسم الفرع"
                invalid={!!(errors.branch && touched.branch)}
                errorMessage={errors.branch}
              >
                <Field
                  type="text"
                  name="branch"
                  placeholder="أدخل اسم الفرع"
                  autoComplete="off"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="كلمة المرور"
                invalid={!!(errors.password && touched.password)}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="كلمة المرور"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-between mb-6">
                <Field
                  className="mb-0"
                  name="rememberMe"
                  component={Checkbox}
                >
                  تذكرني
                </Field>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
