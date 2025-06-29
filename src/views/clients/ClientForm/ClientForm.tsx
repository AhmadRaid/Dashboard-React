import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps } from 'formik'

import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import ClientFields from './ClientFields'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any

type FormikRef = FormikProps<any>

type InitialData = {
    firstName: string
    middleName: string
    lastName: string
    email: string
    phone: string
    clientType: 'individual' | 'company' | ''
    carModel: string
    carColor: string
    branch: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    guarantee: {
        typeGuarantee: string
        startDate: string
        endDate: string
        terms: string
        Notes: string
    }
}

export const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('الاسم الاول مطلوب')
        .min(2, 'يجب أن يكون الاسم الكامل على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم الكامل 100 حرف'),

    middleName: Yup.string()
        .required('الاسم الثاني مطلوب')
        .min(2, 'يجب أن يكون الاسم الكامل على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم الكامل 100 حرف'),

    lastName: Yup.string()
        .required('الاسم الاخير مطلوب')
        .min(2, 'يجب أن يكون الاسم الكامل على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم الكامل 100 حرف'),

    email: Yup.string().email('عنوان البريد الإلكتروني غير صالح'),

    phone: Yup.string()
        .required('رقم الهاتف مطلوب')
        .matches(
            /^\+?[0-9]{7,15}$/,
            'يجب أن يكون رقم الهاتف صالحًا (من 7 إلى 15 رقم مع "+" اختياري)'
        ),

    clientType: Yup.string()
        .oneOf(
            ['individual', 'company'],
            'نوع العميل يجب أن يكون "فردي" أو "شركة"'
        )
        .required('نوع العميل مطلوب'),

    branch: Yup.string()
        .oneOf(
            ['عملاء فرع المدينة', 'عملاء فرع ابحر', 'اخرى'],
            'فرع العميل يجب أن يكون "عميل فرع ابحر" أو "عميل فرع المدينة" او "اخرى"'
        )
        .required('فرع العميل مطلوب'),

    carManufacturer: Yup.string(),

    carPlateNumber: Yup.string().max(
        100,
        'يجب ألا تتجاوز لوحة السيارة 100 رقم'
    ),

    carSize: Yup.string().oneOf(
        ['small', 'medium', 'large'],
        'اختر حجمًا صالحًا للسيارة'
    ),

    carType: Yup.string().max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),

    carModel: Yup.string().max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),

    carColor: Yup.string().max(30, 'يجب ألا يتجاوز لون السيارة 30 حرفًا'),

    guarantee: Yup.object().shape({
        typeGuarantee: Yup.string(),
        startDate: Yup.string()

            .matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'تاريخ البدء يجب أن يكون بتنسيق YYYY-MM-DD'
            )
            .test(
                'is-future-or-today',
                'تاريخ البدء يجب أن يكون اليوم أو في المستقبل',
                function (value) {
                    if (!value) return true // السماح بالقيم الفارغة
                    const today = new Date().setHours(0, 0, 0, 0)
                    const inputDate = new Date(value).setHours(0, 0, 0, 0)

                    return inputDate >= today
                }
            ),

        endDate: Yup.string()
            .matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'يجب أن يكون تاريخ الانتهاء بصيغة YYYY-MM-DD'
            )
            .test(
                'is-after-start-date',
                'لا يمكن أن يكون تاريخ الانتهاء قبل تاريخ البدء',
                function (value) {
                    if (!value) return true // السماح بالقيم الفارغة

                    const { startDate } = this.parent
                    if (!startDate || !value) return true
                    return new Date(value) >= new Date(startDate)
                }
            ),

        terms: Yup.string().max(200, 'يجب ألا تتجاوز الشروط 200 حرف'),

        Notes: Yup.string().max(
            200,
            'يجب ألا تتجاوز الملاحظات السيارة 200 حرف'
        ),
    }),
})

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ClientForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit?: (formData: any, setSubmitting: SetSubmitting) => void
}

const DeleteProductButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                Delete
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete project"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>Are you sure you want to delete this Project?</p>
            </ConfirmDialog>
        </>
    )
}

const ClientForm = forwardRef<FormikRef, ClientForm>((props, ref) => {
    const {
        type,
        initialData = {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            clientType: '',
            carModel: '',
            carColor: '',
            carSize: '',
            branch: '',
            carPlateNumber: '',
            carManufacturer: '',
            guarantee: {
                typeGuarantee: '',
                startDate: '',
                endDate: '',
                terms: '',
                Notes: '',
            },
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    function removeEmptyFields(obj: any): any {
        if (Array.isArray(obj)) {
            return obj
                .map(removeEmptyFields)
                .filter((item) => item !== undefined && item !== null)
        } else if (typeof obj === 'object' && obj !== null) {
            const cleaned: any = {}
            for (const key in obj) {
                const value = removeEmptyFields(obj[key])
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    !(
                        typeof value === 'object' &&
                        Object.keys(value).length === 0
                    )
                ) {
                    cleaned[key] = value
                }
            }
            return cleaned
        }
        return obj
    }

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    let data = cloneDeep(values)

                    // تحويل تواريخ الضمان إن وُجدت
                    if (data.guarantee?.startDate) {
                        data.guarantee.startDate = new Date(
                            data.guarantee.startDate
                        ).toISOString()
                    }
                    if (data.guarantee?.endDate) {
                        data.guarantee.endDate = new Date(
                            data.guarantee.endDate
                        ).toISOString()
                    }

                    // حذف الضمان إذا كان فارغًا
                    if (
                        !data.guarantee?.typeGuarantee &&
                        !data.guarantee?.startDate &&
                        !data.guarantee?.endDate
                    ) {
                        delete data.guarantee
                    }

                    // حذف كل الحقول الفارغة
                    data = removeEmptyFields(data)

                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    console.log('errors', errors)

                    return (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <ClientFields
                                            touched={touched}
                                            errors={errors}
                                            values={values}
                                        />
                                    </div>
                                </div>

                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && (
                                            <DeleteProductButton
                                                onDelete={onDelete as OnDelete}
                                            />
                                        )}
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
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            اضافة
                                        </Button>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
})

ClientForm.displayName = 'ClientForm'

export default ClientForm
