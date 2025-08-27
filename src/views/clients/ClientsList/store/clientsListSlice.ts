import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetClients, apiGetStatistics } from '@/services/ClientsService'
import { Client, GetClientsParams, GetClientsResponse } from '@/@types/clients'

export const SLICE_NAME = 'clientsListSlice'

interface TableData {
    pageIndex: number
    limit: number
    total: number
    query: string
    sort: {
        order: '' | 'asc' | 'desc'
        key: string
    }
    branchFilter: string
}

export interface ClientsListState {
    clientList: Client[]
    loading: boolean
    tableData: TableData
    statistics: any
}

const initialState: ClientsListState = {
    clientList: [],
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
        branchFilter: '',
    },
    statistics: {},
}

export const getClients = createAsyncThunk(
    `${SLICE_NAME}/getClients`,
    async (params: GetClientsParams) => {
        const response = await apiGetClients(params)
        return response.data
    }
)

export const getStatistics = createAsyncThunk(
    'clientsList/data/getStatistics',
    async () => {
        const response = await apiGetStatistics()
        return response.data
    }
)

const clientsListSlice = createSlice({
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
            .addCase(getClients.pending, (state) => {
                state.loading = true
            })
            .addCase(getClients.fulfilled, (state, action) => {
                state.clientList = action.payload.data.clients
                state.tableData.total =
                    action.payload.data.pagination.totalClients
                state.loading = false
                state.statistics = action.payload

            })
            .addCase(getClients.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters } = clientsListSlice.actions
export default clientsListSlice.reducer
