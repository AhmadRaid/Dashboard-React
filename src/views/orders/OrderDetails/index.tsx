import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Order } from '@/@types/order'
import { apiGetOrdersDetails } from '@/services/OrdersService'
import { Button } from '@/components/ui'
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
} from 'react-icons/fi'
import ShowOrderFields from './ShowOrderField'

const OrderDetails = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)

        const fetchOrderDetails = async () => {
            try {
                const response = await apiGetOrdersDetails(orderId)
                setOrder(response.data.data)
            } catch (error) {
                console.error('Failed to fetch order details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderDetails()
    }, [orderId])

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
                </div>
            )
        }

        return null
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold mb-1">
                    تفاصيل طلب
                    {order.orderNumber && (
                        <span className="mr-2 text-indigo-600 dark:text-indigo-400 text-xl">
                            #{order.orderNumber}
                        </span>
                    )}
                </h3>
            </div>

            <AdaptableCard>
                <ShowOrderFields
                    values={{
                        carModel: order.carModel,
                        carColor: order.carColor,
                        branch: order.branch,
                        carPlateNumber: order.carPlateNumber,
                        carManufacturer: order.carManufacturer,
                        carSize: order.carSize,
                        carType: order.carType,
                        services: order.services.map((service) => ({
                            ...service,
                            guarantee: service.guarantee || null,
                        })),
                    }}
                    touched={{}}
                    errors={{}}
                    readOnly={true}
                />

                {/* التفاصيل المالية المحسّنة */}
                {order.invoice && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <FiDollarSign className="text-indigo-600" />
                            التفاصيل المالية
                        </h2>
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            {/* بطاقات المؤشرات المالية الرئيسية */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* إجمالي المبلغ المدفوع */}
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

                                {/* المبلغ قبل الضريبة */}
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

                                {/* قيمة الضريبة */}
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

                                {/* حالة الفاتورة */}
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

                            {/* تفاصيل إضافية للفوترة */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    تفاصيل الفاتورة
                                </h3>
                                <div className="space-y-4">
                                    {/* رقم الفاتورة */}
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FiFileText className="text-indigo-500" />
                                            رقم الفاتورة:
                                        </span>
                                        <span className="font-medium text-gray-800">
                                            {order.invoice.invoiceNumber}
                                        </span>
                                    </div>

                                    {/* تاريخ الفاتورة بالميلادي والهجري */}
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <FiCalendar className="text-indigo-500" />
                                            تاريخ الفاتورة:
                                        </span>
                                        <div className="flex flex-col items-end">
                                            {/* التاريخ الميلادي */}
                                            <span className="font-medium text-gray-800">
                                                {new Date(
                                                    order.invoice.invoiceDate
                                                ).toLocaleDateString('EN-US')}
                                            </span>
                                            {/* التاريخ الهجري */}
                                            <span className="text-sm text-gray-500 mt-1">
                                                {new Date(
                                                    order.invoice.invoiceDate
                                                ).toLocaleDateString('ar-SA', {
                                                    calendar:
                                                        'islamic-umalqura',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ملاحظات الفاتورة */}
                                    {order.invoice.notes && (
                                        <div className="flex justify-between items-start pb-2">
                                            <span className="text-gray-600 flex items-center gap-2">
                                                <FiInfo className="text-indigo-500" />
                                                ملاحظات:
                                            </span>
                                            <p className="text-gray-800 max-w-sm text-right">
                                                {order.invoice.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* معلومات إضافية للطلب */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FiInfo className="text-xl text-indigo-600" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            معلومات إضافية للطلب
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* تاريخ الإنشاء */}
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                تاريخ الإنشاء
                            </h3>
                            <p className="text-lg font-medium text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString(
                                    'ar-SA',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </p>
                        </div>

                        {/* حالة الطلب */}
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                حالة الطلب
                            </h3>
                            <span
                                className={`inline-block px-4 py-1 rounded-full text-white font-semibold ${
                                    order.status === 'مكتمل'
                                        ? 'bg-green-500'
                                        : order.status === 'قيد المعالجة'
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
            </AdaptableCard>
        </div>
    )
}

export default OrderDetails
