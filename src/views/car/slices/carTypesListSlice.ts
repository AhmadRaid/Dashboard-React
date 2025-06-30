import { apiGetCarTypes } from '@/services/CarsService'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface CarType {
    _id: string
    name: string
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

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
    data: CarType[]
    loading: boolean
    error: string | null
    tableData: TableData
}

const initialState: CarTypesListState = {
    data: [],
    loading: false,
    error: null,
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

export const fetchCarTypes = createAsyncThunk(
    'carTypesList/fetch',
    async (params: { limit: number; offset: number; search?: string }) => {
        const response = await apiGetCarTypes(params)
        return response.data
    }
)

const carTypesListSlice = createSlice({
    name: 'carTypesList',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload,
            }
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCarTypes.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCarTypes.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload.carTypes
                state.tableData.total = action.payload.pagination.totalCarTypes
            })
            .addCase(fetchCarTypes.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch car types'
            })
    },
})

export const { setTableData, resetState } = carTypesListSlice.actions
export default carTypesListSlice.reducer