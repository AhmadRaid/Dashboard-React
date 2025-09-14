import { useEffect, useState } from 'react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'

import OrderForm from '../OrderForm/OrderForm'
import { InitialData } from '../OrderForm/OrderForm'
import { apiGetOrdersDetails, apiUpdateOrder } from '@/services/OrdersService'

const EditOrder = () => {
    const navigate = useNavigate()
    const { clientId, orderId } = useParams()
    const [loading, setLoading] = useState(true)
    const [initialData, setInitialData] = useState<InitialData | null>(null)

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!orderId) {
                toast.push(
                    <Notification title="خطأ" type="danger">
                        معرف الطلب غير صالح
                    </Notification>
                )
                navigate('/clients') 
                return
            }
            setLoading(true)
            try {
                const response = await apiGetOrdersDetails(orderId) 
                if (response.data) {
                    const orderData = response.data.data 
                    setInitialData({
                        carModel: orderData.carModel || '',
                        carColor: orderData.carColor || '',
                        branch: orderData.branch || '',
                        carPlateNumber: orderData.carPlateNumber || '',
                        carManufacturer: orderData.carManufacturer || '',
                        carSize: orderData.carSize || '',
                        orderStatus: orderData.status || 'new',
                        services: orderData.services || [],
                    })
                } else {
                    toast.push(
                        <Notification title="خطأ" type="danger">
                            فشل في جلب بيانات الطلب
                        </Notification>
                    )
                    navigate(`/clients`)
                }
            } catch (error) {
                console.error('Failed to fetch order data:', error)
                toast.push(
                    <Notification title="خطأ" type="danger">
                        حدث خطأ أثناء جلب بيانات الطلب
                    </Notification>
                )
                navigate(`/clients/${clientId}`)
            } finally {
                setLoading(false)
            }
        }

        fetchOrderData()
    }, [orderId, clientId, navigate])

    const updateOrder = async (data: InitialData) => {
        if (!orderId) {
            toast.push(
                <Notification title="خطأ" type="danger">
                    معرف الطلب غير صالح
                </Notification>
            )
            return false
        }
        const response = await apiUpdateOrder(orderId, data) 
        return response.data
    }

    const handleFormSubmit = async (
        values: InitialData,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const success = await updateOrder(values)
            setSubmitting(false)
            if (success) {
                toast.push(
                    <Notification
                        title="نجح التعديل"
                        type="success"
                        duration={2500}
                    >
                        تم تعديل الطلب بنجاح
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate(`/clients`)
            }
        } catch (error) {
            toast.push(
                <Notification
                    title="للاسف تم رفض الطلب! الرجاء المحاولة مرة اخرى"
                    type="danger"
                    duration={2500}
                />,
                {
                    placement: 'top-center',
                }
            )
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate(`/clients/${clientId}`)
    }

    return (
        <>
            <h3 className="text-2xl font-bold mb-5">تعديل الطلب</h3>
            {loading ? (
                <div>جارٍ تحميل بيانات الطلب...</div>
            ) : (
                <OrderForm
                    type="edit"
                    initialData={initialData as InitialData}
                    onFormSubmit={handleFormSubmit}
                    onDiscard={handleDiscard}
                    onDelete={() =>
                        console.log('Delete functionality for order')
                    }
                />
            )}
        </>
    )
}

export default EditOrder