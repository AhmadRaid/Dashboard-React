import { GetOrdersParams, GetOrdersResponse, Order } from '@/@types/order'
import axios from 'axios'

export const apiGetOrders = async (params: GetOrdersParams) => {
    const response = await axios.get<GetOrdersResponse>('/orders', { params })
    return response
}

export const apiGetOrderDetails = async (id: string) => {
    const response = await axios.get<{ data: Order }>(`/orders/${id}`)
    return response
}