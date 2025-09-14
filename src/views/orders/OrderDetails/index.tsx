import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Order } from '@/@types/order'
import {
    apiGetOrdersDetails,
    apiChangeGurenteeStatus,
} from '@/services/OrdersService'
import { Button, toast } from '@/components/ui'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import {
    FiAlertCircle,
    FiLoader,
    FiRefreshCw,
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiPercent,
    FiTag,
    FiInfo,
    FiCheckCircle,
    FiXCircle,
    FiShield,
} from 'react-icons/fi'
import ShowOrderFields from './ShowOrderField'

const OrderDetails = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [activatingGuarantee, setActivatingGuarantee] = useState<
        string | null
    >(null)
    const [deactivatingGuarantee, setDeactivatingGuarantee] = useState<
        string | null
    >(null)
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchOrderDetails()
    }, [orderId])

    const fetchOrderDetails = async () => {
        try {
            setLoading(true)
            const response = await apiGetOrdersDetails(orderId)
            setOrder(response.data.data)
        } catch (error) {
            console.error('Failed to fetch order details:', error)
            toast.push(
                <Notification title="نجاح" type="error">
                    فشل في تحميل تفاصيل الطلب'
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    // In OrderDetails component, update the function calls to pass both serviceId and guaranteeId
    // In OrderDetails component
    const handleActivateGuarantee = async (
        serviceId: string,
        guaranteeId: string
    ) => {
        if (!orderId || !order) return
        try {
            setActivatingGuarantee(guaranteeId)
            await apiChangeGurenteeStatus(orderId, serviceId, guaranteeId, {
                status: 'active',
            })
            toast.push(
                <Notification title="نجاح" type="success">
                    تم تفعيل الضمان بنجاح'
                </Notification>
            )
            // Update the order state directly
            setOrder((prevOrder) => {
                if (!prevOrder) return null
                const updatedServices = prevOrder.services.map((service) => {
                    if (service._id === serviceId && service.guarantee) {
                        return {
                            ...service,
                            guarantee: {
                                ...service.guarantee,
                                status: 'active',
                            },
                        }
                    }
                    return service
                })
                return { ...prevOrder, services: updatedServices }
            })
        } catch (error) {
            console.error('Failed to activate guarantee:', error)
            toast.push(
                <Notification title="فشل" type="error">
                    فشل في تفعيل الضمان'
                </Notification>
            )
        } finally {
            setActivatingGuarantee(null)
        }
    }

    const handleDeactivateGuarantee = async (
        serviceId: string,
        guaranteeId: string
    ) => {
        if (!orderId || !order) return
        try {
            setDeactivatingGuarantee(guaranteeId)
            await apiChangeGurenteeStatus(orderId, serviceId, guaranteeId, {
                status: 'inactive',
            })
            toast.push(
                <Notification title="نجاح" type="success">
                    تم إلغاء تفعيل الضمان بنجاح'
                </Notification>
            )

            // Update the order state directly
            setOrder((prevOrder) => {
                if (!prevOrder) return null
                const updatedServices = prevOrder.services.map((service) => {
                    if (service._id === serviceId && service.guarantee) {
                        return {
                            ...service,
                            guarantee: {
                                ...service.guarantee,
                                status: 'inactive',
                            },
                        }
                    }
                    return service
                })
                return { ...prevOrder, services: updatedServices }
            })
        } catch (error) {
            console.error('Failed to deactivate guarantee:', error)
            toast.push(
                <Notification title="فشل" type="error">
                    فشل في إلغاء تفعيل الضمان'
                </Notification>
            )
        } finally {
            setDeactivatingGuarantee(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <FiLoader className="animate-spin text-3xl text-black" />
                <p className="text-gray-700 text-lg">
                    جاري جلب بيانات الطلب...
                </p>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 p-8 bg-rose-50 rounded-xl">
                <FiAlertCircle className="text-5xl text-rose-500" />
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        خطأ في تحميل الطلب
                    </h3>
                    <p className="text-gray-600 max-w-md">
                        تعذر العثور على الطلب المطلوب. قد يكون الرابط خاطئاً أو
                        تم حذف الطلب.
                    </p>
                </div>
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
                    onClick={() => window.location.reload()}
                >
                    <FiRefreshCw />
                    <span>إعادة المحاولة</span>
                </button>
            </div>
        )
    }

    // دالة مساعدة لعرض بيانات الضمان بشكل صحيح
    const renderGuaranteeInfo = (guarantee) => {
        if (!guarantee) return null

        if (typeof guarantee === 'string') {
            return (
                <p className="text-xs text-gray-500 mt-1">ضمان: {guarantee}</p>
            )
        }

        if (typeof guarantee === 'object') {
            return (
                <div className="text-xs text-gray-500 mt-1">
                    <p>ضمان: {guarantee.typeGuarantee || 'ضمان قياسي'}</p>
                    {guarantee.startDate && (
                        <p>
                            يبدأ:{' '}
                            {new Date(guarantee.startDate).toLocaleDateString(
                                'ar-SA'
                            )}
                        </p>
                    )}
                    {guarantee.endDate && (
                        <p>
                            ينتهي:{' '}
                            {new Date(guarantee.endDate).toLocaleDateString(
                                'ar-SA'
                            )}
                        </p>
                    )}
                    {guarantee.isActive !== undefined && (
                        <p
                            className={`font-semibold ${
                                guarantee.isActive
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            الحالة: {guarantee.isActive ? 'مفعل' : 'غير مفعل'}
                        </p>
                    )}
                </div>
            )
        }

        return null
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">
                    تفاصيل الطلب
                    {order.orderNumber && (
                        <span className="mr-2 text-indigo-600 dark:text-indigo-400 text-xl font-medium">
                            #{order.orderNumber}
                        </span>
                    )}
                </h3>
            </div>

            <div className="space-y-10">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div class="bg-gradient-to-br from-gray-700 to-gray-500 rounded-t-lg p-6 mb-6 flex items-center shadow-md">
                        <div>
                            <h5 class="text-2xl font-bold text-white flex items-center gap-3">
                                <span>معلومات الطلب</span>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 24 24"
                                    className="text-2xl"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
                                </svg>
                            </h5>
                            <p class="text-gray-100 text-opacity-90">
                                تفاصيل الطلب ووقت الإنشاء
                            </p>
                        </div>
                    </div>
                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                تاريخ الإنشاء
                            </h3>
                            <p className="text-lg font-medium text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString(
                                    'en-GB',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }
                                )}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                حالة الطلب
                            </h3>
                            <span
                                className={`inline-block px-4 py-1 rounded-full text-white font-semibold ${
                                    order.status === 'طلب جديد'
                                        ? 'bg-green-500'
                                        : order.status === 'طلب صيانة'
                                        ? 'bg-yellow-500'
                                        : order.status === 'ملغي'
                                        ? 'bg-red-500'
                                        : 'bg-gray-500'
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* قسم معلومات السيارة والخدمات */}
                <ShowOrderFields
                    values={{
                        carModel: order.carModel,
                        carColor: order.carColor,
                        branch: order.branch,
                        carPlateNumber: order.carPlateNumber,
                        carManufacturer: order.carManufacturer,
                        carSize: order.carSize,
                        services: order.services.map((service) => ({
                            ...service,
                            guarantee: service.guarantee || null,
                            _id: service._id,
                        })),
                    }}
                    touched={{}}
                    errors={{}}
                    readOnly={true}
                    onActivateGuarantee={handleActivateGuarantee}
                    onDeactivateGuarantee={handleDeactivateGuarantee}
                    activatingGuarantee={activatingGuarantee}
                    deactivatingGuarantee={deactivatingGuarantee}
                />

                {/* قسم التفاصيل المالية */}
                {order.invoice && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div class="bg-gradient-to-br from-gray-700 to-gray-500 rounded-t-lg p-6 mb-6 flex items-center shadow-md">
                            <div>
                                <h5 class="text-2xl font-bold text-white flex items-center gap-3">
                                    <span>التفاصيل المالية</span>
                                    <FiDollarSign className="text-3xl" />
                                </h5>
                                <p class="text-gray-100 text-opacity-90">
                                    تفاصيل السيارة الأساسية والمعلومات الفنية
                                    لطلب الخدمة.
                                </p>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl">
                                    <div className="bg-green-100 p-3 rounded-full mb-3">
                                        <FiDollarSign className="text-green-600 text-2xl" />
                                    </div>
                                    <span className="text-sm text-green-700 font-semibold mb-1">
                                        إجمالي المبلغ
                                    </span>
                                    <span className="text-2xl font-bold text-green-800">
                                        {order.invoice.totalAmount.toFixed(2)}{' '}
                                        ر.س
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl">
                                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                                        <FiTag className="text-blue-600 text-2xl" />
                                    </div>
                                    <span className="text-sm text-blue-700 font-semibold mb-1">
                                        المبلغ قبل الضريبة
                                    </span>
                                    <span className="text-2xl font-bold text-blue-800">
                                        {order.invoice.subtotal.toFixed(2)} ر.س
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl">
                                    <div className="bg-red-100 p-3 rounded-full mb-3">
                                        <FiPercent className="text-red-600 text-2xl" />
                                    </div>
                                    <span className="text-sm text-red-700 font-semibold mb-1">
                                        قيمة الضريبة ({order.invoice.taxRate}%)
                                    </span>
                                    <span className="text-2xl font-bold text-red-800">
                                        {order.invoice.taxAmount.toFixed(2)} ر.س
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl">
                                    <div className="bg-yellow-100 p-3 rounded-full mb-3">
                                        <FiFileText className="text-yellow-600 text-2xl" />
                                    </div>
                                    <span className="text-sm text-yellow-700 font-semibold mb-1">
                                        حالة الفاتورة
                                    </span>
                                    <span className="text-2xl font-bold text-yellow-800">
                                        {order.invoice.status || 'مدفوعة'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    تفاصيل إضافية
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FiFileText className="text-indigo-500" />
                                            رقم الفاتورة:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {order.invoice.invoiceNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FiCalendar className="text-indigo-500" />
                                            تاريخ الفاتورة:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                                {order.invoice.notes && (
                                    <div className="mt-4">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FiInfo className="text-indigo-500" />
                                            ملاحظات:
                                        </span>
                                        <p className="text-gray-800 mt-1">
                                            {order.invoice.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetails
