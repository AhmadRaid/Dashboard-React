import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import { Client } from '@/@types/clients'
import {  useAppDispatch, useAppSelector } from '../store'
import ClientsCommunicationTableTools from './ClientsCommunicationTableTools'
import DailyTasks from '@/views/tasks/DailyTasks'



// نوع بيانات اتصال العميل
interface ClientCommunication {
  _id: string
  firstName: string
  lastName: string
  phone: string
  purpose: string
  result: string
  date: string
  status: 'مكتمل' | 'قيد المعالجة' | 'ملغى'
}

const ClientsCommunicationTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [communications, setCommunications] = useState<ClientCommunication[]>([])

    const { pageIndex, limit, sort, query, total } =
        useAppSelector((state) => state.clientCommunicationList.data.tableData)

    const loading = useAppSelector(
        (state) => state.clientCommunicationList.data.loading
    )
    
    // جلب بيانات الإحصائيات من الـ store
    const statistics = useAppSelector(
        (state) => state.clientCommunicationList.data.statistics || {}
    )

    useEffect(() => {
        // محاكاة جلب بيانات اتصالات العملاء من API
        const fetchCommunications = async () => {
            try {
                // في التطبيق الحقيقي، سيتم استدعاء API خاص باتصالات العملاء
                const mockCommunications: ClientCommunication[] = [
                  {
                    _id: '1',
                    firstName: 'أحمد',
                    lastName: 'العمري',
                    phone: '0551234567',
                    purpose: 'استفسار عن المنتجات',
                    result: 'تم الرد على الاستفسار',
                    date: '2023-10-15',
                    status: 'مكتمل'
                  },
                  {
                    _id: '2',
                    firstName: 'فاطمة',
                    lastName: 'السعدي',
                    phone: '0567654321',
                    purpose: 'شكوى',
                    result: 'تحويل إلى خدمة العملاء',
                    date: '2023-10-14',
                    status: 'قيد المعالجة'
                  },
                  {
                    _id: '3',
                    firstName: 'محمد',
                    lastName: 'الزيد',
                    phone: '0509876543',
                    purpose: 'طلب عرض سعر',
                    result: 'تم إرسال العرض',
                    date: '2023-10-13',
                    status: 'مكتمل'
                  },
                  {
                    _id: '4',
                    firstName: 'سارة',
                    lastName: 'العتيبي',
                    phone: '0541122334',
                    purpose: 'تتبع طلب',
                    result: 'تم توفير معلومات التتبع',
                    date: '2023-10-12',
                    status: 'مكتمل'
                  },
                  {
                    _id: '5',
                    firstName: 'خالد',
                    lastName: 'الفهد',
                    phone: '0534455667',
                    purpose: 'استفسار عن الخدمات',
                    result: 'في انتظار الرد',
                    date: '2023-10-11',
                    status: 'قيد المعالجة'
                  }
                ]
                setCommunications(mockCommunications)
            } catch (error) {
                console.error('Error fetching communications:', error)
            }
        }

        fetchCommunications()
        dispatch(getStatistics())
    }, [dispatch])

    const columns: ColumnDef<ClientCommunication>[] = useMemo(
        () => [
            {
                header: 'الاسم الاول',
                accessorKey: 'firstName',
                sortable: true,
            },
            {
                header: 'اسم العائلة',
                accessorKey: 'lastName',
                sortable: true,
            },
            { 
                header: 'رقم الهاتف', 
                accessorKey: 'phone', 
                sortable: false,
            },
            {
                header: 'غرض الاتصال',
                accessorKey: 'purpose',
                sortable: true,
                cell: (props) => {
                  const purpose = props.row.original.purpose
                  return (
                    <span className="font-medium">{purpose}</span>
                  )
                }
            },
            {
                header: 'النتيجة',
                accessorKey: 'result',
                sortable: true,
                cell: (props) => {
                  const result = props.row.original.result
                  return (
                    <span className="text-sm">{result}</span>
                  )
                }
            },
            {
                header: 'الحالة',
                accessorKey: 'status',
                sortable: true,
                cell: (props) => {
                  const status = props.row.original.status
                  const statusColors = {
                    'مكتمل': 'bg-green-100 text-green-800',
                    'قيد المعالجة': 'bg-amber-100 text-amber-800',
                    'ملغى': 'bg-red-100 text-red-800'
                  }
                  return (
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
                      {status}
                    </span>
                  )
                }
            },
            {
                header: 'التاريخ',
                accessorKey: 'date',
                sortable: true,
                cell: (props) => {
                  const date = props.row.original.date
                  return new Date(date).toLocaleDateString('ar-SA')
                }
            },
            {
                header: 'الإجراءات',
                accessorKey: 'actions',
                cell: (props) => {
                  const communication = props.row.original
                  return (
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => navigate(`/communications/${communication._id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => console.log('Edit', communication._id)}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        تعديل
                      </button>
                    </div>
                  )
                }
            }
        ],
        [navigate]
    )

    return (
        <>
            {/* عرض مربعات الإحصائيات في أعلى الصفحة */}
            <StatisticsBoxes stats={statistics} />
            
            <DailyTasks />
            <ClientsCommunicationTableTools />
            <DataTable
                ref={tableRef}
                columns={columns}
                data={communications}
                loading={loading}
                pagingData={{
                    total: communications.length,
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
                onRowClick={(row) => navigate(`/communications/${row.original._id}`)}
            />
        </>
    )
}

export default ClientsCommunicationTable