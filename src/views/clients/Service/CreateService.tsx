import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

import { apiCreateService } from '@/services/ClientsService'
import ServiceForm, { SetSubmitting } from './components/ServiceForm'

const CreateService = () => {
    const navigate = useNavigate()

    const addService = async (data: any) => {
        const response = await apiCreateService(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: any,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        try {
            const success = await addService(values)
            setSubmitting(false)
            if (success) {
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة الخدمة بنجاح
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
            <h3 className="text-2xl font-bold mb-5">انشاء خدمة</h3>
            <ServiceForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CreateService
