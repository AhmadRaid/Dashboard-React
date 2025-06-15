import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

import { apiCreateNewClient } from '@/services/ClientsService'
import ClientForm, { SetSubmitting } from '../ClientForm/ClientForm'

const CreateClient = () => {
    const navigate = useNavigate()

    const addProject = async (data: any) => {
        const response = await apiCreateNewClient(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: any,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        try {
            const success = await addProject(values)
            setSubmitting(false)
            if (success) {
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة العميل بنجاح
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
            <ClientForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default CreateClient
