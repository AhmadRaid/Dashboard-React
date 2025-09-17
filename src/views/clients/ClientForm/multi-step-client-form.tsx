'use client'

import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui'
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import ClientInfoStep from './steps/client-info-step'
import CarInfoStep from './steps/car-info-step'
import ServicesStep from './steps/services-step'
import StepIndicator from './step-indicator'
import { apiCheckNameIsExist } from '@/services/ClientsService'
import { ConfirmDialog } from '@/components/shared'
import { toast } from '@/components/ui'
import { Notification } from '@/components/ui'

// Validation schemas for each step
const clientValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('الاسم الاول مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    secondName: Yup.string()
        .required('الاسم الاب مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    thirdName: Yup.string()
        .required('الاسم الجد مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    lastName: Yup.string()
        .required('الاسم العائلة مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    email: Yup.string().email('عنوان البريد الإلكتروني غير صالح'),
    phone: Yup.string()
        .required('رقم الهاتف مطلوب')
        .matches(
            /^05\d{8}$/,
            'يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام'
        ),
    secondPhone: Yup.string().matches(
        /^05\d{8}$/,
        'يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام'
    ),
    clientType: Yup.string()
        .oneOf(
            ['فرد', 'شركة', 'مسوق بعمولة'],
            'نوع العميل يجب أن يكون "فرد" أو "شركة" أو "مسوق"'
        )
        .required('نوع العميل مطلوب'),
    branch: Yup.string()
        .oneOf(
            ['عملاء فرع ابحر', 'عملاء فرع المدينة', 'اخرى'],
            'اختر فرعًا صحيحًا'
        )
        .required('يجب اختيار الفرع'),
})

const carValidationSchema = Yup.object().shape({
    carManufacturer: Yup.string() // ✅ الحقل الجديد
        .required('اسم الشركة المصنعة ونوع السيارة مطلوب')
        .max(50, 'يجب ألا يتجاوز اسم الشركة 50 حرفًا'),
    carModel: Yup.string()
        .required('موديل السيارة مطلوب')
        .max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),
    carColor: Yup.string()
        .required('لون السيارة مطلوب')
        .max(30, 'يجب ألا يتجاوز لون السيارة 30 حرفًا'),
    carPlateNumber: Yup.string()
        .required('رقم لوحة السيارة مطلوب')
        .matches(
            /^[أ-يa-zA-Z0-9]{7,8}$/,
            'يجب أن يتكون رقم اللوحة من 7 أو 8 أحرف'
        ),
    carSize: Yup.string()
        .required('حجم السيارة مطلوب')
        .oneOf(
            ['small', 'medium', 'large', 'X-large', 'XX-large'],
            'اختر حجمًا صالحًا للسيارة'
        ),
})

const servicesValidationSchema = Yup.object().shape({
    services: Yup.array()
        .min(1, 'يجب إضافة خدمة واحدة على الأقل')
        .of(
            Yup.object().shape({
                serviceType: Yup.string().required('نوع الخدمة مطلوب'),
                dealDetails: Yup.string(),
                servicePrice: Yup.number().typeError(
                    'سعر الخدمة يجب أن يكون رقمًا'
                ),
            })
        ),
})

type FormData = {
    // Client info
    firstName: string
    secondName: string
    thirdName: string
    lastName: string
    email?: string
    phone: string
    secondPhone: string
    clientType: string
    branch: string
    // Car info
    carModel: string
    carColor: string
    carPlateNumber: string
    carSize: string
    carManufacturer: string // ← أضف هذا الحقل

    // Services
    services: Array<{
        id: string
        serviceType: string
        dealDetails: string
        protectionType?: string
        protectionSize?: string
        protectionCoverage?: string
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

const initialData: FormData = {
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    email: '',
    phone: '',
    secondPhone: '',
    clientType: '',
    branch: '',
    carModel: '',
    carColor: '',
    carPlateNumber: '',
    carManufacturer: '', // ← أضف هذا الحقل
    carSize: '',
    services: [
        {
            id: 'service-0',
            serviceType: '',
            dealDetails: '',
            guarantee: {
                id: 'guarantee-0',
                typeGuarantee: '',
                startDate: '',
                endDate: '',
                terms: '',
                Notes: '',
            },
        },
    ],
}

type MultiStepClientFormProps = {
    onClientSave?: (clientData: any, confirm?: boolean) => Promise<void>
    onCarSave?: (carData: any) => Promise<void>
    onFinalSave?: (fullData: any) => Promise<void>
    onDiscard?: () => void
}

const MultiStepClientForm = ({
    onClientSave,
    onCarSave,
    onFinalSave,
    onDiscard,
}: MultiStepClientFormProps) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [savedClientData, setSavedClientData] = useState<any>(null)
    const [savedCarData, setSavedCarData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showNameExistsDialog, setShowNameExistsDialog] = useState(false)
    const [pendingClientData, setPendingClientData] = useState<any>(null)
    const [nameExistsMessage, setNameExistsMessage] = useState<string>(
        'هذا الاسم موجود بالفعل لعميل آخر. هل ترغب في الاستمرار باستخدام نفس الاسم؟'
    )
    const [pendingAction, setPendingAction] = useState<'next' | 'save' | null>(
        null
    )
    // حالات جديدة لتخصيص محتوى مربع الحوار
    const [dialogTitle, setDialogTitle] = useState('الاسم موجود مسبقاً');
    const [dialogConfirmText, setDialogConfirmText] = useState('متابعة بنفس الاسم');
    const [dialogCancelText, setDialogCancelText] = useState('تغيير الاسم');

    const steps = [
        {
            number: 1,
            title: 'معلومات العميل',
            description: 'البيانات الشخصية للعميل',
        },
        {
            number: 2,
            title: 'معلومات السيارة',
            description: 'بيانات السيارة والمركبة',
        },
        {
            number: 3,
            title: 'الخدمات',
            description: 'الخدمات المطلوبة والضمانات',
        },
    ]

    const getValidationSchema = () => {
        switch (currentStep) {
            case 1:
                return clientValidationSchema
            case 2:
                return carValidationSchema
            case 3:
                return servicesValidationSchema
            default:
                return clientValidationSchema
        }
    }

    const checkNameAndMaybeConfirm = async (
        clientData: {
            firstName: string
            secondName: string
            thirdName: string
            lastName: string
            phone: string
            secondPhone: string
        }
    ): Promise<boolean> => {
        setIsLoading(true)
        try {
            // 1. قم بإنشاء كائن جديد بالبيانات المطلوبة فقط
            const checkData = {
                firstName: clientData.firstName,
                secondName: clientData.secondName,
                thirdName: clientData.thirdName,
                lastName: clientData.lastName,
                phone: clientData.phone,
                ...(clientData.secondPhone && {
                    secondPhone: clientData.secondPhone,
                }),
            }

            const res: any = await apiCheckNameIsExist(checkData)
            const exists: boolean = !!res?.data?.data?.exists
            const apiMessage: string = res?.data?.message || res?.data?.data?.message || ''


            if (exists) {
                // تحديث محتوى مربع الحوار بناءً على رسالة الـ API
                if (apiMessage.includes('الاسم ورقم الهاتف موجودان')) {
                    setDialogTitle('الاسم ورقم الهاتف موجودان مسبقاً');
                    setDialogCancelText('تغيير البيانات');
                    setDialogConfirmText('متابعة بنفس البيانات');
                } else if (apiMessage.includes('الاسم موجود')) {
                    setDialogTitle('الاسم موجود مسبقاً');
                    setDialogCancelText('تغيير الاسم');
                    setDialogConfirmText('متابعة بنفس الاسم');
                } else if (apiMessage.includes('رقم الهاتف موجود')) {
                    setDialogTitle('رقم الهاتف موجود مسبقاً');
                    setDialogCancelText('تغيير رقم الهاتف');
                    setDialogConfirmText('متابعة بنفس الرقم');
                }
                setNameExistsMessage(apiMessage);
                setPendingClientData(clientData);
                setShowNameExistsDialog(true);
                return false;
            }
            return true;
        } catch (e) {
            console.error('Error checking client existence:', e)
            // 2. إظهار رسالة خطأ للمستخدم
            toast.push(
                <Notification title="فشل التحقق" type="danger">
                    حدث خطأ أثناء التحقق من وجود العميل. يرجى المحاولة مرة أخرى.
                </Notification>,
                {
                    placement: 'top-end',
                }
            )
            return true // نتابع التدفق الطبيعي حتى لو فشل التحقق
        } finally {
            setIsLoading(false)
        }
    }

    const proceedAfterConfirm = async () => {
        if (!pendingClientData) return
        setShowNameExistsDialog(false)
        if (pendingAction === 'save') {
            if (onClientSave) {
                await onClientSave(pendingClientData, true)
            }
            setSavedClientData(pendingClientData)
            // do not advance step on save; user stays to continue or navigate manually
        } else if (pendingAction === 'next') {
            // Stage locally only for Next
            setSavedClientData(pendingClientData)
            setCurrentStep(2)
        }
        setPendingClientData(null)
        setPendingAction(null)
    }

    const cancelAfterConfirm = () => {
        setShowNameExistsDialog(false)
        setPendingClientData(null)
        setPendingAction(null)
        // stay on step 1 so user can change name
    }

    const handleCloseDialog = () => {
        setShowNameExistsDialog(false);
    };

    const handleNext = async (
        values: FormData,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setIsLoading(true)
        try {
            if (currentStep === 1) {
                const clientData = {
                    firstName: values.firstName,
                    secondName: values.secondName,
                    thirdName: values.thirdName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    secondPhone: values?.secondPhone,
                    clientType: values.clientType,
                    branch: values.branch,
                }
                if (!values.email) {
                    delete (clientData as any).email
                }
                // إضافة الشرط لحذف secondPhone إذا كان فارغًا
                if (!values.secondPhone) {
                    delete (clientData as any).secondPhone
                }

                setPendingAction('next')
                const okToProceed = await checkNameAndMaybeConfirm(clientData)
                if (!okToProceed) return

                // For Next: stage locally only (no API)
                setSavedClientData(clientData)
                setCurrentStep(2)
            } else if (currentStep === 2) {
                const carData = {
                    carModel: values.carModel,
                    carColor: values.carColor,
                    carPlateNumber: values.carPlateNumber,
                    carManufacturer: values.carManufacturer, // ← تأكد من إضافة هذا
                    carSize: values.carSize,
                }

                if (onCarSave) {
                    await onCarSave(carData)
                }
                setSavedCarData(carData)
                setCurrentStep(3)
            }
        } catch (error) {
            console.error('Error saving data:', error)
        } finally {
            setIsLoading(false)
            setSubmitting(false)
        }
    }

    const handleSave = async (
        values: FormData,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setIsLoading(true)
        try {
            if (currentStep === 1) {
                const clientData = {
                    firstName: values.firstName,
                    secondName: values.secondName,
                    thirdName: values.thirdName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    secondPhone: values.secondPhone,
                    clientType: values.clientType,
                    branch: values.branch,
                }

                if (!values.email) {
                    delete (clientData as any).email
                }
                // إضافة الشرط لحذف secondPhone إذا كان فارغًا
                if (!values.secondPhone) {
                    delete (clientData as any).secondPhone
                }

                setPendingAction('save')
                const okToProceed = await checkNameAndMaybeConfirm(clientData)
                if (!okToProceed) return

                // For Save: persist immediately (no duplicate)
                if (onClientSave) {
                    await onClientSave(clientData, true)
                }
                setSavedClientData(clientData)
            } else if (currentStep === 2) {
                const carData = {
                    carModel: values.carModel,
                    carColor: values.carColor,
                    carPlateNumber: values.carPlateNumber,
                    carSize: values.carSize,
                }
                // Stage locally for car
                if (onCarSave) {
                    await onCarSave(carData)
                }
                // Also persist full client + car info immediately
                const fullDataStep2 = {
                    ...savedClientData,
                    ...carData,
                }
                if (onFinalSave) {
                    await onFinalSave(fullDataStep2)
                }
            } else if (currentStep === 3) {
                const fullData = {
                    ...savedClientData,
                    ...savedCarData,
                    services: values.services,
                }

                if (onFinalSave) {
                    await onFinalSave(fullData)
                }
            }
        } catch (error) {
            console.error('Error saving data:', error)
        } finally {
            setIsLoading(false)
            setSubmitting(false)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const renderCurrentStep = (
        values: FormData,
        touched: any,
        errors: any,
        setFieldValue: any,
        setFieldTouched: any // أضفنا setFieldTouched
    ) => {
        switch (currentStep) {
            case 1:
                return (
                    <ClientInfoStep
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                    />
                )
            case 2:
                return (
                    <CarInfoStep
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                    />
                )
            case 3:
                return (
                    <ServicesStep
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <StepIndicator steps={steps} currentStep={currentStep} />

            <Formik
                initialValues={initialData}
                validationSchema={getValidationSchema()}
                onSubmit={() => {}} // We handle submission in button clicks
                enableReinitialize
            >
                {({
                    values,
                    touched,
                    errors,
                    setSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    isValid,
                }) => (
                    <Form>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            {renderCurrentStep(
                                values,
                                touched,
                                errors,
                                setFieldValue,
                                setFieldTouched
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    {currentStep > 1 && (
                                        <Button
                                            type="button"
                                            variant="plain"
                                            onClick={handlePrevious}
                                            icon={<HiOutlineArrowRight />}
                                        >
                                            السابق
                                        </Button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="solid"
                                        loading={isLoading}
                                        icon={<AiOutlineSave />}
                                        onClick={() =>
                                            handleSave(values, setSubmitting)
                                        }
                                        disabled={!isValid}
                                    >
                                        {currentStep === 3
                                            ? 'حفظ نهائي'
                                            : 'حفظ'}
                                    </Button>

                                    {currentStep < 3 && (
                                        <Button
                                            type="button"
                                            variant="solid"
                                            loading={isLoading}
                                            icon={<HiOutlineArrowLeft />}
                                            onClick={() =>
                                                handleNext(
                                                    values,
                                                    setSubmitting
                                                )
                                            }
                                            disabled={!isValid}
                                        >
                                            {currentStep === 1
                                                ? 'ادراج سيارة للعميل'
                                                : currentStep === 2
                                                ? 'ادراج خدمات للسيارة'
                                                : 'التالي'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ConfirmDialog
    isOpen={showNameExistsDialog}
    isLoading={false}
    type="warning"
    title={dialogTitle}
    onCancel={cancelAfterConfirm}
    onConfirm={proceedAfterConfirm}
    onClose={handleCloseDialog} // <-- أضف هذا السطر
    cancelText={dialogCancelText}
    confirmText={dialogConfirmText}
>
                            <p className="text-gray-600 dark:text-gray-300">
                                {nameExistsMessage}
                            </p>
                        </ConfirmDialog>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MultiStepClientForm