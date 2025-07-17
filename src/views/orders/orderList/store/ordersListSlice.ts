import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetOrders } from '@/services/OrdersService'
import { GetOrdersParams, Order } from '@/@types/order'
import { apiGetClientOrders } from '@/services/ClientsService'

export const SLICE_NAME = 'ordersListSlice'

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

export interface OrdersListState {
    orderList: Order[]
    loading: boolean
    tableData: TableData
    selectedOrder: Order | null
}

const initialState: OrdersListState = {
    orderList: [],
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
        statusFilter: '',
    },
    selectedOrder: null,
}

export const getOrders = createAsyncThunk(
    `${SLICE_NAME}/getOrdersList`,
    async () => {
        const response = await apiGetOrders()
        return response?.data
    }
)

export const getClientOrders = createAsyncThunk(
    `${SLICE_NAME}/getClientOrders`,
    async (clientId: string, { rejectWithValue }) => {
        try {
            const response = await apiGetClientOrders(clientId)
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const ordersListSlice = createSlice({
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
        setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
            state.selectedOrder = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrders.fulfilled, (state, action) => {

                state.orderList = action.payload.data
                state.loading = false
            })
            .addCase(getOrders.rejected, (state) => {
                state.loading = false
            })
            .addCase(getClientOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(getClientOrders.fulfilled, (state, action) => {
                state.orderList = action.payload.data
                state.loading = false
            })
            .addCase(getClientOrders.rejected, (state) => {
                console.log(action.payload)

                state.loading = false
            })
    },
})

export const { setTableData, resetFilters, setSelectedOrder } =
    ordersListSlice.actions
export default ordersListSlice.reducer
