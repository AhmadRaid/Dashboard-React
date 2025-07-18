import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Invoice } from '@/@types/invoice'
import { apiGetClientInvoices, apiGetInvoices } from '@/services/invoiceService'

export const SLICE_NAME = 'invoiceListSlice'

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

export interface InvoiceListState {
    invoiceList: Invoice[]
    loading: boolean
    tableData: TableData
    selectedInvoice: Invoice | null
}

const initialState: InvoiceListState = {
    invoiceList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        limit: 10,
        total: 0,
        query: '',
        sort: {
            order: 'desc',
            key: 'invoiceDate',
        },
    },
    selectedInvoice: null,
}

export const getInvoices = createAsyncThunk(
    `${SLICE_NAME}/getInvoices`,
    async () => {
        const response = await apiGetInvoices()
        return response.data
    }
)

export const getClientInvoices = createAsyncThunk(
    `${SLICE_NAME}/getClientInvoices`,
    async (clientId: string) => {
        const response = await apiGetClientInvoices(clientId)
        return response.data
    }
)

const invoiceListSlice = createSlice({
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
            }
        },
        setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
            state.selectedInvoice = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInvoices.pending, (state) => {
                state.loading = true
            })
            .addCase(getInvoices.fulfilled, (state, action) => {
                state.invoiceList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getInvoices.rejected, (state) => {
                state.loading = false
            })
            .addCase(getClientInvoices.pending, (state) => {
                state.loading = true
            })
            .addCase(getClientInvoices.fulfilled, (state, action) => {
                state.invoiceList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getClientInvoices.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters, setSelectedInvoice } = invoiceListSlice.actions
export default invoiceListSlice.reducer