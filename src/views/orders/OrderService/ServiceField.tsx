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

    const getServices = async () => {
        setLoadingOrders(true)
        try {
            const res = await apiGetClientOrders(clientId)

            const allOrders = res.data.data.orders.map((service: any) => ({
                label: service.carType,
                value: service.carType,
            }))
            setOrders(allOrders)
        } catch (error) {
            setOrders([]) // empty on error
        }
        setLoadingOrders(false)
    }

    useEffect(() => {
        getServices()
    }, [])

    const addServiceWithGuarantee = () => {
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
                invalid={!!errors.orders && !!touched.orders}
                errorMessage={errors.orders}
            >
                <Field name="orders">
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
                            value={orders.filter(
                                (order) => order.value === values.order
                            )}
                            onChange={(option) => {
                                form.setFieldValue(field.name, option?.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

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
                                !!errors.services?.[index]?.serviceType &&
                                !!touched.services?.[index]?.serviceType
                            }
                            errorMessage={
                                errors.services?.[index]?.serviceType as string
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
                                        !!errors.services?.[index]
                                            ?.protectionFinish &&
                                        !!touched.services?.[index]
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
                                            !!errors.services?.[index]
                                                ?.protectionSize &&
                                            !!touched.services?.[index]
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
                                        !!errors.services?.[index]
                                            ?.protectionCoverage &&
                                        !!touched.services?.[index]
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
                                        !!errors.services?.[index]
                                            ?.insulatorType &&
                                        !!touched.services?.[index]
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
                                        !!errors.services?.[index]
                                            ?.insulatorCoverage &&
                                        !!touched.services?.[index]
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
                                        !!errors.services?.[index]
                                            ?.polishType &&
                                        !!touched.services?.[index]?.polishType
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

                                {/* يظهر فقط عند اختيار خارجي */}
                                {service.polishType === 'external' && (
                                    <FormItem
                                        label="مستوى التلميع"
                                        invalid={
                                            !!errors.services?.[index]
                                                ?.polishSubType &&
                                            !!touched.services?.[index]
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
                                        !!errors.services?.[index]
                                            ?.additionType &&
                                        !!touched.services?.[index]
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
                                            !!errors.services?.[index]
                                                ?.washScope &&
                                            !!touched.services?.[index]
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
                                !!errors.services?.[index]?.dealDetails &&
                                !!touched.services?.[index]?.dealDetails
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
                            />
                        </FormItem>

                        <FormItem
                            label="سعر الخدمة"
                            invalid={
                                !!errors.services?.[index]?.servicePrice &&
                                !!touched.services?.[index]?.servicePrice
                            }
                            errorMessage={
                                errors.services?.[index]?.servicePrice as string
                            }
                        >
                            <Field
                                name={`services[${index}].servicePrice`}
                                type="number"
                                size="sm"
                                placeholder="أدخل سعر الخدمة"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem
                            label="تاريخ الخدمة"
                            invalid={
                                !!errors.services?.[index]?.serviceDate &&
                                !!touched.services?.[index]?.serviceDate
                            }
                            errorMessage={
                                errors.services?.[index]?.serviceDate as string
                            }
                        >
                            <Field
                                name={`services[${index}].serviceDate`}
                                type="date"
                                size="sm"
                                component={Input}
                                placeholder="تاريخ الخدمة"
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
                                        !!errors.services?.[index]?.guarantee
                                            ?.typeGuarantee &&
                                        !!touched.services?.[index]?.guarantee
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
                                        !!errors.services?.[index]?.guarantee
                                            ?.startDate &&
                                        !!touched.services?.[index]?.guarantee
                                            ?.startDate
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
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
                                        !!errors.services?.[index]?.guarantee
                                            ?.endDate &&
                                        !!touched.services?.[index]?.guarantee
                                            ?.endDate
                                    }
                                    errorMessage={
                                        errors.services?.[index]?.guarantee
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
