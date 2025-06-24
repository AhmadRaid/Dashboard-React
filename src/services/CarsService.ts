import {
    CreateClient,
    CreateGurantee,
    CreateService,
    GetClientsParams,
    GetClientsResponse,
} from '@/@types/clients'
import ApiService from './ApiService'
import { GetCarsParams, GetCarsResponse } from '@/@types/cars'

export async function apiGetCars(params: GetCarsParams) {
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

