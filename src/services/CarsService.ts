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

export async function apiGetCars() {
    
    return ApiService.fetchData<GetCarsResponse, GetCarsParams>({
        url: '/car-types',
        method: 'get',
    })
}

export async function apiAddNewCar(data: CreateClient) {
    return ApiService.fetchData({
        url: '/car-types',
        method: 'post',
        data,
    })
}
