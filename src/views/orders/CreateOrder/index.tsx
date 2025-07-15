import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'

import { apiCreateNewClient } from '@/services/ClientsService'
import { apiAddOrder } from '@/services/OrdersService'
import OrderForm from '../OrderForm/OrderForm'

const CreateOrder = () => {
    const navigate = useNavigate()
    const { clientId } = useParams()

    const addOrder = async (data: any) => {
        if (!clientId) {
            toast.push(
                <Notification title="خطأ" type="danger">
                    معرف العميل غير صالح
                </Notification>
            )
            return
        }
        const response = await apiAddOrder(clientId, data)
        return response.data
    }

    const handleFormSubmit = async (values: any, setSubmitting: any) => {
        setSubmitting(true)
        try {
            const success = await addOrder(values)
            setSubmitting(false)
            if (success) {
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة الطلب بنجاح
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/clients')
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
        navigate('/clients')
    }

    return (
        <>
            <h3 className="text-2xl font-bold mb-5">انشاء عميل</h3>
            <OrderForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CreateOrder
