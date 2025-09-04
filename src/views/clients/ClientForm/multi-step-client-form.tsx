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

// Validation schemas for each step
const clientValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('الاسم الاول مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    secondName: Yup.string()
        .required('الاسم الثاني مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    thirdName: Yup.string()
        .required('الاسم الثالث مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    lastName: Yup.string()
        .required('الاسم الاخير مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(100, 'يجب ألا يتجاوز الاسم 100 حرف'),
    email: Yup.string().email('عنوان البريد الإلكتروني غير صالح'),
    phone: Yup.string()
        .required('رقم الهاتف مطلوب')
        .matches(
            /^05\d{8}$/,
            'يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام'
        ),
    clientType: Yup.string()
        .oneOf(
            ['فرد', 'شركة', 'مسوق'],
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
    carType: Yup.string()
        .required('نوع السيارة مطلوب')
        .max(50, 'يجب ألا يتجاوز نوع السيارة 50 حرفًا'),
    carModel: Yup.string()
        .required('موديل السيارة مطلوب')
        .max(50, 'يجب ألا يتجاوز موديل السيارة 50 حرفًا'),
    carColor: Yup.string()
        .required('لون السيارة مطلوب')
        .max(30, 'يجب ألا يتجاوز لون السيارة 30 حرفًا'),
    carManufacturer: Yup.string().required('الشركة المصنعة مطلوبة'),
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
                dealDetails: Yup.string().required('تفاصيل الصفقة مطلوبة'),
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
    clientType: string
    branch: string
    // Car info
    carModel: string
    carColor: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    carType: string
    // Services
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

const initialData: FormData = {
    firstName: '',
    secondName: '',
    thirdName: '',
    lastName: '',
    email: '',
    phone: '',
    clientType: '',
    branch: '',
    carModel: '',
    carColor: '',
    carPlateNumber: '',
    carManufacturer: '',
    carSize: '',
    carType: '',
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

    const checkNameAndMaybeConfirm = async (clientData: any): Promise<boolean> => {
        // returns true if allowed to proceed
        const { firstName, secondName, thirdName, lastName } = clientData
        try {
            const res: any = await apiCheckNameIsExist({
                firstName,
                secondName,
                thirdName,
                lastName,
            })
            const exists: boolean = !!res?.data?.data?.exists
            if (exists) {
                setPendingClientData(clientData)
                setShowNameExistsDialog(true)
                return false
            }
            return true
        } catch (e) {
            // If check fails, do not block normal flow
            return true
        }
    }

    const proceedAfterConfirm = async () => {
        if (!pendingClientData) return
        setShowNameExistsDialog(false)
        if (onClientSave) {
            await onClientSave(pendingClientData, true)
        }
        setSavedClientData(pendingClientData)
        setPendingClientData(null)
        setCurrentStep(2)
    }

    const cancelAfterConfirm = () => {
        setShowNameExistsDialog(false)
        setPendingClientData(null)
        // stay on step 1 so user can change name
    }

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
                    clientType: values.clientType,
                    branch: values.branch,
                }
                if (!values.email) {
                    delete (clientData as any).email
                }

                const okToProceed = await checkNameAndMaybeConfirm(clientData)
                if (!okToProceed) return

                if (onClientSave) {
                    await onClientSave(clientData)
                }
                setSavedClientData(clientData)
                setCurrentStep(2)
            } else if (currentStep === 2) {
                const carData = {
                    carModel: values.carModel,
                    carColor: values.carColor,
                    carPlateNumber: values.carPlateNumber,
                    carManufacturer: values.carManufacturer,
                    carSize: values.carSize,
                    carType: values.carType,
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
                    clientType: values.clientType,
                    branch: values.branch,
                }

                if (!values.email) {
                    delete (clientData as any).email
                }

                const okToProceed = await checkNameAndMaybeConfirm(clientData)
                if (!okToProceed) return

                if (onClientSave) {
                    await onClientSave(clientData)
                }
            } else if (currentStep === 2) {
                const carData = {
                    carModel: values.carModel,
                    carColor: values.carColor,
                    carPlateNumber: values.carPlateNumber,
                    carManufacturer: values.carManufacturer,
                    carSize: values.carSize,
                    carType: values.carType,
                }

                if (onCarSave) {
                    await onCarSave(carData)
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
        setFieldValue: any
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
        <div className="max-w-4xl mx-auto">
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
                    isValid,
                }) => (
                    <Form>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            {renderCurrentStep(
                                values,
                                touched,
                                errors,
                                setFieldValue
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
                                        variant="plain"
                                        onClick={onDiscard}
                                    >
                                        إلغاء
                                    </Button>

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
                                            التالي
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <ConfirmDialog
                            isOpen={showNameExistsDialog}
                            isLoading={false}
                            type="warning"
                            title="الاسم موجود مسبقاً"
                            onCancel={cancelAfterConfirm}
                            onConfirm={proceedAfterConfirm}
                            cancelText="تغيير الاسم"
                            confirmText="متابعة بنفس الاسم"
                        >
                            <p className="text-gray-600 dark:text-gray-300">
                                هذا الاسم موجود بالفعل لعميل آخر. هل ترغب في الاستمرار باستخدام نفس الاسم؟
                            </p>
                        </ConfirmDialog>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MultiStepClientForm
