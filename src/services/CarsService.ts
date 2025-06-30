import {
    CreateClient,
    CreateGurantee,
    CreateService,
    GetClientsParams,
    GetClientsResponse,
} from '@/@types/clients'
import ApiService from './ApiService'
import { GetCarsParams, GetCarsResponse } from '@/@types/cars'


interface GetCarTypesResponse {
    status: string
    code: number
    data: {
        pagination: {
            totalCarTypes: number
            currentPage: number
            totalPages: number
            nextPage: number
            limit: number
            offset: number
        }
        carTypes: Array<{
            _id: string
            name: string
            isActive: boolean
            isDeleted: boolean
            createdAt: string
            updatedAt: string
            __v: number
        }>
    }
    message: string
}

// export const apiGetCarTypes = async (params: {
//     limit: number
//     offset: number
//     search?: string
// }): Promise<{ data: GetCarTypesResponse }> => {
//     return axios.get('/car-types', { params })
// }

export async function apiGetCarTypes(params: {
    limit: number
    offset: number
    search?: string
}) {
    return ApiService.fetchData<GetCarsResponse, GetCarsParams>({
        url: '/car-types',
        method: 'get',
        params,
    })
}

export async function apiCreateNewCar(data: CreateClient) {
    return ApiService.fetchData({
        url: '/car-types',
        method: 'post',
        data,
    })
}

