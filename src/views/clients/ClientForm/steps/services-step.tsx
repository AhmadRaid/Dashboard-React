"use client"

import { useState, useEffect } from "react"
import AdaptableCard from "@/components/shared/AdaptableCard"
import Input from "@/components/ui/Input"
import { FormItem } from "@/components/ui/Form"
import { Field, type FormikErrors, type FormikTouched, type FieldProps } from "formik"
import { Select, Button } from "@/components/ui"
import { HiPlus, HiTrash } from "react-icons/hi"
import { apiGetAllServices } from "@/services/ClientsService"

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

type ServicesStepProps = {
  touched: FormikTouched<{ services: Service[] }>
  errors: FormikErrors<{ services: Service[] }>
  values: { services: Service[] }
  setFieldValue: (field: string, value: any) => void
}

const ServicesStep = ({ touched, errors, values, setFieldValue }: ServicesStepProps) => {
  const [services, setServices] = useState<{ label: string; value: string }[]>([])
  const [loadingServices, setLoadingServices] = useState<boolean>(false)
  const [serviceCounter, setServiceCounter] = useState(1)

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

              <FormItem
                label="سعر الخدمة"
                invalid={
                  !!(errors.services as any)?.[index]?.servicePrice &&
                  !!(touched.services as any)?.[index]?.servicePrice
                }
                errorMessage={(errors.services as any)?.[index]?.servicePrice}
              >
                <Field
                  name={`services[${index}].servicePrice`}
                  type="number"
                  size="sm"
                  placeholder="سعر الخدمة"
                  component={Input}
                />
              </FormItem>

              <FormItem
                label="تاريخ الخدمة"
                invalid={
                  !!(errors.services as any)?.[index]?.serviceDate && !!(touched.services as any)?.[index]?.serviceDate
                }
                errorMessage={(errors.services as any)?.[index]?.serviceDate}
              >
                <Field name={`services[${index}].serviceDate`} type="date" size="sm" component={Input} />
              </FormItem>
            </div>

            {/* Guarantee Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h6 className="text-sm font-medium mb-3">معلومات الضمان</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                  label="نوع الضمان"
                  invalid={
                    !!(errors.services as any)?.[index]?.guarantee?.typeGuarantee &&
                    !!(touched.services as any)?.[index]?.guarantee?.typeGuarantee
                  }
                  errorMessage={(errors.services as any)?.[index]?.guarantee?.typeGuarantee}
                >
                  <Field
                    name={`services[${index}].guarantee.typeGuarantee`}
                    type="text"
                    size="sm"
                    placeholder="نوع الضمان"
                    component={Input}
                  />
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
                  label="تاريخ بداية الضمان"
                  invalid={
                    !!(errors.services as any)?.[index]?.guarantee?.startDate &&
                    !!(touched.services as any)?.[index]?.guarantee?.startDate
                  }
                  errorMessage={(errors.services as any)?.[index]?.guarantee?.startDate}
                >
                  <Field name={`services[${index}].guarantee.startDate`} type="date" size="sm" component={Input} />
                </FormItem>

                <FormItem
                  label="تاريخ انتهاء الضمان"
                  invalid={
                    !!(errors.services as any)?.[index]?.guarantee?.endDate &&
                    !!(touched.services as any)?.[index]?.guarantee?.endDate
                  }
                  errorMessage={(errors.services as any)?.[index]?.guarantee?.endDate}
                >
                  <Field name={`services[${index}].guarantee.endDate`} type="date" size="sm" component={Input} />
                </FormItem>
              </div>

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
        ))}
      </div>
    </AdaptableCard>
  )
}

export default ServicesStep
