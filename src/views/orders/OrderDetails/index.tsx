import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Order } from '@/@types/order'
import { apiGetOrdersDetails } from '@/services/OrdersService'
import { Button } from '@/components/ui'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import OrderFields from '../OrderForm/OrderFields'
import { FiAlertCircle, FiLoader, FiRefreshCw } from 'react-icons/fi'

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
                <AddOrder
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

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        معلومات إضافية للطلب
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                تاريخ الإنشاء
                            </h3>
                            <p>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">
                                حالة الطلب
                            </h3>
                            <p>{order.status}</p>
                        </div>
                    </div>
                </div>
            </AdaptableCard>
        </div>
    )
}

export default OrderDetails
