import toast from '@/components/ui/toast'
import { useNavigate } from 'react-router-dom'

import { apiAddNewCar } from '@/services/CarsService'
import CarForm from '../CarForm/CarForm'

const CreateCar = () => {
    const navigate = useNavigate()

    const addNewCar = async (data: any) => {
        const response = await apiAddNewCar(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: any,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        try {
            const success = await addNewCar(values)
            setSubmitting(false)
            if (success) {
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة سيارة بنجاح
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
                    title="للاسف تم رفض اضافة سيارة! الرجاء المحاولة مرة اخرى"
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
