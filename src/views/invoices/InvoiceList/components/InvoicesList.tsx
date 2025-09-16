import React, { useEffect, useMemo, useRef } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type { DataTableResetHandle, ColumnDef } from '@/components/shared/DataTable'
import reducer, {
    getInvoices,
    useAppDispatch,
    useAppSelector,
    setTableData,
} from '../store'
import { injectReducer } from '@/store'
import InvoicesTableTools from './InvoicesTableTools'

injectReducer('invoiceListSlice', reducer)

const InvoiceList = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, startDate, endDate, total } = useAppSelector(
        (state) => state.invoiceListSlice.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.invoiceListSlice.data.loading
    )
    const invoiceData = useAppSelector(
        (state) => state.invoiceListSlice.data.invoiceList
    )

    useEffect(() => {
        dispatch(getInvoices())
    }, [pageIndex, limit, sort, query, startDate, endDate, dispatch])

    const normalizedData = useMemo(() => {
        if (!invoiceData) return []

        return invoiceData.map((invoice) => ({
            ...invoice,
            totalAmount: invoice.totalAmount?.toLocaleString() || '0',
            invoiceDate: dayjs(invoice.invoiceDate).format('DD/MM/YYYY')
        }))
    }, [invoiceData])

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'رقم الفاتورة',
                accessorKey: 'invoiceNumber',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'اسم العميل',
                cell: (props) => {
                    const client = props.row.original.clientDetails;
                    if (!client) {
                        return 'غير محدد';
                    }
                    return `${client.firstName} ${client.secondName} ${client.thirdName} ${client.lastName}`;
                },
            },
            {
                header: 'الخدمات',
                cell: (props) => {
                    const services = props.row.original.orderDetails?.services
                    if (!services || services.length === 0) {
                        return (
                            <div className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-default py-1">
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
                                            {translateServiceType(service.serviceType)}
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
                cell: (props) => `${props.getValue()} ر.س`,
            },
            {
                header: 'تاريخ الفاتورة',
                accessorKey: 'invoiceDate',
                cell: (props) => props.getValue(),
            },
            {
                header: 'الحالة',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.getValue()
                    return (
                        <span className={`badge ${status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                            {status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                        </span>
                    )
                },
            },
        ],
        []
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