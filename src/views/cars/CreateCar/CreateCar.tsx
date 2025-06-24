import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

import CarForm, { SetSubmitting } from '../CarForm/CarForm'
import { apiCreateNewCar } from '@/services/CarsService'

const CreateCar = () => {
    const navigate = useNavigate()

    const addCar = async (data: any) => {
        const response = await apiCreateNewCar(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: any,
        setSubmitting: SetSubmitting
    ) => {
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
                        تم اضافة السيارة بنجاح
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/cars')
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
        navigate('/cars')
    }

    return (
        <>
            <h3 className="text-2xl font-bold mb-5">إضافة سيارة جديدة</h3>
            <CarForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CreateCar