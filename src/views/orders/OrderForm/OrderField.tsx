import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import { apiGetAllServices } from '@/services/ClientsService'
import Button from '@/components/ui/Button' // Make sure to import Button
import { HiPlus, HiMinus } from 'react-icons/hi' // Import the icons

type FormFieldsName = {
    firstName: string
    secondName: string
    thirdName: string
    lastName: string
    email: string
    phone: string
    clientType: string
    carModel: string
    carColor: string
    branch: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
}

type ClientFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
}

const carSizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'X-Large', value: 'X-large' },
    { label: 'XX-Large', value: 'XX-large' },
]

const branchOptions = [
    { label: 'عملاء فرع ابحر', value: 'عملاء فرع ابحر' },
    { label: 'عملاء فرع المدينة', value: 'عملاء فرع المدينة' },
    { label: 'اخرى', value: 'اخرى' },
]

const OrderFields = (props: ClientFieldsProps) => {
    const [services, setServices] = useState<
        { label: string; value: string }[]
    >([])
    const [loadingServices, setLoadingServices] = useState<boolean>(false)
    const [showEighthBox, setShowEighthBox] = useState<boolean>(false) // Add this state

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

    const handleAddBox = () => {
        setShowEighthBox(true)
    }

    const handleRemoveBox = () => {
        setShowEighthBox(false)
    }

    useEffect(() => {
        getServices()
    }, [])

    const { values, touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5 className="mt-8 text-lg font-semibold">معلومات السيارة</h5>
            <p className="mb-6 text-sm text-gray-500">
                قسم لإعداد معلومات السيارة
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="الشركة المصنعة ونوع السيارة"
                    invalid={!!errors.carManufacturer && !!touched.carManufacturer}
                    errorMessage={errors.carManufacturer as string}
                >
                    <Field
                        name="carManufacturer"
                        type="text"
                        size="sm"
                        placeholder="الشركة المصنعة ونوع السيارة"
                        component={Input}
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
                    />
                </FormItem>

                <FormItem
                    label="رقم لوحة السيارة"
                    invalid={
                        !!errors.carPlateNumber && !!touched.carPlateNumber
                    }
                    errorMessage={errors.carPlateNumber as string}
                >
                    <Field name="carPlateNumber">
                        {({ field, form }: FieldProps) => (
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    {[...Array(showEighthBox ? 8 : 7)].map(
                                        (_, i) => (
                                            <Input
                                                key={i} // Add key here
                                                type="text"
                                                size="sm"
                                                maxLength={1}
                                                className="text-center w-10"
                                                value={
                                                    (field.value?.[i] === '_'
                                                        ? ''
                                                        : field.value?.[i]) ||
                                                    ''
                                                }
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.toUpperCase()
                                                    let newValue =
                                                        field.value || ''

                                                    // حافظ على الطول المطلوب باستخدام '_' كمكان شاغر
                                                    newValue = String(
                                                        newValue || ''
                                                    ).padEnd(
                                                        showEighthBox ? 8 : 7,
                                                        '_'
                                                    )
                                                    newValue =
                                                        newValue.substring(
                                                            0,
                                                            i
                                                        ) +
                                                        (value || '_') +
                                                        newValue.substring(
                                                            i + 1
                                                        )

                                                    form.setFieldValue(
                                                        field.name,
                                                        newValue
                                                    )
                                                    form.setFieldTouched(
                                                        field.name,
                                                        true
                                                    )

                                                    if (
                                                        value &&
                                                        i <
                                                            (showEighthBox
                                                                ? 7
                                                                : 6)
                                                    ) {
                                                        const nextInput =
                                                            document.querySelector(
                                                                `input[name="${
                                                                    field.name
                                                                }-${i + 1}"]`
                                                            ) as HTMLInputElement
                                                        nextInput?.focus()
                                                    }
                                                }}
                                                onBlur={() =>
                                                    form.setFieldTouched(
                                                        field.name,
                                                        true
                                                    )
                                                }
                                                name={`${field.name}-${i}`}
                                            />
                                        )
                                    )}

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
                                key={option.value} // Add key here
                                className={`relative p-2 border rounded-md cursor-pointer transition-all text-sm
                                    ${
                                        values.carSize === option.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
                                    <span className="block font-medium">
                                        {option.label}
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                        {option.value === 'small'}
                                        {option.value === 'medium'}
                                        {option.value === 'large'}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default OrderFields