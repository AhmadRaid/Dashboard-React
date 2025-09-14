import { GetOrdersParams, GetOrdersResponse, Order } from '@/@types/order'
import axios from 'axios'
import ApiService from './ApiService'

export async function apiGetOrders() {
    return ApiService.fetchData<GetOrdersResponse>({
        url: '/orders',
        method: 'get',
    })
}
export async function apiGetClientOrders(clientId: string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/client/${clientId}`,
        method: 'get',
    })
}

export async function apiGetOrdersDetails(orderId: string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/${orderId}`,
        method: 'get',
    })
}

export async function apiAddOrder(clientId: string, data: any) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/add-order/${clientId}`,
        method: 'post',
        data,
    })
}

export async function apiUpdateOrder(orderId: string, data: any) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/${orderId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteOrder(orderId: string) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/${orderId}`,
        method: 'delete',
    })
}

export async function apiSendServiceForOrder(data: any) {
    return ApiService.fetchData<GetOrdersResponse>({
        url: `/orders/add-service`,
        method: 'post',
        data,
    })
}

export async function apiChangeGurenteeStatus(
    orderId: string,
    serviceId: string,
    guaranteeId: string, // This should now receive the actual guarantee ID
    data: {
        status: 'active' | 'inactive'
    }
) {
    return ApiService.fetchData({
        url: `/orders/${orderId}/service/${serviceId}/guarantee/${guaranteeId}/status`,
        method: 'PATCH',
        data,
    })
}