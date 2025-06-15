import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import CreateGuranteeForm from './CreateGuranteeForm'
import { Notification, toast } from '@/components/ui'
import { apiCreateOrderGurentee } from '@/services/ClientsService'
import { getClientOrders, useAppDispatch } from '../ClientOrders/store'
import { useParams } from 'react-router-dom'

interface CreateGuaranteeProps {
    dialogIsOpen: boolean
    orderId: string | undefined
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateGurentee = ({
    dialogIsOpen,
    setIsOpen,
    orderId,
}: CreateGuaranteeProps) => {
    const { clientId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const handleDiscard = () => {
        onDialogClose()
    }

    const handleFormSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        setIsLoading(true)

        try {
            const success = await apiCreateOrderGurentee(orderId, values)

            setSubmitting(false)
            setIsLoading(false)

            if (success) {
                dispatch(getClientOrders(clientId))
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة الضمان بنجاح
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                onDialogClose()
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
            setIsLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
        >
            <div className="flex flex-col  justify-between">
                <h5 className="mb-4">اضافة ضمان</h5>
                <CreateGuranteeForm
                    isLoading={isLoading}
                    type="add"
                    orderId={orderId}
                    onFormSubmit={handleFormSubmit}
                    onDiscard={handleDiscard}
                />
            </div>
        </Dialog>
    )
}

export default CreateGurentee
