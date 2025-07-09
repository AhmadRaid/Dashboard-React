import AdaptableCard from '@/components/shared/AdaptableCard'
import { ClientWithOrdersData } from '@/@types/clients'
import { useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import { Button } from '@/components/ui'
import { FiDownload, FiInfo } from 'react-icons/fi'
import RatingAndNotesSection from '../ClientRating/RatingComponent'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useAppSelector } from '@/store'
import { apiGetInvoiceByOrderId } from '@/services/invoiceService'
import InvoicePDF from '@/views/invoices/PDF/InvoicePDF'
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer'
import { createRoot } from 'react-dom/client'

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
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    const handleRowClick = (row: any) => {
        console.log('row data', row)
        navigate(`/orders/${row.original._id}`)
    }

    const handleDownloadGuarantee = (orderId: string) => {
        console.log('Download guarantee for order:', orderId)
        // هنا يمكنك استدعاء API لتحميل ضمان PDF
    }

    // عدل دالة handleDownloadInvoice كما يلي:
    const handleDownloadInvoice = async (orderId: string) => {
        try {
            const response = await apiGetInvoiceByOrderId(orderId)

            if (response.data.data) {
                const invoiceData = response.data.data

                // Create a temporary container
                const container = document.createElement('div')
                document.body.appendChild(container)

                // Create root and render the BlobProvider
                const root = createRoot(container)

                root.render(
                    <BlobProvider
                        document={<InvoicePDF invoice={invoiceData} />}
                    >
                        {({ blob, url, loading, error }) => {
                            if (blob && !loading) {
                                // Create download link
                                const downloadLink = document.createElement('a')
                                downloadLink.href = url || ''
                                downloadLink.download = `فاتورة_${invoiceData.invoiceNumber}.pdf`
                                document.body.appendChild(downloadLink)
                                downloadLink.click()

                                // Clean up
                                setTimeout(() => {
                                    document.body.removeChild(downloadLink)
                                    root.unmount()
                                    document.body.removeChild(container)
                                }, 100)
                            }
                            return null
                        }}
                    </BlobProvider>
                )
            }
        } catch (error) {
            console.error('Error downloading invoice:', error)
            toast.push(
                <Notification title="خطأ" type="danger">
                    فشل في تحميل الفاتورة
                </Notification>
            )
        }
    }
    const handleDownloadReceipt = (orderId: string) => {
        console.log('Download receipt for order:', orderId)
        // هنا يمكنك استدعاء API لتحميل استلام السيارة PDF
    }

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
                    <div className="space-y-2">
                        {services.map((service: any, index: number) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center">
                                    <span className="font-medium">
                                        {service.serviceType === 'protection'
                                            ? 'حماية'
                                            : service.serviceType === 'polish'
                                            ? 'تلميع'
                                            : service.serviceType ===
                                              'insulator'
                                            ? 'عازل حراري'
                                            : service.serviceType ===
                                              'additions'
                                            ? 'إضافات'
                                            : service.serviceType}
                                    </span>
                                </div>
                                {index < services.length - 1 && (
                                    <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-1"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )
            },
        },
        {
            header: 'العمليات',
            accessorKey: 'actions',
            cell: (props) => {
                const order = props.row.original
                return (
                    <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                        <Button
                            type="button" // Add this
                            size="xs"
                            variant="solid"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadInvoice(order._id)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            icon={<FiDownload />}
                        >
                            تصدير فاتورة
                        </Button>
                        <Button
                            size="xs"
                            variant="solid"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadGuarantee(order._id)
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            تصدير ضمان
                        </Button>
                        <Button
                            size="xs"
                            variant="solid"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadReceipt(order._id)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            استلام سيارة
                        </Button>
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
                    <RatingAndNotesSection
                        values={values}
                        readOnly={readOnly}
                    />
                </div>

                <h5 className="mt-8 mb-4">الطلبات </h5>
                <DataTable
                    columns={ordersColumns}
                    data={values.orders || []}
                    onRowClick={handleRowClick}
                />
            </AdaptableCard>
        </>
    )
}

export default OrdersClientFields
