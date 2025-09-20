import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import Cookies from 'js-cookie'

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        const accessToken = Cookies.get('accessToken')

        console.log(accessToken)

        // أضف عنوان التفويض (Authorization header) إلى الطلب إذا كان التوكن موجوداً
        if (accessToken) {
            param.headers = {
                ...param.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        }

        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

export default ApiService
