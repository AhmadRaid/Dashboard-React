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

type FormikRef = FormikProps<any>

type InitialData = {
    serviceName: string
    serviceType: string
    amount: number
    status: 'new' | 'in_progress' | 'maintenance' | 'completed'
}

export const validationSchema = Yup.object().shape({
    serviceName: Yup.string()
        .required('اسم الخدمة مطلوب')
        .min(2, 'يجب أن يكون اسم الخدمة على الأقل حرفين')
        .max(100, 'يجب ألا يتجاوز اسم الخدمة 100 حرف'),

    serviceType: Yup.string()
        .required('نوع الخدمة مطلوب')
        .max(100, 'يجب ألا يتجاوز نوع الخدمة 100 حرف'),

    amount: Yup.number()
        .required('المبلغ مطلوب')
        .min(0, 'يجب أن يكون المبلغ رقم موجب'),

    status: Yup.string()
        .required('حالة الخدمة مطلوبة')
        .oneOf(
            ['new', 'in_progress', 'maintenance', 'completed'],
            'حالة الخدمة غير صالحة'
        ),
})

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void
export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>
type OnDelete = (callback: OnDeleteCallback) => void

type ServiceFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit?: (formData: any, setSubmitting: SetSubmitting) => void
}

const DeleteServiceButton = ({ onDelete }: { onDelete: OnDelete }) => {
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
                حذف
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="حذف الخدمة"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>هل أنت متأكد أنك تريد حذف هذه الخدمة؟</p>
            </ConfirmDialog>
        </>
    )
}

const ServiceForm = forwardRef<FormikRef, ServiceFormProps>((props, ref) => {
    const {
        type,
        initialData = {
            serviceName: '',
            serviceType: '',
            amount: 0,
            status: 'new',
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const data = cloneDeep(values)
                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* اسم الخدمة */}
                                    <FormItem
                                        label="اسم الخدمة"
                                        invalid={errors.serviceName && touched.serviceName}
                                        errorMessage={errors.serviceName as string}
                                    >
                                        <Field
                                            type="text"
                                            name="serviceName"
                                            placeholder="أدخل اسم الخدمة"
                                        />
                                    </FormItem>

                                    {/* نوع الخدمة */}
                                    <FormItem
                                        label="نوع الخدمة"
                                        invalid={errors.serviceType && touched.serviceType}
                                        errorMessage={errors.serviceType as string}
                                    >
                                        <Field
                                            type="text"
                                            name="serviceType"
                                            placeholder="أدخل نوع الخدمة"
                                        />
                                    </FormItem>

                                    {/* المبلغ */}
                                    <FormItem
                                        label="المبلغ"
                                        invalid={errors.amount && touched.amount}
                                        errorMessage={errors.amount as string}
                                    >
                                        <Field
                                            type="number"
                                            name="amount"
                                            placeholder="أدخل المبلغ"
                                        />
                                    </FormItem>

                                    {/* الحالة */}
                                    <FormItem
                                        label="الحالة"
                                        invalid={errors.status && touched.status}
                                        errorMessage={errors.status as string}
                                    >
                                        <Field as="select" name="status">
                                            <option value="new">جديد</option>
                                            <option value="in_progress">قيد الإجراء</option>
                                            <option value="maintenance">صيانة</option>
                                            <option value="completed">منتهي</option>
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeleteServiceButton
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
                                        حفظ
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

ServiceForm.displayName = 'ServiceForm'

export default ServiceForm