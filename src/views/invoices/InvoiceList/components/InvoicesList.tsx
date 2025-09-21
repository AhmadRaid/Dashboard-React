// src/views/invoices/InvoiceList/index.tsx

import React, { useEffect, useMemo, useRef } from 'react'
import dayjs from 'dayjs'
import { useNavigate, Link } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import { Button } from '@/components/ui'
import reducer, {
    getInvoices,
    useAppDispatch,
    useAppSelector,
    setTableData,
    updateInvoiceStatus,
} from '../store'
import { injectReducer } from '@/store'
import InvoicesTableTools from './InvoicesTableTools'
import { InvoiceStatus } from '@/@types/invoice'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover'

// حقن reducer في المتجر العام
injectReducer('invoiceListSlice', reducer)

const InvoiceList = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, startDate, endDate, total, status } =
        useAppSelector((state) => state.invoiceListSlice.data.tableData)

    const loading = useAppSelector(
        (state) => state.invoiceListSlice.data.loading
    )
    const invoiceData = useAppSelector(
        (state) => state.invoiceListSlice.data.invoiceList
    )

    useEffect(() => {
        dispatch(getInvoices())
    }, [pageIndex, limit, sort, query, startDate, endDate, status, dispatch])

    const normalizedData = useMemo(() => {
        if (!invoiceData) return []

        return invoiceData.map((invoice) => ({
            ...invoice,
            totalAmount: invoice.totalAmount?.toLocaleString() || '0',
            invoiceDate: dayjs(invoice.invoiceDate).format('DD/MM/YYYY'),
        }))
    }, [invoiceData])

    // ✅ دالة الألوان المحسنة مع تباين أعلى
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'open':
                return 'text-blue-800 border border-blue-300' // أزرق واضح
            case 'pending':
                return 'text-yellow-800 border border-yellow-300' // أصفر واضح
            case 'approved':
                return 'text-green-800 border border-green-300' // أخضر واضح
            case 'rejected':
                return 'text-red-800 border border-red-300' // أحمر واضح
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300'
        }
    }


    const handleStatusChange = async (
        option: { label: string; value: string },
        invoiceId: string
    ) => {
        if (option?.value) {
            await dispatch(
                updateInvoiceStatus({
                    id: invoiceId,
                    status: option.value as InvoiceStatus,
                })
            )
            dispatch(getInvoices())
        }
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'رقم الفاتورة',
                accessorKey: 'invoiceNumber',
                cell: (props) => {
                    const id = props.row.original._id
                    const num = props.getValue() || 'غير محدد'
                    return (
                        <Link
                            to={`/invoices/${id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-600 hover:text-indigo-800 underline font-bold"
                            title="عرض تفاصيل الفاتورة"
                        >
                            {String(num)}
                        </Link>
                    ) as any
                },
            },
            {
                header: 'اسم العميل',
                cell: (props) => {
                    const client = props.row.original.clientDetails
                    if (!client) {
                        return <div className="text-gray-400">غير محدد</div>
                    }
                    const clientName = `${client.firstName} ${client.secondName} ${client.thirdName} ${client.lastName}`
                    return (
                        <div>
                            {clientName}
                        </div>
                    )
                },
            },
            {
                header: 'الخدمات',
                cell: (props) => {
                    const services = props.row.original.orderDetails?.services
                    if (!services || services.length === 0) {
                        return (
                            <div className="text-gray-400">
                                لا توجد خدمات لعرضها
                            </div>
                        )
                    }

                    const translateServiceType = (type: string) => {
                        switch (type) {
                            case 'protection':
                                return 'حماية'
                            case 'polish':
                                return 'تلميع'
                            case 'insulator':
                                return 'عازل حراري'
                            case 'additions':
                                return 'إضافات'
                            default:
                                return type
                        }
                    }

                    return (
                        <div className="space-y-2">
                            {services.map((service: any, index: number) => (
                                <React.Fragment key={index}>
                                    <div className="flex items-center">
                                        <span className="font-medium">
                                            {translateServiceType(
                                                service.serviceType
                                            )}
                                        </span>
                                    </div>
                                    {index < services.length - 1 && (
                                        <div className="border-t border-dashed border-gray-400/80 dark:border-gray-500/80 my-2"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )
                },
            },
            {
                header: 'المجموع',
                accessorKey: 'totalAmount',
                cell: (props) => {
                    const value = props.getValue()
                    return (
                        <div>
                            {`${value} ر.س`}
                        </div>
                    )
                }
            },
            {
                header: 'تاريخ الفاتورة',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const createdAt = props.row.original.createdAt
                    if (!createdAt) return <div className="text-gray-400">غير متاح</div>
                    const dateStr = new Date(createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                    return (
                        <div>
                            {dateStr}
                        </div>
                    )
                },
            },
            {
                header: 'الحالة',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.getValue() as InvoiceStatus
                    const invoiceId = props.row.original._id
                    const [isOpen, setIsOpen] = React.useState(false)

                    const statusOptions = [
                        { label: 'مفتوحة', value: 'open' },
                        { label: 'معلقة', value: 'pending' },
                        { label: 'مقبولة', value: 'approved' },
                        { label: 'مرفوضة', value: 'rejected' },
                    ]

                    const currentStatusOption = statusOptions.find(
                        (opt) => opt.value === status
                    ) || { label: 'غير محدد', value: '' }

                    const handleStatusChangeAndClose = (option: {
                        label: string
                        value: string
                    }) => {
                        handleStatusChange(option, invoiceId)
                        setIsOpen(false)
                    }

                    return (
                        <div onClick={(e) => e.stopPropagation()} className="p-2">
                            <Popover
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                placement="bottom-start"
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        size="sm"
                                        className={`w-36 font-semibold rounded-lg ${getStatusColorClass(
                                            status
                                        ).replace('bg-', '!bg-')} transition-colors duration-200 hover:brightness-95`}
                                    >
                                        {currentStatusOption.label}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-2 w-48">
                                    <div className="space-y-1">
                                        {statusOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() =>
                                                    handleStatusChangeAndClose(
                                                        option
                                                    )
                                                }
                                                className={`w-full text-right px-3 py-2 text-sm rounded-md transition-colors duration-200 hover:bg-gray-100 ${option.value === status ? 'font-bold' : ''}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )
                },
            },
        ],
        [handleStatusChange, getStatusColorClass]
    )

    return (
        <div className="p-4">
            <InvoicesTableTools />
            {loading ? (
                <div className="text-center py-8">جاري تحميل البيانات...</div>
            ) : normalizedData.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={normalizedData}
                    loading={loading}
                    pagingData={{
                        total: total || normalizedData.length,
                        pageIndex,
                        pageSize: limit,
                    }}
                    onPaginationChange={(page) =>
                        dispatch(setTableData({ pageIndex: page }))
                    }
                    onRowClick={(row) =>
                        navigate(`/invoices/${row.original._id}`)
                    }
                />
            ) : (
                <div className="text-center py-8">لا توجد فواتير متاحة</div>
            )}
        </div>
    )
}

export default InvoiceList