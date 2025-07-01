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
import ClientFields from './ClientFields'
import { Select } from '@/components/ui'
import Input from '@/components/ui/Input'

type FormikRef = FormikProps<any>

type Service = {
    id: string
    serviceType?: string
    dealDetails?: string
    protectionFinish?: string
    protectionSize?: string
    protectionCoverage?: string
    insulatorType?: string
    insulatorCoverage?: string
    polishType?: string
    polishSubType?: string
    additionType?: string
    washScope?: string
    servicePrice?: number
    serviceDate?: string
}

type Guarantee = {
    id: string
    typeGuarantee: string
    startDate: string
    endDate: string
    terms: string
    Notes: string
}

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
    services: Array<Service & { guarantee?: Guarantee }>
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
        .matches(/^05\d{8}$/, 'يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام')
        .min(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام')
        .max(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام'),

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
        ['small', 'medium', 'large', 'X-large', 'huge'],
        'اختر حجمًا صالحًا للسيارة'
    ),

    carType: Yup.string().max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),

    carModel: Yup.string().max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),

    carColor: Yup.string().max(30, 'يجب ألا يتجاوز لون السيارة 30 حرفًا'),

    services: Yup.array().of(
        Yup.object().shape({
            serviceType: Yup.string().oneOf(
                ['polish', 'protection', 'insulator', 'additions'],
                'نوع الخدمة يجب أن يكون أحد الخيارات المتاحة'
            ),
            dealDetails: Yup.string().max(
                500,
                'يجب ألا تتجاوز تفاصيل الاتفاق 500 حرف'
            ),
            servicePrice: Yup.number().min(0, 'لا يمكن أن يكون السعر أقل من 0'),
            serviceDate: Yup.string().matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'تاريخ الخدمة يجب أن يكون بتنسيق YYYY-MM-DD'
            ),
            protectionFinish: Yup.string().when('serviceType', {
                is: 'protection',
                then: Yup.string()
                    .required('درجة اللمعان مطلوبة')
                    .oneOf(
                        ['glossy', 'matte', 'colored'],
                        'درجة اللمعان يجب أن تكون أحد الخيارات المتاحة'
                    ),
            }),
            protectionSize: Yup.string().when(
                ['serviceType', 'protectionFinish'],
                {
                    is: (serviceType: string, protectionFinish: string) =>
                        serviceType === 'protection' &&
                        protectionFinish === 'glossy',
                    then: Yup.string()
                        .required('حجم الفيلم مطلوب')
                        .oneOf(
                            ['10', '7.5'],
                            'حجم الفيلم يجب أن يكون 10 مل أو 7.5 مل'
                        ),
                }
            ),
            protectionCoverage: Yup.string().when('serviceType', {
                is: 'protection',
                then: Yup.string()
                    .required('نوع التغطية مطلوب')
                    .oneOf(
                        ['full', 'half', 'quarter', 'edges', 'other'],
                        'نوع التغطية يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
            insulatorType: Yup.string().when('serviceType', {
                is: 'insulator',
                then: Yup.string()
                    .required('نوع العازل مطلوب')
                    .oneOf(
                        ['ceramic', 'carbon', 'crystal'],
                        'نوع العازل يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
            insulatorCoverage: Yup.string().when('serviceType', {
                is: 'insulator',
                then: Yup.string()
                    .required('نطاق التغطية مطلوب')
                    .oneOf(
                        ['full', 'half', 'piece', 'shield', 'external'],
                        'نطاق التغطية يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
            polishType: Yup.string().when('serviceType', {
                is: 'polish',
                then: Yup.string()
                    .required('نوع التلميع مطلوب')
                    .oneOf(
                        [
                            'external',
                            'internal',
                            'seats',
                            'piece',
                            'water_polish',
                        ],
                        'نوع التلميع يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
            polishSubType: Yup.string().when(['serviceType', 'polishType'], {
                is: (serviceType, polishType) =>
                    serviceType === 'polish' && polishType === 'external',
                then: Yup.string()
                    .required('مستوى التلميع مطلوب')
                    .oneOf(
                        ['1', '2', '3'],
                        'مستوى التلميع يجب أن يكون 1 أو 2 أو 3'
                    ),
            }),
            additionType: Yup.string().when('serviceType', {
                is: 'additions',
                then: Yup.string()
                    .required('نوع الإضافة مطلوب')
                    .oneOf(
                        [
                            'detailed_wash',
                            'premium_wash',
                            'leather_pedals',
                            'blackout',
                            'nano_interior_decor',
                            'nano_interior_seats',
                        ],
                        'نوع الإضافة يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
            washScope: Yup.string().when(['serviceType', 'additionType'], {
                is: (serviceType: string, additionType: string) =>
                    serviceType === 'additions' &&
                    ['detailed_wash', 'premium_wash'].includes(additionType),
                then: Yup.string()
                    .required('نطاق الغسيل مطلوب')
                    .oneOf(
                        ['full', 'external_only', 'internal_only', 'engine'],
                        'نطاق الغسيل يجب أن يكون أحد الخيارات المتاحة'
                    ),
            }),
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
                            if (!value) return true
                            const today = new Date().setHours(0, 0, 0, 0)
                            const inputDate = new Date(value).setHours(
                                0,
                                0,
                                0,
                                0
                            )
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
                            if (!value) return true
                            const { startDate } = this.parent
                            if (!startDate || !value) return true
                            return new Date(value) >= new Date(startDate)
                        }
                    ),
                terms: Yup.string().max(200, 'يجب ألا تتجاوز الشروط 200 حرف'),
                Notes: Yup.string().max(
                    200,
                    'يجب ألا تتجاوز الملاحظات 200 حرف'
                ),
            }),
        })
    ),
})

type ClientFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: (callback: any) => void
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

const ClientForm = forwardRef<FormikRef, ClientFormProps>((props, ref) => {
    const [serviceCounter, setServiceCounter] = useState(1) // بدءًا من 1 لضمان وجود خدمة واحدة افتراضياً

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
        onDelete,
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
            // لا تسمح بحذف آخر خدمة
            return
        }
        const services = [...form.values.services]
        services.splice(index, 1)
        form.setFieldValue('services', services)
    }

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

                    // تحويل تواريخ الضمان
                    data.services = data.services?.map((service: any) => {
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

                        // حذف الضمان إذا كان فارغًا
                        if (
                            service.guarantee &&
                            !service.guarantee.typeGuarantee &&
                            !service.guarantee.startDate &&
                            !service.guarantee.endDate
                        ) {
                            delete service.guarantee
                        }

                        return service
                    })

                    // حذف كل الحقول الفارغة
                    data = removeEmptyFields(data)

                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting, ...form }) => {
                    return (
                        <Form>
                            <FormContainer>
                                {/* Client and Car Info Sections */}
                                <ClientFields
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                />

                                {/* Services and Guarantees Sections */}
                                <h5 className="mt-8 text-lg font-semibold">الخدمات والضمانات</h5>
                                <p className="mb-6 text-sm text-gray-500">قسم لإعداد الخدمات والضمانات المقدمة للعميل</p>

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
                                                        removeService(form, index)
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

                                                    {/* حقل الحجم - يظهر فقط للأفلام اللامعة */}
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
                                                                                label: '7.5 مل',
                                                                                value: '7.5',
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

                                                    {/* يظهر فقط عند اختيار خارجي */}
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

                                                    {/* حقول فرعية لأنواع الإضافات */}
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

                                            {/* <FormItem
                                                label="سعر الخدمة"
                                                invalid={!!errors.services?.[index]?.servicePrice && !!touched.services?.[index]?.servicePrice}
                                                errorMessage={errors.services?.[index]?.servicePrice as string}
                                            >
                                                <Field
                                                    name={`services[${index}].servicePrice`}
                                                    type="number"
                                                    size="sm"
                                                    placeholder="أدخل سعر الخدمة"
                                                    component={Input}
                                                />
                                            </FormItem> */}
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
                                                                                  label: field.value,
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
                                                            type="date"
                                                            size="sm"
                                                            component={Input}
                                                            placeholder="تاريخ البدء"
                                                        />
                                                    </FormItem>

                                                    <FormItem
                                                        label="تاريخ الانتهاء"
                                                        invalid={
                                                            !!errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.endDate &&
                                                            !!touched
                                                                .services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.endDate
                                                        }
                                                        errorMessage={
                                                            errors.services?.[
                                                                index
                                                            ]?.guarantee
                                                                ?.endDate
                                                        }
                                                    >
                                                        <Field
                                                            name={`services[${index}].guarantee.endDate`}
                                                            size="sm"
                                                            type="date"
                                                            component={Input}
                                                            placeholder="تاريخ الانتهاء"
                                                        />
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
                                    <div>
                                        {type === 'edit' && (
                                            <DeleteProductButton
                                                onDelete={onDelete as any}
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
                                            {type === 'new' ? 'اضافة' : 'تحديث'}
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