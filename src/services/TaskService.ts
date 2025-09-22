import ApiService from './ApiService'

export async function apiGetTasks() {
    return ApiService.fetchData({
        url: '/tasks',
        method: 'get',
    })
}

export async function apiAddNewTask(data: any) {
    return ApiService.fetchData({
        url: '/tasks',
        method: 'post',
        data,
    })
}

export async function apiGetTaskDetails(branchId: string) {
    return ApiService.fetchData({
        url: `/tasks/${branchId}`,
        method: 'get',
    })
}

export async function apiUpdateTask(branchId: string, data: any) {
    return ApiService.fetchData({
        url: `/tasks/${branchId}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteTask(branchId: string, data: any) {
    return ApiService.fetchData({
        url: `/tasks/${branchId}`,
        method: 'delete',
        data,
    })
}
