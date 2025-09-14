import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, Formik, FormikProps, FieldProps } from 'formik'
import { AiOutlineSave } from 'react-icons/ai'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import OrderServiceFields from './ClientServiceField'
import { HiOutlineTrash } from 'react-icons/hi'
import { apiSendServiceForOrder } from '@/services/OrdersService'
import { toast, Notification } from '@/components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { apiAddService } from '@/services/ServiceAPI'

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
    orderId: string
    services: Service[]
}

const initialData: InitialData = {
    orderId: '',
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
    orderId: Yup.string(),
    services: Yup.array().of(
        Yup.object().shape({
            serviceType: Yup.string()
            .oneOf(
                ['polish', 'protection', 'insulator', 'additions'],
                'اختر نوع خدمة صالح'
            ),
            dealDetails: Yup.string(),
            protectionFinish: Yup.string(),
            protectionSize: Yup.string(),
            protectionCoverage: Yup.string(),
            insulatorType: Yup.string(),
            insulatorCoverage: Yup.string(),
            polishType: Yup.string(),
            polishSubType: Yup.string(),
            additionType: Yup.string(),
            washScope: Yup.string(),
            guarantee: Yup.object().shape({
                typeGuarantee: Yup.string(),
                startDate: Yup.string(),
                endDate: Yup.string(),
                terms: Yup.string(),
                Notes: Yup.string(),
            }),
        })
    ),
})

type OrderServiceFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    clientId: string
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

const OrderServiceForm = forwardRef<FormikRef, OrderServiceFormProps>(
    (props, ref) => {
        const navigate = useNavigate()
        const { clientId } = useParams()

        const {
            type,
            initialData = {
                orderId: '',
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
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            // إنشاء نسخة عميقة من القيم
                            let data = cloneDeep(values)

                            const { clientSearch, ...dataWithoutClientSearch } =
                                data

                            // استخدام البيانات بدون حقل clientSearch
                            let data_with_empty_fields = dataWithoutClientSearch

                            console.log('111111111111111111111111',data_with_empty_fields);
                            

                            // تنظيف البيانات من الحقول الفارغة
                            data = removeEmptyFields(data_with_empty_fields)

                            console.log('111111111111111111111111',data);

                            // تحويل التواريخ إلى ISOString
                            if (data.services) {
                                data.services = data.services.map(
                                    (service: any) => ({
                                        ...service,
                                        serviceDate: service.serviceDate
                                            ? new Date(
                                                  service.serviceDate
                                              ).toISOString()
                                            : undefined,
                                        guarantee: service.guarantee
                                            ? {
                                                  ...service.guarantee,
                                                  startDate: service.guarantee
                                                      .startDate
                                                      ? new Date(
                                                            service.guarantee.startDate
                                                        ).toISOString()
                                                      : undefined,
                                                  endDate: service.guarantee
                                                      .endDate
                                                      ? new Date(
                                                            service.guarantee.endDate
                                                        ).toISOString()
                                                      : undefined,
                                              }
                                            : undefined,
                                    })
                                )
                            }

                            // إرسال البيانات إلى API
                            const response = await apiAddService(data.orderId, {
                                ...data,
                            })

                            if (response) {
                                toast.push(
                                    <Notification
                                        title="تم التحديث"
                                        type="success"
                                    >
                                        تم اضافة الخدمة بنجاح
                                    </Notification>
                                )
                                navigate(`home-page`)

                                if (onFormSubmit) {
                                    onFormSubmit(values, setSubmitting)
                                }
                            }
                        } catch (error) {
                            console.error('Failed to update services:', error)
                            // toast.push(
                            //     <Notification title="خطأ" type="danger">
                            //         فشل في تحميل الفاتورة
                            //     </Notification>
                            // )
                        }
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
                                                {type === 'new'
                                                    ? 'اضافة'
                                                    : 'تحديث'}
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
    }
)

OrderServiceForm.displayName = 'OrderServiceForm'

export default OrderServiceForm
