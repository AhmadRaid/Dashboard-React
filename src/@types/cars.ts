export type Car = {
    _id: string
    name: string
}

export interface GetCarsParams {
    offset: number
    limit: number
}

export interface Pagination {
    totalCars: number
    limit: number
    offset: number
}


export interface GetCarsResponse {
    data: {
        carTypes: Car[]
        pagination: {
            totalCarTypes: number
            limit: number
        }
    }
}









