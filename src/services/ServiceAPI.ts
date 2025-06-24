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

export async function apiCreateService(data: CreateService) {
    return ApiService.fetchData({
        url: '/services',
        method: 'post',
        data,
    })
}
