import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Button } from '@/components/ui'
import { Field as FormikField } from 'formik'
import {
    FaCar,
    FaTools,
    FaShieldAlt,
    FaTag,
    FaPalette,
    FaRulerCombined,
    FaWrench,
    FaDollarSign,
    FaInfoCircle,
    FaCalendarAlt,
    FaMapMarkerAlt,
} from 'react-icons/fa'
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'

type FormFieldsName = {
    carModel: string
    carColor: string
    branch: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    services: Array<{
        _id: string // Add _id for service
        serviceType: string
        dealDetails?: string
        protectionFinish?: string
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
            _id: string
            typeGuarantee: string
            startDate: string
            endDate: string
            terms?: string
            notes?: string
            status: string // Ensure this is status
            accepted: boolean
        }
    }>
}

const serviceTypeOptions = [
    { label: 'حماية', value: 'protection' },
    { label: 'تلميع', value: 'polish' },
    { label: 'عازل', value: 'insulator' },
    { label: 'إضافات', value: 'additions' },
    { label: 'حجز', value: 'booking' },
    { label: 'صيانة', value: 'maintenance' },
]

const protectionCoverageOptions = [
    { label: 'كامل', value: 'full' },
    { label: 'نص', value: 'half' },
    { label: 'ربع', value: 'quarter' },
    { label: 'أطراف', value: 'edges' },
    { label: 'اخرى', value: 'other' },
]

const protectionSizeOptions = [
    { label: '10 مل', value: '10' },
    { label: '8 مل', value: '8' },
    { label: '7.5 مل', value: '7.5' },
    { label: '6.5 مل', value: '6.5' },
]

const protectionFinishOptions = [
    { label: 'لامع', value: 'glossy' },
    { label: 'مطفى', value: 'matte' },
    { label: 'ملون', value: 'colored' },
]

const insulatorTypeOptions = [
    { label: 'سيراميك', value: 'ceramic' },
    { label: 'كاربون', value: 'carbon' },
    { label: 'كرستال', value: 'crystal' },
]

const insulatorCoverageOptions = [
    { label: 'كامل', value: 'full' },
    { label: 'نص', value: 'half' },
    { label: 'قطعة', value: 'piece' },
    { label: 'درع حماية', value: 'shield' },
    { label: 'خارجية', value: 'external' },
]

const polishTypeOptions = [
    { label: 'خارجي', value: 'external' },
    { label: 'داخلي', value: 'internal' },
    { label: 'داخلي وخارجي', value: 'internalAndExternal' },
    { label: 'كراسي', value: 'seats' },
    { label: 'قطعة', value: 'piece' },
    { label: 'تلميع مائي', value: 'water_polish' },
]

const polishSubTypeOptions = [
    { label: 'مستوى 1', value: '1' },
    { label: 'مستوى 2', value: '2' },
    { label: 'مستوى 3', value: '3' },
]

const additionTypeOptions = [
    { label: 'غسيل تفصيلي', value: 'detailed_wash' },
    { label: 'غسيل تفصيلي خاص', value: 'premium_wash' },
    { label: 'دواسات جلد', value: 'leather_pedals' },
    { label: 'تكحيل', value: 'blackout' },
    { label: 'نانو داخلي ديكور', value: 'nano_interior_decor' },
    { label: 'نانو داخلي مقاعد', value: 'nano_interior_seats' },
]

const washScopeOptions = [
    { label: 'كامل', value: 'full' },
    { label: 'خارجي فقط', value: 'external_only' },
    { label: 'داخلي فقط', value: 'internal_only' },
    { label: 'محرك', value: 'engine' },
]

type OrderFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
    readOnly?: boolean
    onActivateGuarantee?: (serviceId: string, guaranteeId: string) => void // Update this
    onDeactivateGuarantee?: (serviceId: string, guaranteeId: string) => void // Update this
    activatingGuarantee?: string | null
    deactivatingGuarantee?: string | null
}

const getServiceTypeName = (serviceType: string) => {
    switch (serviceType) {
        case 'protection':
            return 'حماية'
        case 'polish':
            return 'تلميع'
        case 'insulator':
            return 'عازل حراري'
        case 'additions':
            return 'إضافات'
        default:
            return serviceType
    }
}

const serviceTypeIcons = {
    protection: (
        <FaShieldAlt className="text-purple-600 dark:text-purple-400" />
    ),
    polish: <FaWrench className="text-orange-600 dark:text-orange-400" />,
    insulator: <FaTools className="text-blue-600 dark:text-blue-400" />,
    additions: <FaTag className="text-green-600 dark:text-green-400" />,
    default: <FaTools className="text-gray-500 dark:text-gray-500" />,
}

const renderReadOnlyValue = (
    value: string | number | undefined,
    placeholder: string = '-'
) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-medium text-gray-800 dark:text-gray-200 shadow-inner">
        {value || placeholder}
    </div>
)

const ShowOrderFields = (props: OrderFieldsProps) => {
    const renderReadOnlyValue = (value: string | number | null | undefined) => {
        return (
            <div className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-white flex items-center bg-gray-100 dark:bg-gray-700">
                {value ?? '-'}
            </div>
        )
    }

    const getLabel = (options: any[], value: string | undefined) => {
        const option = options.find((opt) => opt.value === value)
        return option ? option.label : '-'
    }

    const {
        values,
        readOnly = false,
        onActivateGuarantee,
        onDeactivateGuarantee,
        activatingGuarantee,
        deactivatingGuarantee,
    } = props

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const renderServiceDetails = (service: any) => {
        switch (service.serviceType) {
            case 'protection':
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaPalette className="ml-2 text-base text-gray-500" />{' '}
                                لون الحماية
                            </label>
                            {renderReadOnlyValue(service.protectionColor)}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaWrench className="ml-2 text-base text-gray-500" />{' '}
                                درجة اللمعان
                            </label>
                            {renderReadOnlyValue(service.protectionFinish)}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaRulerCombined className="ml-2 text-base text-gray-500" />{' '}
                                حجم الفيلم
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    protectionSizeOptions,
                                    service.protectionSize
                                )
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaShieldAlt className="ml-2 text-base text-gray-500" />{' '}
                                نوع التغطية
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    protectionCoverageOptions,
                                    service.protectionCoverage
                                )
                            )}{' '}
                        </div>
                    </>
                )
            case 'polish':
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaWrench className="ml-2 text-base text-gray-500" />{' '}
                                نوع التلميع
                            </label>
                            {renderReadOnlyValue(
                                getLabel(polishTypeOptions, service.polishType)
                            )}{' '}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaWrench className="ml-2 text-base text-gray-500" />{' '}
                                مستوى التلميع
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    polishSubTypeOptions,
                                    service.polishSubType
                                )
                            )}{' '}
                        </div>
                    </>
                )
            case 'insulator':
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaTools className="ml-2 text-base text-gray-500" />{' '}
                                نوع العازل
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    insulatorTypeOptions,
                                    service.insulatorType
                                )
                            )}{' '}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaTools className="ml-2 text-base text-gray-500" />{' '}
                                تغطية العازل
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    insulatorCoverageOptions,
                                    service.insulatorCoverage
                                )
                            )}
                        </div>
                    </>
                )
            case 'additions':
                return (
                    <>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaTag className="ml-2 text-base text-gray-500" />{' '}
                                نوع الإضافة
                            </label>
                            {renderReadOnlyValue(
                                getLabel(
                                    additionTypeOptions,
                                    service.additionType
                                )
                            )}{' '}
                               {(service.additionType === 'detailed_wash' ||
                            service.additionType === 'premium_wash') && (
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                    <FaTag className="ml-2 text-base text-gray-500" />{' '}
                                    نطاق الغسيل
                                </label>
                                {renderReadOnlyValue(
                                    getLabel(washScopeOptions, service.washScope),
                                )}
                            </div>
                        )}
                        </div>
                    </>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full max-w-full">
            <div className="max-w-7xl mx-auto">
                {/* Car Information Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-10">
                    <div className="bg-gradient-to-br from-gray-700 to-gray-500 rounded-t-lg p-6 mb-6 flex items-center shadow-md">
                        <div>
                            <h5 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span>معلومات السيارة</span>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    className="text-white text-3xl"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M499.99 176h-59.87l-16.64-41.6C406.38 91.63 365.57 64 319.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4L71.87 176H12.01C4.2 176-1.53 183.34.37 190.91l6 24C7.7 220.25 12.5 224 18.01 224h20.07C24.65 235.73 16 252.78 16 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-19.22-8.65-36.27-22.07-48H494c5.51 0 10.31-3.75 11.64-9.09l6-24c1.89-7.57-3.84-14.91-11.65-14.91zm-352.06-17.83c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L384 208H128l19.93-49.83zM96 319.8c-19.2 0-32-12.76-32-31.9S76.8 256 96 256s48 28.71 48 47.85-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S396.8 256 416 256s32 12.76 32 31.9-12.8 31.9-32 31.9z"></path>
                                </svg>
                            </h5>
                            <p className="text-gray-100 text-opacity-90">
                                تفاصيل السيارة الأساسية والمعلومات الفنية لطلب
                                الخدمة.
                            </p>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaCar className="ml-2 text-base text-gray-500" />{' '}
                                الشركة المصنعة و نوع السيارة
                            </label>
                            {renderReadOnlyValue(values.carManufacturer)}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaTag className="ml-2 text-base text-gray-500" />{' '}
                                موديل السيارة
                            </label>
                            {renderReadOnlyValue(values.carModel)}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaPalette className="ml-2 text-base text-gray-500" />{' '}
                                لون السيارة
                            </label>
                            {renderReadOnlyValue(values.carColor)}
                        </div>
                        <div className="flex flex-col lg:col-span-3">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaMapMarkerAlt className="ml-2 text-base text-gray-500" />{' '}
                                رقم لوحة السيارة
                            </label>
                            <div className="flex justify-center mt-2">
                                <div className="flex gap-2 bg-gray-200 dark:bg-gray-800 p-3 rounded-xl shadow-inner overflow-x-auto">
                                    {Array.from(
                                        values.carPlateNumber || ''
                                    ).map((char, i) => (
                                        <div
                                            key={i}
                                            className="w-12 h-14 flex items-center justify-center bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase"
                                        >
                                            {char || ' '}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                <FaRulerCombined className="ml-2 text-base text-gray-500" />{' '}
                                حجم السيارة
                            </label>
                            {renderReadOnlyValue(values.carSize)}
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-br from-gray-700 to-gray-500 rounded-t-lg p-6 mb-6 flex items-center shadow-md">
                        <div>
                            <h5 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span>الخدمات المقدمة</span>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    className="text-white text-3xl"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.2 103.6l82.1 82.1c8.1-1.9 16.5-2.9 24.7-2.9zm-103.9 82l-56.7-56.7L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l123.6-123.6c-7.6-19.9-9.9-41.6-5-62.7zM64 472c-13.2 0-24-10.8-24-24 0-13.3 10.7-24 24-24s24 10.7 24 24c0 13.2-10.7 24-24 24z"></path>
                                </svg>
                            </h5>
                            <p className="text-gray-100 text-opacity-90">
                                استعراض تفصيلي لجميع الخدمات التي تم تقديمها مع
                                معلومات الضمان.
                            </p>
                        </div>
                    </div>
                    <div className="p-8">
                        {values.services?.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                لا توجد خدمات مسجلة لهذا الطلب.
                            </p>
                        ) : (
                            values.services?.map(
                                (service: any, index: number) => (
                                    <div key={service._id || index}>
                                        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg bg-gray-50 dark:bg-gray-850 transform hover:scale-[1.01] transition-transform duration-300">
                                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center">
                                                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                                                        {serviceTypeIcons[
                                                            service.serviceType as keyof typeof serviceTypeIcons
                                                        ] ||
                                                            serviceTypeIcons.default}
                                                    </div>
                                                    <h6 className="text-xl font-bold mr-4 text-gray-800 dark:text-gray-100">
                                                        الخدمة {index + 1}:{' '}
                                                        {getServiceTypeName(
                                                            service.serviceType
                                                        )}
                                                    </h6>
                                                </div>
                                                {service.servicePrice && (
                                                    <div className="flex items-center bg-green-500/10 dark:bg-green-500/20 p-2 rounded-lg font-bold text-green-700 dark:text-green-300 text-lg ring-1 ring-green-500/30">
                                                        <FaDollarSign className="ml-2 text-green-600" />
                                                        {service.servicePrice}{' '}
                                                        ر.س
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {/* Common fields for all services */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                                                        <FaInfoCircle className="ml-2 text-base text-gray-500" />{' '}
                                                        تفاصيل الاتفاق
                                                    </label>
                                                    {renderReadOnlyValue(
                                                        service.dealDetails,
                                                        'لا يوجد تفاصيل'
                                                    )}
                                                </div>

                                                {/* Render service-specific fields */}
                                                {renderServiceDetails(service)}
                                            </div>

                                            {/* Guarantee Section */}
                                            {service.guarantee && (
                                                <div
                                                    className={`mt-8 p-6 rounded-xl border-2 ${
                                                        service.guarantee
                                                            .status === 'active'
                                                            ? 'bg-green-50 border-green-200'
                                                            : 'bg-red-50 border-red-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-center gap-3">
                                                            {service.guarantee
                                                                .status ===
                                                            'active' ? (
                                                                <FiCheckCircle className="text-green-600 text-3xl" />
                                                            ) : (
                                                                <FiXCircle className="text-red-600 text-3xl" />
                                                            )}
                                                            <h6 className="text-lg font-bold text-gray-800 dark:text-gray-300">
                                                                تفاصيل الضمان
                                                            </h6>
                                                        </div>
                                                        {readOnly &&
                                                            (service.guarantee
                                                                .status ===
                                                            'active' ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="solid"
                                                                    color="red"
                                                                    loading={
                                                                        deactivatingGuarantee ===
                                                                        service
                                                                            .guarantee
                                                                            ._id
                                                                    }
                                                                    onClick={() =>
                                                                        onDeactivateGuarantee?.(
                                                                            service._id,
                                                                            service
                                                                                .guarantee
                                                                                ._id
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 transition-all duration-200"
                                                                >
                                                                    <FiXCircle />
                                                                    إلغاء تفعيل
                                                                    الضمان
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="solid"
                                                                    color="green"
                                                                    loading={
                                                                        activatingGuarantee ===
                                                                        service
                                                                            .guarantee
                                                                            ._id
                                                                    }
                                                                    onClick={() =>
                                                                        onActivateGuarantee?.(
                                                                            service._id,
                                                                            service
                                                                                .guarantee
                                                                                ._id
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 transition-all duration-200"
                                                                >
                                                                    <FiCheckCircle />
                                                                    تفعيل الضمان
                                                                </Button>
                                                            ))}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                        <div className="flex flex-col">
                                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                                حالة الضمان
                                                            </label>
                                                            <span
                                                                className={`px-4 py-2 rounded-full font-semibold text-sm ${
                                                                    service
                                                                        .guarantee
                                                                        .status ===
                                                                    'active'
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                }`}
                                                            >
                                                                {service
                                                                    .guarantee
                                                                    .status ===
                                                                'active'
                                                                    ? 'مفعل'
                                                                    : 'غير مفعل'}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                                مدة الضمان
                                                            </label>
                                                            {renderReadOnlyValue(
                                                                service
                                                                    .guarantee
                                                                    .typeGuarantee ||
                                                                    '-'
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                                تاريخ البدء
                                                            </label>
                                                            {renderReadOnlyValue(
                                                                formatDate(
                                                                    service
                                                                        .guarantee
                                                                        .startDate
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                                                تاريخ الانتهاء
                                                            </label>
                                                            {renderReadOnlyValue(
                                                                formatDate(
                                                                    service
                                                                        .guarantee
                                                                        .endDate
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {index < values.services.length - 1 && (
                                            <div className="my-10 h-0.5 w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent dark:via-gray-600 rounded-full" />
                                        )}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowOrderFields
