import { GetOrdersParams, GetOrdersResponse, Order } from '@/@types/order'
import axios from 'axios'
import ApiService from './ApiService'

export async function apiGetOrders() {
    return ApiService.fetchData<GetOrdersResponse>({
        url: '/orders',
        method: 'get',
    })
}
export async function apiGetClientOrders(clientId:string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/client/${clientId}`,
        method: 'get',
    })
}

export async function apiSendServiceForOrder(data:any) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/add-service`,
        method: 'post',
        data,
    })
}