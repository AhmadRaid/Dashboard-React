import { ClientWithOrdersData } from '@/@types/clients'
import { apiGetClientOrders } from '@/services/ClientsService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export type clientOrdersState = {
    loading: boolean
    ordersData: ClientWithOrdersData | any
}

export const SLICE_NAME = 'clientOrdersSlice'

export const getClientOrders = createAsyncThunk(
    SLICE_NAME + '/getOrders',
    async (orederId: string | undefined) => {
        const response = await apiGetClientOrders(orederId)

        return response?.data?.data
    }
)

// export const updateProject = async <T, U extends Record<string, unknown>>(
//     data: U,
//     id: string
// ) => {
//     const response = await apiUpdateProject(data, id)
//     return response.data
// }

// export const deleteProject = async <T, U extends Record<string, unknown>>(
//     data: U
// ) => {
//     const response = await apiDeleteProject(data)
//     return response.data
// }

const initialState: clientOrdersState = {
    loading: true,
    ordersData: {},
}

const clientOrdersSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClientOrders.fulfilled, (state, action) => {
                state.ordersData = action.payload
                state.loading = false
            })
            .addCase(getClientOrders.pending, (state) => {
                state.loading = true
            })
    },
})

export default clientOrdersSlice.reducer
