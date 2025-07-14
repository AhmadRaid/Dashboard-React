export interface Client {
    _id: string
    name: string
    phone: string
    email?: string
}

export interface ServiceItem {
    serviceId: string
    serviceName: string
    servicePrice: number
    quantity: number
    total: number
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'partially_paid' | 'cancelled'

// src/@types/invoice.d.ts (or add to an existing types file)

export interface FinancialReportData {
    client: {
        _id: string;
        firstName: string;
        middleName: string;
        lastName: string;
        clientNumber: string;
        email?: string;
        phone?: string;
    };
    totalInvoices: number;
    totalSubtotal: number;
    totalTaxAmount: number;
    totalAmount: number;
    averageInvoiceAmount: number;
}

export interface Invoice {
    _id: string
    invoiceNumber: string
    invoiceDate: Date
    dueDate: Date
    clientId: Client
    orderId?: string
    services: ServiceItem[]
    subtotal: number
    taxRate: number
    taxAmount: number
    discount?: number
    totalAmount: number
    amountPaid: number
    balanceDue: number
    status: InvoiceStatus
    notes?: string
    terms?: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateInvoice {
    clientId: string
    orderId?: string
    invoiceDate: Date
    dueDate: Date
    services: Array<{
        serviceId: string
        quantity: number
    }>
    taxRate: number
    discount?: number
    notes?: string
    terms?: string
}

export interface UpdateInvoice {
    invoiceDate?: Date
    dueDate?: Date
    services?: Array<{
        serviceId: string
        quantity: number
    }>
    taxRate?: number
    discount?: number
    notes?: string
    terms?: string
}

export interface GetInvoicesParams {
    page?: number
    limit?: number
    sort?: string
    query?: string
    status?: InvoiceStatus
    startDate?: string
    endDate?: string
}

export interface GetInvoicesResponse {
    data: Invoice[]
    total: number
    page: number
    limit: number
}