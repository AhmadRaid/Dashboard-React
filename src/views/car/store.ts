import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetCarTypes } from '@/services/CarsService'

export const CAR_TYPES_SLICE_NAME = 'carTypesListSlice'

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

export interface CarTypesListState {
    carTypesList: Array<{ name: string }>
    loading: boolean
    tableData: TableData
}

const initialState: CarTypesListState = {
    carTypesList: [],
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

export const getCarTypes = createAsyncThunk(
    `${CAR_TYPES_SLICE_NAME}/getCarTypes`,
    async (params: { limit: number; offset: number; search?: string }) => {
        const response = await apiGetCarTypes(params)
        return response.data
    }
)

const carTypesListSlice = createSlice({
    name: CAR_TYPES_SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCarTypes.pending, (state) => {
                state.loading = true
            })
            .addCase(getCarTypes.fulfilled, (state, action) => {
                state.carTypesList = action.payload.data.carTypes
                state.tableData.total = action.payload.data.pagination.total
                state.loading = false
            })
            .addCase(getCarTypes.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData } = carTypesListSlice.actions
export default carTypesListSlice.reducer