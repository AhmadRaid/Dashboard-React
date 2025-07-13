import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import { Select, toast } from '@/components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { apiAddOrder } from '@/services/OrdersService'

type FormikRef = FormikProps<any>

type Service = {
    id: string
    serviceType?: string
    dealDetails?: string
    protectionFinish?: string
    protectionSize?: '10' | '8' | '7.5' | '6.5'
    protectionCoverage?: string
    insulatorType?: string
    insulatorCoverage?: string
    polishType?: string
    polishSubType?: string
    additionType?: string
    washScope?: string
    servicePrice?: number
    serviceDate?: string
    originalCarColor?: string
    protectionColor?: string
}

type Guarantee = {
    id: string
    typeGuarantee: string
    startDate: string
    endDate?: string
    terms: string
    Notes: string
}

type InitialData = {
    carModel: string
    carColor: string
    branch: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    carType: string
    services: Array<{
        id: string
        serviceType: string
        dealDetails: string
        protectionFinish?: string
        protectionSize?: string
        protectionCoverage?: string
        originalCarColor?: string
        protectionColor?: string
        insulatorType?: string
        insulatorCoverage?: string
        polishType?: string
        polishSubType?: string
        additionType?: string
        washScope?: string
        servicePrice?: number
        serviceDate?: string
        guarantee?: {
            id: string
            typeGuarantee: string
            startDate: string
            endDate: string
            terms: string
            Notes: string
        }
    }>
}

const initialData: InitialData = {
    carModel: '',
    carColor: '',
    branch: '',
    carPlateNumber: '',
    carManufacturer: '',
    carSize: '',
    carType: '',
    services: [
        {
            id: 'service-0',
            serviceType: '',
            dealDetails: '',
            guarantee: {
                id: 'guarantee-0',
                typeGuarantee: '',
                startDate: '',
                endDate: '',
                terms: '',
                Notes: '',
            },
        },
    ],
}

export const validationSchema = Yup.object().shape({
    carType: Yup.string()
        .max(50, 'يجب ألا يتجاوز نوع السيارة 50 حرفًا')
        .required('نوع السيارة مطلوب'),
    carModel: Yup.string()
        .max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا')
        .required('موديل السيارة مطلوب'),
    carColor: Yup.string()
        .max(30, 'يجب ألا يتجاوز لون السيارة 30 حرفًا')
        .required('لون السيارة مطلوب'),
    carManufacturer: Yup.string().required('الشركة المصنعة للسيارة مطلوبة'),
    carSize: Yup.string()
        .oneOf(
            ['small', 'medium', 'large', 'X-large', 'XX-large'],
            'اختر حجمًا صالحًا للسيارة'
        )
        .required('حجم السيارة مطلوب'),
    services: Yup.array()
        .of(
            Yup.object().shape({
                serviceType: Yup.string().required('نوع الخدمة مطلوب'),
                dealDetails: Yup.string(),
                guarantee: Yup.object().shape({
                    typeGuarantee: Yup.string().required('مدة الضمان مطلوبة'),
                    startDate: Yup.string().required('تاريخ البدء مطلوب'),
                    terms: Yup.string(),
                }),
            })
        )
        .min(1, 'يجب إضافة خدمة واحدة على الأقل'),
})

const calculateEndDate = (
    startDate: string,
    guaranteePeriod: string
): string => {
    if (!startDate || !guaranteePeriod) return ''

    const date = new Date(startDate)
    const years = parseInt(guaranteePeriod)

    if (isNaN(years)) return ''

    date.setFullYear(date.getFullYear() + years)
    date.setDate(date.getDate() - 1)

    return date.toISOString().split('T')[0]
}

const toHijriDate = (gregorianDate: string): string => {
    if (!gregorianDate) return ''

    const date = new Date(gregorianDate)
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)

    return hijri
}

type FullOrderFormProps = {
    initialData?: InitialData
    onDiscard?: () => void
    onFormSubmit?: (
        formData: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => void
}

const DeleteProductButton = ({ onDelete }: { onDelete: any }) => {
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



const OrderForm = forwardRef<FormikRef, FullOrderFormProps>((props, ref) => {
    const [serviceCounter, setServiceCounter] = useState(1)
    const { clientId } = useParams<{ clientId: string }>()
    const navigate = useNavigate()

    const {
        initialData = {
            carModel: '',
            carColor: '',
            carSize: '',
            branch: '',
            carPlateNumber: '',
            carManufacturer: '',
            carType: '',
            services: [
                {
                    id: 'service-0',
                    serviceType: '',
                    dealDetails: '',
                    guarantee: {
                        id: 'guarantee-0',
                        typeGuarantee: '',
                        startDate: '',
                        endDate: '',
                        terms: '',
                        Notes: '',
                    },
                },
            ],
        },
        onFormSubmit,
        onDiscard,
    } = props

    const addServiceWithGuarantee = (form: FormikProps<any>) => {
        const newServiceId = `service-${serviceCounter}`
        const newGuaranteeId = `guarantee-${serviceCounter}`

        form.setFieldValue(`services[${serviceCounter}]`, {
            id: newServiceId,
            serviceType: '',
            dealDetails: '',
        })

        form.setFieldValue(`services[${serviceCounter}].guarantee`, {
            id: newGuaranteeId,
            typeGuarantee: '',
            startDate: '',
            endDate: '',
            terms: '',
            Notes: '',
        })

        setServiceCounter(serviceCounter + 1)
    }

    const removeService = (form: FormikProps<any>, index: number) => {
        if (form.values.services.length <= 1) {
            return
        }
        const services = [...form.values.services]
        services.splice(index, 1)
        form.setFieldValue('services', services)
    }

     function removeEmptyFields(obj: any): any {
        // حالة القيم الأساسية (ليست كائن أو مصفوفة)
        if (typeof obj !== 'object' || obj === null) {
            return obj
        }

        // حالة المصفوفات
        if (Array.isArray(obj)) {
            const cleanedArray = obj
                .map((item) => removeEmptyFields(item)) // تطبيق الدالة على كل عنصر
                .filter((item) => {
                    // تصفية العناصر الفارغة
                    if (typeof item === 'object' && item !== null) {
                        // بالنسبة لمصفوفة الخدمات، تأكد من وجود حقول مطلوبة
                        if (
                            item.serviceType ||
                            item.dealDetails ||
                            item.guarantee?.typeGuarantee
                        ) {
                            return true
                        }
                        return false
                    }
                    return item !== undefined && item !== null && item !== ''
                })

            // إذا كانت المصفوفة فارغة بعد التنظيف، نعيد undefined
            return cleanedArray.length > 0 ? cleanedArray : undefined
        }

        // حالة الكائنات
        const cleaned: Record<string, any> = {}
        for (const [key, value] of Object.entries(obj)) {
            const cleanedValue = removeEmptyFields(value) // تطبيق الدالة بشكل متكرر

            // الاحتفاظ بالقيمة فقط إذا لم تكن فارغة
            if (
                cleanedValue !== undefined &&
                cleanedValue !== null &&
                cleanedValue !== '' &&
                !(
                    typeof cleanedValue === 'object' &&
                    Object.keys(cleanedValue).length === 0
                ) &&
                !(Array.isArray(cleanedValue) && cleanedValue.length === 0)
            ) {
                cleaned[key] = cleanedValue
            }
        }

        return Object.keys(cleaned).length > 0 ? cleaned : undefined
    }

    const carSizeOptions = [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'X-Large', value: 'X-large' },
        { label: 'XX-Large', value: 'XX-large' },
    ]

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // تنظيف البيانات قبل الإرسال
            const cleanedData = removeEmptyFields(cloneDeep(values))

            // معالجة لوحة السيارة إذا كانت مصفوفة
            if (Array.isArray(cleanedData.carPlateNumber)) {
                cleanedData.carPlateNumber = cleanedData.carPlateNumber.join('')
            }

            // تحويل تواريخ الضمان إلى ISOString
            if (cleanedData.services) {
                cleanedData.services = cleanedData.services.map((service) => {
                    if (service.guarantee?.startDate) {
                        service.guarantee.startDate = new Date(
                            service.guarantee.startDate
                        ).toISOString()
                    }
                    if (service.guarantee?.endDate) {
                        service.guarantee.endDate = new Date(
                            service.guarantee.endDate
                        ).toISOString()
                    }
                    return service
                })
            }

            console.log('Data being sent:', cleanedData)

            if (!clientId) {
                toast.push(
                    <Notification type="danger">
                        معرف العميل غير صالح
                    </Notification>
                )
                navigate('/clients')
                return
            }

            // إرسال البيانات المنظفة
            const response = await apiAddOrder(clientId, cleanedData)

            if (response.success) {
                toast.push(
                    <Notification title="تم اضافة الطلب" type="success">
                        تم اضافة الطلب بنجاح
                    </Notification>
                )
                navigate(`/clients/${clientId}`)
            } else {
                throw new Error(response.message || 'فشل في إضافة الطلب')
            }
        } catch (error) {
            console.error('Error submitting order:', error)
            toast.push(
                <Notification title="خطأ" type="danger">
                    {error.message || 'حدث خطأ أثناء إضافة الطلب'}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, isSubmitting, ...form }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <h5 className="text-lg font-semibold">
                                    معلومات السيارة
                                </h5>
                                <p className="mb-6 text-sm text-gray-500">
                                    قسم لإعداد معلومات السيارة
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label="نوع السيارة"
                                        invalid={
                                            !!errors.carType &&
                                            !!touched.carType
                                        }
                                        errorMessage={errors.carType as string}
                                    >
                                        <Field
                                            name="carType"
                                            type="text"
                                            size="sm"
                                            placeholder="نوع السيارة"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="موديل السيارة"
                                        invalid={
                                            !!errors.carModel &&
                                            !!touched.carModel
                                        }
                                        errorMessage={errors.carModel}
                                    >
                                        <Field
                                            name="carModel"
                                            type="text"
                                            size="sm"
                                            placeholder="موديل السيارة"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="لون السيارة"
                                        invalid={
                                            !!errors.carColor &&
                                            !!touched.carColor
                                        }
                                        errorMessage={errors.carColor}
                                    >
                                        <Field
                                            name="carColor"
                                            type="text"
                                            size="sm"
                                            placeholder="لون السيارة"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="رقم لوحة السيارة"
                                        invalid={
                                            !!errors.carPlateNumber &&
                                            !!touched.carPlateNumber
                                        }
                                        errorMessage={
                                            errors.carPlateNumber as string
                                        }
                                    >
                                        <Field name="carPlateNumber">
                                            {({ field, form }: FieldProps) => (
                                                <div className="flex gap-2">
                                                    {[...Array(8)].map(
                                                        (_, i) => (
                                                            <Input
                                                                key={i}
                                                                type="text"
                                                                size="sm"
                                                                maxLength={1}
                                                                className="text-center w-10"
                                                                value={
                                                                    field
                                                                        .value?.[
                                                                        i
                                                                    ] || ''
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        e.target.value.toUpperCase()
                                                                    let newValue =
                                                                        field.value ||
                                                                        ''

                                                                    newValue =
                                                                        newValue.padEnd(
                                                                            8,
                                                                            ' '
                                                                        )
                                                                    newValue =
                                                                        newValue.substring(
                                                                            0,
                                                                            i
                                                                        ) +
                                                                        value +
                                                                        newValue.substring(
                                                                            i +
                                                                                1
                                                                        )

                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        newValue.trim()
                                                                    )

                                                                    if (
                                                                        value &&
                                                                        i < 7
                                                                    ) {
                                                                        const nextInput =
                                                                            document.querySelector(
                                                                                `input[name="${
                                                                                    field.name
                                                                                }-${
                                                                                    i +
                                                                                    1
                                                                                }"]`
                                                                            ) as HTMLInputElement
                                                                        nextInput?.focus()
                                                                    }
                                                                }}
                                                                name={`${field.name}-${i}`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem
                                        label="الشركة المصنعة"
                                        invalid={
                                            !!errors.carManufacturer &&
                                            !!touched.carManufacturer
                                        }
                                        errorMessage={errors.carManufacturer}
                                    >
                                        <Field
                                            name="carManufacturer"
                                            type="text"
                                            size="sm"
                                            placeholder="ادخل الشركة المصنعة"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label="حجم السيارة"
                                        invalid={
                                            !!errors.carSize &&
                                            !!touched.carSize
                                        }
                                        errorMessage={errors.carSize as string}
                                    >
                                        <Field name="carSize">
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    field={field}
                                                    size="sm"
                                                    form={form}
                                                    options={carSizeOptions}
                                                    value={carSizeOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            values.carSize
                                                    )}
                                                    onChange={(option) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value
                                                        )
                                                    }}
                                                    placeholder="اختر حجم السيارة"
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                {/* Services and Guarantees Sections */}
                                <h5 className="mt-8 text-lg font-semibold">
                                    الخدمات والضمانات
                                </h5>
                                <p className="mb-6 text-sm text-gray-500">
                                    قسم لإعداد الخدمات والضمانات المقدمة للعميل
                                </p>

                                {values.services?.map((service, index) => (
                                    <div
                                        key={service.id}
                                        className="mt-6 border-t pt-6"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-lg font-semibold">
                                                الخدمة {index + 1}
                                            </h4>
                                            {values.services.length > 1 && (
                                                <Button
                                                    size="xs"
                                                    variant="plain"
                                                    type="button"
                                                    icon={<HiOutlineTrash />}
                                                    onClick={() =>
                                                        removeService(
                                                            form,
                                                            index
                                                        )
                                                    }
                                                >
                                                    حذف الخدمة
                                                </Button>
                                            )}
                                        </div>

                                        {/* Service Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormItem
                                                label="نوع الخدمة"
                                                invalid={
                                                    !!errors.services?.[index]
                                                        ?.serviceType &&
                                                    !!touched.services?.[index]
                                                        ?.serviceType
                                                }
                                                errorMessage={
                                                    errors.services?.[index]
                                                        ?.serviceType as string
                                                }
                                            >
                                                <Field
                                                    name={`services[${index}].serviceType`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select
                                                            field={field}
                                                            size="sm"
                                                            form={form}
                                                            options={[
                                                                {
                                                                    label: 'تلميع',
                                                                    value: 'polish',
                                                                },
                                                                {
                                                                    label: 'حماية',
                                                                    value: 'protection',
                                                                },
                                                                {
                                                                    label: 'عازل حراري',
                                                                    value: 'insulator',
                                                                },
                                                                {
                                                                    label: 'إضافات',
                                                                    value: 'additions',
                                                                },
                                                            ]}
                                                            value={
                                                                field.value
                                                                    ? {
                                                                          label:
                                                                              field.value ===
                                                                              'polish'
                                                                                  ? 'تلميع'
                                                                                  : field.value ===
                                                                                    'protection'
                                                                                  ? 'حماية'
                                                                                  : field.value ===
                                                                                    'insulator'
                                                                                  ? 'عازل حراري'
                                                                                  : 'إضافات',
                                                                          value: field.value,
                                                                      }
                                                                    : null
                                                            }
                                                            onChange={(
                                                                option
                                                            ) => {
                                                                form.setFieldValue(
                                                                    `services[${index}].protectionFinish`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].protectionSize`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].protectionCoverage`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].insulatorType`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].insulatorCoverage`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].polishType`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].polishSubType`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].additionType`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    `services[${index}].washScope`,
                                                                    ''
                                                                )
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    option?.value ||
                                                                        ''
                                                                )
                                                            }}
                                                            placeholder="اختر نوع الخدمة"
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* حقول خاصة بخدمة الحماية */}
                                            {service.serviceType ===
                                                'protection' && (
                                                <>
                                                    <FormItem
                                                        label="لون السيارة الأصلي"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]
                                                                ?.originalCarColor &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.originalCarColor
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.originalCarColor as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].originalCarColor`}
                                                            type="text"
                                                            size="sm"
                                                            placeholder="أدخل لون السيارة الأصلي"
                                                            component={Input}
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="لون الحماية"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionColor &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.protectionColor
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionColor as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].protectionColor`}
                                                            type="text"
                                                            size="sm"
                                                            placeholder="أدخل لون الحماية"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        label="اللمعان"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionFinish &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.protectionFinish
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionFinish as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].protectionFinish`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'لامع',
                                                                            value: 'glossy',
                                                                        },
                                                                        {
                                                                            label: 'مطفى',
                                                                            value: 'matte',
                                                                        },
                                                                        {
                                                                            label: 'ملون',
                                                                            value: 'colored',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'glossy'
                                                                                          ? 'لامع'
                                                                                          : field.value ===
                                                                                            'matte'
                                                                                          ? 'مطفى'
                                                                                          : 'ملون',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            `services[${index}].protectionSize`,
                                                                            ''
                                                                        )
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر درجة اللمعان"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    {service.protectionFinish ===
                                                        'glossy' && (
                                                        <FormItem
                                                            label="الحجم"
                                                            invalid={
                                                                !!errors
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.protectionSize &&
                                                                !!touched
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.protectionSize
                                                            }
                                                            errorMessage={
                                                                errors
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.protectionSize as string
                                                            }
                                                        >
                                                            <Field
                                                                name={`services[${index}].protectionSize`}
                                                            >
                                                                {({
                                                                    field,
                                                                    form,
                                                                }: FieldProps) => (
                                                                    <Select
                                                                        field={
                                                                            field
                                                                        }
                                                                        size="sm"
                                                                        form={
                                                                            form
                                                                        }
                                                                        options={[
                                                                            {
                                                                                label: '10 مل',
                                                                                value: '10',
                                                                            },
                                                                            {
                                                                                label: '8 مل',
                                                                                value: '8',
                                                                            },
                                                                            {
                                                                                label: '7.5 مل',
                                                                                value: '7.5',
                                                                            },
                                                                            {
                                                                                label: '6.5 مل',
                                                                                value: '6.5',
                                                                            },
                                                                        ]}
                                                                        value={
                                                                            field.value
                                                                                ? {
                                                                                      label: `${field.value} مل`,
                                                                                      value: field.value,
                                                                                  }
                                                                                : null
                                                                        }
                                                                        onChange={(
                                                                            option
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                option?.value ||
                                                                                    ''
                                                                            )
                                                                        }}
                                                                        placeholder="اختر حجم الفيلم"
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FormItem>
                                                    )}

                                                    <FormItem
                                                        label="التغطية"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionCoverage &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]
                                                                ?.protectionCoverage
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.protectionCoverage as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].protectionCoverage`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'كامل',
                                                                            value: 'full',
                                                                        },
                                                                        {
                                                                            label: 'نص',
                                                                            value: 'half',
                                                                        },
                                                                        {
                                                                            label: 'ربع',
                                                                            value: 'quarter',
                                                                        },
                                                                        {
                                                                            label: 'أطراف',
                                                                            value: 'edges',
                                                                        },
                                                                        {
                                                                            label: 'أخرى',
                                                                            value: 'other',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'full'
                                                                                          ? 'كامل'
                                                                                          : field.value ===
                                                                                            'half'
                                                                                          ? 'نص'
                                                                                          : field.value ===
                                                                                            'quarter'
                                                                                          ? 'ربع'
                                                                                          : field.value ===
                                                                                            'edges'
                                                                                          ? 'أطراف'
                                                                                          : 'أخرى',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر نوع التغطية"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </>
                                            )}

                                            {/* حقول خاصة بخدمة العازل الحراري */}
                                            {service.serviceType ===
                                                'insulator' && (
                                                <>
                                                    <FormItem
                                                        label="نوع العازل"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.insulatorType &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.insulatorType
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.insulatorType as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].insulatorType`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'سيراميك',
                                                                            value: 'ceramic',
                                                                        },
                                                                        {
                                                                            label: 'كاربون',
                                                                            value: 'carbon',
                                                                        },
                                                                        {
                                                                            label: 'كرستال',
                                                                            value: 'crystal',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'ceramic'
                                                                                          ? 'سيراميك'
                                                                                          : field.value ===
                                                                                            'carbon'
                                                                                          ? 'كاربون'
                                                                                          : 'كرستال',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر نوع العازل"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    <FormItem
                                                        label="نطاق التغطية"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]
                                                                ?.insulatorCoverage &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.insulatorCoverage
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.insulatorCoverage as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].insulatorCoverage`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'كامل',
                                                                            value: 'full',
                                                                        },
                                                                        {
                                                                            label: 'نص',
                                                                            value: 'half',
                                                                        },
                                                                        {
                                                                            label: 'قطعة',
                                                                            value: 'piece',
                                                                        },
                                                                        {
                                                                            label: 'درع حماية',
                                                                            value: 'shield',
                                                                        },
                                                                        {
                                                                            label: 'خارجية',
                                                                            value: 'external',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'full'
                                                                                          ? 'كامل'
                                                                                          : field.value ===
                                                                                            'half'
                                                                                          ? 'نص'
                                                                                          : field.value ===
                                                                                            'piece'
                                                                                          ? 'قطعة'
                                                                                          : field.value ===
                                                                                            'shield'
                                                                                          ? 'درع حماية'
                                                                                          : 'خارجية',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر نطاق التغطية"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </>
                                            )}

                                            {/* حقول خاصة بخدمة التلميع */}
                                            {service.serviceType ===
                                                'polish' && (
                                                <>
                                                    <FormItem
                                                        label="نوع التلميع"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.polishType &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.polishType
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.polishType as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].polishType`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'خارجي',
                                                                            value: 'external',
                                                                        },
                                                                        {
                                                                            label: 'داخلي',
                                                                            value: 'internal',
                                                                        },
                                                                        {
                                                                            label: 'كراسي',
                                                                            value: 'seats',
                                                                        },
                                                                        {
                                                                            label: 'قطعة',
                                                                            value: 'piece',
                                                                        },
                                                                        {
                                                                            label: 'تلميع مائي',
                                                                            value: 'water_polish',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'external'
                                                                                          ? 'خارجي'
                                                                                          : field.value ===
                                                                                            'internal'
                                                                                          ? 'داخلي'
                                                                                          : field.value ===
                                                                                            'seats'
                                                                                          ? 'كراسي'
                                                                                          : field.value ===
                                                                                            'piece'
                                                                                          ? 'قطعة'
                                                                                          : 'تلميع مائي',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            `services[${index}].polishSubType`,
                                                                            ''
                                                                        )
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر نوع التلميع"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    {service.polishType ===
                                                        'external' && (
                                                        <FormItem
                                                            label="مستوى التلميع"
                                                            invalid={
                                                                !!errors
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.polishSubType &&
                                                                !!touched
                                                                    .services?.[
                                                                    index
                                                                ]?.polishSubType
                                                            }
                                                            errorMessage={
                                                                errors
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.polishSubType as string
                                                            }
                                                        >
                                                            <Field
                                                                name={`services[${index}].polishSubType`}
                                                            >
                                                                {({
                                                                    field,
                                                                    form,
                                                                }: FieldProps) => (
                                                                    <Select
                                                                        field={
                                                                            field
                                                                        }
                                                                        size="sm"
                                                                        form={
                                                                            form
                                                                        }
                                                                        options={[
                                                                            {
                                                                                label: 'مستوى 1',
                                                                                value: '1',
                                                                            },
                                                                            {
                                                                                label: 'مستوى 2',
                                                                                value: '2',
                                                                            },
                                                                            {
                                                                                label: 'مستوى 3',
                                                                                value: '3',
                                                                            },
                                                                        ]}
                                                                        value={
                                                                            field.value
                                                                                ? {
                                                                                      label: `مستوى ${field.value}`,
                                                                                      value: field.value,
                                                                                  }
                                                                                : null
                                                                        }
                                                                        onChange={(
                                                                            option
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                option?.value ||
                                                                                    ''
                                                                            )
                                                                        }}
                                                                        placeholder="اختر مستوى التلميع"
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FormItem>
                                                    )}
                                                </>
                                            )}

                                            {/* حقول خاصة بخدمة الإضافات */}
                                            {service.serviceType ===
                                                'additions' && (
                                                <>
                                                    <FormItem
                                                        label="نوع الإضافة"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.additionType &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.additionType
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]
                                                                ?.additionType as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].additionType`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: 'غسيل تفصيلي',
                                                                            value: 'detailed_wash',
                                                                        },
                                                                        {
                                                                            label: 'غسيل تفصيلي خاص',
                                                                            value: 'premium_wash',
                                                                        },
                                                                        {
                                                                            label: 'دواسات جلد',
                                                                            value: 'leather_pedals',
                                                                        },
                                                                        {
                                                                            label: 'تكحيل',
                                                                            value: 'blackout',
                                                                        },
                                                                        {
                                                                            label: 'نانو داخلي ديكور',
                                                                            value: 'nano_interior_decor',
                                                                        },
                                                                        {
                                                                            label: 'نانو داخلي مقاعد',
                                                                            value: 'nano_interior_seats',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label:
                                                                                      field.value ===
                                                                                      'detailed_wash'
                                                                                          ? 'غسيل تفصيلي'
                                                                                          : field.value ===
                                                                                            'premium_wash'
                                                                                          ? 'غسيل تفصيلي خاص'
                                                                                          : field.value ===
                                                                                            'leather_pedals'
                                                                                          ? 'دواسات جلد'
                                                                                          : field.value ===
                                                                                            'blackout'
                                                                                          ? 'تكحيل'
                                                                                          : field.value ===
                                                                                            'nano_interior_decor'
                                                                                          ? 'نانو داخلي ديكور'
                                                                                          : 'نانو داخلي مقاعد',
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ||
                                                                                ''
                                                                        )
                                                                    }}
                                                                    placeholder="اختر نوع الإضافة"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    {(service.additionType ===
                                                        'detailed_wash' ||
                                                        service.additionType ===
                                                            'premium_wash') && (
                                                        <FormItem
                                                            label="نطاق الغسيل"
                                                            invalid={
                                                                !!errors
                                                                    .services?.[
                                                                    index
                                                                ]?.washScope &&
                                                                !!touched
                                                                    .services?.[
                                                                    index
                                                                ]?.washScope
                                                            }
                                                            errorMessage={
                                                                errors
                                                                    .services?.[
                                                                    index
                                                                ]
                                                                    ?.washScope as string
                                                            }
                                                        >
                                                            <Field
                                                                name={`services[${index}].washScope`}
                                                            >
                                                                {({
                                                                    field,
                                                                    form,
                                                                }: FieldProps) => (
                                                                    <Select
                                                                        field={
                                                                            field
                                                                        }
                                                                        size="sm"
                                                                        form={
                                                                            form
                                                                        }
                                                                        options={[
                                                                            {
                                                                                label: 'كامل',
                                                                                value: 'full',
                                                                            },
                                                                            {
                                                                                label: 'خارجي فقط',
                                                                                value: 'external_only',
                                                                            },
                                                                            {
                                                                                label: 'داخلي فقط',
                                                                                value: 'internal_only',
                                                                            },
                                                                            {
                                                                                label: 'محرك',
                                                                                value: 'engine',
                                                                            },
                                                                        ]}
                                                                        value={
                                                                            field.value
                                                                                ? {
                                                                                      label:
                                                                                          field.value ===
                                                                                          'full'
                                                                                              ? 'كامل'
                                                                                              : field.value ===
                                                                                                'external_only'
                                                                                              ? 'خارجي فقط'
                                                                                              : field.value ===
                                                                                                'internal_only'
                                                                                              ? 'داخلي فقط'
                                                                                              : 'محرك',
                                                                                      value: field.value,
                                                                                  }
                                                                                : null
                                                                        }
                                                                        onChange={(
                                                                            option
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                option?.value ||
                                                                                    ''
                                                                            )
                                                                        }}
                                                                        placeholder="اختر نطاق الغسيل"
                                                                    />
                                                                )}
                                                            </Field>
                                                        </FormItem>
                                                    )}
                                                </>
                                            )}

                                            <FormItem
                                                label="تفاصيل الاتفاق"
                                                invalid={
                                                    !!errors.services?.[index]
                                                        ?.dealDetails &&
                                                    !!touched.services?.[index]
                                                        ?.dealDetails
                                                }
                                                errorMessage={
                                                    errors.services?.[index]
                                                        ?.dealDetails as string
                                                }
                                            >
                                                <Field
                                                    name={`services[${index}].dealDetails`}
                                                    type="text"
                                                    size="sm"
                                                    placeholder="أدخل تفاصيل الاتفاق"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>

                                        {/* Guarantee Fields */}
                                        {service.guarantee && (
                                            <div className="mt-6">
                                                <h5 className="text-md font-semibold mb-4">
                                                    ضمان الخدمة {index + 1}
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormItem
                                                        label="مدة الضمان"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.typeGuarantee &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.typeGuarantee
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.typeGuarantee
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].guarantee.typeGuarantee`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    field={
                                                                        field
                                                                    }
                                                                    size="sm"
                                                                    form={form}
                                                                    options={[
                                                                        {
                                                                            label: '2 سنوات',
                                                                            value: '2 سنوات',
                                                                        },
                                                                        {
                                                                            label: '3 سنوات',
                                                                            value: '3 سنوات',
                                                                        },
                                                                        {
                                                                            label: '5 سنوات',
                                                                            value: '5 سنوات',
                                                                        },
                                                                        {
                                                                            label: '8 سنوات',
                                                                            value: '8 سنوات',
                                                                        },
                                                                        {
                                                                            label: '10 سنوات',
                                                                            value: '10 سنوات',
                                                                        },
                                                                    ]}
                                                                    value={
                                                                        field.value
                                                                            ? {
                                                                                  label: `${field.value}`,
                                                                                  value: field.value,
                                                                              }
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        option
                                                                    ) => {
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value
                                                                        )

                                                                        const startDate =
                                                                            form
                                                                                .values
                                                                                .services[
                                                                                index
                                                                            ]
                                                                                .guarantee
                                                                                .startDate
                                                                        if (
                                                                            startDate &&
                                                                            option?.value
                                                                        ) {
                                                                            const endDate =
                                                                                calculateEndDate(
                                                                                    startDate,
                                                                                    option.value
                                                                                )
                                                                            form.setFieldValue(
                                                                                `services[${index}].guarantee.endDate`,
                                                                                endDate
                                                                            )
                                                                        }
                                                                    }}
                                                                    placeholder="اختر مدة الضمان"
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>

                                                    <FormItem
                                                        label="تاريخ البدء"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.startDate &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.startDate
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.startDate
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].guarantee.startDate`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <div>
                                                                    <Input
                                                                        type="date"
                                                                        size="sm"
                                                                        {...field}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            field.onChange(
                                                                                e
                                                                            )

                                                                            const guaranteePeriod =
                                                                                form
                                                                                    .values
                                                                                    .services[
                                                                                    index
                                                                                ]
                                                                                    .guarantee
                                                                                    .typeGuarantee
                                                                            if (
                                                                                e
                                                                                    .target
                                                                                    .value &&
                                                                                guaranteePeriod
                                                                            ) {
                                                                                const endDate =
                                                                                    calculateEndDate(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        guaranteePeriod
                                                                                    )
                                                                                form.setFieldValue(
                                                                                    `services[${index}].guarantee.endDate`,
                                                                                    endDate
                                                                                )
                                                                            }
                                                                        }}
                                                                        placeholder="تاريخ البدء"
                                                                    />
                                                                    {field.value && (
                                                                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                                                                            <span className="text-base font-medium text-blue-700">
                                                                                التاريخ
                                                                                الهجري:
                                                                            </span>
                                                                            <span className="text-base font-semibold text-blue-800">
                                                                                {toHijriDate(
                                                                                    field.value
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                    <FormItem label="تاريخ الانتهاء">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="text"
                                                                    size="sm"
                                                                    value={
                                                                        values
                                                                            .services[
                                                                            index
                                                                        ]
                                                                            .guarantee
                                                                            ?.endDate ||
                                                                        ''
                                                                    }
                                                                    readOnly
                                                                    className="bg-gray-50"
                                                                />
                                                            </div>
                                                            {values.services[
                                                                index
                                                            ].guarantee
                                                                ?.endDate && (
                                                                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                                                                    <span className="text-base font-medium text-blue-700">
                                                                        التاريخ
                                                                        الهجري:
                                                                    </span>
                                                                    <span className="text-base font-semibold text-blue-800">
                                                                        {toHijriDate(
                                                                            values
                                                                                .services[
                                                                                index
                                                                            ]
                                                                                .guarantee
                                                                                .endDate
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormItem>

                                                    <FormItem
                                                        label="الشروط"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.terms &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.guarantee?.terms
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]?.guarantee?.terms
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].guarantee.terms`}
                                                            type="text"
                                                            size="sm"
                                                            placeholder="شروط الضمان"
                                                            component={Input}
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="ملاحظات على الضمان"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.Notes &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.guarantee?.Notes
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.Notes as string
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].guarantee.Notes`}
                                                            type="text"
                                                            size="sm"
                                                            placeholder="اضف ملاحظات على الضمان"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-6">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            addServiceWithGuarantee(form)
                                        }
                                        icon={<HiPlus />}
                                    >
                                        إضافة خدمة وضمان جديد
                                    </Button>
                                </div>

                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
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
                                            اضافة الطلب
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

OrderForm.displayName = 'OrderForm'

export default OrderForm
