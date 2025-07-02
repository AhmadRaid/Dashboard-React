import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetOrders } from '@/services/OrdersService'
import { GetOrdersParams, Order } from '@/@types/order'

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
    statusFilter: string
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
    `${SLICE_NAME}/getOrders`,
    async (params: GetOrdersParams) => {
        const response = await apiGetOrders(params)
        return response.data
    }
)

// export const getOrderDetails = createAsyncThunk(
//     `${SLICE_NAME}/getOrderDetails`,
//     async (id: string) => {
//         const response = await apiGetOrderDetails(id)
//         return response.data.data
//     }
// )

const ordersListSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload
            }
        },
        resetFilters: (state) => {
            state.tableData = {
                ...initialState.tableData,
                pageIndex: 1,
                limit: state.tableData.limit,
                total: state.tableData.total
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
                state.orderList = action.payload.data.orders
                state.tableData.total = action.payload.data.pagination.totalOrders
                state.loading = false
            })
            .addCase(getOrders.rejected, (state) => {
                state.loading = false
            })
            // .addCase(getOrderDetails.fulfilled, (state, action) => {
            //     state.selectedOrder = action.payload
            // })
    },
})

export const { setTableData, resetFilters, setSelectedOrder } = ordersListSlice.actions
export default ordersListSlice.reducer