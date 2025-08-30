import { useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikProps } from 'formik'
import { Select } from '@/components/ui'
import Button from '@/components/ui/Button'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi'
import Checkbox from '@/components/ui/Checkbox'

type Service = {
  id: string
  serviceType?: string
  protectionFilm?: {
    finish?: string
    size?: string
    coverage?: string
  }
  thermalInsulator?: {
    type?: string
    percentage?: string
    coverage?: string
  }
  polishing?: {
    type?: string
    level?: string
    nanoType?: string
  }
  additions?: {
    type?: string
    blackoutType?: string
    washScope?: string
  }
  serviceDetails?: string
  servicePrice?: number
}

type FormFieldsName = {
  services: Service[]
}

type ServiceFieldsProps = {
  values: any
  form: FormikProps<any>
}

const WorkOrderFields = (props: ServiceFieldsProps) => {
  const { values, form } = props
  const [serviceCounter, setServiceCounter] = useState(1)

  const addService = () => {
    const newServiceId = `service-${serviceCounter}`
    
    form.setFieldValue(`services[${serviceCounter}]`, {
      id: newServiceId,
      serviceType: '',
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
      <h5 className="text-lg font-semibold">تفاصيل الخدمات</h5>
      <p className="mb-6 text-sm text-gray-500">
        قسم لإعداد الخدمات المقدمة للعميل
      </p>

      {values.services?.map((service, index) => (
        <div key={service.id} className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">الخدمة {index + 1}</h4>
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

          {/* Service Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <FormItem label="أفلام حماية">
         <Checkbox
    checked={service.serviceType === 'protection'}
    onChange={(checked) => { // Change e to checked
      if (checked) {
        form.setFieldValue(`services[${index}].serviceType`, 'protection')
        form.setFieldValue(`services[${index}].protectionFilm`, {})
      } else if (service.serviceType === 'protection') {
        form.setFieldValue(`services[${index}].serviceType`, '')
        form.setFieldValue(`services[${index}].protectionFilm`, undefined)
      }
    }}
  >
  </Checkbox>
            </FormItem>

            <FormItem label="عازل حراري">
          <Checkbox
    checked={service.serviceType === 'insulator'}
    onChange={(checked) => { // Change e to checked
      if (checked) {
        form.setFieldValue(`services[${index}].serviceType`, 'insulator')
        form.setFieldValue(`services[${index}].thermalInsulator`, {})
      } else if (service.serviceType === 'insulator') {
        form.setFieldValue(`services[${index}].serviceType`, '')
        form.setFieldValue(`services[${index}].thermalInsulator`, undefined)
      }
    }}
  >
  </Checkbox>
            </FormItem>

            <FormItem label="تلميع">
        <Checkbox
    checked={service.serviceType === 'polishing'}
    onChange={(checked) => { // Change e to checked
      if (checked) {
        form.setFieldValue(`services[${index}].serviceType`, 'polishing')
        form.setFieldValue(`services[${index}].polishing`, {})
      } else if (service.serviceType === 'polishing') {
        form.setFieldValue(`services[${index}].serviceType`, '')
        form.setFieldValue(`services[${index}].polishing`, undefined)
      }
    }}
  >
  </Checkbox>
            </FormItem>

            <FormItem label="إضافات">
      <Checkbox
    checked={service.serviceType === 'additions'}
    onChange={(checked) => { // Change e to checked
      if (checked) {
        form.setFieldValue(`services[${index}].serviceType`, 'additions')
        form.setFieldValue(`services[${index}].additions`, {})
      } else if (service.serviceType === 'additions') {
        form.setFieldValue(`services[${index}].serviceType`, '')
        form.setFieldValue(`services[${index}].additions`, undefined)
      }
    }}
  >
  </Checkbox>
            </FormItem>
          </div>

          {/* Protection Film Fields */}
          {service.serviceType === 'protection' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormItem label="النوع">
                <Field name={`services[${index}].protectionFilm.finish`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'لامع', value: 'glossy' },
                        { label: 'مطفى', value: 'matte' },
                        { label: 'ملون', value: 'colored' },
                      ]}
                      value={field.value ? { label: field.value === 'glossy' ? 'لامع' : field.value === 'matte' ? 'مطفى' : 'ملون', value: field.value } : null}
                      onChange={(option) => {
                        form.setFieldValue(field.name, option?.value || '')
                        form.setFieldValue(`services[${index}].protectionFilm.size`, '')
                      }}
                      placeholder="اختر النوع"
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="الحجم">
                <Field name={`services[${index}].protectionFilm.size`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={
                        service.protectionFilm?.finish === 'glossy' 
                          ? [
                              { label: '10 مل', value: '10' },
                              { label: '7 مل', value: '7' },
                            ]
                          : service.protectionFilm?.finish === 'matte'
                          ? [
                              { label: '8 مل', value: '8' },
                            ]
                          : service.protectionFilm?.finish === 'colored'
                          ? [
                              { label: '5 مل', value: '5' },
                              { label: '7 مل', value: '7' },
                              { label: '10 مل', value: '10' },
                            ]
                          : []
                      }
                      value={field.value ? { label: `${field.value} مل`, value: field.value } : null}
                      onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                      placeholder="اختر الحجم"
                      disabled={!service.protectionFilm?.finish}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="التغطية">
                <Field name={`services[${index}].protectionFilm.coverage`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'كامل', value: 'full' },
                        { label: 'نص', value: 'half' },
                        { label: 'ربع', value: 'quarter' },
                        { label: 'أطراف', value: 'edges' },
                        { label: 'أخرى', value: 'other' },
                      ]}
                      value={field.value ? { label: field.value === 'full' ? 'كامل' : field.value === 'half' ? 'نص' : field.value === 'quarter' ? 'ربع' : field.value === 'edges' ? 'أطراف' : 'أخرى', value: field.value } : null}
                      onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                      placeholder="اختر التغطية"
                    />
                  )}
                </Field>
              </FormItem>
            </div>
          )}

          {/* Thermal Insulator Fields */}
          {service.serviceType === 'insulator' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormItem label="النوع">
                <Field name={`services[${index}].thermalInsulator.type`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'سيراميك', value: 'ceramic' },
                        { label: 'كاربون', value: 'carbon' },
                        { label: 'كرست', value: 'crystal' },
                      ]}
                      value={field.value ? { label: field.value === 'ceramic' ? 'سيراميك' : field.value === 'carbon' ? 'كاربون' : 'كرست', value: field.value } : null}
                      onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                      placeholder="اختر النوع"
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="النسبة">
                <Field name={`services[${index}].thermalInsulator.percentage`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: '5%', value: '5' },
                        { label: '7%', value: '7' },
                        { label: '10%', value: '10' },
                      ]}
                      value={field.value ? { label: `${field.value}%`, value: field.value } : null}
                      onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                      placeholder="اختر النسبة"
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="التغطية">
                <Field name={`services[${index}].thermalInsulator.coverage`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'كامل', value: 'full' },
                        { label: 'نص', value: 'half' },
                        { label: 'قطعة', value: 'piece' },
                        { label: 'درع حماية', value: 'shield' },
                        { label: 'خارجي', value: 'external' },
                      ]}
                      value={field.value ? { label: field.value === 'full' ? 'كامل' : field.value === 'half' ? 'نص' : field.value === 'piece' ? 'قطعة' : field.value === 'shield' ? 'درع حماية' : 'خارجي', value: field.value } : null}
                      onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                      placeholder="اختر التغطية"
                    />
                  )}
                </Field>
              </FormItem>
            </div>
          )}

          {/* Polishing Fields */}
          {service.serviceType === 'polishing' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormItem label="النوع">
                <Field name={`services[${index}].polishing.type`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'خارجي', value: 'external' },
                        { label: 'داخلي', value: 'internal' },
                        { label: 'كراسي', value: 'seats' },
                        { label: 'قطعة', value: 'piece' },
                        { label: 'تلميع مائي', value: 'water_polish' },
                        { label: 'نانو سيراميك طبقة', value: 'nano_ceramic_1' },
                        { label: 'نانو سيراميك طبقتين', value: 'nano_ceramic_2' },
                        { label: 'نانو سيراميك ماستر', value: 'nano_ceramic_master' },
                      ]}
                      value={
                        field.value 
                          ? { 
                              label: 
                                field.value === 'external' ? 'خارجي' :
                                field.value === 'internal' ? 'داخلي' :
                                field.value === 'seats' ? 'كراسي' :
                                field.value === 'piece' ? 'قطعة' :
                                field.value === 'water_polish' ? 'تلميع مائي' :
                                field.value === 'nano_ceramic_1' ? 'نانو سيراميك طبقة' :
                                field.value === 'nano_ceramic_2' ? 'نانو سيراميك طبقتين' : 'نانو سيراميك ماستر', 
                              value: field.value 
                            } 
                          : null
                      }
                      onChange={(option) => {
                        form.setFieldValue(field.name, option?.value || '')
                        form.setFieldValue(`services[${index}].polishing.level`, '')
                      }}
                      placeholder="اختر النوع"
                    />
                  )}
                </Field>
              </FormItem>

              {service.polishing?.type === 'external' && (
                <FormItem label="المستوى">
                  <Field name={`services[${index}].polishing.level`}>
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        size="sm"
                        form={form}
                        options={[
                          { label: 'مستوى 1', value: '1' },
                          { label: 'مستوى 2', value: '2' },
                          { label: 'مستوى 3', value: '3' },
                        ]}
                        value={field.value ? { label: `مستوى ${field.value}`, value: field.value } : null}
                        onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                        placeholder="اختر المستوى"
                      />
                    )}
                  </Field>
                </FormItem>
              )}

              {(service.polishing?.type === 'nano_ceramic_1' || 
                service.polishing?.type === 'nano_ceramic_2' || 
                service.polishing?.type === 'nano_ceramic_master') && (
                <FormItem label="نوع النانو">
                  <Field name={`services[${index}].polishing.nanoType`}>
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        size="sm"
                        form={form}
                        options={[
                          { label: 'عادي', value: 'normal' },
                          { label: 'ممتاز', value: 'premium' },
                          { label: 'احترافي', value: 'professional' },
                        ]}
                        value={
                          field.value 
                            ? { 
                                label: 
                                  field.value === 'normal' ? 'عادي' :
                                  field.value === 'premium' ? 'ممتاز' : 'احترافي', 
                                value: field.value 
                              } 
                            : null
                        }
                        onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                        placeholder="اختر نوع النانو"
                      />
                    )}
                  </Field>
                </FormItem>
              )}
            </div>
          )}

          {/* Additions Fields */}
          {service.serviceType === 'additions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <FormItem label="النوع">
                <Field name={`services[${index}].additions.type`}>
                  {({ field, form }: FieldProps) => (
                    <Select
                      field={field}
                      size="sm"
                      form={form}
                      options={[
                        { label: 'غسيل تفصيلي', value: 'detailed_wash' },
                        { label: 'غسيل تفصيلي خاص', value: 'premium_wash' },
                        { label: 'دواسات جلد', value: 'leather_pedals' },
                        { label: 'تكحيل', value: 'blackout' },
                        { label: 'نانو داخلي ديكور', value: 'nano_interior_decor' },
                        { label: 'نانو داخلي مقاعد', value: 'nano_interior_seats' },
                      ]}
                      value={
                        field.value 
                          ? { 
                              label: 
                                field.value === 'detailed_wash' ? 'غسيل تفصيلي' :
                                field.value === 'premium_wash' ? 'غسيل تفصيلي خاص' :
                                field.value === 'leather_pedals' ? 'دواسات جلد' :
                                field.value === 'blackout' ? 'تكحيل' :
                                field.value === 'nano_interior_decor' ? 'نانو داخلي ديكور' : 'نانو داخلي مقاعد', 
                              value: field.value 
                            } 
                          : null
                      }
                      onChange={(option) => {
                        form.setFieldValue(field.name, option?.value || '')
                        form.setFieldValue(`services[${index}].additions.blackoutType`, '')
                        form.setFieldValue(`services[${index}].additions.washScope`, '')
                      }}
                      placeholder="اختر النوع"
                    />
                  )}
                </Field>
              </FormItem>

              {service.additions?.type === 'blackout' && (
                <FormItem label="نوع التكحيل">
                  <Field name={`services[${index}].additions.blackoutType`}>
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        size="sm"
                        form={form}
                        options={[
                          { label: 'شمعة', value: 'candle' },
                          { label: 'اسطبات', value: 'pads' },
                        ]}
                        value={field.value ? { label: field.value === 'candle' ? 'شمعة' : 'اسطبات', value: field.value } : null}
                        onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                        placeholder="اختر نوع التكحيل"
                      />
                    )}
                  </Field>
                </FormItem>
              )}

            </div>
          )}

          {/* Service Details and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem label="تفاصيل الخدمة">
              <Field
                name={`services[${index}].serviceDetails`}
                type="text"
                size="sm"
                placeholder="أدخل تفاصيل الخدمة"
                component={Input}
              />
            </FormItem>

            <FormItem label="سعر الخدمة">
              <Field
                name={`services[${index}].servicePrice`}
                type="number"
                size="sm"
                placeholder="أدخل سعر الخدمة"
                component={Input}
              />
            </FormItem>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <Button
          type="button"
          onClick={addService}
          icon={<HiPlus />}
        >
          إضافة خدمة جديدة
        </Button>
      </div>
    </AdaptableCard>
  )
}

export default WorkOrderFields