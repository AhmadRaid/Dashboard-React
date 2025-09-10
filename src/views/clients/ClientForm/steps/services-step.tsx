"use client"

import { useState, useEffect } from "react"
import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { Select, Button } from "@/components/ui"
import { HiPlus, HiTrash } from "react-icons/hi"
import { apiGetAllServices } from "@/services/ClientsService"
import { serviceTypeOptions } from "../service-type-options"

type Service = {
  id: string
  serviceType: string
  dealDetails: string
  protectionType?: string
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
  guarantee?: {
    id: string
    typeGuarantee: string
    startDate: string
    endDate: string
    terms: string
    Notes: string
  }
}

type ServicesStepProps = {
  touched: FormikTouched<{ services: Service[] }>
  errors: FormikErrors<{ services: Service[] }>
  values: { services: Service[] }
  setFieldValue: (field: string, value: any) => void
}

const calculateEndDate = (startDate: string, guaranteePeriod: string): string => {
  if (!startDate || !guaranteePeriod) return ""

  const date = new Date(startDate)
  const years = Number.parseInt(guaranteePeriod)

  if (isNaN(years)) return ""

  date.setFullYear(date.getFullYear() + years)
  date.setDate(date.getDate() - 1)

  return date.toISOString().split("T")[0]
}

const toHijriDate = (gregorianDate: string): string => {
  if (!gregorianDate) return ""
  const date = new Date(gregorianDate)
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
  return hijri
}

const ServicesStep = ({ touched, errors, values, setFieldValue }: ServicesStepProps) => {
  const [services, setServices] = useState<{ label: string; value: string }[]>(serviceTypeOptions)
  const [loadingServices, setLoadingServices] = useState<boolean>(false)
  const [serviceCounter, setServiceCounter] = useState(1)

  const getServices = async () => {
    // Using static options shared with ClientForm2
    setServices(serviceTypeOptions)
    setLoadingServices(false)
  }

  useEffect(() => {
    getServices()
  }, [])

  const addService = () => {
    const newService: Service = {
      id: `service-${serviceCounter}`,
      serviceType: "",
      dealDetails: "",
      guarantee: {
        id: `guarantee-${serviceCounter}`,
        typeGuarantee: "",
        startDate: "",
        endDate: "",
        terms: "",
        Notes: "",
      },
    }

    setFieldValue("services", [...values.services, newService])
    setServiceCounter(serviceCounter + 1)
  }

  const removeService = (index: number) => {
    if (values.services.length <= 1) {
      return // Don't allow removing the last service
    }
    const updatedServices = values.services.filter((_, i) => i !== index)
    setFieldValue("services", updatedServices)
  }

  return (
    <AdaptableCard divider className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="text-lg font-semibold">الخدمات والضمانات</h5>
          <p className="text-sm text-gray-500">قسم لإعداد الخدمات والضمانات المقدمة للعميل</p>
        </div>
        <Button type="button" size="sm" variant="solid" icon={<HiPlus />} onClick={addService}>
          إضافة خدمة
        </Button>
      </div>

      <div className="space-y-6">
        {values.services.map((service, index) => (
          <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h6 className="text-md font-medium">الخدمة {index + 1}</h6>
              {values.services.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="plain"
                  icon={<HiTrash />}
                  onClick={() => removeService(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  حذف
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem
                label="نوع الخدمة"
                invalid={
                  !!(errors.services as any)?.[index]?.serviceType && !!(touched.services as any)?.[index]?.serviceType
                }
                errorMessage={(errors.services as any)?.[index]?.serviceType}
              >
                <Field name={`services[${index}].serviceType`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={services}
                      value={services.find((option) => option.value === field.value)}
                      onChange={(option) => {
                        form.setFieldValue(field.name, option?.value)
                      }}
                      placeholder="اختر نوع الخدمة"
                      isLoading={loadingServices}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                label="تفاصيل الصفقة"
                invalid={
                  !!(errors.services as any)?.[index]?.dealDetails && !!(touched.services as any)?.[index]?.dealDetails
                }
                errorMessage={(errors.services as any)?.[index]?.dealDetails}
              >
                <Field
                  name={`services[${index}].dealDetails`}
                  type="text"
                  size="sm"
                  placeholder="تفاصيل الصفقة"
                  component={Input}
                />
              </FormItem>

              {/* Protection specific fields */}
              {service.serviceType === "protection" && (
                <>
                  <FormItem
                    label="نوع الحماية"
                    invalid={
                      !!(errors.services as any)?.[index]?.protectionType &&
                      !!(touched.services as any)?.[index]?.protectionType
                    }
                    errorMessage={(errors.services as any)?.[index]?.protectionType}
                  >
                    <Field name={`services[${index}].protectionType`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "لامع", value: "glossy" },
                            { label: "مطفى", value: "matte" },
                            { label: "ملون", value: "colored" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "glossy"
                                      ? "لامع"
                                      : field.value === "matte"
                                        ? "مطفى"
                                        : "ملون",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(`services[${index}].protectionSize`, "")
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نوع الحماية"
                        />
                      )}
                    </Field>
                  </FormItem>

                  {service.protectionType === "colored" && (
                    <FormItem
                      label="لون الحماية"
                      invalid={
                        !!(errors.services as any)?.[index]?.protectionColor &&
                        !!(touched.services as any)?.[index]?.protectionColor
                      }
                      errorMessage={(errors.services as any)?.[index]?.protectionColor}
                    >
                      <Field
                        name={`services[${index}].protectionColor`}
                        type="text"
                        size="sm"
                        placeholder="أدخل لون الحماية"
                        component={Input}
                      />
                    </FormItem>
                  )}

                  <FormItem
                    label="الحجم"
                    invalid={
                      !!(errors.services as any)?.[index]?.protectionSize &&
                      !!(touched.services as any)?.[index]?.protectionSize
                    }
                    errorMessage={(errors.services as any)?.[index]?.protectionSize}
                  >
                    <Field name={`services[${index}].protectionSize`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "10 مل", value: "10" },
                            { label: "8 مل", value: "8" },
                            { label: "7.5 مل", value: "7.5" },
                            { label: "6.5 مل", value: "6.5" },
                          ]}
                          value={
                            field.value
                              ? { label: `${field.value} مل`, value: field.value }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر حجم الفيلم"
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="التغطية"
                    invalid={
                      !!(errors.services as any)?.[index]?.protectionCoverage &&
                      !!(touched.services as any)?.[index]?.protectionCoverage
                    }
                    errorMessage={(errors.services as any)?.[index]?.protectionCoverage}
                  >
                    <Field name={`services[${index}].protectionCoverage`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "كامل", value: "full" },
                            { label: "نص", value: "half" },
                            { label: "ربع", value: "quarter" },
                            { label: "أطراف", value: "edges" },
                            { label: "اخرى", value: "other" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "full"
                                      ? "كامل"
                                      : field.value === "half"
                                        ? "نص"
                                        : field.value === "quarter"
                                          ? "ربع"
                                          : field.value === "edges"
                                            ? "أطراف"
                                            : "اخرى",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نوع التغطية"
                        />
                      )}
                    </Field>
                  </FormItem>
                </>
              )}

              {/* Insulator specific fields */}
              {service.serviceType === "insulator" && (
                <>
                  <FormItem
                    label="نوع العازل"
                    invalid={
                      !!(errors.services as any)?.[index]?.insulatorType &&
                      !!(touched.services as any)?.[index]?.insulatorType
                    }
                    errorMessage={(errors.services as any)?.[index]?.insulatorType}
                  >
                    <Field name={`services[${index}].insulatorType`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "سيراميك", value: "ceramic" },
                            { label: "كاربون", value: "carbon" },
                            { label: "كرستال", value: "crystal" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "ceramic"
                                      ? "سيراميك"
                                      : field.value === "carbon"
                                        ? "كاربون"
                                        : "كرستال",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نوع العازل"
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="نطاق التغطية"
                    invalid={
                      !!(errors.services as any)?.[index]?.insulatorCoverage &&
                      !!(touched.services as any)?.[index]?.insulatorCoverage
                    }
                    errorMessage={(errors.services as any)?.[index]?.insulatorCoverage}
                  >
                    <Field name={`services[${index}].insulatorCoverage`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "كامل", value: "full" },
                            { label: "نص", value: "half" },
                            { label: "قطعة", value: "piece" },
                            { label: "درع حماية", value: "shield" },
                            { label: "خارجية", value: "external" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "full"
                                      ? "كامل"
                                      : field.value === "half"
                                        ? "نص"
                                        : field.value === "piece"
                                          ? "قطعة"
                                          : field.value === "shield"
                                            ? "درع حماية"
                                            : "خارجية",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نطاق التغطية"
                        />
                      )}
                    </Field>
                  </FormItem>
                </>
              )}

              {/* Polish specific fields */}
              {service.serviceType === "polish" && (
                <>
                  <FormItem
                    label="نوع التلميع"
                    invalid={
                      !!(errors.services as any)?.[index]?.polishType &&
                      !!(touched.services as any)?.[index]?.polishType
                    }
                    errorMessage={(errors.services as any)?.[index]?.polishType}
                  >
                    <Field name={`services[${index}].polishType`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "خارجي", value: "external" },
                            { label: "داخلي", value: "internal" },
                            { label: "داخلي وخارجي", value: "internalAndExternal" },
                            { label: "كراسي", value: "seats" },
                            { label: "قطعة", value: "piece" },
                            { label: "تلميع مائي", value: "water_polish" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "external"
                                      ? "خارجي"
                                      : field.value === "internal"
                                        ? "داخلي"
                                        : field.value === "internalAndExternal"
                                          ? "داخلي وخارجي"
                                          : field.value === "seats"
                                            ? "كراسي"
                                            : field.value === "piece"
                                              ? "قطعة"
                                              : "تلميع مائي",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(`services[${index}].polishSubType`, "")
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نوع التلميع"
                        />
                      )}
                    </Field>
                  </FormItem>

                  {(service.polishType === "external" || service.polishType === "internalAndExternal") && (
                    <FormItem
                      label="مستوى التلميع"
                      invalid={
                        !!(errors.services as any)?.[index]?.polishSubType &&
                        !!(touched.services as any)?.[index]?.polishSubType
                      }
                      errorMessage={(errors.services as any)?.[index]?.polishSubType}
                    >
                      <Field name={`services[${index}].polishSubType`}>
                        {({ field, form }: FieldProps) => (
                          <Select
                            field={field}
                            size="sm"
                            form={form}
                            options={[
                              { label: "مستوى 1", value: "1" },
                              { label: "مستوى 2", value: "2" },
                              { label: "مستوى 3", value: "3" },
                            ]}
                            value={
                              field.value ? { label: `مستوى ${field.value}`, value: field.value } : null
                            }
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value || "")
                            }}
                            placeholder="اختر مستوى التلميع"
                          />
                        )}
                      </Field>
                    </FormItem>
                  )}
                </>
              )}

              {/* Additions specific fields */}
              {service.serviceType === "additions" && (
                <>
                  <FormItem
                    label="نوع الإضافة"
                    invalid={
                      !!(errors.services as any)?.[index]?.additionType &&
                      !!(touched.services as any)?.[index]?.additionType
                    }
                    errorMessage={(errors.services as any)?.[index]?.additionType}
                  >
                    <Field name={`services[${index}].additionType`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "غسيل تفصيلي", value: "detailed_wash" },
                            { label: "غسيل تفصيلي خاص", value: "premium_wash" },
                            { label: "دواسات جلد", value: "leather_pedals" },
                            { label: "تكحيل", value: "blackout" },
                            { label: "نانو داخلي ديكور", value: "nano_interior_decor" },
                            { label: "نانو داخلي مقاعد", value: "nano_interior_seats" },
                          ]}
                          value={
                            field.value
                              ? {
                                  label:
                                    field.value === "detailed_wash"
                                      ? "غسيل تفصيلي"
                                      : field.value === "premium_wash"
                                        ? "غسيل تفصيلي خاص"
                                        : field.value === "leather_pedals"
                                          ? "دواسات جلد"
                                          : field.value === "blackout"
                                            ? "تكحيل"
                                            : field.value === "nano_interior_decor"
                                              ? "نانو داخلي ديكور"
                                              : "نانو داخلي مقاعد",
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value || "")
                          }}
                          placeholder="اختر نوع الإضافة"
                        />
                      )}
                    </Field>
                  </FormItem>

                  {(service.additionType === "detailed_wash" || service.additionType === "premium_wash") && (
                    <FormItem
                      label="نطاق الغسيل"
                      invalid={
                        !!(errors.services as any)?.[index]?.washScope &&
                        !!(touched.services as any)?.[index]?.washScope
                      }
                      errorMessage={(errors.services as any)?.[index]?.washScope}
                    >
                      <Field name={`services[${index}].washScope`}>
                        {({ field, form }: FieldProps) => (
                          <Select
                            field={field}
                            size="sm"
                            form={form}
                            options={[
                              { label: "كامل", value: "full" },
                              { label: "خارجي فقط", value: "external_only" },
                              { label: "داخلي فقط", value: "internal_only" },
                              { label: "محرك", value: "engine" },
                            ]}
                            value={
                              field.value
                                ? {
                                    label:
                                      field.value === "full"
                                        ? "كامل"
                                        : field.value === "external_only"
                                          ? "خارجي فقط"
                                          : field.value === "internal_only"
                                            ? "داخلي فقط"
                                            : "محرك",
                                    value: field.value,
                                  }
                                : null
                            }
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value || "")
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
                label="سعر الخدمة"
                invalid={
                  !!(errors.services as any)?.[index]?.servicePrice &&
                  !!(touched.services as any)?.[index]?.servicePrice
                }
                errorMessage={(errors.services as any)?.[index]?.servicePrice}
              >
                <div className="flex flex-col gap-2">
                  <Field name={`services[${index}].servicePrice`}>
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field}
                        type="number"
                        size="sm"
                        placeholder="أدخل سعر الخدمة"
                        min={50}
                        onChange={(e: any) => {
                          const raw: string = e.target.value
                          if (raw === "") {
                            form.setFieldValue(`services[${index}].servicePrice`, undefined)
                            return
                          }
                          const stripped = raw.replace(/^0+(?=\d)/, "")
                          const value = Number.parseFloat(stripped)
                          if (Number.isNaN(value)) {
                            form.setFieldValue(`services[${index}].servicePrice`, undefined)
                          } else {
                            form.setFieldValue(`services[${index}].servicePrice`, value)
                          }
                        }}
                        onBlur={(e: any) => {
                          const raw: string = e.target.value
                          if (raw === "") {
                            form.setFieldValue(`services[${index}].servicePrice`, undefined)
                            return
                          }
                          const value = Number.parseFloat(raw)
                          if (Number.isNaN(value)) {
                            form.setFieldValue(`services[${index}].servicePrice`, undefined)
                          } else {
                            form.setFieldValue(`services[${index}].servicePrice`, value)
                          }
                        }}
                      />
                    )}
                  </Field>
                  {typeof values.services[index].servicePrice === "number" &&
                    values.services[index].servicePrice >= 50 && (
                    <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">السعر الأساسي:</span>
                        <span className="text-sm font-semibold">
                          {values.services[index].servicePrice} ريال
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">الضريبة (5%):</span>
                        <span className="text-sm font-semibold">
                          {(values.services[index].servicePrice * 0.05).toFixed(2)} ريال
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="text-sm font-medium text-gray-800">الإجمالي شامل الضريبة:</span>
                        <span className="text-sm font-bold text-blue-600">
                          {(values.services[index].servicePrice * 1.05).toFixed(2)} ريال
                        </span>
                      </div>
                    </div>
                  )}
                  {typeof values.services[index].servicePrice === "number" &&
                    values.services[index].servicePrice > 0 &&
                    values.services[index].servicePrice < 50 && (
                      <div className="mt-1 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-red-700 text-sm">
                        الحد الأدنى لسعر الخدمة هو 50 ريال بقرار من الإدارة
                      </div>
                    )}
                </div>
              </FormItem>

            </div>

            {/* Guarantee Section (hidden for polish) */}
            {service.serviceType !== "polish" && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h6 className="text-sm font-medium mb-3">معلومات الضمان</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem
                    label="مدة الضمان"
                    invalid={
                      !!(errors.services as any)?.[index]?.guarantee?.typeGuarantee &&
                      !!(touched.services as any)?.[index]?.guarantee?.typeGuarantee
                    }
                    errorMessage={(errors.services as any)?.[index]?.guarantee?.typeGuarantee}
                  >
                    <Field name={`services[${index}].guarantee.typeGuarantee`}>
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          size="sm"
                          form={form}
                          options={[
                            { label: "2 سنوات", value: "2 سنوات" },
                            { label: "3 سنوات", value: "3 سنوات" },
                            { label: "5 سنوات", value: "5 سنوات" },
                            { label: "8 سنوات", value: "8 سنوات" },
                            { label: "10 سنوات", value: "10 سنوات" },
                          ]}
                          value={
                            field.value ? { label: `${field.value}`, value: field.value } : null
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option?.value)
                            const startDate = (form.values as any).services[index]?.guarantee?.startDate
                            if (startDate && option?.value) {
                              const period = String(option.value).split(" ")[0]
                              const endDate = calculateEndDate(startDate, period)
                              form.setFieldValue(`services[${index}].guarantee.endDate`, endDate)
                            }
                          }}
                          placeholder="اختر مدة الضمان"
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="تاريخ بداية الضمان"
                    invalid={
                      !!(errors.services as any)?.[index]?.guarantee?.startDate &&
                      !!(touched.services as any)?.[index]?.guarantee?.startDate
                    }
                    errorMessage={(errors.services as any)?.[index]?.guarantee?.startDate}
                  >
                    <Field name={`services[${index}].guarantee.startDate`}>
                      {({ field, form }: FieldProps) => (
                        <div>
                          <Input
                            type="date"
                            size="sm"
                            {...field}
                            onChange={(e: any) => {
                              field.onChange(e)
                              const guaranteePeriod = (form.values as any).services[index]?.guarantee?.typeGuarantee
                              if (e.target.value && guaranteePeriod) {
                                const period = String(guaranteePeriod).split(" ")[0]
                                const endDate = calculateEndDate(e.target.value, period)
                                form.setFieldValue(`services[${index}].guarantee.endDate`, endDate)
                              }
                            }}
                            placeholder="تاريخ البدء"
                          />
                          {field.value && (
                            <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md mt-2">
                              <span className="text-base font-medium text-blue-700">التاريخ الهجري:</span>
                              <span className="text-base font-semibold text-blue-800">{toHijriDate(field.value)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </FormItem>

                  <FormItem label="تاريخ انتهاء الضمان">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          size="sm"
                          value={(values as any).services[index]?.guarantee?.endDate || ""}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                      {(values as any).services[index]?.guarantee?.endDate && (
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                          <span className="text-base font-medium text-blue-700">التاريخ الهجري:</span>
                          <span className="text-base font-semibold text-blue-800">{toHijriDate((values as any).services[index].guarantee.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </FormItem>            

                  <FormItem
                    label="شروط الضمان"
                    invalid={
                      !!(errors.services as any)?.[index]?.guarantee?.terms &&
                      !!(touched.services as any)?.[index]?.guarantee?.terms
                    }
                    errorMessage={(errors.services as any)?.[index]?.guarantee?.terms}
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
                    label="ملاحظات الضمان"
                    invalid={
                      !!(errors.services as any)?.[index]?.guarantee?.Notes &&
                      !!(touched.services as any)?.[index]?.guarantee?.Notes
                    }
                    errorMessage={(errors.services as any)?.[index]?.guarantee?.Notes}
                  >
                    <Field
                      name={`services[${index}].guarantee.Notes`}
                      as="textarea"
                      rows={3}
                      placeholder="ملاحظات إضافية حول الضمان"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </FormItem>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdaptableCard>
  )
}

export default ServicesStep
