"use client"

import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { useState } from "react"
import { HiPlus, HiMinus } from "react-icons/hi" // أضفنا أيقونة الناقص

type FormFieldsName = {
  carModel: string
  carColor: string
  carPlateNumber: string
  carManufacturer: string
  carSize: string
  carType: string
}

type CarInfoStepProps = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: any
  setFieldValue: (field: string, value: any) => void
}

const carSizeOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "X-Large", value: "X-large" },
  { label: "XX-Large", value: "XX-large" },
]

const CarInfoStep = ({ touched, errors, values, setFieldValue }: CarInfoStepProps) => {
  const [showEighthBox, setShowEighthBox] = useState(false)

  const handleAddBox = () => {
    setShowEighthBox(true)
  }

  const handleRemoveBox = () => {
    setShowEighthBox(false)
    // إزالة الحرف الثامن من قيمة رقم اللوحة
    if (values.carPlateNumber && values.carPlateNumber.length > 7) {
      setFieldValue('carPlateNumber', values.carPlateNumber.substring(0, 7))
    }
  }

  return (
    <AdaptableCard divider className="mb-4">
      <h5 className="text-lg font-semibold">معلومات السيارة</h5>
      <p className="mb-6 text-sm text-gray-500">قسم لإعداد معلومات السيارة والمركبة</p>

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
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  {[...Array(showEighthBox ? 8 : 7)].map((_, i) => (
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

                        newValue = newValue.padEnd(showEighthBox ? 8 : 7, " ")
                        newValue = newValue.substring(0, i) + value + newValue.substring(i + 1)

                        form.setFieldValue(field.name, newValue.trim())

                        if (value && i < (showEighthBox ? 7 : 6)) {
                          const nextInput = document.querySelector(
                            `input[name="${field.name}-${i + 1}"]`,
                          ) as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      name={`${field.name}-${i}`}
                    />
                  ))}
                  
                  <div className="flex gap-1">
                    {!showEighthBox ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        icon={<HiPlus />}
                        onClick={handleAddBox}
                        className="h-9 w-9 p-0"
                        title="إضافة خانة إضافية"
                      />
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="solid"
                        icon={<HiMinus />}
                        onClick={handleRemoveBox}
                        className="h-9 w-9 p-0 bg-red-500 hover:bg-red-600"
                        title="إزالة الخانة الإضافية"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </Field>
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
                </div>
              </label>
            ))}
          </div>
        </FormItem>
      </div>
    </AdaptableCard>
  )
}

export default CarInfoStep