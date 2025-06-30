import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetCarTypes } from '@/services/CarsService'
import { RootState } from '../rootReducer'

interface CarType {
    _id: string
    name: string
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

interface Pagination {
    totalCarTypes: number
    currentPage: number
    totalPages: number
    nextPage: number
    limit: number
    offset: number
}

interface ApiResponse {
    carTypes: CarType[]
    pagination: Pagination
}

interface TableState {
    pageIndex: number
    limit: number
    query: string
    sort: {
        order: 'asc' | 'desc' | ''
        key: string
    }
    total?: number
}

export interface CarTypesListState {
    data: CarType[]
    loading: boolean
    error: string | null
    tableState: TableState
}

const initialState: CarTypesListState = {
    data: [],
    loading: false,
    error: null,
    tableState: {
        pageIndex: 1,
        limit: 10,
        query: '',
        sort: {
            order: '',
            key: ''
        }
    }
}

export const fetchCarTypes = createAsyncThunk(
    'carTypes/fetch',
    async (_, { getState }) => {
        const state = getState() as RootState
        const { pageIndex, limit, query } = state.carTypesList.tableState
        
        const response = await apiGetCarTypes({
            limit,
            offset: (pageIndex - 1) * limit,
            search: query
        })
        return response.data.data
    }
)

export const carTypesListSlice = createSlice({
    name: 'carTypesList',
    initialState,
    reducers: {
        setTableState: (state, action: PayloadAction<Partial<TableState>>) => {
            state.tableState = {
                ...state.tableState,
                ...action.payload
            }
        },
        resetState: () => initialState
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
                state.tableState.total = action.payload.pagination.totalCarTypes
            })
            .addCase(fetchCarTypes.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch car types'
            })
    }
})

export const { setTableState, resetState } = carTypesListSlice.actions
export const selectCarTypes = (state: RootState) => state.carTypesList
export default carTypesListSlice.reducer