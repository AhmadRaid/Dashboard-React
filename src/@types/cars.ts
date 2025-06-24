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

interface CarsResponse {
    cars: Car[]
    pagination: Pagination
}


export interface GetCarsResponse {
    data: CarsResponse
    total: number
}








