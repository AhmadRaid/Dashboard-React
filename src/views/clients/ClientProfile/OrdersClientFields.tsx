import AdaptableCard from '@/components/shared/AdaptableCard'
import { ClientWithOrdersData } from '@/@types/clients'
import { HiCheckCircle, HiPlusCircle, HiXCircle } from 'react-icons/hi'
import CreateGurentee from './CreateGurentee'
import { useState } from 'react'
import ChangeGuranteeStatusConfirmation from './ChangeGuranteeStatusConfirmation'
import GuaranteePdfExport from './GuaranteePdfExport'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui'
import { Button } from '@/components/ui'
import { FiInfo } from 'react-icons/fi'
import RatingAndNotesSection from '../ClientRating/RatingComponent'

const formatDate = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

type OrdersClientFieldsProps = {
    values: ClientWithOrdersData
    readOnly?: boolean
}

const OrdersClientFields = (props: OrdersClientFieldsProps) => {
    const [addGuaranteeDialogOpen, setAddGuaranteeDialogOpen] = useState(false)
    const [changeGuaranteeStatusDialog, setChangeGuaranteeStatusDialog] =
        useState<{
            open: boolean
            orderId?: string
            guaranteeId?: string
            status?: string
        }>({ open: false })

    const openChangeGuaranteeStatusDialog = (
        orderId?: string,
        guaranteeId?: string,
        status?: string
    ) => {
        setChangeGuaranteeStatusDialog({
            open: true,
            orderId,
            guaranteeId,
            status,
        })
    }

    const closeChangeGuaranteeStatusDialog = () => {
        setChangeGuaranteeStatusDialog((prev) => ({
            ...prev,
            open: false,
        }))
    }

    const { values, readOnly } = props

    // Merged Orders and Guarantees columns
    const ordersColumns: ColumnDef<any>[] = [
        { header: 'نوع السيارة', accessorKey: 'carType' },
        { header: 'موديل السيارة', accessorKey: 'carModel' },
        { header: 'لون السيارة', accessorKey: 'carColor' },
        {
            header: 'الخدمات',
            accessorKey: 'services',
            cell: (props) => {
                const services = props.row.original.services
                if (!services || services.length === 0) {
                    return (
                        <div className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-default py-1">
                            لا توجد خدمات لعرضها
                        </div>
                    )
                }
                return (
                    <div>
                        {services.map((service: any, index: number) => (
                            <div key={index}>
                                {service.serviceType === 'protection'
                                    ? 'حماية'
                                    : service.serviceType === 'polish'
                                    ? 'تلميع'
                                    : service.serviceType === 'insulator'
                                    ? 'عازل حراري'
                                    : service.serviceType === 'additions'
                                    ? 'اضافات'
                                    : service.serviceType}
                            </div>
                        ))}
                    </div>
                )
            },
        },
    ]

    return (
        <>
            <AdaptableCard divider className="mb-4 w-full">
                <h5 className="mb-4">معلومات العميل الأساسية</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            الاسم الكامل
                        </h6>
                        <p>
                            {values.firstName} {values.middleName}{' '}
                            {values.lastName}
                        </p>
                    </div>
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            البريد الإلكتروني
                        </h6>
                        <p>{values.email || '-'}</p>
                    </div>
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            رقم الهاتف
                        </h6>
                        <p>{values.phone || '-'}</p>
                    </div>
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            نوع العميل
                        </h6>
                        <p>
                            {values.clientType === 'individual'
                                ? 'فردي'
                                : 'شركة'}
                        </p>
                    </div>
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            تاريخ الإنشاء
                        </h6>
                        <p>{formatDate(values.createdAt)}</p>
                    </div>
                    <div className="border rounded p-4">
                        <h6 className="text-sm font-medium text-gray-500 mb-2">
                            إجمالي الطلبات
                        </h6>
                        <p>{values.orderStats?.totalOrders || 0}</p>
                    </div>
                    <RatingAndNotesSection values={values} readOnly={readOnly} />
                </div>

                <h5 className="mt-8 mb-4">الطلبات </h5>
                <DataTable
                    columns={ordersColumns}
                    data={values.orders || []}
                    disablePagination
                    disableSorting
                />
            </AdaptableCard>
            {/* 
            <CreateGurentee
                dialogIsOpen={addGuaranteeDialogOpen}
                setIsOpen={setAddGuaranteeDialogOpen}
                orderId={values.orders?.[0]?._id}
            />
            <ChangeGuranteeStatusConfirmation
                status={changeGuaranteeStatusDialog.status}
                orderId={changeGuaranteeStatusDialog.orderId}
                gId={changeGuaranteeStatusDialog.guaranteeId}
                dialogIsOpen={changeGuaranteeStatusDialog.open}
                closeDialog={closeChangeGuaranteeStatusDialog}
            /> */}
        </>
    )
}

export default OrdersClientFields
