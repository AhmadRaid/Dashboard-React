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

    console.log('Order Data:', orderData)
    console.log('Loading:', loading)
    console.log('Table Data:', { pageIndex, limit, sort, query, total })

    useEffect(() => {
        dispatch(getOrders())
    }, [pageIndex, limit, sort, query, dispatch])

    // Normalize the data to ensure it's always an array with the correct structure
    const normalizedData = useMemo(() => {
        if (!orderData) return []

        // If data is an array, transform each item
        if (Array.isArray(orderData)) {
            return orderData.map((item) => ({
                ...item,
                clientName: item.client
                    ? `${item.client.firstName} ${item.client.secondName} ${item.client.thirdName} ${item.client.lastName}`
                    : 'غير محدد',
            }))
        }
    }, [orderData])

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'رقم الطلب',
                accessorKey: 'orderNumber',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'اسم العميل',
                accessorKey: 'clientName',
                cell: (props) => props.getValue() || 'غير محدد',
            },
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
                header: 'حالة الطلب',
                accessorKey: 'status',
                cell: (props) => props.getValue() || 'غير محدد',
            },
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
                                            {service.serviceType ===
                                            'protection'
                                                ? 'حماية'
                                                : service.serviceType ===
                                                  'polish'
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
                header: 'تاريخ الإنشاء',
                cell: (props) =>
                    new Date(props.row.original.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
            },
        ],
        []
    )

    return (
        <div className="p-4">
            <OrdersTableTools />
            {loading ? (
                <div className="text-center py-8">جاري تحميل البيانات...</div>
            ) : normalizedData.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={normalizedData}
                    loading={loading}
                    pagingData={{
                        total: normalizedData.length || total || 0,
                        pageIndex: pageIndex || 1,
                        pageSize: limit || 10,
                    }}
                    onPaginationChange={(page) =>
                        dispatch(setTableData({ pageIndex: page }))
                    }
                    onRowClick={(row) =>
                        navigate(`/orders/${row.original._id}`)
                    }
                />
            ) : (
                <div className="text-center py-8">لا توجد بيانات متاحة</div>
            )}
        </div>
    )
}

export default OrdersTable
