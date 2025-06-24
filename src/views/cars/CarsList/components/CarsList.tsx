import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import cloneDeep from 'lodash/cloneDeep'
import {
    getCars,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { Car } from '@/@types/cars'

const CarsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.carsListSlice.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.carsListSlice.data.loading
    )
    const carList = useAppSelector(
        (state) => state.carsListSlice.data.carList
    )

    const tableData = useMemo(
        () => ({ pageIndex, limit, sort, query, total }),
        [pageIndex, limit, sort, query, total]
    )

    useEffect(() => {
        dispatch(
            getCars({
                limit,
                offset: (pageIndex - 1) * limit,
            })
        )
    }, [pageIndex, limit, sort, query, dispatch])

    const columns: ColumnDef<Car>[] = useMemo(
        () => [
            { 
                header: 'اسم السيارة', 
                accessorKey: 'name', 
                sortable: false 
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
            <DataTable
                ref={tableRef}
                columns={columns}
                data={carList}
                loading={loading}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.limit,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onRowClick={(row) => navigate(`/cars/${row.original._id}`)}
            />
        </>
    )
}

export default CarsTable