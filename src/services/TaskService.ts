import ApiService from './ApiService'

export async function apiGetTasksForSpecificBranch() {
    return ApiService.fetchData({
        url: '/tasks',
        method: 'get',
    })
}

export async function apiGetTasks() {
    return ApiService.fetchData({
        url: '/tasks/admin-all',
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

export async function apiGetTaskDetails(taskId: string) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}`,
        method: 'get',
    })
}

export async function apiUpdateTask(taskId: string, data: any) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}`,
        method: 'put',
        data,
    })
}

export async function apiMakeTaskCompleted(taskId: string, data: any) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}/complete`,
        method: 'put',
        data,
    })
}

export async function apiDeleteTask(taskId: string, data: any) {
    return ApiService.fetchData({
        url: `/tasks/${taskId}`,
        method: 'delete',
        data,
    })
}
