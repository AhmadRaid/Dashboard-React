import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import { AiOutlineSave } from 'react-icons/ai'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import { Select } from '@/components/ui'
import Input from '@/components/ui/Input'
import OrderServiceFields from './ServiceField'
import { HiPlus, HiOutlineTrash } from 'react-icons/hi'

type FormikRef = FormikProps<any>

type Service = {
    id: string
    serviceType?: string
    dealDetails?: string
    protectionFinish?: string
    protectionSize?: string
    protectionCoverage?: string
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

type InitialData = {
    services: Service[]
}

const initialData: InitialData = {
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

export const validationSchema = Yup.object().shape({
    // services: Yup.array().of(
    //     Yup.object().shape({
    //         serviceType: Yup.string()
    //             .required('نوع الخدمة مطلوب')
    //             .oneOf(
    //                 ['polish', 'protection', 'insulator', 'additions'],
    //                 'اختر نوع خدمة صالح'
    //             ),

    //         dealDetails: Yup.string()
    //             .required('تفاصيل الاتفاق مطلوبة')
    //             .min(10, 'يجب أن تكون تفاصيل الاتفاق على الأقل 10 أحرف'),

    //         servicePrice: Yup.number()
    //             .required('سعر الخدمة مطلوب')
    //             .min(0, 'يجب أن يكون سعر الخدمة موجبًا'),

    //         serviceDate: Yup.date().required('تاريخ الخدمة مطلوب'),

    //         // حقول التحقق الخاصة بأنواع الخدمات المختلفة
    //         protectionFinish: Yup.string().when('serviceType', {
    //             is: 'protection',
    //             then: Yup.string().required('درجة اللمعان مطلوبة للحماية'),
    //         }),

    //         protectionSize: Yup.string().when(
    //             ['serviceType', 'protectionFinish'],
    //             {
    //                 is: (serviceType: string, protectionFinish: string) =>
    //                     serviceType === 'protection' &&
    //                     protectionFinish === 'glossy',
    //                 then: Yup.string().required(
    //                     'حجم الفيلم مطلوب للأفلام اللامعة'
    //                 ),
    //             }
    //         ),

    //         protectionCoverage: Yup.string().when('serviceType', {
    //             is: 'protection',
    //             then: Yup.string().required('نوع التغطية مطلوب للحماية'),
    //         }),

    //         insulatorType: Yup.string().when('serviceType', {
    //             is: 'insulator',
    //             then: Yup.string().required('نوع العازل مطلوب للعازل الحراري'),
    //         }),

    //         insulatorCoverage: Yup.string().when('serviceType', {
    //             is: 'insulator',
    //             then: Yup.string().required(
    //                 'نطاق التغطية مطلوب للعازل الحراري'
    //             ),
    //         }),

    //         polishType: Yup.string().when('serviceType', {
    //             is: 'polish',
    //             then: Yup.string().required('نوع التلميع مطلوب للتلميع'),
    //         }),

    //         polishSubType: Yup.string().when(
    //             ['serviceType', 'polishType'],
    //             {
    //                 is: (serviceType: string, polishType: string) =>
    //                     serviceType === 'polish' && polishType === 'external',
    //                 then: Yup.string().required(
    //                     'مستوى التلميع مطلوب للتلميع الخارجي'
    //                 ),
    //             }
    //         ),

    //         additionType: Yup.string().when('serviceType', {
    //             is: 'additions',
    //             then: Yup.string().required('نوع الإضافة مطلوب للإضافات'),
    //         }),

    //         washScope: Yup.string().when('additionType', {
    //             is: (additionType: string) =>
    //                 additionType === 'detailed_wash' ||
    //                 additionType === 'premium_wash',
    //             then: Yup.string().required('نطاق الغسيل مطلوب لخدمات الغسيل'),
    //         }),

    //         guarantee: Yup.object().shape({
    //             typeGuarantee: Yup.string(),
    //             startDate: Yup.string(),
    //             endDate: Yup.string(),
    //             terms: Yup.string(),
    //             Notes: Yup.string(),
    //         }),
    //     })
    // ),
})

type OrderServiceFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: (callback: any) => void
    onFormSubmit?: (
        formData: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => void
}

const DeleteServiceButton = ({ onDelete }: { onDelete: any }) => {
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
                حذف
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="حذف الخدمة"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>هل أنت متأكد أنك تريد حذف هذه الخدمة؟</p>
            </ConfirmDialog>
        </>
    )
}

const OrderServiceForm = forwardRef<FormikRef, OrderServiceFormProps>((props, ref) => {
    const {
        type,
        initialData = {
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
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    function removeEmptyFields(obj: any): any {
        if (Array.isArray(obj)) {
            return obj
                .map(removeEmptyFields)
                .filter((item) => item !== undefined && item !== null)
        } else if (typeof obj === 'object' && obj !== null) {
            const cleaned: any = {}
            for (const key in obj) {
                const value = removeEmptyFields(obj[key])
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    !(
                        typeof value === 'object' &&
                        Object.keys(value).length === 0
                    )
                ) {
                    cleaned[key] = value
                }
            }
            return cleaned
        }
        return obj
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
                    let data = cloneDeep(values)

                    // تحويل تواريخ الخدمة والضمان
                    data.services = data.services?.map((service: any) => {
                        if (service.serviceDate) {
                            service.serviceDate = new Date(
                                service.serviceDate
                            ).toISOString()
                        }
                        if (service.guarantee?.startDate) {
                            service.guarantee.startDate = new Date(
                                service.guarantee.startDate
                            ).toISOString()
                        }
                        if (service.guarantee?.endDate) {
                            service.guarantee.endDate = new Date(
                                service.guarantee.endDate
                            ).toISOString()
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

                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting, ...form }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <OrderServiceFields
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                    form={form}
                                />

                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && (
                                            <DeleteServiceButton
                                                onDelete={onDelete as any}
                                            />
                                        )}
                                    </div>

                                    <div className="md:flex items-center">
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={() => onDiscard?.()}
                                        >
                                            الغاء
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            {type === 'new' ? 'اضافة' : 'تحديث'}
                                        </Button>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
})

OrderServiceForm.displayName = 'OrderServiceForm'

export default OrderServiceForm