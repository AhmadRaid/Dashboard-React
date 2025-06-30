import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import type { Guarantee } from '@/@types/clients'
import { useEffect, useState } from 'react'
import { apiGetAllServices } from '@/services/ClientsService'
import { useAppDispatch } from '@/store'

type FormFieldsName = {
    firstName: string
    middleName: string
    lastName: string
    email: string
    phone: string
    clientType: string
    carModel: string
    carColor: string
    guarantee: Guarantee
    branch: string
    carType: string // Add this
    carPlateNumber: string // Add this
    carManufacturer: string // Add this
    carSize: string // Add this
}

type ClientFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName
}

const carSizeOptions = [
    { label: 'صغير', value: 'small' },
    { label: 'متوسط', value: 'medium' },
    { label: 'كبير', value: 'large' },
]

const branchOptions = [
    { label: 'عملاء فرع ابحر', value: 'عملاء فرع ابحر' },
    { label: 'عملاء فرع المدينة', value: 'عملاء فرع المدينة' },
    { label: 'اخرى', value: 'اخرى' },
]

const guaranteeOptions = [
    { label: '2 سنوات', value: '2 سنوات' },
    { label: '3 سنوات', value: '3 سنوات' },
    { label: '5 سنوات', value: '5 سنوات' },
    { label: '8 سنوات', value: '8 سنوات' },
    { label: '10 سنوات', value: '10 سنوات' },
]

const ClientFields = (props: ClientFieldsProps) => {
    const [services, setServices] = useState<
        { label: string; value: string }[]
    >([])
    const [loadingServices, setLoadingServices] = useState<boolean>(false)

    const clientTypes = [
        { label: 'فردي', value: 'individual' },
        { label: 'شركة', value: 'company' },
    ]

    const getServices = async () => {
        setLoadingServices(true)
        try {
            const res = await apiGetAllServices()
            const allServices = res.data.data.map((service: any) => ({
                label: service.name,
                value: service.name,
            }))
            setServices(allServices)
        } catch (error) {
            setServices([]) // empty on error
        }
        setLoadingServices(false)
    }

    useEffect(() => {
        getServices()
    }, [])

    const { values, touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>معلومات العميل</h5>
            <p className="mb-6">قسم لإعداد معلومات العميل الأساسية</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="الاسم الأول"
                    invalid={!!errors.firstName && !!touched.firstName}
                    errorMessage={errors.firstName}
                >
                    <Field
                        name="firstName"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="الاسم الأول"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="الاسم الثاني"
                    invalid={!!errors.middleName && !!touched.middleName}
                    errorMessage={errors.middleName}
                >
                    <Field
                        name="middleName"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="الاسم الثاني"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="اسم العائلة"
                    invalid={!!errors.lastName && !!touched.lastName}
                    errorMessage={errors.lastName}
                >
                    <Field
                        name="lastName"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="اسم العائلة"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="البريد الإلكتروني"
                    invalid={!!errors.email && !!touched.email}
                    errorMessage={errors.email}
                >
                    <Field
                        name="email"
                        size="sm"
                        type="email"
                        placeholder="البريد الإلكتروني"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="رقم الهاتف"
                    invalid={!!errors.phone && !!touched.phone}
                    errorMessage={errors.phone}
                >
                    <Field
                        name="phone"
                        type="text"
                        size="sm"
                        placeholder="رقم الهاتف"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="نوع العميل"
                    invalid={!!errors.clientType && !!touched.clientType}
                    errorMessage={errors.clientType}
                >
                    <Field name="clientType">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={clientTypes}
                                value={clientTypes.find(
                                    (option) =>
                                        option.value === values.clientType
                                )}
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }}
                                placeholder="نوع العميل"
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="الفرع"
                    invalid={!!errors.branch && !!touched.branch}
                    errorMessage={errors.branch as string}
                >
                    <Field name="branch">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={branchOptions}
                                value={branchOptions.find(
                                    (option) => option.value === values.branch
                                )}
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }}
                                placeholder="اختر الفرع"
                            />
                        )}
                    </Field>
                </FormItem>
            </div>

            <h5 className="mt-8">معلومات السيارة</h5>
            <p className="mb-6">قسم لإعداد معلومات السيارة</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="نوع السيارة"
                    invalid={!!errors.carType && !!touched.carType}
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
                    invalid={!!errors.carModel && !!touched.carModel}
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
                    invalid={!!errors.carColor && !!touched.carColor}
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
                        !!errors.carPlateNumber && !!touched.carPlateNumber
                    }
                    errorMessage={errors.carPlateNumber as string}
                >
                    <Field
                        name="carPlateNumber"
                        type="text"
                        size="sm"
                        placeholder="رقم لوحة السيارة"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="الشركة المصنعة"
                    invalid={
                        !!errors.carManufacturer && !!touched.carManufacturer
                    }
                    errorMessage={errors.carManufacturer}
                >
                    {/* <Field
                        name="carManufacturer"
                        type="text"
                        size="sm"
                        placeholder="ادخل الشركة المصنعة"
                        component={Input}
                    /> */}
                    <Field name="carManufacturer">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={[
                                    { label: 'NISSAN', value: 'NISSAN' },
                                    { label: 'BMW', value: 'BMW' },
                                    { label: 'GOLF', value: 'GOLF' },
                                    { label: 'TOYOTA', value: 'TOYOTA' },
                                ]}
                                value={
                                    field.value
                                        ? {
                                              label: field.value,
                                              value: field.value,
                                          }
                                        : null
                                }
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value || ''
                                    )
                                }}
                                placeholder="اختر الشركة المصنعة"
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="حجم السيارة"
                    invalid={!!errors.carSize && !!touched.carSize}
                    errorMessage={errors.carSize as string}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {' '}
                        {/* تغيير gap من 4 إلى 2 */}
                        {carSizeOptions.map((option) => (
                            <label
                                key={option.value}
                                className={`relative p-2 border rounded-md cursor-pointer transition-all text-sm
                    ${
                        values.carSize === option.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                `}
                            >
                                <Field
                                    type="radio"
                                    name="carSize"
                                    value={option.value}
                                    className="absolute opacity-0"
                                    checked={values.carSize === option.value}
                                />
                                <div className="flex flex-col items-center text-center">
                                    <span className="block font-medium">
                                        {' '}
                                        {/* إزالة text-lg و mb-1 */}
                                        {option.label}
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {' '}
                                        {/* تغيير text-sm إلى text-xs */}
                                        {option.value === 'small'}
                                        {option.value === 'medium'}
                                        {option.value === 'large'}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FormItem>

                {/* <FormItem
                    label="حجم السيارة"
                    invalid={!!errors.carSize && !!touched.carSize}
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
                                    (option) => option.value === values.carSize
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
                </FormItem> */}
            </div>

            {/* <FormItem
                    label="الخدمة"
                    invalid={!!errors.service && !!touched.service}
                    errorMessage={errors.service}
                >
                    <Field name="service">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                form={form}
                                options={
                                    loadingServices
                                        ? [
                                              {
                                                  label: 'جاري التحميل...',
                                                  value: '',
                                              },
                                          ]
                                        : services.length > 0
                                        ? services
                                        : [
                                              {
                                                  label: 'لا توجد خدمات متاحة',
                                                  value: '',
                                              },
                                          ]
                                }
                                value={services.filter(
                                    (service) =>
                                        service.value === values.service
                                )}
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }}
                            />
                        )}
                    </Field>
                </FormItem> */}

            {/* <FormItem
                    label="المنتجات"
                    invalid={
                        !!errors.guarantee?.products &&
                        !!touched.guarantee?.products
                    }
                    errorMessage={errors.guarantee?.products as string}
                >
                    <Field name="guarantee.products">
                        {({ field, form }: FieldProps) => (
                            <Select
                                isMulti
                                size="sm"
                                placeholder="اختر المنتجات"
                                options={[
                                    {
                                        label: 'Thermal Coating',
                                        value: 'Thermal Coating',
                                    },
                                    {
                                        label: 'Ceramic Layer',
                                        value: 'Ceramic Layer',
                                    },
                                    {
                                        label: 'Nano Protection',
                                        value: 'Nano Protection',
                                    },
                                ]}
                                value={
                                    field.value
                                        ? field.value.map((val: string) => ({
                                              label: val,
                                              value: val,
                                          }))
                                        : []
                                }
                                onChange={(selectedOptions) =>
                                    form.setFieldValue(
                                        field.name,
                                        selectedOptions.map(
                                            (option: any) => option.value
                                        )
                                    )
                                }
                            />
                        )}
                    </Field>
                </FormItem> */}

            <h5 className="mt-8">الخدمات والمبيعات</h5>
            <p className="mb-6">قسم لإعداد معلومات الخدمات والمبيعات</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="نوع الخدمة"
                    invalid={!!errors.serviceType && !!touched.serviceType}
                    errorMessage={errors.serviceType as string}
                >
                    <Field name="serviceType">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={[
                                    { label: 'تلميع', value: 'polish' },
                                    { label: 'حماية', value: 'protection' },
                                    { label: 'عازل حراري', value: 'insulator' },
                                    { label: 'إضافات', value: 'additions' },
                                ]}
                                value={
                                    field.value
                                        ? {
                                              label:
                                                  field.value === 'polish'
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
                                onChange={(option) => {
                                    // مسح الحقول القديمة عند تغيير نوع الخدمة
                                    form.setFieldValue('protectionType', '')
                                    form.setFieldValue('protectionFinish', '')
                                    form.setFieldValue('protectionSize', '')
                                    form.setFieldValue('protectionCoverage', '')
                                    form.setFieldValue('insulatorType', '')
                                    form.setFieldValue('insulatorCoverage', '')
                                    form.setFieldValue('polishType', '')
                                    form.setFieldValue('polishSubType', '')
                                    form.setFieldValue('additionType', '')
                                    form.setFieldValue(
                                        'serviceType',
                                        option?.value || ''
                                    )
                                }}
                                placeholder="اختر نوع الخدمة"
                            />
                        )}
                    </Field>
                </FormItem>

                {/* حقل تفاصيل الخدمة العام */}
                <FormItem
                    label="تفاصيل الخدمة"
                    invalid={
                        !!errors.serviceDetails && !!touched.serviceDetails
                    }
                    errorMessage={errors.serviceDetails as string}
                >
                    <Field
                        name="serviceDetails"
                        type="text"
                        size="sm"
                        placeholder="أدخل تفاصيل الخدمة"
                        component={Input}
                    />
                </FormItem>
                {/* حقول خاصة بخدمة الحماية */}
                <>
                    {values.serviceType === 'protection' && (
                        <>
                            <FormItem
                                label="اللمعان"
                                invalid={
                                    !!errors.protectionFinish &&
                                    !!touched.protectionFinish
                                }
                                errorMessage={errors.protectionFinish as string}
                            >
                                <Field name="protectionFinish">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            field={field}
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
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    'protectionSize',
                                                    ''
                                                )
                                                form.setFieldValue(
                                                    'protectionFinish',
                                                    option?.value || ''
                                                )
                                            }}
                                            placeholder="اختر درجة اللمعان"
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            {/* حقل الحجم - يظهر فقط للأفلام اللامعة */}
                            {values.protectionFinish === 'glossy' && (
                                <FormItem
                                    label="الحجم"
                                    invalid={
                                        !!errors.protectionSize &&
                                        !!touched.protectionSize
                                    }
                                    errorMessage={
                                        errors.protectionSize as string
                                    }
                                >
                                    <Field name="protectionSize">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                field={field}
                                                size="sm"
                                                form={form}
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
                                                onChange={(option) => {
                                                    form.setFieldValue(
                                                        'protectionSize',
                                                        option?.value || ''
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
                                    !!errors.protectionCoverage &&
                                    !!touched.protectionCoverage
                                }
                                errorMessage={
                                    errors.protectionCoverage as string
                                }
                            >
                                <Field name="protectionCoverage">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            field={field}
                                            size="sm"
                                            form={form}
                                            options={[
                                                {
                                                    label: 'كامل',
                                                    value: 'full',
                                                },
                                                { label: 'نص', value: 'half' },
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
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    'protectionCoverage',
                                                    option?.value || ''
                                                )
                                            }}
                                            placeholder="اختر نوع التغطية"
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </>
                    )}
                </>

                {/* حقول خاصة بخدمة العازل الحراري */}
                {values.serviceType === 'insulator' && (
                    <>
                        <FormItem
                            label="نوع العازل"
                            invalid={
                                !!errors.insulatorType &&
                                !!touched.insulatorType
                            }
                            errorMessage={errors.insulatorType as string}
                        >
                            <Field name="insulatorType">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
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
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                'insulatorType',
                                                option?.value || ''
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
                                !!errors.insulatorCoverage &&
                                !!touched.insulatorCoverage
                            }
                            errorMessage={errors.insulatorCoverage as string}
                        >
                            <Field name="insulatorCoverage">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
                                        size="sm"
                                        form={form}
                                        options={[
                                            { label: 'كامل', value: 'full' },
                                            { label: 'نص', value: 'half' },
                                            { label: 'قطعة', value: 'piece' },
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
                                                          field.value === 'full'
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
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                'insulatorCoverage',
                                                option?.value || ''
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
                {values.serviceType === 'polish' && (
                    <>
                        <FormItem
                            label="نوع التلميع"
                            invalid={
                                !!errors.polishType && !!touched.polishType
                            }
                            errorMessage={errors.polishType as string}
                        >
                            <Field name="polishType">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
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
                                            { label: 'كراسي', value: 'seats' },
                                            { label: 'قطعة', value: 'piece' },
                                            {
                                                label: 'تلميع مائي',
                                                value: 'water_polish',
                                            },
                                            {
                                                label: 'نانو سيراميك طبقة',
                                                value: 'nano_ceramic_1',
                                            },
                                            {
                                                label: 'نانو سيراميك طبقتين',
                                                value: 'nano_ceramic_2',
                                            },
                                            {
                                                label: 'نانو سيراميك ماستر',
                                                value: 'nano_ceramic_master',
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
                                                              : field.value ===
                                                                'water_polish'
                                                              ? 'تلميع مائي'
                                                              : field.value ===
                                                                'nano_ceramic_1'
                                                              ? 'نانو سيراميك طبقة'
                                                              : field.value ===
                                                                'nano_ceramic_2'
                                                              ? 'نانو سيراميك طبقتين'
                                                              : 'نانو سيراميك ماستر',
                                                      value: field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                'polishSubType',
                                                ''
                                            )
                                            form.setFieldValue(
                                                'polishType',
                                                option?.value || ''
                                            )
                                        }}
                                        placeholder="اختر نوع التلميع"
                                    />
                                )}
                            </Field>
                        </FormItem>

                        {/* حقول فرعية لأنواع التلميع */}
                        {(values.polishType === 'external' ||
                            values.polishType === 'internal' ||
                            values.polishType === 'seats') && (
                            <FormItem
                                label="تفاصيل إضافية"
                                invalid={
                                    !!errors.polishSubType &&
                                    !!touched.polishSubType
                                }
                                errorMessage={errors.polishSubType as string}
                            >
                                <Field name="polishSubType">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            field={field}
                                            size="sm"
                                            form={form}
                                            options={[
                                                {
                                                    label: 'عادي',
                                                    value: 'normal',
                                                },
                                                {
                                                    label: 'ممتاز',
                                                    value: 'premium',
                                                },
                                                {
                                                    label: 'فاخر',
                                                    value: 'luxury',
                                                },
                                            ]}
                                            value={
                                                field.value
                                                    ? {
                                                          label:
                                                              field.value ===
                                                              'normal'
                                                                  ? 'عادي'
                                                                  : field.value ===
                                                                    'premium'
                                                                  ? 'ممتاز'
                                                                  : 'فاخر',
                                                          value: field.value,
                                                      }
                                                    : null
                                            }
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    'polishSubType',
                                                    option?.value || ''
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
                {values.serviceType === 'additions' && (
                    <>
                        <FormItem
                            label="نوع الإضافة"
                            invalid={
                                !!errors.additionType && !!touched.additionType
                            }
                            errorMessage={errors.additionType as string}
                        >
                            <Field name="additionType">
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        field={field}
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
                                        onChange={(option) => {
                                            form.setFieldValue(
                                                'additionType',
                                                option?.value || ''
                                            )
                                        }}
                                        placeholder="اختر نوع الإضافة"
                                    />
                                )}
                            </Field>
                        </FormItem>

                        {/* حقول فرعية لأنواع الإضافات */}
                        {(values.additionType === 'detailed_wash' ||
                            values.additionType === 'premium_wash') && (
                            <FormItem
                                label="نطاق الغسيل"
                                invalid={
                                    !!errors.washScope && !!touched.washScope
                                }
                                errorMessage={errors.washScope as string}
                            >
                                <Field name="washScope">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            field={field}
                                            size="sm"
                                            form={form}
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
                                            onChange={(option) => {
                                                form.setFieldValue(
                                                    'washScope',
                                                    option?.value || ''
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
            </div>

            <h5 className="mt-8">اضافة الضمان</h5>
            <p className="mb-6">قسم لإعداد معلومات الضمان</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="مدة الضمان"
                    invalid={
                        !!errors.guarantee?.typeGuarantee &&
                        !!touched.guarantee?.typeGuarantee
                    }
                    errorMessage={errors.guarantee?.typeGuarantee}
                >
                    <Field name="guarantee.typeGuarantee">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={guaranteeOptions}
                                value={guaranteeOptions.find(
                                    (option) =>
                                        option.value ===
                                        values.guarantee.typeGuarantee
                                )}
                                onChange={(option) => {
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
                        !!errors.guarantee?.startDate &&
                        !!touched.guarantee?.startDate
                    }
                    errorMessage={errors.guarantee?.startDate}
                >
                    <Field
                        name="guarantee.startDate"
                        type="date"
                        size="sm"
                        component={Input}
                        placeholder="تاريخ البدء"
                    />
                </FormItem>

                <FormItem
                    label="تاريخ الانتهاء"
                    invalid={
                        !!errors.guarantee?.endDate &&
                        !!touched.guarantee?.endDate
                    }
                    errorMessage={errors.guarantee?.endDate}
                >
                    <Field
                        name="guarantee.endDate"
                        size="sm"
                        type="date"
                        component={Input}
                        placeholder="تاريخ الانتهاء"
                    />
                </FormItem>

                <FormItem
                    label="الشروط"
                    invalid={
                        !!errors.guarantee?.terms && !!touched.guarantee?.terms
                    }
                    errorMessage={errors.guarantee?.terms}
                >
                    <Field
                        name="guarantee.terms"
                        type="text"
                        size="sm"
                        placeholder="شروط الضمان"
                        component={Input}
                    />
                </FormItem>
                <FormItem
                    label="ملاحظات عل الضمان"
                    invalid={
                        !!errors.guarantee?.Notes && !!touched.guarantee?.Notes
                    }
                    errorMessage={errors.guarantee?.Notes as string}
                >
                    <Field
                        name="guarantee.Notes"
                        type="text"
                        size="sm"
                        placeholder="اضف ملاحظات عل الضمان"
                        component={Input}
                    />
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default ClientFields
