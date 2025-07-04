import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import reducer, {
    getOrders,
    useAppDispatch,
    useAppSelector,
    setTableData,
} from '../store'
import { injectReducer } from '@/store'
import OrdersTableTools from './OrdersTableTools'

injectReducer('ordersListSlice', reducer)

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.ordersListSlice.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.ordersListSlice.data.loading
    )
    const orderData = useAppSelector(
        (state) => state.ordersListSlice.data.orderList
    )

    useEffect(() => {
        dispatch(getOrders())
    }, [pageIndex, limit, sort, query, dispatch])

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'نوع السيارة',
                accessorKey: 'carType',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'الموديل',
                accessorKey: 'carModel',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'اللون',
                accessorKey: 'carColor',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'الخدمات',
                cell: (props) => {
                    const services = props.row.original.services
                    return services?.length > 0
                        ? services.map((service:any) => service.serviceType).join('، ')
                        : 'لا يوجد خدمات'
                },
            },
            {
                header: 'تاريخ الإنشاء',
                cell: (props) =>
                    new Date(props.row.original.createdAt).toLocaleDateString(),
            },
        ],
        []
    )

    return (
        <div className="p-4">
            <OrdersTableTools />
            <DataTable
                ref={tableRef}
                columns={columns}
                data={orderData || []}
                loading={loading}
                pagingData={{
                    total: total || 0,
                    pageIndex: pageIndex || 1,
                    pageSize: limit || 10,
                }}
                onPaginationChange={(page) =>
                    dispatch(setTableData({ pageIndex: page }))
                }
                onRowClick={(row) => navigate(`/orders/${row.original._id}`)}
            />
        </div>
    )
}

export default OrdersTable
