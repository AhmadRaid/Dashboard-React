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
    orderNumber: string
    client: {
        _id: string
        firstName: string
        secondName: string
        thirdName: string
        lastName: string
        email: string
        phone: string
        clientType: string
    }
    invoice: {
        invoiceNumber: string
        subtotal: number
        taxRate: number
        taxAmount: number
        totalAmount: number
        notes: string
        invoiceDate: string
    }
    carModel: string
    carColor: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    branch: string
    services: Array<{
        serviceType: string
        dealDetails: string
        protectionFinish?: string
        protectionSize?: string
        protectionCoverage?: string
        protectionColor?: string
        insulatorType?: string
        insulatorCoverage?: string
        polishType?: string
        polishSubType?: string
        additionType?: string
        washScope?: string
        servicePrice?: number
        serviceDate?: string
        guarantee?: {
            typeGuarantee: string
            startDate: string
            endDate: string
            terms: string
            Notes: string
        }
    }>
    status: string
    createdAt: string
    updatedAt: string
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
    }
    message: string
}
