import { Formik, Form, Field, FieldProps } from 'formik'
import { Input, Select } from '@/components/ui'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Button } from '@/components/ui'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGetClientProfile, apiUpdateClient } from '@/services/ClientsService'
import { useEffect, useState } from 'react'
import { toast, Notification } from '@/components/ui'
import * as Yup from 'yup'

const clientTypes = [
    { label: 'فرد', value: 'فرد' },
    { label: 'شركة', value: 'شركة' },
    { label: 'مسوق', value: 'مسوق' },
]

const branchOptions = [
    { label: 'عملاء فرع ابحر', value: 'عملاء فرع ابحر' },
    { label: 'عملاء فرع المدينة', value: 'عملاء فرع المدينة' },
    { label: 'اخرى', value: 'اخرى' },
]

const UpdateDataClient = () => {
    const { clientId } = useParams()
    const navigate = useNavigate()
    const [clientData, setClientData] = useState(null)
    const [loading, setLoading] = useState(true)

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('الاسم الأول مطلوب'),
        secondName: Yup.string().required('الاسم الثاني مطلوب'),
        thirdName: Yup.string().required('الاسم الثالث مطلوب'),
        lastName: Yup.string().required('اسم العائلة مطلوب'),
        email: Yup.string().email('بريد إلكتروني غير صالح'),
        phone: Yup.string()
            .required('رقم الهاتف مطلوب')
            .matches(
                /^05\d{8}$/,
                'يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام'
            )
            .min(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام')
            .max(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام'),
        clientType: Yup.string()
            .oneOf(
                ['فرد', 'شركة', 'مسوق'],
                'نوع العميل يجب أن يكون "فرد" أو "شركة" أو "مسوق"'
            )
            .required('نوع العميل مطلوب'),

        branch: Yup.string()
            .oneOf(
                ['عملاء فرع ابحر', 'عملاء فرع المدينة', 'اخرى'],
                'اختر فرعًا صحيحًا'
            )
            .required('يجب اختيار الفرع'),
    })

    useEffect(() => {
        if (!clientId) {
            toast.push(
                <Notification type="danger">معرف العميل غير صالح</Notification>
            )
            navigate('/clients')
            return
        }

        const fetchClientData = async () => {
            try {
                const response = await apiGetClientProfile(clientId)
                if (response.data.data) {
                    setClientData(response.data.data)
                } else {
                    throw new Error('Client not found')
                }
            } catch (error) {
                toast.push(
                    <Notification title="خطأ" type="danger">
                        فشل في تحميل بيانات العميل
                    </Notification>
                )
                navigate('/clients')
            } finally {
                setLoading(false)
            }
        }

        fetchClientData()
    }, [clientId, navigate])

    const handleSubmit = async (values, { setSubmitting }) => {
        const payload = Object.fromEntries(
            Object.entries(values).filter(
                ([_, value]) =>
                    value !== '' && value !== null && value !== undefined
            )
        )

        try {
            if (!clientId) {
                toast.push(
                    <Notification type="danger">
                        معرف العميل غير صالح
                    </Notification>
                )
                navigate('/clients')
                return
            }

            await apiUpdateClient(clientId, payload)
            toast.push(
                <Notification title="تم التحديث" type="success">
                    تم تحديث بيانات العميل بنجاح
                </Notification>
            )
            navigate(`/clients/${clientId}`)
        } catch (error) {
            toast.push(
                <Notification title="خطأ" type="danger">
                    فشل في تحديث بيانات العميل
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (!clientData) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                لا توجد بيانات للعميل
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r p-2 text-white">
                    <h1 className="text-2xl font-bold">تحديث بيانات العميل</h1>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    <Formik
                        initialValues={{
                            firstName: clientData.firstName || '',
                            secondName: clientData.secondName || '',
                            thirdName: clientData.thirdName || '',
                            lastName: clientData.lastName || '',
                            email: clientData.email || '',
                            phone: clientData.phone || '',
                            clientType: clientData.clientType ,
                            branch: clientData.branch || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <FormContainer>
                                    {/* Personal Information Section */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                                            المعلومات الشخصية
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormItem
                                                label="الاسم الأول"
                                                invalid={
                                                    !!errors.firstName &&
                                                    !!touched.firstName
                                                }
                                                errorMessage={errors.firstName}
                                            >
                                                <Field
                                                    name="firstName"
                                                    as={Input}
                                                    placeholder="أدخل الاسم الأول"
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="الاسم الثاني"
                                                invalid={
                                                    !!errors.secondName &&
                                                    !!touched.secondName
                                                }
                                                errorMessage={errors.secondName}
                                            >
                                                <Field
                                                    name="secondName"
                                                    as={Input}
                                                    placeholder="أدخل الاسم الأوسط"
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="الاسم الثالث"
                                                invalid={
                                                    !!errors.thirdName &&
                                                    !!touched.thirdName
                                                }
                                                errorMessage={errors.thirdName}
                                            >
                                                <Field
                                                    name="thirdName"
                                                    as={Input}
                                                    placeholder="أدخل الاسم الثالث"
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="اسم العائلة"
                                                invalid={
                                                    !!errors.lastName &&
                                                    !!touched.lastName
                                                }
                                                errorMessage={errors.lastName}
                                            >
                                                <Field
                                                    name="lastName"
                                                    as={Input}
                                                    placeholder="أدخل اسم العائلة"
                                                />
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* Contact Information Section */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                                            معلومات التواصل
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormItem
                                                label="البريد الإلكتروني"
                                                invalid={
                                                    !!errors.email &&
                                                    !!touched.email
                                                }
                                                errorMessage={errors.email}
                                            >
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    as={Input}
                                                    placeholder="example@domain.com"
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="رقم الجوال"
                                                invalid={
                                                    !!errors.phone &&
                                                    !!touched.phone
                                                }
                                                errorMessage={errors.phone}
                                            >
                                                <Field name="phone">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="05XXXXXXXX"
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target.value.replace(
                                                                        /\D/g,
                                                                        ''
                                                                    )
                                                                const formattedValue =
                                                                    value.length >
                                                                    0
                                                                        ? '05' +
                                                                          value.substring(
                                                                              2,
                                                                              10
                                                                          )
                                                                        : ''
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    formattedValue
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* Additional Information Section */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                                            معلومات إضافية
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormItem
                                                label="نوع العميل"
                                                invalid={
                                                    !!errors.clientType &&
                                                    !!touched.clientType
                                                }
                                                errorMessage={errors.clientType}
                                            >
                                                <Field name="clientType">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select
                                                            {...field}
                                                            options={
                                                                clientTypes
                                                            }
                                                            value={clientTypes.find(
                                                                (opt) =>
                                                                    opt.value ===
                                                                    field.value
                                                            )}
                                                            onChange={(
                                                                option
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                            }
                                                            placeholder="اختر نوع العميل"
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            <FormItem
                                                label="الفرع"
                                                invalid={
                                                    !!errors.branch &&
                                                    !!touched.branch
                                                }
                                                errorMessage={errors.branch}
                                            >
                                                <Field name="branch">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select
                                                            {...field}
                                                            options={
                                                                branchOptions
                                                            }
                                                            value={branchOptions.find(
                                                                (opt) =>
                                                                    opt.value ===
                                                                    field.value
                                                            )}
                                                            onChange={(
                                                                option
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value
                                                                )
                                                            }
                                                            placeholder="اختر الفرع"
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                                        <Button
                                            type="button"
                                            variant="plain"
                                            onClick={() =>
                                                navigate(`/clients/${clientId}`)
                                            }
                                            className="px-6 py-2"
                                        >
                                            إلغاء
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="solid"
                                            loading={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
                                        >
                                            حفظ التغييرات
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default UpdateDataClient
