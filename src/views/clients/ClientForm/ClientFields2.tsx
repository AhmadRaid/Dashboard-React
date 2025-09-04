"use client"

import AdaptableCard from "@/components/shared/AdaptableCard"
import { Input } from "@/components/ui/input"
import { FormItem } from "@/components/ui/form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { Select } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { apiGetAllServices } from "@/services/ClientsService"

type FormFieldsName = {
  firstName: string
  secondName: string
  thirdName: string
  lastName: string
  email: string
  phone: string
  clientType: string
  carModel: string
  carColor: string
  branch: string
  carPlateNumber: string
  carManufacturer: string
  carSize: string
  carType: string
  status: string
}

type ClientFieldsProps = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: any
}

const carSizeOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "X-Large", value: "X-large" },
  { label: "XX-Large", value: "XX-large" },
]

const branchOptions = [
  { label: "عملاء فرع ابحر", value: "عملاء فرع ابحر" },
  { label: "عملاء فرع المدينة", value: "عملاء فرع المدينة" },
  { label: "اخرى", value: "اخرى" },
]

const ClientFields = (props: ClientFieldsProps) => {
  const [services, setServices] = useState<{ label: string; value: string }[]>([])
  const [loadingServices, setLoadingServices] = useState<boolean>(false)

  const clientTypes = [
    { label: "فردي", value: "individual" },
    { label: "شركة", value: "company" },
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
      setServices([])
    }
    setLoadingServices(false)
  }

  useEffect(() => {
    getServices()
  }, [])

  const { values, touched, errors } = props

  return (
    <AdaptableCard divider className="mb-4">
      <h5 className="text-lg font-semibold">معلومات العميل</h5>
      <p className="mb-6 text-sm text-gray-500">قسم لإعداد معلومات العميل الأساسية</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                value={clientTypes.find((option) => option.value === values.clientType)}
                onChange={(option) => {
                  form.setFieldValue(field.name, option?.value)
                }}
                placeholder="نوع العميل"
              />
            )}
          </Field>
        </FormItem>

        <FormItem label="الفرع" invalid={!!errors.branch && !!touched.branch} errorMessage={errors.branch as string}>
          <Field name="branch">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                size="sm"
                form={form}
                options={branchOptions}
                value={branchOptions.find((option) => option.value === values.branch)}
                onChange={(option) => {
                  form.setFieldValue(field.name, option?.value)
                }}
                placeholder="اختر الفرع"
              />
            )}
          </Field>
        </FormItem>

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
          invalid={!!errors.secondName && !!touched.secondName}
          errorMessage={errors.secondName}
        >
          <Field
            name="secondName"
            size="sm"
            autoComplete="off"
            type="text"
            placeholder="الاسم الثاني"
            component={Input}
          />
        </FormItem>

        <FormItem
          label="الاسم الثالث"
          invalid={!!errors.thirdName && !!touched.thirdName}
          errorMessage={errors.thirdName}
        >
          <Field
            name="thirdName"
            size="sm"
            autoComplete="off"
            type="text"
            placeholder="الاسم الثالث"
            component={Input}
          />
        </FormItem>

        <FormItem label="اسم العائلة" invalid={!!errors.lastName && !!touched.lastName} errorMessage={errors.lastName}>
          <Field name="lastName" size="sm" autoComplete="off" type="text" placeholder="اسم العائلة" component={Input} />
        </FormItem>

        <FormItem label="البريد الإلكتروني" invalid={!!errors.email && !!touched.email} errorMessage={errors.email}>
          <Field name="email" size="sm" type="email" placeholder="البريد الإلكتروني" component={Input} />
        </FormItem>

        <FormItem label="رقم الهاتف" invalid={!!errors.phone && !!touched.phone} errorMessage={errors.phone}>
          <Field name="phone">
            {({ field, form }: FieldProps) => (
              <Input
                {...field}
                type="text"
                size="sm"
                placeholder="05xxxxxxxx"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "") // Remove non-digits
                  if (value.length > 0 && !value.startsWith("05")) {
                    value = "05" + value.substring(2)
                  }
                  if (value.length > 10) {
                    value = value.substring(0, 10)
                  }
                  form.setFieldValue(field.name, value)
                }}
              />
            )}
          </Field>
        </FormItem>
      </div>

      <h5 className="mt-8 text-lg font-semibold">معلومات السيارة</h5>
      <p className="mb-6 text-sm text-gray-500">قسم لإعداد معلومات السيارة</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem
          label="نوع السيارة"
          invalid={!!errors.carType && !!touched.carType}
          errorMessage={errors.carType as string}
        >
          <Field name="carType" type="text" size="sm" placeholder="نوع السيارة" component={Input} />
        </FormItem>

        <FormItem
          label="موديل السيارة"
          invalid={!!errors.carModel && !!touched.carModel}
          errorMessage={errors.carModel}
        >
          <Field name="carModel" type="text" size="sm" placeholder="موديل السيارة" component={Input} />
        </FormItem>

        <FormItem label="لون السيارة" invalid={!!errors.carColor && !!touched.carColor} errorMessage={errors.carColor}>
          <Field name="carColor" type="text" size="sm" placeholder="لون السيارة" component={Input} />
        </FormItem>

        <FormItem
          label="رقم لوحة السيارة"
          invalid={!!errors.carPlateNumber && !!touched.carPlateNumber}
          errorMessage={errors.carPlateNumber as string}
        >
          <Field name="carPlateNumber">
            {({ field, form }: FieldProps) => (
              <div className="flex gap-2">
                {[...Array(8)].map((_, i) => (
                  <Input
                    key={i}
                    type="text"
                    size="sm"
                    maxLength={1}
                    className="text-center w-10"
                    value={field.value?.[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase()
                      let newValue = field.value || ""

                      // إنشاء نسخة من القيمة الحالية مع حرف واحد محدث
                      newValue = newValue.padEnd(8, " ") // تأكد من طول 8 أحرف
                      newValue = newValue.substring(0, i) + value + newValue.substring(i + 1)

                      form.setFieldValue(field.name, newValue.trim())

                      if (value && i < 7) {
                        const nextInput = document.querySelector(
                          `input[name="${field.name}-${i + 1}"]`,
                        ) as HTMLInputElement
                        nextInput?.focus()
                      }
                    }}
                    name={`${field.name}-${i}`}
                  />
                ))}
              </div>
            )}
          </Field>
        </FormItem>

        <FormItem
          label="الشركة المصنعة"
          invalid={!!errors.carManufacturer && !!touched.carManufacturer}
          errorMessage={errors.carManufacturer}
        >
          <Field name="carManufacturer" type="text" size="sm" placeholder="ادخل الشركة المصنعة" component={Input} />
        </FormItem>

        <FormItem
          label="حجم السيارة"
          invalid={!!errors.carSize && !!touched.carSize}
          errorMessage={errors.carSize as string}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {carSizeOptions.map((option) => (
              <label
                key={option.value}
                className={`relative p-2 border rounded-md cursor-pointer transition-all text-sm
                                    ${
                                      values.carSize === option.value
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
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
                  <span className="block font-medium">{option.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {option.value === "small" && "السيارة صغيرة"}
                    {option.value === "medium" && "السيارة متوسطة الحجم"}
                    {option.value === "large" && "السيارة كبيرة"}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </FormItem>
        <FormItem
          label="حالة الطلب"
          invalid={!!errors.status && !!touched.status}
          errorMessage={errors.status as string}
        >
          <Field name="status">
            {({ field, form }: FieldProps) => (
              <Select
                field={field}
                size="sm"
                form={form}
                options={[
                  {
                    label: "طلب جديد",
                    value: "طلب جديد",
                  },
                  {
                    label: "قيد الصيانة",
                    value: "قيد الصيانة",
                  },
                ]}
                value={
                  field.value
                    ? {
                        label: field.value === "طلب جديد" ? "طلب جديد" : "قيد الصيانة",
                        value: field.value,
                      }
                    : null
                }
                onChange={(option) => {
                  form.setFieldValue(field.name, option?.value || "طلب جديد")
                }}
                placeholder="اختر حالة الطلب"
              />
            )}
          </Field>
        </FormItem>
      </div>
    </AdaptableCard>
  )
}

export default ClientFields
