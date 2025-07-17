import React, { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
    OnSortParam,
} from '@/components/shared/DataTable'
import { getCars, setTableData, useAppDispatch, useAppSelector } from '../store'
import { Car } from '@/@types/cars'

const CarsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // استخدم قيم افتراضية للوصول الآمن
    const {
        pageIndex = 1,
        limit = 10,
        sort = { order: '', key: '' },
        query = '',
        total = 0
    } = useAppSelector(
        (state) => state.carsListSlice?.data?.tableData || {}
    )

    const loading = useAppSelector(
        (state) => state.carsListSlice?.data?.loading || false
    )
    
    const carsList = useAppSelector(
        (state) => state.carsListSlice?.data?.carList || []
    )

    useEffect(() => {
        
        const params = {
            limit,
            page: pageIndex,
            search: query,
            sort: sort.order,
            sortField: sort.key
        }

        dispatch(getCars(params))
    }, [pageIndex, limit, sort, query, dispatch])

    const columns: ColumnDef<Car>[] = useMemo(
        () => [
            {
                header: 'الاسم',
                accessorKey: 'name',
                sortable: false,
            },
        ],
        []
    )

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={carsList}
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
                            key: sort.key,
                        },
                    })
                )
            }
            onRowClick={(row) => navigate(`/cars/${row.original._id}`)}
        />
    )
}

export default CarsTable