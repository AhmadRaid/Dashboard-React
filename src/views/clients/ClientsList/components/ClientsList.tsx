import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import cloneDeep from 'lodash/cloneDeep'
import { Client } from '@/@types/clients'
import {
    getClients,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import ClientsTableTools from './ClientsTableTools'

const ClientsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.clientsListSlice.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.clientsListSlice.data.loading
    )
    const clientList = useAppSelector(
        (state) => state.clientsListSlice.data.clientList
    )

    const tableData = useMemo(
        () => ({ pageIndex, limit, sort, query, total }),
        [pageIndex, limit, sort, query, total]
    )

    useEffect(() => {
        dispatch(
            getClients({
                limit,
                offset: (pageIndex - 1) * limit,
                search: query || undefined
            })
        )
    }, [pageIndex, limit, sort, query, dispatch])

    const columns: ColumnDef<Client>[] = useMemo(
        () => [
            { header: 'الاسم الاول', accessorKey: 'firstName', sortable: false },
            { header: 'الاسم الثاني', accessorKey: 'middleName', sortable: false },
            { header: 'الاسم العائلة', accessorKey: 'lastName', sortable: false },
            { header: 'الايميل', accessorKey: 'email', sortable: false },
            {
                header: 'نوع العميل',
                accessorKey: 'clientType',
                sortable: false,
            },
            { header: 'الهاتف', accessorKey: 'phone', sortable: false },
            {
                header: 'تاريخ الانشاء',
                accessorKey: 'createdAt',
                cell: (props) =>
                    new Date(props.row.original.createdAt).toLocaleString(),
                sortable: false,
            },
            {
                header: 'تاريخ التحديث',
                accessorKey: 'updatedAt',
                cell: (props) =>
                    new Date(props.row.original.updatedAt).toLocaleString(),
                sortable: false,
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.limit = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = {
            order: sort.order,
            key: String(sort.key),
        }
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <ClientsTableTools />
            <DataTable
                ref={tableRef}
                columns={columns}
                data={clientList}
                loading={loading}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.limit,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onRowClick={(row) => navigate(`/clients/${row.original._id}`)}
            />
        </>
    )
}

export default ClientsTable