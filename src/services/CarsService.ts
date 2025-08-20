import ApiService from './ApiService'
import { CreateCar, GetCarsParams, GetCarsResponse } from '@/@types/cars'

export async function apiGetCars() {
    return ApiService.fetchData<GetCarsResponse, GetCarsParams>({
        url: '/car-types',
        method: 'get',
    })
}

export async function apiAddNewCar(data: CreateCar) {
    return ApiService.fetchData({
        url: '/car-types',
        method: 'post',
        data,
    })
}

export async function apiGetCarDetails(carId: string) {
    return ApiService.fetchData({
        url: `/car-types/${carId}`,
        method: 'get',
    })
}

export async function apiUpdateCar(carId: string, data: CreateCar) {
    return ApiService.fetchData({
        url: `/car-types/${carId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteCar(carId: string, data: any) {
    return ApiService.fetchData({
        url: `/car-types/${carId}`,
        method: 'delete',
        data,
    })
}
