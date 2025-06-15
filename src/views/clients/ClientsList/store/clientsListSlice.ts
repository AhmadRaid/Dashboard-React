import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetClients } from '@/services/ClientsService'
import {
    Client,
    GetClientsParams,
    GetClientsResponse,
    Pagination,
} from '@/@types/clients'

export const SLICE_NAME = 'clientsListSlice'

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

export interface ClientsListState {
    clientList: Client[]
    loading: boolean
    tableData: TableData
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
    },
}

export const getClients = createAsyncThunk<
    GetClientsResponse,
    GetClientsParams
>('clients/getClients', async (params) => {
    console.log(params, params)

    const response = await apiGetClients(params)
    console.log(response.data)

    return response.data
})

const clientsListSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<TableData>) => {
            state.tableData = action.payload
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
                state.tableData.limit = action.payload.data.pagination.limit
                state.loading = false
            })
            .addCase(getClients.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData } = clientsListSlice.actions
export default clientsListSlice.reducer
