"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { FormContainer, FormItem } from "@/components/ui/Form"
import Button from "@/components/ui/Button"
import StickyFooter from "@/components/shared/StickyFooter"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { Field, Form, Formik, type FormikProps, type FieldProps } from "formik"
import { HiOutlineTrash, HiPlus } from "react-icons/hi"
import { AiOutlineSave } from "react-icons/ai"
import cloneDeep from "lodash/cloneDeep"
import * as Yup from "yup"
import ClientFields from "./ClientFields2"
import { Select } from "@/components/ui"
import Input from "@/components/ui/Input"
import { apiCreateClient } from "@/services/ClientsService"

type FormikRef = FormikProps<any>

type Service = {
  id: string
  serviceType?: string
  dealDetails?: string
  protectionType?: string
  protectionSize?: "10" | "8" | "7.5" | "6.5"
  protectionCoverage?: string
  insulatorType?: string
  insulatorCoverage?: string
  polishType?: string
  polishSubType?: string
  additionType?: string
  washScope?: string
  servicePrice?: number
  serviceDate?: string
  originalCarColor?: string
  protectionColor?: string
}

type Guarantee = {
  id: string
  typeGuarantee: string
  startDate: string
  endDate?: string
  terms: string
  Notes: string
}

type InitialData = {
  firstName: string
  secondName: string
  thirdName: string
  lastName: string
  email: string
  phone: string
  clientType: "فرد" | "شركة" | "مسوق بعمولة"
  carModel: string
  carColor: string
  branch: string
  carPlateNumber: string
  carManufacturer: string
  carSize: string
  services: Array<{
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
  }>
}

const initialData: InitialData = {
  firstName: "",
  secondName: "",
  thirdName: "",
  lastName: "",
  email: "",
  phone: "",
  clientType: "",
  carModel: "",
  carColor: "",
  branch: "",
  carPlateNumber: "",
  carManufacturer: "",
  carSize: "",
  services: [
    {
      id: "service-0",
      serviceType: "",
      dealDetails: "",
      guarantee: {
        id: "guarantee-0",
        typeGuarantee: "",
        startDate: "",
        endDate: "",
        terms: "",
        Notes: "",
      },
    },
  ],
}

export const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("الاسم الاول مطلوب")
    .min(2, "يجب أن يكون الاسم الكامل على الأقل 2 حروف")
    .max(100, "يجب ألا يتجاوز الاسم الكامل 100 حرف"),

  secondName: Yup.string()
    .required("الاسم الاب مطلوب")
    .min(2, "يجب أن يكون الاسم الكامل على الأقل 2 حروف")
    .max(100, "يجب ألا يتجاوز الاسم الكامل 100 حرف"),
  thirdName: Yup.string()
    .required("الاسم الجد مطلوب")
    .min(2, "يجب أن يكون الاسم على الأقل 2 حروف")
    .max(100, "يجب ألا يتجاوز الاسم الكامل 100 حرف"),

  lastName: Yup.string()
    .required("الاسم الاخير مطلوب")
    .min(2, "يجب أن يكون الاسم الكامل على الأقل 2 حروف")
    .max(100, "يجب ألا يتجاوز الاسم الكامل 100 حرف"),

  email: Yup.string().email("عنوان البريد الإلكتروني غير صالح"),

  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .matches(/^05\d{8}$/, "يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام")
    .min(10, "يجب أن يتكون رقم الهاتف من 10 أرقام")
    .max(10, "يجب أن يتكون رقم الهاتف من 10 أرقام"),

  clientType: Yup.string()
    .oneOf(["فرد", "شركة", "مسوق بعمولة"], 'نوع العميل يجب أن يكون "فرد" أو "شركة" أو "مسوق بعمولة"')
    .required("نوع العميل مطلوب"),

  branch: Yup.string()
    .oneOf(["عملاء فرع ابحر", "عملاء فرع المدينة", "اخرى"], "اختر فرعًا صحيحًا")
    .required("يجب اختيار الفرع"),

  carModel: Yup.string()
    .max(50, "يجب ألا يتجاوز موديل السيارة 50 حرفًا")
    .test("require-if-car-fields-exist", "موديل السيارة مطلوب عند إدخال أي بيانات للسيارة", function (value) {
      const {  carColor, carManufacturer, carPlateNumber, carSize, services } = this.parent
      const anyCarFieldFilled =  !!carColor || !!carManufacturer || !!carPlateNumber || !!carSize

      return anyCarFieldFilled ? !!value : true
    }),

  carColor: Yup.string()
    .max(30, "يجب ألا يتجاوز لون السيارة 30 حرفًا")
    .test("require-if-car-fields-exist", "لون السيارة مطلوب عند إدخال أي بيانات للسيارة", function (value) {
      const {  carModel, carManufacturer, carPlateNumber, carSize, services } = this.parent
      const anyCarFieldFilled =  !!carModel || !!carManufacturer || !!carPlateNumber || !!carSize
      return anyCarFieldFilled ? !!value : true
    }),

  carManufacturer: Yup.string().test(
    "require-if-car-fields-exist",
    "الشركة المصنعة للسيارة مطلوبة عند إدخال أي بيانات للسيارة",
    function (value) {
      const { carModel, carColor, carPlateNumber, carSize, services } = this.parent
      const anyCarFieldFilled =  !!carModel || !!carColor || !!carPlateNumber || !!carSize
      return anyCarFieldFilled ? !!value : true
    },
  ),

  carPlateNumber: Yup.string()
    .matches(
      /^[أ-يa-zA-Z0-9]{7,8}$/, // تم تعديل التعبير النمطي هنا
      "يجب أن يتكون رقم اللوحة من 7 أو 8 أحرف عربية/إنجليزية أو أرقام", // رسالة خطأ محدثة
    )
    .test("require-if-car-fields-exist", "رقم لوحة السيارة مطلوب عند إدخال أي بيانات للسيارة", function (value) {
      const { carModel, carColor, carManufacturer, carSize } = this.parent
      const anyCarFieldFilled =  !!carModel || !!carColor || !!carManufacturer || !!carSize
      return anyCarFieldFilled ? !!value : true
    }),

  carSize: Yup.string()
    .oneOf(["small", "medium", "large", "X-large", "XX-large"], "اختر حجمًا صالحًا للسيارة")
    .test("require-if-car-fields-exist", "حجم السيارة مطلوب عند إدخال أي بيانات للسيارة", function (value) {
      const {  carModel, carColor, carManufacturer, carPlateNumber, services } = this.parent
      const anyCarFieldFilled =  !!carModel || !!carColor || !!carManufacturer || !!carPlateNumber
      return anyCarFieldFilled ? !!value : true
    }),

  // services: Yup.array()
  //     .of(
  //         Yup.object().shape({
  //             serviceType: Yup.string(),
  //             dealDetails: Yup.string(),
  //             guarantee: Yup.object().shape({
  //                 typeGuarantee: Yup.string(),
  //                 startDate: Yup.string(),
  //                 terms: Yup.string(),
  //             }),
  //         })
  //     )
  //     .test(
  //         'require-if-car-fields-exist',
  //         'يجب إضافة خدمة واحدة على الأقل عند إدخال أي بيانات للسيارة',
  //         function (value) {
  //             const {
  //                 carType,
  //                 carModel,
  //                 carColor,
  //                 carManufacturer,
  //                 carPlateNumber,
  //                 carSize,
  //             } = this.parent
  //             const anyCarFieldFilled =
  //                 !!carType ||
  //                 !!carModel ||
  //                 !!carColor ||
  //                 !!carManufacturer ||
  //                 !!carPlateNumber ||
  //                 !!carSize

  //             // إذا لم يكن هناك أي حقل سيارة مملوء، تجاهل services
  //             if (!anyCarFieldFilled) return true

  //             // إذا كان services فارغًا أو يحتوي على كائنات فارغة، اعتبره غير صالح
  //             // if (
  //             //     !value ||
  //             //     value.every(
  //             //         (service) =>
  //             //             !service.serviceType &&
  //             //             !service.dealDetails &&
  //             //             !service.guarantee
  //             //     )
  //             // ) {
  //             //     return false // يظهر خطأ "يجب إضافة خدمة واحدة على الأقل"
  //             // }

  //             return true
  //         }
  //     ),
})

const calculateEndDate = (startDate: string, guaranteePeriod: string): string => {
  if (!startDate || !guaranteePeriod) return ""

  const date = new Date(startDate)
  const years = Number.parseInt(guaranteePeriod)

  if (isNaN(years)) return ""

  date.setFullYear(date.getFullYear() + years)
  date.setDate(date.getDate() - 1) // ناقص يوم واحد

  return date.toISOString().split("T")[0]
}

const toHijriDate = (gregorianDate: string): string => {
  if (!gregorianDate) return ""

  // يمكنك استخدام مكتبة مثل ummalqura أو كتابة الدالة الخاصة بك
  // هذا مثال مبسط:
  const date = new Date(gregorianDate)
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

  return hijri
}

type ClientFormProps = {
  initialData?: InitialData
  type: "edit" | "new"
  onDiscard?: () => void
  onDelete?: (callback: any) => void
  onFormSubmit?: (formData: any, setSubmitting: (isSubmitting: boolean) => void) => void
}

const DeleteProductButton = ({ onDelete }: { onDelete: any }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const onConfirmDialogOpen = () => {
    setDialogOpen(true)
  }

  const onConfirmDialogClose = () => {
    setDialogOpen(false)
  }

  const handleConfirm = () => {
    onDelete?.(setDialogOpen)
  }

  return (
    <>
      <Button
        className="text-red-600"
        variant="plain"
        size="sm"
        icon={<HiOutlineTrash />}
        type="button"
        onClick={onConfirmDialogOpen}
      >
        Delete
      </Button>
      <ConfirmDialog
        isOpen={dialogOpen}
        type="danger"
        title="Delete project"
        confirmButtonColor="red-600"
        onClose={onConfirmDialogClose}
        onRequestClose={onConfirmDialogClose}
        onCancel={onConfirmDialogClose}
        onConfirm={handleConfirm}
      >
        <p>Are you sure you want to delete this Project?</p>
      </ConfirmDialog>
    </>
  )
}

const ClientForm = forwardRef<FormikRef, ClientFormProps>((props, ref) => {
  const [serviceCounter, setServiceCounter] = useState(1) // بدءًا من 1 لضمان وجود خدمة واحدة افتراضياً

  const {
    type,
    initialData = {
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      email: "",
      phone: "",
      clientType: "",
      carModel: "",
      carColor: "",
      carSize: "",
      branch: "",
      carPlateNumber: "",
      carManufacturer: "",
      services: [
        {
          id: "service-0",
          serviceType: "",
          dealDetails: "",
          guarantee: {
            id: "guarantee-0",
            typeGuarantee: "",
            startDate: "",
            endDate: "",
            terms: "",
            Notes: "",
          },
        },
      ],
    },
    onFormSubmit,
    onDiscard,
    onDelete,
  } = props

  const addServiceWithGuarantee = (form: FormikProps<any>) => {
    const newServiceId = `service-${serviceCounter}`
    const newGuaranteeId = `guarantee-${serviceCounter}`

    form.setFieldValue(`services[${serviceCounter}]`, {
      id: newServiceId,
      serviceType: "",
      dealDetails: "",
    })

    form.setFieldValue(`services[${serviceCounter}].guarantee`, {
      id: newGuaranteeId,
      typeGuarantee: "",
      startDate: "",
      endDate: "",
      terms: "",
      Notes: "",
    })

    setServiceCounter(serviceCounter + 1)
  }

  const removeService = (form: FormikProps<any>, index: number) => {
    if (form.values.services.length <= 1) {
      // لا تسمح بحذف آخر خدمة
      return
    }
    const services = [...form.values.services]
    services.splice(index, 1)
    form.setFieldValue("services", services)
  }

  function removeEmptyFields(obj: any): any {
    // حالة القيم الأساسية (ليست كائن أو مصفوفة)
    if (typeof obj !== "object" || obj === null) {
      return obj
    }

    // حالة المصفوفات
    if (Array.isArray(obj)) {
      const cleanedArray = obj
        .map((item) => removeEmptyFields(item)) // تطبيق الدالة على كل عنصر
        .filter((item) => {
          // تصفية العناصر الفارغة
          if (typeof item === "object" && item !== null) {
            // بالنسبة لمصفوفة الخدمات، تأكد من وجود حقول مطلوبة
            if (item.serviceType || item.dealDetails || item.guarantee?.typeGuarantee) {
              return true
            }
            return false
          }
          return item !== undefined && item !== null && item !== ""
        })

      // إذا كانت المصفوفة فارغة بعد التنظيف، نعيد undefined
      return cleanedArray.length > 0 ? cleanedArray : undefined
    }

    // حالة الكائنات
    const cleaned: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmptyFields(value) // تطبيق الدالة بشكل متكرر

      // الاحتفاظ بالقيمة فقط إذا لم تكن فارغة
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        cleanedValue !== "" &&
        !(typeof cleanedValue === "object" && Object.keys(cleanedValue).length === 0) &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0)
      ) {
        cleaned[key] = cleanedValue
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined
  }

  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    clientData: null,
    formData: null,
  })

  const handleSubmitWithConfirmation = async (data: any, setSubmitting: (isSubmitting: boolean) => void) => {
    try {
      const response = await apiCreateClient(data)

      if (response.data.requiresConfirmation) {
        // عرض حوار التأكيد
        setConfirmationDialog({
          isOpen: true,
          clientData: response.data.client,
          formData: data,
        })
        setSubmitting(false)
        return
      }

      // إذا لم يتطلب تأكيداً، تابع العملية الطبيعية
      onFormSubmit?.(data, setSubmitting)
    } catch (error) {
      setSubmitting(false)
      // معالجة الأخطاء هنا
    }
  }

  const ConfirmationDialog = ({ isOpen, onClose, onConfirm, clientData }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">تأكيد إضافة الطلب</h3>
          <p className="text-gray-600 mb-4">
            العميل {clientData?.firstName} {clientData?.lastName} موجود مسبقاً في النظام. هل أنت متأكد من إضافة طلب جديد
            لهذا العميل؟
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="plain" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="button" variant="solid" onClick={onConfirm}>
              تأكيد الإضافة
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // دالة لتحويل servicePrice إلى رقم
  const convertServicePricesToNumbers = (data: any): any => {
    if (!data || typeof data !== "object") return data

    if (Array.isArray(data)) {
      return data.map((item) => convertServicePricesToNumbers(item))
    }

    const converted = { ...data }

    // تحويل servicePrice في خدمات
    if (converted.services && Array.isArray(converted.services)) {
      converted.services = converted.services.map((service: any) => {
        if (service.servicePrice !== undefined && service.servicePrice !== null) {
          return {
            ...service,
            servicePrice:
              typeof service.servicePrice === "string"
                ? Number.parseFloat(service.servicePrice) || 0
                : Number(service.servicePrice),
          }
        }
        return service
      })
    }

    // تحويل servicePrice في المستوى الرئيسي (إذا كان موجودًا)
    if (converted.servicePrice !== undefined && converted.servicePrice !== null) {
      converted.servicePrice =
        typeof converted.servicePrice === "string"
          ? Number.parseFloat(converted.servicePrice) || 0
          : Number(converted.servicePrice)
    }

    return converted
  }

  return (
    <>
      <Formik
        innerRef={ref}
        initialValues={{
          ...initialData,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmitWithConfirmation(values, setSubmitting)

          let data = cloneDeep(values)
          console.log("Data values:", values)

          if (Array.isArray(data.carPlateNumber)) {
            data.carPlateNumber = data.carPlateNumber.join("")
          }

          // تحويل servicePrice إلى رقم قبل المعالجة
          data = convertServicePricesToNumbers(data)

          // تحويل تواريخ الضمان
          data.services = data.services?.map((service: any) => {
            if (service.guarantee?.startDate) {
              service.guarantee.startDate = new Date(service.guarantee.startDate).toISOString()
            }
            if (service.guarantee?.endDate) {
              service.guarantee.endDate = new Date(service.guarantee.endDate).toISOString()
            }

            // حذف الضمان إذا كان فارغًا
            if (
              service.guarantee &&
              !service.guarantee.typeGuarantee &&
              !service.guarantee.startDate &&
              !service.guarantee.endDate
            ) {
              delete service.guarantee
            }

            return service
          })

          // حذف كل الحقول الفارغة
          data = removeEmptyFields(data)

          if (data.services && data.services.length === 0) {
            delete data.services
          }

          onFormSubmit?.(data, setSubmitting)
        }}
      >
        {({ values, touched, errors, isSubmitting, ...form }) => {
          return (
            <Form>
              <FormContainer>
                {/* Client and Car Info Sections */}
                <ClientFields touched={touched} errors={errors} values={values} setFieldValue={form.setFieldValue} />

                {/* Services and Guarantees Sections */}
                <h5 className="mt-8 text-lg font-semibold">الخدمات والضمانات</h5>
                <p className="mb-6 text-sm text-gray-500">قسم لإعداد الخدمات والضمانات المقدمة للعميل</p>

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
                          onClick={() => removeService(form, index)}
                        >
                          حذف الخدمة
                        </Button>
                      )}
                    </div>

                    {/* Service Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem
                        label="نوع الخدمة"
                        invalid={!!errors.services?.[index]?.serviceType && !!touched.services?.[index]?.serviceType}
                        errorMessage={errors.services?.[index]?.serviceType as string}
                      >
                        <Field name={`services[${index}].serviceType`}>
                          {({ field, form }: FieldProps) => (
                            <Select
                              field={field}
                              size="sm"
                              form={form}
                              options={[
                                {
                                  label: "تلميع",
                                  value: "polish",
                                },
                                {
                                  label: "حماية",
                                  value: "protection",
                                },
                                {
                                  label: "عازل حراري",
                                  value: "insulator",
                                },
                                {
                                  label: "إضافات",
                                  value: "additions",
                                },
                              ]}
                              value={
                                field.value
                                  ? {
                                      label:
                                        field.value === "polish"
                                          ? "تلميع"
                                          : field.value === "protection"
                                            ? "حماية"
                                            : field.value === "insulator"
                                              ? "عازل حراري"
                                              : "إضافات",
                                      value: field.value,
                                    }
                                  : null
                              }
                              onChange={(option) => {
                                form.setFieldValue(`services[${index}].protectionType`, "")
                                form.setFieldValue(`services[${index}].protectionSize`, "")
                                form.setFieldValue(`services[${index}].protectionCoverage`, "")
                                form.setFieldValue(`services[${index}].insulatorType`, "")
                                form.setFieldValue(`services[${index}].insulatorCoverage`, "")
                                form.setFieldValue(`services[${index}].polishType`, "")
                                form.setFieldValue(`services[${index}].polishSubType`, "")
                                form.setFieldValue(`services[${index}].additionType`, "")
                                form.setFieldValue(`services[${index}].washScope`, "")
                                form.setFieldValue(field.name, option?.value || "")
                              }}
                              placeholder="اختر نوع الخدمة"
                            />
                          )}
                        </Field>
                      </FormItem>

                      {/* حقول خاصة بخدمة الحماية */}
                      {service.serviceType === "protection" && (
                        <>
                          <FormItem
                            label="نوع الحماية"
                            invalid={
                              !!errors.services?.[index]?.protectionType && !!touched.services?.[index]?.protectionType
                            }
                            errorMessage={errors.services?.[index]?.protectionType as string}
                          >
                            <Field name={`services[${index}].protectionType`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "لامع",
                                      value: "glossy",
                                    },
                                    {
                                      label: "مطفى",
                                      value: "matte",
                                    },
                                    {
                                      label: "ملون",
                                      value: "colored",
                                    },
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
                                  placeholder="اختر درجة اللمعان"
                                />
                              )}
                            </Field>
                          </FormItem>
                          {/* حقل لون الحماية */}
                          {/* حقل الحجم - يظهر فقط للأفلام اللامعة */}
                          {service.protectionType === "colored" && (
                            <FormItem
                              label="لون الحماية"
                              invalid={
                                !!errors.services?.[index]?.protectionColor &&
                                !!touched.services?.[index]?.protectionColor
                              }
                              errorMessage={errors.services?.[index]?.protectionColor as string}
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
                              !!errors.services?.[index]?.protectionSize && !!touched.services?.[index]?.protectionSize
                            }
                            errorMessage={errors.services?.[index]?.protectionSize as string}
                          >
                            <Field name={`services[${index}].protectionSize`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "10 مل",
                                      value: "10",
                                    },
                                    {
                                      label: "8 مل",
                                      value: "8",
                                    },
                                    {
                                      label: "7.5 مل",
                                      value: "7.5",
                                    },
                                    {
                                      label: "6.5 مل",
                                      value: "6.5",
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
                              !!errors.services?.[index]?.protectionCoverage &&
                              !!touched.services?.[index]?.protectionCoverage
                            }
                            errorMessage={errors.services?.[index]?.protectionCoverage as string}
                          >
                            <Field name={`services[${index}].protectionCoverage`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "كامل",
                                      value: "full",
                                    },
                                    {
                                      label: "نص",
                                      value: "half",
                                    },
                                    {
                                      label: "ربع",
                                      value: "quarter",
                                    },
                                    {
                                      label: "أطراف",
                                      value: "edges",
                                    },
                                    {
                                      label: "اخرى",
                                      value: "other",
                                    },
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

                      {/* حقول خاصة بخدمة العازل الحراري */}
                      {service.serviceType === "insulator" && (
                        <>
                          <FormItem
                            label="نوع العازل"
                            invalid={
                              !!errors.services?.[index]?.insulatorType && !!touched.services?.[index]?.insulatorType
                            }
                            errorMessage={errors.services?.[index]?.insulatorType as string}
                          >
                            <Field name={`services[${index}].insulatorType`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "سيراميك",
                                      value: "ceramic",
                                    },
                                    {
                                      label: "كاربون",
                                      value: "carbon",
                                    },
                                    {
                                      label: "كرستال",
                                      value: "crystal",
                                    },
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
                              !!errors.services?.[index]?.insulatorCoverage &&
                              !!touched.services?.[index]?.insulatorCoverage
                            }
                            errorMessage={errors.services?.[index]?.insulatorCoverage as string}
                          >
                            <Field name={`services[${index}].insulatorCoverage`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "كامل",
                                      value: "full",
                                    },
                                    {
                                      label: "نص",
                                      value: "half",
                                    },
                                    {
                                      label: "قطعة",
                                      value: "piece",
                                    },
                                    {
                                      label: "درع حماية",
                                      value: "shield",
                                    },
                                    {
                                      label: "خارجية",
                                      value: "external",
                                    },
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

                      {/* حقول خاصة بخدمة التلميع */}
                      {service.serviceType === "polish" && (
                        <>
                          <FormItem
                            label="نوع التلميع"
                            invalid={!!errors.services?.[index]?.polishType && !!touched.services?.[index]?.polishType}
                            errorMessage={errors.services?.[index]?.polishType as string}
                          >
                            <Field name={`services[${index}].polishType`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "خارجي",
                                      value: "external",
                                    },
                                    {
                                      label: "داخلي",
                                      value: "internal",
                                    },
                                    {
                                      label: "داخلي وخارجي",
                                      value: "internalAndExternal",
                                    },
                                    {
                                      label: "كراسي",
                                      value: "seats",
                                    },
                                    {
                                      label: "قطعة",
                                      value: "piece",
                                    },
                                    {
                                      label: "تلميع مائي",
                                      value: "water_polish",
                                    },
                                  ]}
                                  value={
                                    field.value
                                      ? {
                                          label:
                                            field.value === "external"
                                              ? "خارجي"
                                              : field.value === "internal"
                                                ? "داخلي"
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

                          {/* يظهر فقط عند اختيار خارجي */}
                          {service.polishType === "external" && (
                            <FormItem
                              label="مستوى التلميع"
                              invalid={
                                !!errors.services?.[index]?.polishSubType && !!touched.services?.[index]?.polishSubType
                              }
                              errorMessage={errors.services?.[index]?.polishSubType as string}
                            >
                              <Field name={`services[${index}].polishSubType`}>
                                {({ field, form }: FieldProps) => (
                                  <Select
                                    field={field}
                                    size="sm"
                                    form={form}
                                    options={[
                                      {
                                        label: "مستوى 1",
                                        value: "1",
                                      },
                                      {
                                        label: "مستوى 2",
                                        value: "2",
                                      },
                                      {
                                        label: "مستوى 3",
                                        value: "3",
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

                      {/* حقول خاصة بخدمة الإضافات */}
                      {service.serviceType === "additions" && (
                        <>
                          <FormItem
                            label="نوع الإضافة"
                            invalid={
                              !!errors.services?.[index]?.additionType && !!touched.services?.[index]?.additionType
                            }
                            errorMessage={errors.services?.[index]?.additionType as string}
                          >
                            <Field name={`services[${index}].additionType`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "غسيل تفصيلي",
                                      value: "detailed_wash",
                                    },
                                    {
                                      label: "غسيل تفصيلي خاص",
                                      value: "premium_wash",
                                    },
                                    {
                                      label: "دواسات جلد",
                                      value: "leather_pedals",
                                    },
                                    {
                                      label: "تكحيل",
                                      value: "blackout",
                                    },
                                    {
                                      label: "نانو داخلي ديكور",
                                      value: "nano_interior_decor",
                                    },
                                    {
                                      label: "نانو داخلي مقاعد",
                                      value: "nano_interior_seats",
                                    },
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

                          {/* حقول فرعية لأنواع الإضافات */}
                          {(service.additionType === "detailed_wash" || service.additionType === "premium_wash") && (
                            <FormItem
                              label="نطاق الغسيل"
                              invalid={!!errors.services?.[index]?.washScope && !!touched.services?.[index]?.washScope}
                              errorMessage={errors.services?.[index]?.washScope as string}
                            >
                              <Field name={`services[${index}].washScope`}>
                                {({ field, form }: FieldProps) => (
                                  <Select
                                    field={field}
                                    size="sm"
                                    form={form}
                                    options={[
                                      {
                                        label: "كامل",
                                        value: "full",
                                      },
                                      {
                                        label: "خارجي فقط",
                                        value: "external_only",
                                      },
                                      {
                                        label: "داخلي فقط",
                                        value: "internal_only",
                                      },
                                      {
                                        label: "محرك",
                                        value: "engine",
                                      },
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
                        invalid={!!errors.services?.[index]?.servicePrice && !!touched.services?.[index]?.servicePrice}
                        errorMessage={errors.services?.[index]?.servicePrice as string}
                      >
                        <div className="flex flex-col gap-2">
                          <Field name={`services[${index}].servicePrice`}>
                            {({ field, form }: FieldProps) => (
                              <Input
                                {...field}
                                type="number"
                                size="sm"
                                placeholder="أدخل سعر الخدمة"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = Number.parseFloat(e.target.value) || 0
                                  form.setFieldValue(`services[${index}].servicePrice`, value)
                                }}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  const value = Number.parseFloat(e.target.value) || 0
                                  form.setFieldValue(`services[${index}].servicePrice`, value)
                                }}
                              />
                            )}
                          </Field>
                          {values.services[index].servicePrice && (
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
                        </div>
                      </FormItem>

                      <FormItem
                        label="تفاصيل الاتفاق"
                        invalid={!!errors.services?.[index]?.dealDetails && !!touched.services?.[index]?.dealDetails}
                        errorMessage={errors.services?.[index]?.dealDetails as string}
                      >
                        <Field
                          name={`services[${index}].dealDetails`}
                          type="text"
                          size="sm"
                          placeholder="أدخل تفاصيل الاتفاق"
                          component={Input}
                        />
                      </FormItem>
                    </div>

                    {/* Guarantee Fields */}
                    {service.guarantee && (
                      <div className="mt-6">
                        <h5 className="text-md font-semibold mb-4">ضمان الخدمة {index + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormItem
                            label="مدة الضمان"
                            invalid={
                              !!errors.services?.[index]?.guarantee?.typeGuarantee &&
                              !!touched.services?.[index]?.guarantee?.typeGuarantee
                            }
                            errorMessage={errors.services?.[index]?.guarantee?.typeGuarantee}
                          >
                            <Field name={`services[${index}].guarantee.typeGuarantee`}>
                              {({ field, form }: FieldProps) => (
                                <Select
                                  field={field}
                                  size="sm"
                                  form={form}
                                  options={[
                                    {
                                      label: "2 سنوات",
                                      value: "2 سنوات",
                                    },
                                    {
                                      label: "3 سنوات",
                                      value: "3 سنوات",
                                    },
                                    {
                                      label: "5 سنوات",
                                      value: "5 سنوات",
                                    },
                                    {
                                      label: "8 سنوات",
                                      value: "8 سنوات",
                                    },
                                    {
                                      label: "10 سنوات",
                                      value: "10 سنوات",
                                    },
                                  ]}
                                  value={
                                    field.value
                                      ? {
                                          label: `${field.value}`,
                                          value: field.value,
                                        }
                                      : null
                                  }
                                  onChange={(option) => {
                                    form.setFieldValue(field.name, option?.value)

                                    // حساب تاريخ الانتهاء تلقائياً
                                    const startDate = form.values.services[index].guarantee.startDate
                                    if (startDate && option?.value) {
                                      const endDate = calculateEndDate(startDate, option.value)
                                      form.setFieldValue(`services[${index}].guarantee.endDate`, endDate)
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
                              !!errors.services?.[index]?.guarantee?.startDate &&
                              !!touched.services?.[index]?.guarantee?.startDate
                            }
                            errorMessage={errors.services?.[index]?.guarantee?.startDate}
                          >
                            <Field name={`services[${index}].guarantee.startDate`}>
                              {({ field, form }: FieldProps) => (
                                <div>
                                  <Input
                                    type="date"
                                    size="sm"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e)

                                      // حساب تاريخ الانتهاء تلقائياً
                                      const guaranteePeriod = form.values.services[index].guarantee.typeGuarantee
                                      if (e.target.value && guaranteePeriod) {
                                        const endDate = calculateEndDate(e.target.value, guaranteePeriod)
                                        form.setFieldValue(`services[${index}].guarantee.endDate`, endDate)
                                      }
                                    }}
                                    placeholder="تاريخ البدء"
                                  />
                                  {field.value && (
                                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                                      <span className="text-base font-medium text-blue-700">التاريخ الهجري:</span>
                                      <span className="text-base font-semibold text-blue-800">
                                        {toHijriDate(field.value)}
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
                                  value={values.services[index].guarantee?.endDate || ""}
                                  readOnly
                                  className="bg-gray-50" // إضافة خلفية رمادية فاتحة
                                />
                              </div>
                              {values.services[index].guarantee?.endDate && (
                                <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
                                  <span className="text-base font-medium text-blue-700">التاريخ الهجري:</span>
                                  <span className="text-base font-semibold text-blue-800">
                                    {toHijriDate(values.services[index].guarantee.endDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </FormItem>

                          <FormItem
                            label="الشروط"
                            invalid={
                              !!errors.services?.[index]?.guarantee?.terms &&
                              !!touched.services?.[index]?.guarantee?.terms
                            }
                            errorMessage={errors.services?.[index]?.guarantee?.terms}
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
                              !!errors.services?.[index]?.guarantee?.Notes &&
                              !!touched.services?.[index]?.guarantee?.Notes
                            }
                            errorMessage={errors.services?.[index]?.guarantee?.Notes as string}
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
                  <Button type="button" onClick={() => addServiceWithGuarantee(form)} icon={<HiPlus />}>
                    إضافة خدمة وضمان جديد
                  </Button>
                </div>

                <StickyFooter
                  className="-mx-8 px-8 flex items-center justify-between py-4"
                  stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div>{type === "edit" && <DeleteProductButton onDelete={onDelete as any} />}</div>

                  <div className="md:flex items-center">
                    <Button size="sm" className="ltr:mr-3 rtl:ml-3" type="button" onClick={() => onDiscard?.()}>
                      الغاء
                    </Button>
                    <Button size="sm" variant="solid" loading={isSubmitting} icon={<AiOutlineSave />} type="submit">
                      {type === "new" ? "اضافة" : "تحديث"}
                    </Button>
                  </div>
                </StickyFooter>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() =>
          setConfirmationDialog({
            isOpen: false,
            clientData: null,
            formData: null,
          })
        }
        onConfirm={async () => {
          try {
            // إرسال الطلب مع تأكيد
            const response = await apiCreateClient(confirmationDialog.formData, true)
            // معالجة النجاح هنا
            setConfirmationDialog({
              isOpen: false,
              clientData: null,
              formData: null,
            })
            onFormSubmit?.(confirmationDialog.formData, () => {})
          } catch (error) {
            // معالجة الأخطاء هنا
          }
        }}
        clientData={confirmationDialog.clientData}
      />
    </>
  )
})

ClientForm.displayName = "ClientForm"

export default ClientForm
