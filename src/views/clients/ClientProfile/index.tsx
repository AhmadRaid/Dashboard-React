import { forwardRef, useState } from 'react'
// import { FormContainer } from '@/components/ui/Form' // سنقوم بإزالة هذا الاستيراد إذا لم نعد نستخدمه
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import {
    AiOutlineSave,
    AiOutlinePlus,
    AiOutlineSync,
    AiOutlineFileText,
    AiOutlineStar,
    AiOutlineShoppingCart,
} from 'react-icons/ai'
import * as Yup from 'yup'
import OrdersClientFields from './OrdersClientFields'
import { ClientWithOrdersData } from '@/@types/clients'
import { useParams } from 'react-router-dom'
import { ClientOrdersTools } from '../ClientOrders/components/ClientOrdersTools'
import { apiDeleteOrder } from '@/services/OrdersService'
import { toast, Notification } from '@/components/ui'
// import Container from '@/components/shared/Container' // سنقوم بإزالة هذا الاستيراد إذا لم نعد نستخدمه

export const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required').min(2).max(100),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string()
        .required('Phone is required')
        .matches(/^\+?[0-9]{7,15}$/, 'Phone must be a valid number'),
    clientType: Yup.string().oneOf(['فرد', 'شركة', 'مسوق']).required(),
    rating: Yup.number()
        .min(1, 'التقييم يجب أن يكون بين 1 و 5')
        .max(5, 'التقييم يجب أن يكون بين 1 و 5')
        .optional(),
    notes: Yup.string()
        .max(500, 'الملاحظة يجب أن تكون أقل من 500 حرف')
        .optional(),
    orders: Yup.array().of(
        Yup.object().shape({
            carModel: Yup.string().required().max(50),
            carColor: Yup.string().required().max(30),
            service: Yup.string().required().max(100),
            guarantee: Yup.array().of(
                Yup.object().shape({
                    products: Yup.array()
                        .of(Yup.string().required())
                        .min(1)
                        .required(),
                    typeGuarantee: Yup.string().required().max(50),
                    startDate: Yup.string()
                        .required()
                        .matches(/^\d{4}-\d{2}-\d{2}$/),
                    endDate: Yup.string()
                        .required()
                        .matches(/^\d{4}-\d{2}-\d{2}$/)
                        .test(
                            'is-after-start-date',
                            'End Date cannot be before Start Date',
                            function (value) {
                                const { startDate } = this.parent
                                return (
                                    !startDate ||
                                    !value ||
                                    new Date(value) >= new Date(startDate)
                                )
                            }
                        ),
                    terms: Yup.string().required().max(200),
                    coveredComponents: Yup.array()
                        .of(Yup.string().required())
                        .min(1)
                        .required(),
                })
            ),
        })
    ),
})

type SetSubmitting = (isSubmitting: boolean) => void
type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>
type OnDelete = (callback: OnDeleteCallback) => void

type OrdersClientFormProps = {
    initialData?: ClientWithOrdersData
    type: 'edit' | 'view'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit?: (
        formData: ClientWithOrdersData,
        setSubmitting: SetSubmitting
    ) => void
}

const OrdersClientForm = forwardRef<
    FormikProps<ClientWithOrdersData>,
    OrdersClientFormProps
>(({ type, initialData, onFormSubmit, onDiscard, onDelete }, ref) => {
    const navigate = useNavigate()
    const readOnly = type === 'view'
    const [orders, setOrders] = useState(initialData?.orders || [])
    const handleDeleteOrder = async (orderId: string) => {
        try {
            await apiDeleteOrder(orderId)

            setOrders((prevOrders) =>
                prevOrders.filter((order) => order._id !== orderId)
            )

            toast.push(
                <Notification title="نجاح" type="success">
                    تم حذف الطلب بنجاح
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="خطأ" type="danger">
                    فشل في حذف الطلب
                </Notification>
            )
        }
    }

    const handleEditOrder = (orderId: string) => {
        if (!orderId) {
            console.error('Client ID is missing')
            return
        }
        navigate(`/orders/UpdateOrder/${orderId}`)
    }

    const initialValues = cloneDeep(
        initialData ?? {
            _id: '',
            clientNumber: '',
            fullName: '',
            email: '',
            phone: '',
            rating: 0,
            notes: '',
            clientType: 'فرد',
            isDeleted: false,
            orderStats: {
                totalOrders: 0,
                activeGuarantees: 0,
            },
            orders: [
                {
                    carModel: '',
                    carColor: '',
                    service: '',
                    guarantee: [
                        {
                            products: [],
                            typeGuarantee: '',
                            startDate: '',
                            endDate: '',
                            terms: '',
                            coveredComponents: [],
                        },
                    ],
                },
            ],
        }
    )

    const { clientId } = useParams<{ clientId: string }>()

    const navigateToAddService = () => {
        if (!clientId) {
            console.error('Client ID is missing')
            return
        }
        navigate(`/orders/add-service/${clientId}`)
    }

    const navigateToUpdateProfile = () => {
        if (!clientId) {
            console.error('Client ID is missing')
            return
        }
        navigate(`/clients/${clientId}/updateProfile`)
    }

    const navigateToFinancialReports = () => {
        if (!clientId) {
            console.error('Client ID is missing for financial reports')
            return
        }
        navigate(`/invoices/financial-reports/${clientId}`)
    }

    const navigateToCustomerRating = () => {
        if (!clientId) {
            console.error('Client ID is missing for customer rating')
            return
        }
        navigate(`/clients/${clientId}/UpdateRating`)
    }

    const navigateToAddFullOrder = () => {
        if (!clientId) {
            console.error('Client ID is missing')
            return
        }
        navigate(`/orders/add-order/${clientId}`)
    }

    return (
        <Formik
            innerRef={ref}
            enableReinitialize
            initialValues={{
                ...initialValues,
                orders,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                const data = cloneDeep(values)
                data.orders.forEach((order) => {
                    order.guarantee.forEach((g) => {
                        // Ensure dates are saved in ISO format
                        g.startDate = new Date(g.startDate).toISOString()
                        g.endDate = new Date(g.endDate).toISOString()
                    })
                })
                onFormSubmit?.(data, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting }) => (
                <Form>
                    {/* تمت إزالة Container و FormContainer و Grid Layout */}
                    {/* والآن يتم عرض المحتوى مباشرة داخل الـ Form */}
                    <ClientOrdersTools clientNumber={values.clientNumber} />

                    <div className="mb-6 flex flex-wrap gap-3 justify-end md:justify-start">
                        {/* "Add New Order" button */}
                        <Button
                            type="button"
                            variant="solid"
                            icon={<AiOutlineShoppingCart className="text-lg" />}
                            onClick={navigateToAddFullOrder}
                            className="bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            size="sm"
                        >
                            <span className="flex items-center gap-2">
                                إضافة طلب{' '}
                                <span className="bg-white/20 rounded-full px-2 py-1 text-xs">
                                    جديد
                                </span>
                            </span>
                        </Button>

                        {/* "Add New Service" button */}
                        <Button
                            type="button"
                            variant="solid"
                            icon={<AiOutlinePlus className="text-lg" />}
                            onClick={navigateToAddService}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            size="sm"
                        >
                            <span className="flex items-center gap-2">
                                إضافة خدمة{' '}
                                <span className="bg-white/20 rounded-full px-2 py-1 text-xs">
                                    جديدة
                                </span>
                            </span>
                        </Button>

                        {/* "Update/Inquire" button */}
                        <Button
                            type="button"
                            variant="twoTone"
                            icon={<AiOutlineSync className="text-lg" />}
                            onClick={navigateToUpdateProfile}
                            className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
                            size="sm"
                        >
                            تحديث/استفسار
                        </Button>

                        {/* "Financial Reports" button */}
                        <Button
                            type="button"
                            variant="twoTone"
                            icon={<AiOutlineFileText className="text-lg" />}
                            onClick={navigateToFinancialReports}
                            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 shadow-sm hover:shadow-md transition-all duration-300"
                            size="sm"
                        >
                            التقارير المالية
                        </Button>

                        {/* "Customer Rating" button */}
                        <Button
                            type="button"
                            variant="solid"
                            icon={<AiOutlineStar className="text-lg" />}
                            onClick={navigateToCustomerRating}
                            className="bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                            size="sm"
                        >
                            <span className="flex items-center gap-1">
                                تقييم العميل{' '}
                                <span className="text-yellow-200">★★★★★</span>
                            </span>
                        </Button>
                    </div>

                    <OrdersClientFields
                        touched={touched}
                        errors={errors}
                        values={{
                            ...values,
                            orders, // تمرير حالة الطلبات المحلية
                        }}
                        onDeleteOrder={handleDeleteOrder}
                        onEditOrder={handleEditOrder}
                        readOnly={readOnly}
                    />

                    {!readOnly && (
                        <StickyFooter
                            className="-mx-8 px-8 flex items-center justify-between py-4"
                            stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                            <div className="md:flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    onClick={() => onDiscard?.()}
                                >
                                    إلغاء
                                </Button>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    loading={isSubmitting}
                                    icon={<AiOutlineSave />}
                                    type="submit"
                                >
                                    حفظ التغييرات
                                </Button>
                            </div>
                        </StickyFooter>
                    )}
                </Form>
            )}
        </Formik>
    )
})

OrdersClientForm.displayName = 'OrdersClientForm'

export default OrdersClientForm
