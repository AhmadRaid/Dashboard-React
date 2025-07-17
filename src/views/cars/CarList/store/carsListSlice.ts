// store/carsListSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Car, GetCarsParams } from '@/@types/cars'
import { apiGetCars } from '@/services/CarsService'

export const SLICE_NAME = 'carsListSlice'

interface TableData {
    pageIndex: number
    limit: number
    total: number
    query: string
    sort: {
        order: '' | 'asc' | 'desc'
        key: string
    }
}

export interface CarsListState {
    loading: boolean
    carList: Car[]
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

export const getCars = createAsyncThunk(
    `${SLICE_NAME}/getCars`,
    async () => {
        try {
            const response = await apiGetCars()
            console.log('respooooonse',response.data.data );
            
            return response.data.data 
        } catch (error) {
            console.error('API Error:', error)
            return error
        }
    }
)

const carsListSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload,
            }
        },
        resetFilters: (state) => {
            state.tableData = {
                ...initialState.tableData,
                pageIndex: 1,
                limit: state.tableData.limit,
                total: state.tableData.total,
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCars.pending, (state) => {
                console.log('PEEEEEENDING',state)
                state.loading = true
            })
            .addCase(getCars.fulfilled, (state, action) => {
                console.log('FULLLLFIELD',state)
                state.carList = action.payload.carTypes
                state.tableData.total = action.payload.pagination.totalCarTypes
                state.loading = false
            })
            .addCase(getCars.rejected, (state, action) => {
                console.log('REEEJECTED',state)
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters } = carsListSlice.actions
export default carsListSlice.reducer