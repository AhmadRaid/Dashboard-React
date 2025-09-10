import {
    CreateClient,
    CreateGurantee,
    CreateService,
    GetClientsParams,
    GetClientsResponse,
} from '@/@types/clients'
import ApiService from './ApiService'

export async function apiGetAllServices() {
    return ApiService.fetchData({
        url: '/services',
        method: 'get',
    })
}

export async function apiAddService(orderId: string, data: CreateService) {
    return ApiService.fetchData({
        url: `/orders/${orderId}/add-service`,
        method: 'post',
        data,
    })
}
