import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'

import { apiCreateNewClient } from '@/services/ClientsService'
import { apiAddOrder } from '@/services/OrdersService'
import { apiAddNewCar } from '@/services/CarsService'
import CarForm from '../CarForm/CarForm'

const CreateCar = () => {
    const navigate = useNavigate()

    const addCar = async (data: any) => {

        const response = await apiAddNewCar(data)
        return response.data
    }

    const handleFormSubmit = async (values: any, setSubmitting: any) => {
        setSubmitting(true)
        try {
            const success = await addCar(values)
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
                navigate(`/cars`)
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
            <h3 className="text-2xl font-bold mb-5">اضافة سيارة</h3>
            <CarForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CreateCar
