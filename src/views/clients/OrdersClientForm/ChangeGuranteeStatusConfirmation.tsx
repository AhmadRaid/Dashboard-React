import { ConfirmDialog } from '@/components/shared'
import { apiChangeGurenteeStatus } from '@/services/ClientsService'
import React, { useState } from 'react'
import { getClientOrders, useAppDispatch } from '../ClientOrders/store'
import { Notification, toast } from '@/components/ui'
import { useParams } from 'react-router-dom'

interface ChangeGuranteeStatusConfirmationProps {
    dialogIsOpen: boolean
    closeDialog: () => void
    status: string | undefined
    orderId: string | undefined
    gId: string | undefined
}
const ChangeGuranteeStatusConfirmation = ({
    dialogIsOpen,
    closeDialog,
    status,
    orderId,
    gId,
}: ChangeGuranteeStatusConfirmationProps) => {
    console.log('status', status)

    const dispatch = useAppDispatch()
    const { clientId } = useParams()
    const [isLoading, setIsLoading] = useState(false)

    const onConfirmDialogClose = () => {
        closeDialog()
    }

    const handleConfirm = async (newStatus: string) => {
        setIsLoading(true)
        try {
            const success = await apiChangeGurenteeStatus(orderId, gId, {
                status: newStatus,
            })
            setIsLoading(false)

            if (success) {
                dispatch(getClientOrders(clientId))
                toast.push(
                    <Notification
                        title="تمت العملية بنجاح"
                        type="success"
                        duration={2500}
                    >
                        تم تحديث حالة الضمان بنجاح
                    </Notification>,
                    { placement: 'top-center' }
                )
                closeDialog()
            }
        } catch (error) {
            toast.push(
                <Notification title="حدث خطأ" type="danger" duration={2500}>
                    للاسف تم رفض الطلب! الرجاء المحاولة مرة اخرى
                </Notification>,
                { placement: 'top-center' }
            )
            setIsLoading(false)
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogIsOpen}
            type={status === 'active' ? 'danger' : 'success'}
            title={status === 'active' ? 'الغاء تفعيل' : 'تفعيل'}
            confirmButtonColor={status === 'active' ? 'red-600' : 'green-600'}
            isLoading={isLoading}
            cancelText="الغاء"
            confirmText={status === 'active' ? 'الغاء تفعيل' : 'تفعيل'}
            onRequestClose={onConfirmDialogClose}
            onClose={onConfirmDialogClose}
            onCancel={onConfirmDialogClose}
            onConfirm={() =>
                status === 'active'
                    ? handleConfirm('inactive')
                    : handleConfirm('active')
            }
        >
            <p>
                هل انت متاكد من انك تريد
                {status === 'active' ? ' الغاء تفعيل' : ' تفعيل'} هذا الضمان؟
            </p>
        </ConfirmDialog>
    )
}

export default ChangeGuranteeStatusConfirmation
