import { FormItem, FormContainer } from '@/components/ui/Form'
import { Roles } from '@/constants/roles.constant'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import Select from '@/components/ui/Select'
import { Notification, toast } from '@/components/ui'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    fullName: string
    password: string
    email: string
    confirmPassword: string
    role: Roles
}

const roleOptions = Object.values(Roles).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
}))

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('يرجى إدخال الاسم الكامل'),
    email: Yup.string()
        .email('يرجى إدخال بريد إلكتروني صالح')
        .required('يرجى إدخال البريد الإلكتروني'),
    password: Yup.string().required('يرجى إدخال كلمة المرور'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'كلمتا المرور غير متطابقتين')
        .required('يرجى تأكيد كلمة المرور'),
    role: Yup.string()
        .oneOf(Object.values(Roles))
        .required('يرجى اختيار الدور'),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const { signUp } = useAuth()
    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { fullName, password, email, role } = values
        setSubmitting(true)
        const result = await signUp({ fullName, password, email, role })

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
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: Roles.EMPLOYEE,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting, values, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="الاسم الكامل"
                                invalid={errors.fullName && touched.fullName}
                                errorMessage={errors.fullName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="fullName"
                                    placeholder="الاسم الكامل"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="البريد الإلكتروني"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="البريد الإلكتروني"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="الدور"
                                invalid={errors.role && touched.role}
                                errorMessage={errors.role}
                            >
                                <Select
                                    name="role"
                                    options={roleOptions}
                                    className="text-left"
                                    value={roleOptions.find(
                                        (option) => option.value === values.role
                                    )}
                                    placeholder="اختر الدور"
                                    onChange={(option) =>
                                        setFieldValue('role', option?.value)
                                    }
                                />
                            </FormItem>

                            <FormItem
                                label="كلمة المرور"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="كلمة المرور"
                                    component={PasswordInput}
                                />
                            </FormItem>

                            <FormItem
                                label="تأكيد كلمة المرور"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="تأكيد كلمة المرور"
                                    component={PasswordInput}
                                />
                            </FormItem>

                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'جاري إنشاء الحساب...'
                                    : 'إنشاء حساب'}
                            </Button>

                            <div className="mt-4 text-center">
                                <span>لديك حساب بالفعل؟ </span>
                                <ActionLink to={signInUrl}>
                                    تسجيل الدخول
                                </ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
