import AdaptableCard from '@/components/shared/AdaptableCard'
import { ClientWithOrdersData } from '@/@types/clients'
import { useState, useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import { Button, Spinner } from '@/components/ui'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/Popover'
import {
    FiDownload,
    FiTrash,
    FiFileText,
    FiBookOpen,
    FiPrinter,
    FiEdit,
} from 'react-icons/fi'
import RatingAndNotesSection from '../ClientRating/RatingComponent'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useAppSelector } from '@/store'
import { apiGetInvoiceByOrderId } from '@/services/invoiceService'
import InvoicePDF from '@/views/invoices/PDF/InvoicePDF'
import { BlobProvider } from '@react-pdf/renderer'
import { createRoot } from 'react-dom/client'
import type { FormikErrors, FormikTouched } from 'formik'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { HiOutlineTrash } from 'react-icons/hi'
import GuaranteePDF from '@/views/PDF/GuarantePDF'

// --- Helper Functions ---
const formatDate = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

// --- Component Props Type ---
export type OrdersClientFieldsProps = {
    values: ClientWithOrdersData
    touched: FormikTouched<ClientWithOrdersData>
    errors: FormikErrors<ClientWithOrdersData>
    readOnly?: boolean
    onDeleteOrder: (orderId: string) => void // Prop to trigger delete action
    onEditOrder: (orderId: string) => void
}

const DeleteOrderButton = ({
    onDelete,
}: {
    onDelete: (setDialogOpen: (open: boolean) => void) => void
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete(setDialogOpen)
    }

    return (
        <>
            <Button
                size="xs"
                variant="twoTone"
                color="red-600"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                حذف
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="حذف الطلب"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>هل أنت متأكد أنك تريد حذف هذا الطلب؟</p>
            </ConfirmDialog>
        </>
    )
}

// Helper function to transform order data to GuaranteeDocument format
const transformOrderToGuaranteeDoc = (order: any, client: any): any => {
    return {
        documentNumber: `G-${order.orderNumber}`,
        issueDate: new Date(),
        client: {
            firstName: client.firstName,
            middleName: client.middleName || '',
            lastName: client.lastName,
            clientNumber: client.clientNumber || `CL-${client._id}`,
            phone: client.phone,
            email: client.email,
        },
        order: {
            orderNumber: order.orderNumber,
            carType: order.carType,
            carModel: order.carModel,
            carColor: order.carColor,
            carPlateNumber: order.carPlateNumber,
            carManufacturer: order.carManufacturer,
            carSize: order.carSize,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            services: order.services.map((service: any) => ({
                id: service._id || `SVC-${Date.now()}`,
                serviceType: service.serviceType,
                dealDetails: service.dealDetails,
                protectionFinish: service.protectionFinish,
                protectionSize: service.protectionSize,
                protectionCoverage: service.protectionCoverage,
                originalCarColor: service.originalCarColor,
                protectionColor: service.protectionColor,
                insulatorType: service.insulatorType,
                insulatorCoverage: service.insulatorCoverage,
                polishType: service.polishType,
                polishSubType: service.polishSubType,
                externalPolishLevel: service.externalPolishLevel,
                internalPolishLevel: service.internalPolishLevel,
                internalAndExternalPolishLevel:
                    service.internalAndExternalPolishLevel,
                additionType: service.additionType,
                washScope: service.washScope,
                servicePrice: service.servicePrice,
                serviceDate: service.serviceDate,
                guarantee: {
                    id: service.guarantee?._id || `GUA-${Date.now()}`,
                    typeGuarantee: service.guarantee?.typeGuarantee || '1 سنة',
                    startDate: service.guarantee?.startDate || new Date(),
                    endDate:
                        service.guarantee?.endDate ||
                        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    terms: service.guarantee?.terms,
                    Notes: service.guarantee?.Notes,
                },
            })),
        },
    }
}

// --- Main Component ---
const OrdersClientFields = (props: OrdersClientFieldsProps) => {
    // --- State Management ---
    const [downloadLoadingOrderId, setDownloadLoadingOrderId] = useState<
        string | null
    >(null)
    const [downloadType, setDownloadType] = useState<string | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // --- Destructure Props ---
    const { values, readOnly, onDeleteOrder, onEditOrder } = props
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    // --- Handlers for Dialogs & Navigation ---
    const handleRowClick = (row: any) => {
        navigate(`/orders/${row.original._id}`)
    }

    // --- Document Download Handlers ---
    const handleStartDownload = async (
        event: React.MouseEvent,
        orderId: string,
        type: 'invoice' | 'guarantee' | 'receipt'
    ) => {
        if (downloadLoadingOrderId === orderId) return

        setDownloadLoadingOrderId(orderId)
        setDownloadType(type)

        toast.push(
            <Notification title="تصدير" type="info">
                جارٍ إعداد ملف{' '}
                {type === 'invoice'
                    ? 'الفاتورة'
                    : type === 'guarantee'
                    ? 'الضمان'
                    : 'إيصال السيارة'}{' '}
                للتنزيل...
            </Notification>
        )

        try {
            let responseData: any
            let fileName: string = ''
            let pdfComponent: JSX.Element | null = null

            if (type === 'invoice') {
                const response = await apiGetInvoiceByOrderId(orderId)
                responseData = response.data.data
                if (!responseData) throw new Error('Invoice data not found.')
                fileName = `فاتورة_${responseData.invoiceNumber}.pdf`
                pdfComponent = <InvoicePDF invoice={responseData} />
            } else {
                // Find the order in the client's orders
                const order = values.orders?.find((o: any) => o._id === orderId)
                if (!order) throw new Error('Order not found.')

                if (type === 'guarantee') {
                    responseData = transformOrderToGuaranteeDoc(order, values)
                    fileName = `ضمان_${order.orderNumber}.pdf`
                    pdfComponent = <GuaranteePDF guaranteeDoc={responseData} />
                } else if (type === 'receipt') {
                    responseData = {
                        orderId,
                        clientName: values.firstName + ' ' + values.lastName,
                        carDetails: order,
                    }
                    fileName = `إيصال_سيارة_${order.orderNumber}.pdf`
                    // You'll need to create a ReceiptPDF component similar to GuaranteePDF
                    // pdfComponent = <ReceiptPDF receiptData={responseData} />
                    throw new Error(
                        'Receipt PDF generation not implemented yet.'
                    )
                }
            }

            if (!pdfComponent) {
                throw new Error('Failed to create PDF component.')
            }

            // Render PDF and trigger download
            const container = document.createElement('div')
            document.body.appendChild(container)
            const root = createRoot(container)

            root.render(
                <BlobProvider document={pdfComponent}>
                    {({ blob, url, loading, error }) => {
                        if (blob && !loading) {
                            const downloadLink = document.createElement('a')
                            downloadLink.href = url || ''
                            downloadLink.download = fileName
                            document.body.appendChild(downloadLink)
                            downloadLink.click()

                            setTimeout(() => {
                                document.body.removeChild(downloadLink)
                                root.unmount()
                                document.body.removeChild(container)
                            }, 100)
                            toast.push(
                                <Notification title="تصدير" type="success">
                                    تم تنزيل الملف بنجاح.
                                </Notification>
                            )
                            setDownloadLoadingOrderId(null)
                            setDownloadType(null)
                        }
                        if (error) {
                            toast.push(
                                <Notification title="خطأ" type="danger">
                                    حدث خطأ أثناء إنشاء ملف PDF: {error.message}
                                </Notification>
                            )
                            setDownloadLoadingOrderId(null)
                            setDownloadType(null)
                        }
                        return null
                    }}
                </BlobProvider>
            )
        } catch (error: any) {
            console.error(`Error downloading ${type}:`, error)
            toast.push(
                <Notification title="خطأ" type="danger">
                    فشل في تحميل{' '}
                    {type === 'invoice'
                        ? 'الفاتورة'
                        : type === 'guarantee'
                        ? 'الضمان'
                        : 'الإيصال'}
                    : {error.message || 'خطأ غير معروف'}
                </Notification>
            )
            setDownloadLoadingOrderId(null)
            setDownloadType(null)
        }
    }

    // --- DataTable Columns Definition ---
    const ordersColumns: ColumnDef<any>[] = [
        { header: 'رقم الطلب', accessorKey: 'orderNumber' },
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
                        <div className="text-gray-400 py-1">
                            لا توجد خدمات لعرضها
                        </div>
                    )
                }
                return (
                    <div className="space-y-2">
                        {services.map((service: any, index: number) => (
                            <div
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <span className="text-gray-600 dark:text-gray-400">
                                    •
                                </span>
                                <span className="font-medium">
                                    {service.serviceType === 'protection'
                                        ? 'حماية'
                                        : service.serviceType === 'polish'
                                        ? 'تلميع'
                                        : service.serviceType === 'insulator'
                                        ? 'عازل حراري'
                                        : service.serviceType === 'additions'
                                        ? 'إضافات'
                                        : service.serviceType}
                                </span>
                            </div>
                        ))}
                    </div>
                )
            },
        },
        {
            header: 'تاريخ الطلب',
            accessorKey: 'createdAt',
            cell: (props) => formatDate(props.row.original.createdAt),
        },
        {
            header: 'تصدير PDF',
            id: 'exportActions',
            cell: (props) => {
                const order = props.row.original
                const [isOpen, setIsOpen] = useState(false)
                const isLoadingCurrentOrder =
                    downloadLoadingOrderId === order._id

                return (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                    >
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger size="xs" variant="solid">
                                {isLoadingCurrentOrder
                                    ? 'جاري التنزيل...'
                                    : 'تصدير'}
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2">
                                <div className="space-y-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleStartDownload(
                                                e as any,
                                                order._id,
                                                'invoice'
                                            )
                                        }}
                                        disabled={
                                            isLoadingCurrentOrder &&
                                            downloadType !== 'invoice'
                                        }
                                        className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    >
                                        <FiFileText /> فاتورة
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleStartDownload(
                                                e as any,
                                                order._id,
                                                'guarantee'
                                            )
                                        }}
                                        disabled={
                                            isLoadingCurrentOrder &&
                                            downloadType !== 'guarantee'
                                        }
                                        className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    >
                                        <FiBookOpen /> ضمان
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleStartDownload(
                                                e as any,
                                                order._id,
                                                'receipt'
                                            )
                                        }}
                                        disabled={
                                            isLoadingCurrentOrder &&
                                            downloadType !== 'receipt'
                                        }
                                        className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    >
                                        <FiPrinter /> استلام سيارة
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )
            },
        },
        {
            header: 'إجراءات الإدارة',
            id: 'managementActions',
            cell: (props) => {
                const order = props.row.original
                return (
                    <div
                        className="flex justify-center items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            size="xs"
                            variant="twoTone"
                            color="blue-600"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEditOrder(order._id)
                            }}
                            icon={<FiEdit />}
                            title="تعديل الطلب"
                        >
                            تعديل
                        </Button>

                        <DeleteOrderButton
                            onDelete={(setDialogOpen) => {
                                setDialogOpen(false)
                                onDeleteOrder(order._id)
                            }}
                        />
                    </div>
                )
            },
        },
    ]

    // --- Pagination Logic ---
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        return values.orders ? values.orders.slice(startIndex, endIndex) : []
    }, [values.orders, currentPage, pageSize])

    const totalOrdersCount = values.orders?.length || 0

    const onPaginationChange = (page: number) => {
        setCurrentPage(page)
    }

    const onPageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1)
    }

    // --- Render Component ---
    return (
        <>
            <AdaptableCard divider className="mb-6">
                <h5 className="mb-4 text-center">تفاصيل العميل</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            الاسم الكامل
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.firstName} {values.middleName}{' '}
                            {values.lastName}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            البريد الإلكتروني
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.email || '-'}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            رقم الهاتف
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.phone || '-'}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            الفرع
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.branch || '-'}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            نوع العميل
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.clientType === 'individual'
                                ? 'فردي'
                                : 'شركة'}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            تاريخ الإنشاء
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {formatDate(values.createdAt)}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            إجمالي الطلبات
                        </h6>
                        <p className="text-gray-800 dark:text-gray-100">
                            {values.orderStats?.totalOrders || 0}
                        </p>
                    </div>
                </div>

                <h5 className="mb-4 text-center mt-6">التقييم والملاحظات</h5>
                <RatingAndNotesSection values={values} readOnly={readOnly} />
            </AdaptableCard>

            <AdaptableCard divider className="mb-4">
                <h5 className="mb-4 text-center">الطلبات السابقة</h5>
                <DataTable
                    columns={ordersColumns}
                    data={paginatedOrders}
                    onRowClick={handleRowClick}
                    skeletonAvatarColumns={[0]}
                    skeletonRowCount={pageSize}
                    // wrapperClass="pb-28"
                    loading={false}
                    totalData={totalOrdersCount}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPaginationChange={onPaginationChange}
                    onPageSizeChange={onPageSizeChange}
                    rowSize="lg"
                    scrollable={true}
                    style={{ minHeight: '800px' }}
                />
            </AdaptableCard>
        </>
    )
}

export default OrdersClientFields
