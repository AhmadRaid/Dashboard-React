import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef } from '@/components/shared/DataTable'
import { fetchCarTypes, setTableData } from './slices/carTypesListSlice'

const CarTypesTable = () => {
    const dispatch = useAppDispatch()
    const { data, loading, tableState } = useAppSelector(selectCarTypes)

    useEffect(() => {
        dispatch(fetchCarTypes())
    }, [dispatch, tableState.pageIndex, tableState.limit, tableState.query])

    const handlePageChange = (page: number) => {
        dispatch(setTableState({ pageIndex: page }))
    }

    const handleSearch = (query: string) => {
        dispatch(setTableState({ query, pageIndex: 1 }))
    }

    const columns: ColumnDef<typeof data[0]>[] = [
        {
            header: 'الاسم',
            accessorKey: 'name',
        },
        {
            header: 'الحالة',
            accessorKey: 'isActive',
            cell: (props) => props.getValue() ? 'نشط' : 'غير نشط'
        },
        {
            header: 'تاريخ الإنشاء',
            accessorKey: 'createdAt',
            cell: (props) => new Date(props.getValue() as string).toLocaleString()
        }
    ]

    const onPaginationChange = (page: number) => {
        dispatch(setTableData({ pageIndex: page }))
    }

    const onSelectChange = (limit: number) => {
        dispatch(setTableData({ limit, pageIndex: 1 }))
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.limit,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
        />
    )
}

export default CarTypesTable