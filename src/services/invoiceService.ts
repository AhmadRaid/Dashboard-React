import ApiService from './ApiService'
import {
    CreateInvoice,
    GetInvoicesParams,
    GetInvoicesResponse,
    Invoice,
    InvoiceStatus,
    UpdateInvoice,
} from '@/@types/invoice'

export async function apiGetInvoices() {
    return ApiService.fetchData<GetInvoicesResponse, GetInvoicesParams>({
        url: '/invoices',
        method: 'get',
    })
}

export async function apiGetInvoiceById(invoiceId: string) {
    return ApiService.fetchData<Invoice>({
        url: `/invoices/${invoiceId}`,
        method: 'get',
    })
}

export async function apiGetInvoiceByOrderId(orderId: string) {
    return ApiService.fetchData<Invoice>({
        url: `/invoices/order/${orderId}`,
        method: 'get',
    })
}

export async function apiGetClientInvoices(clientId: string) {
    return ApiService.fetchData<GetInvoicesResponse>({
        url: `/clients/${clientId}/invoices`,
        method: 'get',
    })
}

export async function apiCreateInvoice(data: CreateInvoice) {
    return ApiService.fetchData<Invoice>({
        url: '/invoices',
        method: 'post',
    })
}

export async function apiUpdateInvoice(invoiceId: string, data: UpdateInvoice) {
    return ApiService.fetchData<Invoice>({
        url: `/invoices/${invoiceId}`,
        method: 'patch',
    })
}

export async function apiDeleteInvoice(invoiceId: string) {
    return ApiService.fetchData({
        url: `/invoices/${invoiceId}`,
        method: 'delete',
    })
}

export async function apiUpdateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus
) {
    return ApiService.fetchData<Invoice>({
        url: `/invoices/${invoiceId}/status`,
        method: 'patch',
        data: { status },
    })
}

export async function apiSendInvoiceEmail(invoiceId: string, email: string) {
    return ApiService.fetchData({
        url: `/invoices/${invoiceId}/send`,
        method: 'post',
        data: { email },
    })
}

export async function apiGenerateInvoicePdf(invoiceId: string) {
    return ApiService.fetchData<{ pdfUrl: string }>({
        url: `/invoices/${invoiceId}/generate-pdf`,
        method: 'post',
    })
}

export async function apiGetInvoiceStatistics() {
    return ApiService.fetchData<{
        totalInvoices: number
        paidInvoices: number
        unpaidInvoices: number
        totalRevenue: number
    }>({
        url: '/invoices/statistics',
        method: 'get',
    })
}