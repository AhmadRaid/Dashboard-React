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

export async function apiGetOrdersDetails(orderId:string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/${orderId}`,
        method: 'get',
    })
}

export async function apiAddOrder(clientId:string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/add-order/${clientId}`,
        method: 'post',
    })
}

export async function apiSendServiceForOrder(data:any) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/add-service`,
        method: 'post',
        data,
    })
}