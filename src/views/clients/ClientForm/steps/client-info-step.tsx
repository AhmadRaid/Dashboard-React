"use client"

import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { Select } from "@/components/ui"
import { useState } from "react"
import { HiPlus, HiMinus, HiUser, HiShoppingBag, HiMail, HiPhone } from "react-icons/hi"

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
  ordersCount?: number // عدد طلبات العميل
}

// دالة للتحقق من أن النص عربي فقط
const isArabicText = (text: string): boolean => {
  // النمط يتطابق مع الأحرف العربية والمسافات
  const arabicPattern = /^[\u0600-\u06FF\s]+$/
  return arabicPattern.test(text)
}

// دالة لمعالجة المدخلات والسماح فقط بالأحرف العربية
const handleArabicInput = (e: React.ChangeEvent<HTMLInputElement>, field: any, form: any) => {
  const value = e.target.value
  // السماح فقط بالأحرف العربية والمسافات
  const arabicValue = value.replace(/[^\u0600-\u06FF\s]/g, '')
  form.setFieldValue(field.name, arabicValue)
}

// دالة لعرض اسم العميل بشكل منسق
const displayClientName = (values: any) => {
  const { firstName, secondName, thirdName, lastName } = values;
  if (firstName || secondName || thirdName || lastName) {
    return `${firstName || ''} ${secondName || ''} ${thirdName || ''} ${lastName || ''}`.trim();
  }
  return null;
}

const ClientInfoStep = ({ touched, errors, values, setFieldValue, ordersCount = 0 }: ClientInfoStepProps) => {
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

  const clientName = displayClientName(values);

  return (
    <AdaptableCard divider className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h5 className="text-lg font-semibold text-gray-800">معلومات العميل</h5>
          <p className="text-sm text-gray-500">قسم لإعداد معلومات العميل الأساسية</p>
        </div>
      </div>

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
          extra={values.firstName && !isArabicText(values.firstName) && (
            <p className="text-red-500 text-xs mt-1">يجب إدخال الأحرف العربية فقط</p>
          )}
        >
          <Field name="firstName">
            {({ field, form }: FieldProps) => (
              <Input
                {...field}
                size="sm"
                autoComplete="off"
                type="text"
                placeholder="الاسم الأول"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArabicInput(e, field, form)}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          label="اسم الاب"
          invalid={!!errors.secondName && !!touched.secondName}
          errorMessage={errors.secondName}
          extra={values.secondName && !isArabicText(values.secondName) && (
            <p className="text-red-500 text-xs mt-1">يجب إدخال الأحرف العربية فقط</p>
          )}
        >
          <Field name="secondName">
            {({ field, form }: FieldProps) => (
              <Input
                {...field}
                size="sm"
                autoComplete="off"
                type="text"
                placeholder="الاسم الاب"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArabicInput(e, field, form)}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          label="اسم الجد"
          invalid={!!errors.thirdName && !!touched.thirdName}
          errorMessage={errors.thirdName}
          extra={values.thirdName && !isArabicText(values.thirdName) && (
            <p className="text-red-500 text-xs mt-1">يجب إدخال الأحرف العربية فقط</p>
          )}
        >
          <Field name="thirdName">
            {({ field, form }: FieldProps) => (
              <Input
                {...field}
                size="sm"
                autoComplete="off"
                type="text"
                placeholder="الاسم الجد"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArabicInput(e, field, form)}
              />
            )}
          </Field>
        </FormItem>

        <FormItem 
          label="اسم العائلة" 
          invalid={!!errors.lastName && !!touched.lastName} 
          errorMessage={errors.lastName}
          extra={values.lastName && !isArabicText(values.lastName) && (
            <p className="text-red-500 text-xs mt-1">يجب إدخال الأحرف العربية فقط</p>
          )}
        >
          <Field name="lastName">
            {({ field, form }: FieldProps) => (
              <Input
                {...field}
                size="sm"
                autoComplete="off"
                type="text"
                placeholder="اسم العائلة"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleArabicInput(e, field, form)}
              />
            )}
          </Field>
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