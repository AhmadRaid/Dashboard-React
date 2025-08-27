import {
    CreateClient,
    CreateGurantee,
    CreateService,
    GetClientsParams,
    GetClientsResponse,
} from '@/@types/clients'
import ApiService from './ApiService'

export async function apiGetClients(params: GetClientsParams) {
    return ApiService.fetchData<GetClientsResponse, GetClientsParams>({
        url: '/clients',
        method: 'get',
        params,
    })
}

export async function apiGetClientProfile(clientId: string) {
    return ApiService.fetchData({
        url: `/clients/${clientId}`, 
        method: 'get',
    })
}

export async function apiGetStatistics() {
    return ApiService.fetchData({
        url: `/statistics`, 
        method: 'get',
    })
}


export async function apiSearchClients(data:string) {
    return ApiService.fetchData({
        url: `/clients?search=${data}`, 
        method: 'get',
    })
}

export async function apiUpdateClient(clientId: string, data: any) {
    return ApiService.fetchData({
        url: `/clients/${clientId}`,
        method: 'patch',
        data,
    })
}


export async function apiCreateNewClient(data: CreateClient) {
    return ApiService.fetchData({
        url: '/clients',
        method: 'post',
        data,
    })
}

export async function apiGetClientOrders(clientId: string | undefined) {
    return ApiService.fetchData({
        url: `/clients/${clientId}`,
        method: 'get',
    })
}

export async function apiCreateOrderGurentee(
    orederId: string | undefined,
    data: CreateGurantee
) {
    return ApiService.fetchData({
        url: `/orders/${orederId}/guarantee`,
        method: 'post',
        data,
    })
}

export async function apiChangeGurenteeStatus(
    orederId: string | undefined,
    guaranteeId: string | undefined,
    data: {
        status: string
    }
) {
    return ApiService.fetchData({
        url: `/orders/${orederId}/guarantee/${guaranteeId}/status`,
        method: 'PATCH',
        data,
    })
}

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
