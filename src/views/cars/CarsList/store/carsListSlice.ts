import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetCars } from '@/services/CarsService'
import {
    Car,
    GetCarsParams,
    GetCarsResponse,
    Pagination,
} from '@/@types/cars'

export const SLICE_NAME = 'carsListSlice'

interface TableData {
    pageIndex: number
    limit: number
    total: number
    query: string
    sort: {
        order: string
        key: string
    }
}

export interface CarsListState {
    carList: Car[]
    loading: boolean
    tableData: TableData
}

const initialState: CarsListState = {
    carList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        limit: 10,
        total: 0,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
}

export const getCars = createAsyncThunk<
    GetCarsResponse,
    GetCarsParams
>('cars/getCars', async (params) => {
    const response = await apiGetCars(params)
    return response.data
})

const carsListSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<TableData>) => {
            state.tableData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCars.pending, (state) => {
                state.loading = true
            })
            .addCase(getCars.fulfilled, (state, action) => {
                state.carList = action.payload.data.cars
                state.tableData.total = action.payload.data.pagination.totalCars
                state.tableData.limit = action.payload.data.pagination.limit
                state.loading = false
            })
            .addCase(getCars.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData } = carsListSlice.actions
export default carsListSlice.reducer