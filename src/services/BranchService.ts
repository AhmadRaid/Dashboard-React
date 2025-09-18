import ApiService from './ApiService'

export async function apiGetBranches() {
    return ApiService.fetchData({
        url: '/branches',
        method: 'get',
    })
}

export async function apiAddNewBranch(data: any) {
    return ApiService.fetchData({
        url: '/branches',
        method: 'post',
        data,
    })
}

export async function apiGetBranchDetails(carId: string) {
    return ApiService.fetchData({
        url: `/branches/${carId}`,
        method: 'get',
    })
}

export async function apiUpdateBranch(carId: string, data: any) {
    return ApiService.fetchData({
        url: `/branches/${carId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteBranch(carId: string, data: any) {
    return ApiService.fetchData({
        url: `/branches/${carId}`,
        method: 'delete',
        data,
    })
}
