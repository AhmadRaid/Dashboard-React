"use client"

import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { Select } from "@/components/ui"
import { useState } from "react"
import { HiPlus, HiMinus } from "react-icons/hi"

type FormFieldsName = {
  firstName: string
  secondName: string
  thirdName: string
  lastName: string
  email: string
  phone: string
  secondPhone: string
  clientType: string
  branch: string
}

type ClientInfoStepProps = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: any
  setFieldValue: (field: string, value: any) => void
}

const ClientInfoStep = ({ touched, errors, values, setFieldValue }: ClientInfoStepProps) => {
  const [showSecondPhone, setShowSecondPhone] = useState(false)
  const clientTypes = [
    { label: "فرد", value: "فرد" },
    { label: "شركة", value: "شركة" },
    { label: "مسوق بعمولة", value: "مسوق بعمولة" },
  ]

  const branchOptions = [
    { label: "عملاء فرع ابحر", value: "عملاء فرع ابحر" },
    { label: "عملاء فرع المدينة", value: "عملاء فرع المدينة" },
    { label: "اخرى", value: "اخرى" },
  ]

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
          label="الاسم الاب"
          invalid={!!errors.secondName && !!touched.secondName}
          errorMessage={errors.secondName}
        >
          <Field
            name="secondName"
            size="sm"
            autoComplete="off"
            type="text"
            placeholder="الاسم الاب"
            component={Input}
          />
        </FormItem>

        <FormItem
          label="الاسم الجد"
          invalid={!!errors.thirdName && !!touched.thirdName}
          errorMessage={errors.thirdName}
        >
          <Field
            name="thirdName"
            size="sm"
            autoComplete="off"
            type="text"
            placeholder="الاسم الجد"
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
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400 select-none pointer-events-none">+ </span>
                  <Input
                    {...field}
                    type="text"
                    size="sm"
                    className="pl-6 rtl:pl-0 rtl:pr-6"
                    placeholder="05xxxxxxxx"
                    onChange={(e) => {
                      // Keep only digits
                      let digits = e.target.value.replace(/\D/g, "")

                      // Build as '05' + rest, ensuring user's first typed digit isn't swallowed
                      const rest = digits.startsWith("05") ? digits.slice(2) : digits.replace(/^0?5?/, "")
                      let normalized = "05" + rest

                      // Cap to 10 digits total
                      normalized = normalized.slice(0, 10)

                      form.setFieldValue(field.name, normalized)
                    }}
                  />
                </div>
                {!showSecondPhone && (
                  <Button
                    type="button"
                    size="sm"
                    variant="solid"
                    icon={<HiPlus />}
                    onClick={() => setShowSecondPhone(true)}
                    className="h-9 w-9 p-0"
                    title="إضافة رقم هاتف ثاني"
                  />
                )}
              </div>
            )}
          </Field>
        </FormItem>

        {showSecondPhone && (
          <FormItem
            label="رقم الهاتف الثاني"
            invalid={!!errors.secondPhone && !!touched.secondPhone}
            errorMessage={errors.secondPhone as string}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Field name="secondPhone">
                  {({ field, form }: FieldProps) => (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 rtl:left-auto rtl:right-3 flex items-center text-gray-400 select-none pointer-events-none">+ </span>
                      <Input
                        {...field}
                        type="text"
                        size="sm"
                        className="pl-6 rtl:pl-0 rtl:pr-6"
                        placeholder="05xxxxxxxx"
                        onChange={(e) => {
                          let digits = e.target.value.replace(/\D/g, "")
                          const rest = digits.startsWith("05") ? digits.slice(2) : digits.replace(/^0?5?/, "")
                          let normalized = "05" + rest
                          normalized = normalized.slice(0, 10)
                          form.setFieldValue(field.name, normalized)
                        }}
                      />
                    </div>
                  )}
                </Field>
              </div>
              <Button
                type="button"
                size="sm"
                variant="solid"
                icon={<HiMinus />}
                onClick={() => {
                  setShowSecondPhone(false)
                  setFieldValue('secondPhone', '')
                }}
                className="h-9 w-9 p-0 bg-red-500 hover:bg-red-600"
                title="إزالة الرقم الثاني"
              />
            </div>
          </FormItem>
        )}
      </div>
    </AdaptableCard>
  )
}

export default ClientInfoStep
