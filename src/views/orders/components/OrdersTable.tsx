import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import { getOrders, useAppDispatch, useAppSelector } from '../store'
import OrdersTableTools from './OrdersTableTools'
import { Order, Service } from '@/@types/order'

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, total, statusFilter } =
        useAppSelector((state) => state.ordersListSlice.data.tableData)

    const loading = useAppSelector(
        (state) => state.ordersListSlice.data.loading
    )
    const orderList = useAppSelector(
        (state) => state.ordersListSlice.data.orderList
    )

    useEffect(() => {
        const params: any = {
            limit,
            offset: (pageIndex - 1) * limit,
            search: query || undefined,
            status: statusFilter || undefined,
            sort: sort.order ? `${sort.key}:${sort.order}` : undefined,
        }

        dispatch(getOrders(params))
    }, [pageIndex, limit, sort, query, statusFilter, dispatch])

    const calculateTotal = (services: Service[]) => {
        return services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
    }

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: 'رقم الطلب',
                accessorKey: '_id',
                cell: (props) => props.row.original._id.substring(0, 8),
                sortable: false,
            },
            {
                header: 'العميل',
                accessorKey: 'client',
                cell: (props) => {
                    const client = props.row.original.client
                    return client ? `${client.firstName} ${client.lastName}` : 'غير معروف'
                },
                sortable: false,
            },
            {
                header: 'نوع السيارة',
                accessorKey: 'carType',
                sortable: false,
            },
            {
                header: 'موديل السيارة',
                accessorKey: 'carModel',
                sortable: false,
            },
            {
                header: 'الخدمات',
                accessorKey: 'services',
                cell: (props) => {
                    const services = props.row.original.services
                    return services.map(s => s.serviceType).join('، ')
                },
                sortable: false,
            },
            {
                header: 'الإجمالي',
                accessorKey: 'total',
                cell: (props) => {
                    const services = props.row.original.services
                    return `${calculateTotal(services)} ر.س`
                },
                sortable: false,
            },
            {
                header: 'تاريخ الإنشاء',
                accessorKey: 'createdAt',
                cell: (props) =>
                    new Date(props.row.original.createdAt).toLocaleDateString(),
                sortable: true,
            },
            {
                header: 'حالة الطلب',
                accessorKey: 'status',
                cell: (props) => {
                    const services = props.row.original.services
                    if (services.length === 0) return 'غير مكتمل'
                    return services.some(s => s.guarantee?.status === 'active') ? 'نشط' : 'مكتمل'
                },
                sortable: false,
            },
        ],
        []
    )

    return (
        <>
            <OrdersTableTools />
            <DataTable
                ref={tableRef}
                columns={columns}
                data={orderList}
                loading={loading}
                pagingData={{
                    total: total,
                    pageIndex: pageIndex,
                    pageSize: limit,
                }}
                onPaginationChange={(page) =>
                    dispatch(setTableData({ pageIndex: page }))
                }
                onSelectChange={(value) =>
                    dispatch(
                        setTableData({
                            limit: Number(value),
                            pageIndex: 1,
                        })
                    )
                }
                onSort={(sort) =>
                    dispatch(
                        setTableData({
                            sort: {
                                order: sort.order,
                                key: String(sort.key),
                            },
                        })
                    )
                }
                onRowClick={(row) => navigate(`/orders/${row.original._id}`)}
            />
        </>
    )
}

export default OrdersTable