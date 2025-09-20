// src/components/branch/BranchForm.tsx

import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'
import { AiOutlineSave } from 'react-icons/ai'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import BranchFields from './BranchFields'
import { apiAddNewBranch } from '@/services/BranchService'
import { useNavigate } from 'react-router-dom'
import { toast, Notification } from '@/components/ui'


type FormikRef = FormikProps<any>

type InitialData = {
    name: string
    address: string
    phone: string
    secondPhone: string
}

const initialData: InitialData = {
    name: '',
    address: '',
    phone: '',
    secondPhone: '',
}

export const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('اسم الفرع مطلوب')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    address: Yup.string().max(200, 'يجب ألا يتجاوز العنوان 200 حرف'),
    phone: Yup.string().max(20, 'يجب ألا يتجاوز رقم الهاتف 20 حرف'),
    secondPhone: Yup.string().max(
        20,
        'يجب ألا يتجاوز رقم الهاتف الثانوي 20 حرف'
    ),
})

type BranchFormProps = {
    onDiscard?: () => void
    onSuccess?: () => void
    onError?: (error: any) => void
}

const BranchForm = forwardRef<FormikRef, BranchFormProps>((props, ref) => {
    const { onDiscard, onSuccess, onError } = props
    const navigate = useNavigate()

    const onFormSubmit = async (
        values: InitialData,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitting(true)
        try {
            // استدعاء دالة API لإضافة فرع جديد
            await apiAddNewBranch(values)
            setSubmitting(false)
            
            navigate('/branches')
            
            toast.push(
                <Notification
                    title="تمت الإضافة بنجاح"
                    type="success"
                >
                    تم إضافة الفرع بنجاح
                </Notification>
                )
        } catch (error) {
            console.error('API Error:', error)
            setSubmitting(false)
            onError?.(error)
        }
    }

    return (
        <>
            {/* إضافة عنوان واضح لصفحة الإضافة */}
            <h3 className="mb-2">إضافة فرع جديد</h3>
            <p className="mb-4">
                املأ النموذج التالي لإضافة فرع جديد إلى النظام.
            </p>

            <Formik
                innerRef={ref}
                initialValues={initialData}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
            >
                {({ touched, errors, isSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <BranchFields
                                    touched={touched}
                                    errors={errors}
                                    values={initialData} // تم إصلاح الخطأ هنا
                                />

                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    {/* إزالة قسم الحذف */}
                                    <div />
                                    <div className="md:flex items-center">
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={() => onDiscard?.()}
                                        >
                                            إلغاء
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            إضافة
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

BranchForm.displayName = 'BranchForm'

export default BranchForm
