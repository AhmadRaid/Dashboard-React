// في CarInfoStep.tsx
'use client'

import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { useState, useEffect } from "react"
import { HiPlus, HiMinus } from "react-icons/hi"

type FormFieldsName = {
  carModel: string
  carColor: string
  carPlateNumber: string
  carManufacturer: string
  carSize: string
}

type CarInfoStepProps = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: any
  setFieldValue: (field: string, value: any) => void
  setFieldTouched: (field: string, isTouched?: boolean) => void
  onNext?: () => void
  onPrevious?: () => void
  isNextDisabled?: boolean
}

const carSizeOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "X-Large", value: "X-large" },
  { label: "XX-Large", value: "XX-large" },
]

const CarInfoStep = ({ 
  touched, 
  errors, 
  values, 
  setFieldValue, 
  setFieldTouched, 
  onNext, 
  onPrevious, 
  isNextDisabled 
}: CarInfoStepProps) => {
  const [showEighthBox, setShowEighthBox] = useState(false)

  useEffect(() => {
    if (values.carPlateNumber && values.carPlateNumber.length === 8) {
      setShowEighthBox(true)
    } else if (values.carPlateNumber && values.carPlateNumber.length === 7) {
      setShowEighthBox(false)
    }
  }, [values.carPlateNumber])

  const handleAddBox = () => {
    setShowEighthBox(true)
    const current = String(values.carPlateNumber || '')
    if (current.length < 8) {
      setFieldValue('carPlateNumber', current.padEnd(8, '_'))
    }
  }

  const handleRemoveBox = () => {
    setShowEighthBox(false)
    const current = String(values.carPlateNumber || '')
    if (current.length > 7) {
      setFieldValue('carPlateNumber', current.substring(0, 7))
    }
  }

  // دالة محسنة للتحقق إذا كانت جميع الحقول مملوءة بشكل صحيح
  const areAllFieldsFilled = () => {
    const plateNumber = String(values.carPlateNumber || '')
    
    // تحقق من أن رقم اللوحة لا يحتوي على شرطات سفلية (محارف فارغة)
    const isPlateNumberValid = plateNumber.length > 0 && !plateNumber.includes('_')
    
    return (
      values.carModel &&
      values.carColor &&
      isPlateNumberValid &&
      values.carManufacturer &&
      values.carSize
    )
  }

  // دالة للتحقق من الأخطاء
  const hasErrors = () => {
    return (
      !!errors.carModel ||
      !!errors.carColor ||
      !!errors.carPlateNumber ||
      !!errors.carManufacturer ||
      !!errors.carSize
    )
  }

  return (
    <AdaptableCard divider className="mb-4">
      <h5 className="text-lg font-semibold">معلومات السيارة</h5>
      <p className="mb-6 text-sm text-gray-500">قسم لإعداد معلومات السيارة والمركبة</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem
          label="الشركة المصنعة نوع السيارة"
          invalid={!!errors.carManufacturer && !!touched.carManufacturer}
          errorMessage={errors.carManufacturer as string}
        >
          <Field 
            name="carManufacturer" 
            type="text" 
            size="sm" 
            placeholder="الشركة المصنعة ونوع السيارة" 
            component={Input} 
            onBlur={() => setFieldTouched('carManufacturer', true)}
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
            onBlur={() => setFieldTouched('carModel', true)}
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
            onBlur={() => setFieldTouched('carColor', true)}
          />
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
                      value={(field.value?.[i] === '_' ? '' : field.value?.[i]) || ""}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase()
                        let newValue = field.value || ""

                        newValue = String(newValue || '').padEnd(showEighthBox ? 8 : 7, "_")
                        newValue = newValue.substring(0, i) + (value || '_') + newValue.substring(i + 1)

                        form.setFieldValue(field.name, newValue)
                        form.setFieldTouched(field.name, true)

                        if (value && i < (showEighthBox ? 7 : 6)) {
                          const nextInput = document.querySelector(
                            `input[name="${field.name}-${i + 1}"]`,
                          ) as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      onBlur={() => form.setFieldTouched(field.name, true)}
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
                <div className="text-xs text-gray-500 mt-1">
                  {showEighthBox ? '8 أرقام' : '7 أرقام'}
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
                onClick={() => {
                  setFieldValue('carSize', option.value)
                  setFieldTouched('carSize', true)
                }}
              >
                <input
                  type="radio"
                  name="carSize"
                  value={option.value}
                  className="absolute opacity-0"
                  checked={values.carSize === option.value}
                  onChange={() => {
                    setFieldValue('carSize', option.value)
                    setFieldTouched('carSize', true)
                  }}
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