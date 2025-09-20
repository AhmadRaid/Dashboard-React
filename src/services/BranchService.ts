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

export async function apiGetBranchDetails(branchId: string) {
    return ApiService.fetchData({
        url: `/branches/${branchId}`,
        method: 'get',
    })
}

export async function apiUpdateBranch(branchId: string, data: any) {
    return ApiService.fetchData({
        url: `/branches/${branchId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteBranch(branchId: string, data: any) {
    return ApiService.fetchData({
        url: `/branches/${branchId}`,
        method: 'delete',
        data,
    })
}
