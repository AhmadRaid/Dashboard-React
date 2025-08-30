import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetStatistics } from '@/services/ClientsService'

export const SLICE_NAME = 'StatisticsSlice'

// تعريف نوع الإحصائيات
export interface Statistics {
    todaySales: number
    rollCuttingOrders: number
    cutRollsQuantity: number
    totalAppointments: number
    confirmedBookings: number
    pendingOffers: number
}

export interface StatisticsState {
    loading: boolean
    statistics: Statistics
}

const initialState: StatisticsState = {
    statistics: {
        todaySales: 0,
        rollCuttingOrders: 0,
        cutRollsQuantity: 0,
        totalAppointments: 0,
        confirmedBookings: 0,
        pendingOffers: 0
    },
    loading: false,
}

export const getStatistics = createAsyncThunk(
    'statistics-data',
    async (): Promise<Statistics> => {
        const response = await apiGetStatistics()
        return response.data as Statistics
    }
)

const StatisticsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStatistics.pending, (state) => {
                state.loading = true
            })
            .addCase(getStatistics.fulfilled, (state, action: PayloadAction<Statistics>) => {
                state.statistics = action.payload
                state.loading = false
            })
            .addCase(getStatistics.rejected, (state) => {
                state.loading = false
            })
    },
})

export default StatisticsSlice.reducer