import { forwardRef } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'

import { CreateGurantee } from '@/@types/clients'
import { Input } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'

const validationSchema = Yup.object().shape({
    typeGuarantee: Yup.string().required('نوع الضمان مطلوب'),
    startDate: Yup.string()
        .required('تاريخ البدء مطلوب')
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            'تاريخ البدء يجب أن يكون بتنسيق YYYY-MM-DD'
        )
        .test(
            'is-future-or-today',
            'تاريخ البدء يجب أن يكون اليوم أو في المستقبل',
            function (value) {
                const today = new Date().setHours(0, 0, 0, 0)
                const inputDate = new Date(value).setHours(0, 0, 0, 0)

                return inputDate >= today
            }
        ),
    endDate: Yup.string()
        .required('تاريخ الانتهاء مطلوب')
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            'تاريخ الانتهاء يجب أن يكون بتنسيق YYYY-MM-DD'
        )
        .test(
            'is-after-start-date',
            'تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء',
            function (value) {
                const { startDate } = this.parent
                return (
                    !startDate ||
                    !value ||
                    new Date(value) >= new Date(startDate)
                )
            }
        ),
    terms: Yup.string().required('الشروط مطلوبة'),
})

export type SetSubmitting = (isSubmitting: boolean) => void

type CreateGuranteeFormProps = {
    initialData?: CreateGurantee //هتتغير لما اضيف ال edit ممكن
    type: 'edit' | 'add'
    isLoading: boolean
    orderId: string | undefined
    onDiscard?: () => void
    onFormSubmit?: (
        formData: CreateGurantee,
        setSubmitting: SetSubmitting
    ) => void
}

const CreateGuranteeForm = forwardRef<
    FormikProps<CreateGurantee>,
    CreateGuranteeFormProps
>(({ type, onFormSubmit, onDiscard, initialData, isLoading }, ref) => {
    const initialValues: CreateGurantee = cloneDeep(
        initialData ?? {
            typeGuarantee: '',
            startDate: '',
            endDate: '',
            terms: '',
        }
    )

    return (
        <Formik
            innerRef={ref}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                onFormSubmit?.(values, setSubmitting)
            }}
        >
            {({ touched, errors, isSubmitting }) => {
                console.log('isSubmitting inside Formik: ', isSubmitting)
                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1  gap-2">
                                <FormItem
                                    label="نوع الضمان"
                                    invalid={
                                        !!errors.typeGuarantee &&
                                        !!touched.typeGuarantee
                                    }
                                    errorMessage={errors.typeGuarantee}
                                >
                                    <Field
                                        name="typeGuarantee"
                                        size="sm"
                                        component={Input}
                                        placeholder="ادخل نوع الضمان"
                                    />
                                </FormItem>

                                <FormItem
                                    label="تاريخ البدء"
                                    invalid={
                                        !!errors.startDate &&
                                        !!touched.startDate
                                    }
                                    errorMessage={errors.startDate}
                                >
                                    <Field
                                        name="startDate"
                                        size="sm"
                                        type="date"
                                        component={Input}
                                        placeholder="تاريخ البدء"
                                    />
                                </FormItem>

                                <FormItem
                                    label="تاريخ الانتهاء"
                                    invalid={
                                        !!errors.endDate && !!touched.endDate
                                    }
                                    errorMessage={errors.endDate}
                                >
                                    <Field
                                        name="endDate"
                                        type="date"
                                        size="sm"
                                        component={Input}
                                        placeholder="تاريخ الانتهاء"
                                    />
                                </FormItem>

                                <FormItem
                                    label="الشروط"
                                    invalid={!!errors.terms && !!touched.terms}
                                    errorMessage={errors.terms}
                                >
                                    <Field
                                        name="terms"
                                        size="sm"
                                        component={Input}
                                        placeholder="الرجاء ادخال الشروط"
                                    />
                                </FormItem>
                            </div>

                            <div className="md:flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    onClick={() => onDiscard?.()}
                                >
                                    الغاء
                                </Button>

                                <Button
                                    size="sm"
                                    variant="solid"
                                    loading={isLoading}
                                    icon={<HiPlusCircle />}
                                    type="submit"
                                >
                                    اضافة
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
})

CreateGuranteeForm.displayName = 'CreateGuranteeForm'

export default CreateGuranteeForm
