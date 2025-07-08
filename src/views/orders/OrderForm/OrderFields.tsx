import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import { Field as FormikField } from 'formik'
import {
    FaCar,
    FaTools,
    FaShieldAlt,
    FaCalendarAlt,
    FaTag,
    FaPalette,
    FaRulerCombined,
    FaMapMarkerAlt,
    FaBuilding,
    FaWrench,
} from 'react-icons/fa' // Added more specific icons

type FormFieldsName = {
    carModel: string
    carColor: string
    branch: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    carType: string
    services: Array<{
        serviceType: string
        dealDetails: string
        protectionFinish?: string
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
            typeGuarantee: string
            startDate: string
            endDate: string
            terms: string
            Notes: string
        }
    }>
}

type OrderFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
    readOnly?: boolean
}

const carSizeOptions = [
    { label: 'صغيرة', value: 'small', icon: '🚗' },
    { label: 'متوسطة', value: 'medium', icon: '🚙' },
    { label: 'كبيرة', value: 'large', icon: '🚚' },
    { label: 'كبيرة جداً', value: 'X-large', icon: '🚛' },
    { label: 'ضخمة', value: 'XX-large', icon: '🚌' },
]

const branchOptions = [
    { label: 'فرع أبحر', value: 'فرع ابحر', icon: '🌊' }, // Changed icon to be more specific
    { label: 'فرع المدينة', value: 'فرع المدينة', icon: '🏢' }, // Changed icon to be more specific
    { label: 'أخرى', value: 'اخرى', icon: '📍' },
]

// Icons will now use gray tones for consistency with the new palette
const serviceTypeIcons = {
    protection: <FaShieldAlt className="text-gray-600 dark:text-gray-400" />,
    polish: <FaWrench className="text-gray-600 dark:text-gray-400" />,
    insulator: <FaTools className="text-gray-600 dark:text-gray-400" />,
    additions: <FaTag className="text-gray-600 dark:text-gray-400" />,
    default: <FaTools className="text-gray-500 dark:text-gray-500" />,
}

const OrderFields = (props: OrderFieldsProps) => {
    const { values, touched, errors, readOnly = false } = props

    // Helper function for rendering readonly values
    const renderReadOnlyValue = (
        value: string | number | undefined,
        placeholder: string = '-'
    ) => (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-medium text-gray-800 dark:text-gray-200">
            {value || placeholder}
        </div>
    )

    // Helper for translating service type names
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
            case 'wash':
                return 'غسيل' // Added wash type if applicable
            default:
                return serviceType
        }
    }

    return (
        <div className="w-full max-w-full p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <AdaptableCard
                    divider
                    className="w-full shadow-xl rounded-lg overflow-hidden"
                >
                    {/* Car Information Header */}
                    {/* Changed background to gray gradient for professionalism */}
                    <div className="bg-gradient-to-br from-gray-700 to-gray-500 rounded-t-lg p-6 mb-6 flex items-center shadow-md">
                        <div>
                            <h5 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span>معلومات السيارة</span>
                                <FaCar className="text-white text-3xl" />
                            </h5>
                            <p className="text-gray-100 text-opacity-90">
                                تفاصيل السيارة الأساسية والمعلومات الفنية لطلب
                                الخدمة.
                            </p>
                        </div>
                    </div>

                    {/* Car Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                        {/* Car Type */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaCar className="ml-2 text-lg text-gray-500" />{' '}
                                    نوع السيارة
                                </span>
                            }
                            invalid={!!errors.carType && !!touched.carType}
                            errorMessage={errors.carType as string}
                            className="mb-0"
                        >
                            {readOnly ? (
                                renderReadOnlyValue(values.carType)
                            ) : (
                                <Field
                                    name="carType"
                                    type="text"
                                    size="sm"
                                    placeholder="مثال: سيدان، دفع رباعي..."
                                    component={Input}
                                    className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500 transition duration-200"
                                />
                            )}
                        </FormItem>

                        {/* Car Model */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaTag className="ml-2 text-lg text-gray-500" />{' '}
                                    موديل السيارة
                                </span>
                            }
                            invalid={!!errors.carModel && !!touched.carModel}
                            errorMessage={errors.carModel}
                            className="mb-0"
                        >
                            {readOnly ? (
                                renderReadOnlyValue(values.carModel)
                            ) : (
                                <Field
                                    name="carModel"
                                    type="text"
                                    size="sm"
                                    placeholder="مثال: كامري، فورد F-150"
                                    component={Input}
                                    className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500 transition duration-200"
                                />
                            )}
                        </FormItem>

                        {/* Car Color */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaPalette className="ml-2 text-lg text-gray-500" />{' '}
                                    لون السيارة
                                </span>
                            }
                            invalid={!!errors.carColor && !!touched.carColor}
                            errorMessage={errors.carColor}
                            className="mb-0"
                        >
                            {readOnly ? (
                                renderReadOnlyValue(values.carColor)
                            ) : (
                                <Field
                                    name="carColor"
                                    type="text"
                                    size="sm"
                                    placeholder="مثال: أبيض، أسود"
                                    component={Input}
                                    className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500 transition duration-200"
                                />
                            )}
                        </FormItem>

                        {/* License Plate */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaCar className="ml-2 text-lg text-gray-500" />
                                    رقم لوحة السيارة
                                </span>
                            }
                            invalid={
                                !!errors.carPlateNumber &&
                                !!touched.carPlateNumber
                            }
                            errorMessage={errors.carPlateNumber as string}
                            className="mb-0 col-span-full"
                        >
                            {readOnly ? (
                                <div className="flex justify-center mt-2">
                                    <div className="flex gap-1 sm:gap-2 bg-gray-200 dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-inner overflow-x-auto">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 uppercase"
                                            >
                                                {values.carPlateNumber?.[i] ||
                                                    ' '}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Field name="carPlateNumber">
                                    {({ field, form }: FieldProps) => (
                                        <div className="flex justify-center mt-2">
                                            <div className="flex gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-700 p-1 sm:p-2 rounded-lg overflow-x-auto">
                                                {[...Array(8)].map((_, i) => (
                                                    <Input
                                                        key={i}
                                                        type="text"
                                                        size="sm"
                                                        maxLength={1}
                                                        className="text-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-gray-300 rounded-lg text-sm sm:text-lg md:text-xl font-bold uppercase focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition duration-200"
                                                        value={
                                                            field.value?.[i] ||
                                                            ''
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value.toUpperCase()
                                                            let newValue =
                                                                field.value ||
                                                                ''
                                                            newValue =
                                                                newValue.padEnd(
                                                                    8,
                                                                    ' '
                                                                )
                                                            newValue =
                                                                newValue.substring(
                                                                    0,
                                                                    i
                                                                ) +
                                                                value +
                                                                newValue.substring(
                                                                    i + 1
                                                                )
                                                            form.setFieldValue(
                                                                field.name,
                                                                newValue.trim()
                                                            )
                                                            if (
                                                                value &&
                                                                i < 7
                                                            ) {
                                                                const nextInput =
                                                                    document.querySelector(
                                                                        `input[name="${
                                                                            field.name
                                                                        }-${
                                                                            i +
                                                                            1
                                                                        }"]`
                                                                    ) as HTMLInputElement
                                                                nextInput?.focus()
                                                            }
                                                        }}
                                                        name={`${field.name}-${i}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Field>
                            )}
                        </FormItem>

                        {/* Manufacturer */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaBuilding className="ml-2 text-lg text-gray-500" />{' '}
                                    الشركة المصنعة
                                </span>
                            }
                            invalid={
                                !!errors.carManufacturer &&
                                !!touched.carManufacturer
                            }
                            errorMessage={errors.carManufacturer}
                            className="mb-0"
                        >
                            {readOnly ? (
                                renderReadOnlyValue(values.carManufacturer)
                            ) : (
                                <Field
                                    name="carManufacturer"
                                    type="text"
                                    size="sm"
                                    placeholder="مثال: تويوتا، نيسان"
                                    component={Input}
                                    className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500 transition duration-200"
                                />
                            )}
                        </FormItem>

                        {/* Car Size */}
                        <FormItem
                            label={
                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                    <FaRulerCombined className="ml-2 text-lg text-gray-500" />{' '}
                                    حجم السيارة
                                </span>
                            }
                            invalid={!!errors.carSize && !!touched.carSize}
                            errorMessage={errors.carSize as string}
                            className="mb-0 "
                        >
                            {readOnly ? (
                                renderReadOnlyValue(values.carSize)
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                                    {carSizeOptions.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center
                                                ${
                                                    values.carSize ===
                                                    option.value
                                                        ? 'border-gray-500 bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 shadow-md'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'
                                                }
                                                ${
                                                    readOnly
                                                        ? 'cursor-default opacity-80'
                                                        : ''
                                                }
                                            `}
                                        >
                                            <FormikField
                                                type="radio"
                                                name="carSize"
                                                value={option.value}
                                                className="absolute opacity-0"
                                                checked={
                                                    values.carSize ===
                                                    option.value
                                                }
                                                disabled={readOnly}
                                            />
                                            <span className="text-4xl mb-2">
                                                {option.icon}
                                            </span>
                                            <span className="font-semibold text-base">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </FormItem>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

                    {/* Services Header */}
                    {/* Changed background to a gray gradient */}
                    <div className="bg-gradient-to-br from-gray-700 to-gray-500 rounded-lg p-6 my-6 flex items-center shadow-md">
                        <div>
                            <h5 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span> الخدمات المقدمة </span>
                                <FaTools className="text-white text-3xl" />
                            </h5>
                            <p className="text-gray-100 text-opacity-90">
                                استعراض تفصيلي لجميع الخدمات التي تم تقديمها مع
                                معلومات الضمان.
                            </p>
                        </div>
                    </div>

                    {/* Services List */}
                    <div className="px-6 pb-6 space-y-8">
                        {values.services?.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                لا توجد خدمات مسجلة لهذا الطلب.
                            </p>
                        )}
                        {values.services?.map((service: any, index: number) => (
                            <div
                                key={index}
                                className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-850"
                            >
                                {/* Service Header */}
                                {/* Background color changes based on service type, now using subtle gray shades */}
                                <div
                                    className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700
                                    ${
                                        service.serviceType === 'protection'
                                            ? 'bg-gray-50 dark:bg-gray-900/30'
                                            : service.serviceType === 'polish'
                                            ? 'bg-gray-50 dark:bg-gray-900/30'
                                            : service.serviceType ===
                                              'insulator'
                                            ? 'bg-gray-50 dark:bg-gray-900/30'
                                            : 'bg-gray-50 dark:bg-gray-800'
                                    }
                                `}
                                >
                                    <div className="flex items-center">
                                        {serviceTypeIcons[
                                            service.serviceType as keyof typeof serviceTypeIcons
                                        ] || serviceTypeIcons.default}
                                        <h6 className="text-xl font-bold mr-3 text-gray-800 dark:text-gray-100">
                                            الخدمة {index + 1}:{' '}
                                            {getServiceTypeName(
                                                service.serviceType
                                            )}
                                        </h6>
                                    </div>
                                    {service.serviceDate && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
                                            <FaCalendarAlt className="ml-2 text-base text-gray-500" />{' '}
                                            {/* Icon color adjusted */}
                                            <span className="font-medium">
                                                تاريخ الخدمة:{' '}
                                                {new Date(
                                                    service.serviceDate
                                                ).toLocaleDateString('ar-SA')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Service Content */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Common Fields */}
                                    <FormItem
                                        label={
                                            <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                <FaTag className="ml-2 text-lg text-gray-500" />{' '}
                                                تفاصيل الاتفاق
                                            </span>
                                        }
                                        className="mb-0"
                                    >
                                        {renderReadOnlyValue(
                                            service.dealDetails,
                                            'لا يوجد تفاصيل'
                                        )}
                                    </FormItem>

                                    {service.servicePrice && (
                                        <FormItem
                                            label={
                                                <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                    <FaTag className="ml-2 text-lg text-gray-500" />{' '}
                                                    سعر الخدمة
                                                </span>
                                            }
                                            className="mb-0"
                                        >
                                            <div className="bg-gray-100 dark:bg-gray-900/30 p-3 rounded-lg font-bold text-gray-800 dark:text-gray-200 text-lg">
                                                {service.servicePrice} ريال
                                                سعودي
                                            </div>
                                        </FormItem>
                                    )}

                                    {/* Protection Service Fields */}
                                    {service.serviceType === 'protection' && (
                                        <>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaPalette className="ml-2 text-lg text-gray-500" />{' '}
                                                        لون السيارة الأصلي
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.originalCarColor
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaPalette className="ml-2 text-lg text-gray-500" />{' '}
                                                        لون الحماية
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.protectionColor
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaTools className="ml-2 text-lg text-gray-500" />{' '}
                                                        درجة اللمعان
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.protectionFinish ===
                                                        'glossy'
                                                        ? 'لامع'
                                                        : service.protectionFinish ===
                                                          'matte'
                                                        ? 'مطفى'
                                                        : service.protectionFinish ===
                                                          'colored'
                                                        ? 'ملون'
                                                        : service.protectionFinish ||
                                                          '-'
                                                )}
                                            </FormItem>
                                            {service.protectionFinish ===
                                                'glossy' && (
                                                <FormItem
                                                    label={
                                                        <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                            <FaRulerCombined className="ml-2 text-lg text-gray-500" />{' '}
                                                            حجم الفيلم
                                                        </span>
                                                    }
                                                    className="mb-0"
                                                >
                                                    {renderReadOnlyValue(
                                                        service.protectionSize
                                                            ? `${service.protectionSize} مل`
                                                            : '-'
                                                    )}
                                                </FormItem>
                                            )}
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaShieldAlt className="ml-2 text-lg text-gray-500" />{' '}
                                                        نوع التغطية
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.protectionCoverage ===
                                                        'full'
                                                        ? 'كامل'
                                                        : service.protectionCoverage ===
                                                          'half'
                                                        ? 'نص'
                                                        : service.protectionCoverage ===
                                                          'quarter'
                                                        ? 'ربع'
                                                        : service.protectionCoverage ===
                                                          'edges'
                                                        ? 'أطراف'
                                                        : service.protectionCoverage ===
                                                          'other'
                                                        ? 'أخرى'
                                                        : service.protectionCoverage ||
                                                          '-'
                                                )}
                                            </FormItem>
                                        </>
                                    )}

                                    {/* Polish Service Fields (Example, expand as needed) */}
                                    {service.serviceType === 'polish' && (
                                        <>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaWrench className="ml-2 text-lg text-gray-500" />{' '}
                                                        نوع التلميع
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.polishType || '-'
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaWrench className="ml-2 text-lg text-gray-500" />{' '}
                                                        نوع التلميع الفرعي
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.polishSubType || '-'
                                                )}
                                            </FormItem>
                                        </>
                                    )}

                                    {/* Insulator Service Fields (Example, expand as needed) */}
                                    {service.serviceType === 'insulator' && (
                                        <>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaTools className="ml-2 text-lg text-gray-500" />{' '}
                                                        نوع العازل
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.insulatorType || '-'
                                                )}
                                            </FormItem>
                                            <FormItem
                                                label={
                                                    <span className="flex items-center text-gray-700 dark:text-gray-200">
                                                        <FaTools className="ml-2 text-lg text-gray-500" />{' '}
                                                        تغطية العازل
                                                    </span>
                                                }
                                                className="mb-0"
                                            >
                                                {renderReadOnlyValue(
                                                    service.insulatorCoverage ||
                                                        '-'
                                                )}
                                            </FormItem>
                                        </>
                                    )}
                                    {/* Add more service type specific fields here following the same pattern */}
                                </div>

                                {/* Guarantee Section */}
                                {service.guarantee && (
                                    <div className="col-span-full p-6 border-t border-gray-200 dark:border-gray-700 mt-4">
                                        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-inner">
                                            <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                                <FaShieldAlt className="text-gray-600 dark:text-gray-400 text-2xl mr-3" />{' '}
                                                {/* Icon color adjusted */}
                                                <h6 className="text-lg font-bold text-gray-800 dark:text-gray-300">
                                                    تفاصيل الضمان
                                                </h6>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <FormItem
                                                    label="مدة الضمان"
                                                    className="mb-0"
                                                >
                                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded text-gray-700 dark:text-gray-200 font-medium">
                                                        {service.guarantee
                                                            .typeGuarantee ||
                                                            '-'}
                                                    </div>
                                                </FormItem>
                                                <FormItem
                                                    label="تاريخ البدء"
                                                    className="mb-0"
                                                >
                                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded text-gray-700 dark:text-gray-200 font-medium">
                                                        {service.guarantee
                                                            .startDate
                                                            ? new Date(
                                                                  service.guarantee.startDate
                                                              ).toLocaleDateString(
                                                                  'en-US'
                                                              )
                                                            : '-'}
                                                    </div>
                                                </FormItem>
                                                <FormItem
                                                    label="تاريخ الانتهاء"
                                                    className="mb-0"
                                                >
                                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded text-gray-700 dark:text-gray-200 font-medium">
                                                        {service.guarantee
                                                            .endDate
                                                            ? new Date(
                                                                  service.guarantee.endDate
                                                              ).toLocaleDateString(
                                                                  'en-US'
                                                              )
                                                            : '-'}
                                                    </div>
                                                </FormItem>

                                                <FormItem
                                                    label="الملاحظات"
                                                    className="mb-0"
                                                >
                                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded text-gray-700 dark:text-gray-200 font-medium">
                                                        {service.notes || '-'}
                                                    </div>
                                                </FormItem>
                                                {/* Add more guarantee fields as needed following the same pattern */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </AdaptableCard>
            </div>
        </div>
    )
}

export default OrderFields
