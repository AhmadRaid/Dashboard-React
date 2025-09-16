import React, { useEffect, useMemo, useRef } from 'react'
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
            clientName: invoice.clientId?.name || 'غير محدد',
            totalAmount: invoice.totalAmount?.toLocaleString() || '0',
            invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString('en-US')
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
                header: 'تاريخ الفاتورة',
                accessorKey: 'invoiceDate',
                cell: (props) => props.getValue(),
            },
            {
                header: 'اسم العميل',
                accessorKey: 'clientName',
                cell: (props) => props.getValue(),
            },
            {
                header: 'الخدمات',
                accessorKey: 'services',
                cell: (props) => {
                    const services = props.row.original.services
                    if (!services || services.length === 0) {
                        return 'لا توجد خدمات'
                    }
                    return services.map((s: any) => s.serviceName).join('، ')
                },
            },
            {
                header: 'المجموع',
                accessorKey: 'totalAmount',
                cell: (props) => `${props.getValue()} ر.س`,
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