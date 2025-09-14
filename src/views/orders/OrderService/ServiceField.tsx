import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FieldProps,
    FormikProps,
} from 'formik'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi'
import { getClientOrders } from '../orderList/store'
import { useAppDispatch, useAppSelector } from '@/store'
import { apiGetClientOrders } from '@/services/ClientsService'
import { useParams } from 'react-router-dom'

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
    guarantee?: {
        id: string
        typeGuarantee: string
        startDate: string
        endDate: string
        terms: string
        Notes: string
    }
}

type FormFieldsName = {
    services: Service[]
    orderId: string
}

type OrderServiceFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
    form: FormikProps<any>
}

const OrderServiceFields = (props: OrderServiceFieldsProps) => {
    const { values, touched, errors, form } = props
    const [serviceCounter, setServiceCounter] = useState(1)
    const [orders, setOrders] = useState<{ label: string; value: string }[]>([])
    const [loadingOrders, setLoadingOrders] = useState<boolean>(false)
    const { clientId } = useParams<{ clientId: string }>()
    const [clientExists, setClientExists] = useState<boolean>(true)
    const [hasSearched, setHasSearched] = useState<boolean>(false)
    const [orderTouched, setOrderTouched] = useState<boolean>(false)
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false)

    // دالة معالجة تغيير حقول الخدمة
    const handleServiceFieldChange = (fieldName: string, value: any, form: FormikProps<any>) => {
        form.setFieldValue(fieldName, value)
    }

    const shouldShowError = (fieldName: string) => {
        if (fieldName === 'orderId') {
            return (
                (form.submitCount > 0 || orderTouched) &&
                clientExists &&
                hasSearched &&
                !values.orderId
            )
        }

        if (fieldName.includes('services') && searchTriggered) {
            return false
        }

        return form.submitCount > 0 || !!touched[fieldName]
    }

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

    const getServices = async () => {
        if (!clientId) return
        
        setLoadingOrders(true)
        try {
            const res = await apiGetClientOrders(clientId)

            const allOrders = res.data.data.orders.map((order: any) => ({
                label: `${order.carManufacturer} - ${order.carModel}`,
                value: order._id,
                orderData: order,
            }))

            setOrders(allOrders)
        } catch (error) {
            console.error("Error fetching orders:", error)
            setOrders([])
        }
        setLoadingOrders(false)
    }

    useEffect(() => {
        getServices()
    }, [clientId])

    const addServiceWithGuarantee = () => {
        const newIndex = (values.services?.length ?? 0)
        const newServiceId = `service-${Date.now()}-${newIndex}`
        const newGuaranteeId = `guarantee-${Date.now()}-${newIndex}`

        const newService = {
            id: newServiceId,
            serviceType: '',
            dealDetails: '',
            guarantee: {
                id: newGuaranteeId,
                typeGuarantee: '',
                startDate: '',
                endDate: '',
                terms: '',
                Notes: '',
            },
        }

        const nextServices = [...(values.services || []), newService]
        form.setFieldValue('services', nextServices)
        setServiceCounter((prev) => prev + 1)
    }

    const removeService = (index: number) => {
        if (values.services.length <= 1) {
            return
        }
        const services = [...values.services]
        services.splice(index, 1)
        form.setFieldValue('services', services)
    }

    return (
        <AdaptableCard divider className="mb-4">
            <h5 className="text-lg font-semibold">الخدمات والضمانات</h5>
            <p className="mb-6 text-sm text-gray-500">
                قسم لإعداد الخدمات والضمانات المقدمة للعميل
            </p>

            <FormItem
                label="المبيعات السابقة"
                invalid={!!errors.orderId && !!touched.orderId}
                errorMessage={errors.orderId as string}
            >
                <Field name="orderId">
                    {({ field, form }: FieldProps) => (
                        <Select
                            field={field}
                            form={form}
                            placeholder="اختر السيارة المراد اضافة الخدمة الجديدة لها"
                            options={
                                loadingOrders
                                    ? [
                                          {
                                              label: 'جاري التحميل...',
                                              value: '',
                                          },
                                      ]
                                    : orders.length > 0
                                    ? orders
                                    : [
                                          {
                                              label: 'لا توجد طلبات متاحة',
                                              value: '',
                                          },
                                      ]
                            }
                            value={orders.find(
                                (order) => order.value === field.value
                            )}
                            onChange={(option) => {
                                form.setFieldValue(
                                    field.name,
                                    option?.value || ''
                                )
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            {/* حقول الخدمات والضمانات */}
            {values.services?.map((service, index) => (
                <div key={service.id} className="mt-6 border-t pt-6">
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
                                onClick={() => removeService(index)}
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
                                shouldShowError(
                                    `services[${index}].serviceType`
                                ) && !!errors.services?.[index]?.serviceType
                            }
                            errorMessage={
                                shouldShowError(
                                    `services[${index}].serviceType`
                                )
                                    ? (errors.services?.[index]
                                          ?.serviceType as string)
                                    : ''
                            }
                        >
                            <Field name={`services[${index}].serviceType`}>
                                {({ field, form }: FieldProps) => (
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
                                        onChange={(option) => {
                                            // تنظيف الحقول القديمة عند تغيير نوع الخدمة
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
                                            
                                            // التحكم في الضمان حسب نوع الخدمة
                                            if (option?.value === 'polish') {
                                                form.setFieldValue(
                                                    `services[${index}].guarantee`,
                                                    undefined
                                                )
                                            } else {
                                                const hasGuarantee = (form.values as any).services?.[index]?.guarantee
                                                if (!hasGuarantee) {
                                                    form.setFieldValue(
                                                        `services[${index}].guarantee`,
                                                        {
                                                            id: `guarantee-${index}`,
                                                            typeGuarantee: '',
                                                            startDate: '',
                                                            endDate: '',
                                                            terms: '',
                                                            Notes: '',
                                                        }
                                                    )
                                                }
                                            }
                                            
                                            // تحديث قيمة نوع الخدمة
                                            form.setFieldValue(
                                                field.name,
                                                option?.value || ''
                                            )
                                        }}
                                        placeholder="اختر نوع الخدمة"
                                    />
                                )}
                            </Field>
                        </FormItem>

                        {/* حقول خاصة بخدمة الحماية */}
                        {service.serviceType === 'protection' && (
                            <>
                                <FormItem
                                    label="اللمعان"
                                    invalid={
                                        shouldShowError(
                                            `services[${index}].protectionFinish`
                                        ) &&
                                        !!errors.services?.[index]
                                            ?.protectionFinish
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.protectionFinish as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].protectionFinish`}
                                    >
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
                                                        `services[${index}].protectionSize`,
                                                        ''
                                                    )
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value || ''
                                                    )
                                                }}
                                                placeholder="اختر درجة اللمعان"
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* حقل الحجم - يظهر فقط للأفلام اللامعة */}
                                {service.protectionFinish === 'glossy' && (
                                    <FormItem
                                        label="الحجم"
                                        invalid={
                                            shouldShowError(
                                                `services[${index}].protectionSize`
                                            ) &&
                                            !!errors.services?.[index]
                                                ?.protectionSize
                                        }
                                        errorMessage={
                                            errors.services?.[index]
                                                ?.protectionSize as string
                                        }
                                    >
                                        <Field
                                            name={`services[${index}].protectionSize`}
                                        >
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
                                                    onChange={(option) => {
                                                        form.setFieldValue(
                                                            field.name,
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
                                        shouldShowError(
                                            `services[${index}].protectionCoverage`
                                        ) &&
                                        !!errors.services?.[index]
                                            ?.protectionCoverage
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.protectionCoverage as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].protectionCoverage`}
                                    >
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
                                                        label: 'اخرى',
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
                                                                      : 'اخرى',
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
                                                placeholder="اختر نوع التغطية"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </>
                        )}

                        {/* حقول خاصة بخدمة العازل الحراري */}
                        {service.serviceType === 'insulator' && (
                            <>
                                <FormItem
                                    label="نوع العازل"
                                    invalid={
                                        shouldShowError(
                                            `services[${index}].insulatorType`
                                        ) &&
                                        !!errors.services?.[index]
                                            ?.insulatorType
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.insulatorType as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].insulatorType`}
                                    >
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
                                                        field.name,
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
                                        shouldShowError(
                                            `services[${index}].insulatorCoverage`
                                        ) &&
                                        !!errors.services?.[index]
                                            ?.insulatorCoverage
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.insulatorCoverage as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].insulatorCoverage`}
                                    >
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
                                                onChange={(option) => {
                                                    form.setFieldValue(
                                                        field.name,
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
                        {service.serviceType === 'polish' && (
                            <>
                                <FormItem
                                    label="نوع التلميع"
                                    invalid={
                                        shouldShowError(
                                            `services[${index}].polishType`
                                        ) &&
                                        !!errors.services?.[index]?.polishType
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.polishType as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].polishType`}
                                    >
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
                                                    {
                                                        label: 'داخلي وخارجي',
                                                        value: 'internalAndExternal',
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
                                                                        'internalAndExternal'
                                                                      ? 'داخلي وخارجي'
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
                                                onChange={(option) => {
                                                    form.setFieldValue(
                                                        `services[${index}].polishSubType`,
                                                        ''
                                                    )
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value || ''
                                                    )
                                                }}
                                                placeholder="اختر نوع التلميع"
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* يظهر فقط عند اختيار خارجي أو داخلي وخارجي */}
                                {(service.polishType === 'external' || service.polishType === 'internalAndExternal') && (
                                    <FormItem
                                        label="مستوى التلميع"
                                        invalid={
                                            shouldShowError(
                                                `services[${index}].polishSubType`
                                            ) &&
                                            !!errors.services?.[index]
                                                ?.polishSubType
                                        }
                                        errorMessage={
                                            errors.services?.[index]
                                                ?.polishSubType as string
                                        }
                                    >
                                        <Field
                                            name={`services[${index}].polishSubType`}
                                        >
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    field={field}
                                                    size="sm"
                                                    form={form}
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
                                                    onChange={(option) => {
                                                        form.setFieldValue(
                                                            field.name,
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
                        {service.serviceType === 'additions' && (
                            <>
                                <FormItem
                                    label="نوع الإضافة"
                                    invalid={
                                        shouldShowError(
                                            `services[${index}].additionType`
                                        ) &&
                                        !!errors.services?.[index]
                                            ?.additionType
                                    }
                                    errorMessage={
                                        errors.services?.[index]
                                            ?.additionType as string
                                    }
                                >
                                    <Field
                                        name={`services[${index}].additionType`}
                                    >
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
                                                        field.name,
                                                        option?.value || ''
                                                    )
                                                }}
                                                placeholder="اختر نوع الإضافة"
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* حقول فرعية لأنواع الإضافات */}
                                {(service.additionType === 'detailed_wash' ||
                                    service.additionType ===
                                        'premium_wash') && (
                                    <FormItem
                                        label="نطاق الغسيل"
                                        invalid={
                                            shouldShowError(
                                                `services[${index}].washScope`
                                            ) &&
                                            !!errors.services?.[index]
                                                ?.washScope
                                        }
                                        errorMessage={
                                            errors.services?.[index]
                                                ?.washScope as string
                                        }
                                    >
                                        <Field
                                            name={`services[${index}].washScope`}
                                        >
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
                                                            field.name,
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

                        <FormItem
                            label="تفاصيل الاتفاق"
                            invalid={
                                shouldShowError(
                                    `services[${index}].dealDetails`
                                ) &&
                                !!errors.services?.[index]?.dealDetails
                            }
                            errorMessage={
                                errors.services?.[index]?.dealDetails as string
                            }
                        >
                            <Field
                                name={`services[${index}].dealDetails`}
                                type="text"
                                size="sm"
                                placeholder="أدخل تفاصيل الاتفاق"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    form.setFieldValue(`services[${index}].dealDetails`, e.target.value)
                                    setSearchTriggered(false)
                                }}
                            />
                        </FormItem>
                             <FormItem
                                label="سعر الخدمة"
                                invalid={
                                    !!(errors.services as any)?.[index]
                                        ?.servicePrice &&
                                    !!(touched.services as any)?.[index]
                                        ?.servicePrice
                                }
                                errorMessage={
                                    (errors.services as any)?.[index]
                                        ?.servicePrice
                                }
                            >
                                <div className="flex flex-col gap-2">
                                    <Field
                                        name={`services[${index}].servicePrice`}
                                    >
                                        {({ field, form }: FieldProps) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                size="sm"
                                                placeholder="أدخل سعر الخدمة"
                                                min={50}
                                                onChange={(e: any) => {
                                                    const raw: string =
                                                        e.target.value
                                                    if (raw === '') {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            undefined
                                                        )
                                                        return
                                                    }
                                                    const stripped =
                                                        raw.replace(
                                                            /^0+(?=\d)/,
                                                            ''
                                                        )
                                                    const value =
                                                        Number.parseFloat(
                                                            stripped
                                                        )
                                                    if (Number.isNaN(value)) {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            undefined
                                                        )
                                                    } else {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            value
                                                        )
                                                    }
                                                }}
                                                onBlur={(e: any) => {
                                                    const raw: string =
                                                        e.target.value
                                                    if (raw === '') {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            undefined
                                                        )
                                                        return
                                                    }
                                                    const value =
                                                        Number.parseFloat(raw)
                                                    if (Number.isNaN(value)) {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            undefined
                                                        )
                                                    } else {
                                                        form.setFieldValue(
                                                            `services[${index}].servicePrice`,
                                                            value
                                                        )
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>
                                    {typeof values.services[index]
                                        .servicePrice === 'number' &&
                                        values.services[index].servicePrice >=
                                            50 && (
                                            <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-md">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        السعر الأساسي:
                                                    </span>
                                                    <span className="text-sm font-semibold">
                                                        {
                                                            values.services[
                                                                index
                                                            ].servicePrice
                                                        }{' '}
                                                        ريال
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        الضريبة (5%):
                                                    </span>
                                                    <span className="text-sm font-semibold">
                                                        {(
                                                            values.services[
                                                                index
                                                            ].servicePrice *
                                                            0.05
                                                        ).toFixed(2)}{' '}
                                                        ريال
                                                    </span>
                                                </div>
                                                <div className="flex justify-between border-t pt-1 mt-1">
                                                    <span className="text-sm font-medium text-gray-800">
                                                        الإجمالي شامل الضريبة:
                                                    </span>
                                                    <span className="text-sm font-bold text-blue-600">
                                                        {(
                                                            values.services[
                                                                index
                                                            ].servicePrice *
                                                            1.05
                                                        ).toFixed(2)}{' '}
                                                        ريال
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    {typeof values.services[index]
                                        .servicePrice === 'number' &&
                                        values.services[index].servicePrice >
                                            0 &&
                                        values.services[index].servicePrice <
                                            50 && (
                                            <div className="mt-1 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
                                                الحد الأدنى لسعر الخدمة هو 50
                                                ريال بقرار من الإدارة
                                            </div>
                                        )}
                                </div>
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
                                        shouldShowError(
                                            `services[${index}].guarantee.typeGuarantee`
                                        ) &&
                                        !!errors.services?.[index]?.guarantee
                                            ?.typeGuarantee
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
                                            ?.typeGuarantee
                                    }
                                >
                                    <Field
                                        name={`services[${index}].guarantee.typeGuarantee`}
                                    >
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                field={field}
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
                                                onChange={(option) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value || ''
                                                    )
                                                    
                                                    // إذا كان هناك تاريخ بدء، نقوم بحساب تاريخ الانتهاء تلقائياً
                                                    const startDate = form.values.services[index].guarantee.startDate
                                                    if (startDate && option?.value) {
                                                        const endDate = calculateEndDate(startDate, option.value.split(' ')[0])
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
                                        shouldShowError(
                                            `services[${index}].guarantee.startDate`
                                        ) &&
                                        !!errors.services?.[index]?.guarantee
                                            ?.startDate
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
                                            ?.startDate
                                    }
                                >
                                    <Field
                                        name={`services[${index}].guarantee.startDate`}
                                    >
                                        {({ field, form }: FieldProps) => (
                                            <div>
                                                <Input
                                                    type="date"
                                                    size="sm"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setSearchTriggered(false)

                                                        // حساب تاريخ الانتهاء تلقائياً
                                                        const guaranteePeriod =
                                                            form.values
                                                                .services[index]
                                                                .guarantee
                                                                .typeGuarantee
                                                        if (
                                                            e.target.value &&
                                                            guaranteePeriod
                                                        ) {
                                                            const endDate =
                                                                calculateEndDate(
                                                                    e.target
                                                                        .value,
                                                                    guaranteePeriod.split(' ')[0]
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
                                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md mt-2">
                                                        <span className="text-base font-medium text-blue-700">
                                                            التاريخ الهجري:
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
                                                    values.services[index]
                                                        .guarantee?.endDate ||
                                                    ''
                                                }
                                                readOnly
                                                className="bg-gray-50"
                                            />
                                        </div>
                                        {values.services[index].guarantee
                                            ?.endDate && (
                                            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                                                <span className="text-base font-medium text-blue-700">
                                                    التاريخ الهجري:
                                                </span>
                                                <span className="text-base font-semibold text-blue-800">
                                                    {toHijriDate(
                                                        values.services[index]
                                                            .guarantee.endDate
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </FormItem>

                                <FormItem
                                    label="الشروط"
                                    invalid={
                                        !!errors.services?.[index]?.guarantee
                                            ?.terms &&
                                        !!touched.services?.[index]?.guarantee
                                            ?.terms
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
                                            ?.terms
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
                                        !!errors.services?.[index]?.guarantee
                                            ?.Notes &&
                                        !!touched.services?.[index]?.guarantee
                                            ?.Notes
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
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
                    onClick={addServiceWithGuarantee}
                    icon={<HiPlus />}
                >
                    إضافة خدمة وضمان جديد
                </Button>
            </div>
        </AdaptableCard>
    )
}

export default OrderServiceFields