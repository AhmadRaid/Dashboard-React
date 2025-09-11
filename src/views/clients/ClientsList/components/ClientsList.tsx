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
import DailyTasks from '@/views/tasks/DailyTasks'

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
                header: 'الاسم الاب',
                accessorKey: 'secondName',
                sortable: false,
            },
            {
                header: 'الاسم الجد',
                accessorKey: 'thirdName',
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
                            {clientType}
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