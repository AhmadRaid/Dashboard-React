export interface Guarantee {
    typeGuarantee: string
    startDate: string
    endDate: string
    terms?: string
    notes?: string
    status: string
    accepted: boolean
    _id: string
}

export interface Service {
    _id: string
    serviceType: 'protection' | 'polish' | string
    servicePrice?: number
    protectionFinish?: string
    protectionSize?: string
    protectionCoverage?: string
    polishType?: string
    polishSubType?: string
    dealDetails?: string
    guarantee: Guarantee
}

export interface Order {
    _id: string
    clientId: string
    carType: string
    carModel: string
    carColor: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    services: Service[]
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
    client?: {
        firstName: string
        lastName: string
        phone: string
    }
}

export interface GetOrdersParams {
    limit?: number
    offset?: number
    search?: string
    status?: string
    sort?: string
}

export interface GetOrdersResponse {
    data: {
        orders: Order[]
        pagination: {
            totalOrders: number
        }
    }
    message: string
}