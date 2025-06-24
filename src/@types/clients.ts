export interface GetClientsParams {
    offset: number
    limit: number
    search?: string
}

export type Client = {
    _id: string
    fullName: string
    email: string
    clientType: string
    phone: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    orderStats?: {
        totalOrders: number
        activeGuarantees: number
    }
    orders?: Order[]
}



export type Guarantee = {
    // products: string[]
    typeGuarantee: string
    startDate: string
    endDate: string
    terms: string
    coveredComponents: string[]
}
export type CreateGurantee = {
    typeGuarantee: string
    startDate: string
    endDate: string
    terms: string
}

export type CreateClient = {
    fullName: string
    email: string
    phone: string
    clientType: string
    carModel: string
    carColor: string
    service: string
    guarantee: Guarantee
}
export interface Pagination {
    totalClients: number
    limit: number
    offset: number
}

interface ClientsResponse {
    clients: Client[]
    pagination: Pagination
}

export interface GetClientsResponse {
    data: ClientsResponse
    total: number
}



export type Order = {
    _id?: string
    clientId?: string
    carModel: string
    carColor: string
    service: string
    createdAt?: string
    updatedAt?: string
    guarantee: OrdersGuarantee[]
}

export type OrdersGuarantee = {
    _id?: string
    products: string[]
    typeGuarantee: string
    startDate: string
    endDate: string
    terms: string
    status?: string
    coveredComponents: string[]
}
export type ClientWithOrdersData = {
    _id?: string
    firstName: string
    middleName: string
    lastName: string
    email: string
    phone: string
    orderStats: {
        totalOrders: number
        activeGuarantees: number
    }
    clientType: 'individual' | 'company'
    isDeleted: boolean
    createdAt?: string
    updatedAt?: string
    orders: Order[]
}

export type CreateService = {
    name: string
    description: string
}
