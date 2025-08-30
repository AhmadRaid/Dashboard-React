import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
    apiGetClientsCommunication,
} from '@/services/ClientsService'
import { GetClientsParams } from '@/@types/clients'

export const SLICE_NAME = 'clientCommunicationListSlice'

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

export interface clientCommunicationListState {
    clientCommunicationList: any
    loading: boolean
    tableData: TableData
}

const initialState: clientCommunicationListState = {
    clientCommunicationList: [],
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
}

export const getClientsCommunication = createAsyncThunk(
    `${SLICE_NAME}/getClientsCommunication`,
    async (params: GetClientsParams) => {
        const response = await apiGetClientsCommunication(params)
        return response.data
    }
)

const clientCommunicationListSlice = createSlice({
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
            .addCase(getClientsCommunication.pending, (state) => {
                state.loading = true
            })
            .addCase(getClientsCommunication.fulfilled, (state, action) => {
                state.clientCommunicationList = action.payload.data.clientCommunicationList
                state.tableData.total =
                    action.payload.data.pagination.totalClients
                state.loading = false
            })
            .addCase(getClientsCommunication.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters } =
    clientCommunicationListSlice.actions
export default clientCommunicationListSlice.reducer
