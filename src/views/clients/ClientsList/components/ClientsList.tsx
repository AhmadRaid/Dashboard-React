import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import { Client } from '@/@types/clients'
import { getClients, useAppDispatch, useAppSelector, getStatistics } from '../store'
import ClientsTableTools from './ClientsTableTools'

// مكون جديد لعرض مربعات الإحصائيات
const StatisticsBoxes = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {/* إجمالي مبيعات اليوم */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-md border border-blue-200">
        <h3 className="text-sm font-medium text-blue-700">مبيعات اليوم</h3>
        <p className="text-2xl font-bold text-blue-800">{stats.todaySales ? stats.todaySales.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-blue-600">ريال سعودي</span>
        </div>
      </div>

      {/* أوامر قص الرولات */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 shadow-md border border-green-200">
        <h3 className="text-sm font-medium text-green-700">أوامر قص الرولات</h3>
        <p className="text-2xl font-bold text-green-800">{stats.rollCuttingOrders ? stats.rollCuttingOrders.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-green-600">طلبات اليوم</span>
        </div>
      </div>

      {/* كمية الرولات المقصوصة */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow-md border border-purple-200">
        <h3 className="text-sm font-medium text-purple-700">قصاصات</h3>
        <p className="text-2xl font-bold text-purple-800">{stats.cutRollsQuantity ? stats.cutRollsQuantity.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-purple-600">متر اليوم</span>
        </div>
      </div>

      {/* إجمالي المواعيد والحجوزات */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 shadow-md border border-amber-200">
        <h3 className="text-sm font-medium text-amber-700">إجمالي الحجوزات</h3>
        <p className="text-2xl font-bold text-amber-800">{stats.totalAppointments ? stats.totalAppointments.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-amber-600">حجوزات نشطة</span>
        </div>
      </div>

      {/* حجوزات في الانتظار (مؤكدة) */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 shadow-md border border-teal-200">
        <h3 className="text-sm font-medium text-teal-700">حجوزات مؤكدة</h3>
        <p className="text-2xl font-bold text-teal-800">{stats.confirmedBookings ? stats.confirmedBookings.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-teal-600">تم الدفع</span>
        </div>
      </div>

      {/* العروض (حجوز غير مؤكدة) */}
      <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 shadow-md border border-rose-200">
        <h3 className="text-sm font-medium text-rose-700">عروض غير مؤكدة</h3>
        <p className="text-2xl font-bold text-rose-800">{stats.pendingOffers ? stats.pendingOffers.toLocaleString('ar-SA') : 0}</p>
        <div className="flex items-center mt-1">
          <span className="text-xs text-rose-600">بانتظار التأكيد</span>
        </div>
      </div>
    </div>
  )
}

const ClientsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, total, branchFilter } =
        useAppSelector((state) => state.clientsListSlice.data.tableData)

    const loading = useAppSelector(
        (state) => state.clientsListSlice.data.loading
    )
    const clientList = useAppSelector(
        (state) => state.clientsListSlice.data.clientList
    )
    
    // جلب بيانات الإحصائيات من الـ store
    const statistics = useAppSelector(
        (state) => state.clientsListSlice.data.statistics || {}
    )

    useEffect(() => {
        const params: any = {
            limit,
            offset: (pageIndex - 1) * limit,
            search: query || undefined,
            branch: branchFilter || undefined,
            sort: sort.order || undefined,
        }

        dispatch(getClients(params))
        // جلب الإحصائيات عند تحميل المكون
        dispatch(getStatistics())
    }, [pageIndex, limit, sort, query, branchFilter, dispatch])

    const columns: ColumnDef<Client>[] = useMemo(
        () => [
            // الأعمدة كما هي موجودة في الكود الأصلي
            {
                header: 'الاسم الاول',
                accessorKey: 'firstName',
                sortable: false,
            },
            {
                header: 'الاسم الثاني',
                accessorKey: 'middleName',
                sortable: false,
            },
            {
                header: 'الاسم العائلة',
                accessorKey: 'lastName',
                sortable: false,
            },
            {
                header: 'نوع العميل',
                accessorKey: 'clientType',
                cell: (props) => {
                    const clientType = props.row.original.clientType
                    return (
                        <span>
                            {clientType === 'individual'
                                ? 'فردي'
                                : clientType === 'company'
                                ? 'شركة'
                                : clientType}
                        </span>
                    )
                },
                sortable: false,
            },
            { header: 'الهاتف', accessorKey: 'phone', sortable: false },
            {
                header: 'تاريخ الانشاء',
                accessorKey: 'createdAt',
                cell: (props) =>
                    new Date(props.row.original.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                sortable: true,
            },
        ],
        []
    )

    return (
        <>
            {/* عرض مربعات الإحصائيات في أعلى الصفحة */}
            <StatisticsBoxes stats={statistics} />
            
            <ClientsTableTools />
            <DataTable
                ref={tableRef}
                columns={columns}
                data={clientList}
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
                                key: '',
                            },
                        })
                    )
                }
                onRowClick={(row) => navigate(`/clients/${row.original._id}`)}
            />
        </>
    )
}

export default ClientsTable