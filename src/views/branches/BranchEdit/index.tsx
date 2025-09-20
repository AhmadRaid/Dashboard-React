// src/views/branches/BranchEdit/index.tsx

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'
import { AiOutlineSave } from 'react-icons/ai'
import { Loading } from '@/components/shared'
import { toast, Notification } from '@/components/ui'
import * as Yup from 'yup'
import { apiGetBranchDetails, apiUpdateBranch } from '@/services/BranchService'
import BranchFields from '../BranchForm/BranchFields'

type InitialData = {
    _id: string
    name: string
    address: string
    phone: string
    secondPhone: string
}

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('اسم الفرع مطلوب')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    address: Yup.string().max(200, 'يجب ألا يتجاوز العنوان 200 حرف'),
    phone: Yup.string()
        .required('رقم الهاتف الأساسي مطلوب')
        .matches(
            /^05\d{8}$/,
            'يجب أن يكون رقم هاتف صالحًا يبدأ بـ 05 ويتكون من 10 أرقام'
        ),
    secondPhone: Yup.string()
        .matches(
            /^05\d{8}$/,
            'يجب أن يكون رقم هاتف صالحًا يبدأ بـ 05 ويتكون من 10 أرقام'
        )
        .test(
            'phone-not-same',
            'يجب أن يكون رقم الهاتف الثانوي مختلفًا عن رقم الهاتف الرئيسي',
            function (value) {
                const { phone } = this.parent
                if (value && phone && value === phone) {
                    return false
                }
                return true
            }
        ),
})

const BranchEditPage = () => {
    const { branchId } = useParams()
    const navigate = useNavigate()
    const [branchData, setBranchData] = useState<InitialData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBranch = async () => {
            if (!branchId) {
                setLoading(false)
                toast.push(
                    <Notification
                        title="خطأ في المعرف"
                        type="danger"
                        duration={3000}
                    >
                        لم يتم العثور على معرف الفرع.
                    </Notification>
                )
                return
            }
            try {
                const response = await apiGetBranchDetails(branchId)
                if (response?.data) {
                    setBranchData(response.data.data)
                } else {
                    toast.push(
                        <Notification
                            title="خطأ في البيانات"
                            type="danger"
                            duration={3000}
                        >
                            بيانات الفرع غير متوفرة.
                        </Notification>
                    )
                }
            } catch (err) {
                toast.push(
                    <Notification
                        title="خطأ في الاتصال"
                        type="danger"
                        duration={3000}
                    >
                        فشل في جلب بيانات الفرع.
                    </Notification>
                )
            } finally {
                setLoading(false)
            }
        }
        fetchBranch()
    }, [branchId])

    const onFormSubmit = async (
        values: InitialData,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitting(true)
        try {
            await apiUpdateBranch(values._id, values)
            setSubmitting(false)
            navigate('/branches')
            toast.push(
                <Notification
                    title="تم التعديل بنجاح"
                    type="success"
                >
                    تم تعديل الفرع بنجاح
                </Notification>
            )
        } catch (error) {
            console.error('API Error:', error)
            setSubmitting(false)
            toast.push(
                <Notification
                    title="خطأ في التعديل"
                    type="danger"
                >
                    فشل في تعديل الفرع.
                </Notification>
            )
        }
    }

    if (loading) {
        return <Loading loading={true} />
    }

    if (!branchData) {
        return (
            <div className="p-4 text-center">
                <h4 className="text-xl font-bold">
                    لم يتم العثور على الفرع
                </h4>
                <p className="mt-2 text-gray-500">
                    الفرع الذي تحاول تعديله غير موجود أو تم حذفه.
                </p>
            </div>
        )
    }

    return (
        <>
            <h3 className="mb-2">تعديل فرع</h3>
            <p className="mb-4">قم بتعديل بيانات الفرع.</p>
            <Formik
                initialValues={branchData}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit}
                enableReinitialize={true}
            >
                {({ touched, errors, isSubmitting, values }) => (
                    <Form>
                        <FormContainer>
                            <BranchFields
                                touched={touched}
                                errors={errors}
                                values={values} // **هنا تم تمرير الخاصية values**
                            />
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div />
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => navigate('/branches')}
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
                                        حفظ التعديلات
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default BranchEditPage