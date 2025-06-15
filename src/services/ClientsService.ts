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

// ?search=
// phone number or name

export async function apiCreateNewClient(data: CreateClient) {
    return ApiService.fetchData({
        url: '/clients',
        method: 'post',
        data,
    })
}

export async function apiGetClientOrders(orederId: string | undefined) {
    return ApiService.fetchData({
        url: `/clients/${orederId}`,
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
