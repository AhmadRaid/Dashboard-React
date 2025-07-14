import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    ///////////////////////////////////// Client Route /////////////////////////////////////
    {
        key: 'clientsMenu.clientsList',
        path: '/clients',
        component: lazy(() => import('@/views/clients/ClientsList')),
        authority: [],
    },
    {
        key: 'clientsMenu.createClient',
        path: '/clients/create-client',
        component: lazy(
            () => import('@/views/clients/CreateClient/CreateClient')
        ),
        authority: [],
    },
    {
        key: 'clientsMenu.viewClient',
        path: '/clients/:clientId',
        component: lazy(
            () => import('@/views/clients/ClientOrders/ClientOrders')
        ),
        authority: [],
    },

    {
        key: 'clientsMenu.updateProfile',
        path: '/clients/:clientId/updateProfile',
        component: lazy(() => import('@/views/clients/UpdateClient')),
        authority: [],
    },

    {
        key: 'clientsMenu.clientRating',
        path: '/clients/:clientId/UpdateRating',
        component: lazy(
            () => import('@/views/clients/ClientRating/ClientRatingForm')
        ),
        authority: [],
    },

    ///////////////////////////////////// Order Route /////////////////////////////////////

    {
        key: 'ordersMenu.ordersList',
        path: '/orders',
        component: lazy(
            () => import('@/views/orders/orderList/components/OrdersTable')
        ),
        authority: [],
    },
    {
        key: 'ordersMenu.AddOrder',
        path: '/orders/add-order/:clientId',
        component: lazy(() => import('@/views/orders/AddOrder/OrderForm')),
        authority: [],
    },

    {
        key: 'ordersMenu.AddService',
        path: '/orders/add-service/:clientId',
        component: lazy(
            () => import('@/views/orders/OrderService/ServiceForm')
        ),
        authority: [],
    },
    {
        key: 'ordersMenu.UpdateProfile',
        path: '/clients/updateProfile/:clientId',
        component: lazy(() => import('@/views/clients/ClientProfile')),
        authority: [],
    },

    {
        key: 'ordersMenu.OrderDetails',
        path: '/orders/:orderId',
        component: lazy(() => import('@/views/orders/OrderDetails')),
        authority: [],
    },
    {
        key: 'clientsMenu.branchClients',
        path: '/clients/:branchType',
        component: lazy(() => import('@/views/clients/ClientsList')),
        authority: [],
    },
    ///////////////////////////////////// Invoice Route /////////////////////////////////////

    {
        key: 'invoicesMenu.invoicesList',
        path: '/invoices',
        component: lazy(
            () => import('@/views/invoices/InvoiceList/components/InvoicesList')
        ),
        authority: [],
    },

        {
        key: 'invoicesMenu.reportInvoices',
        path: '/invoices/financial-reports/:clientId',
        component: lazy(
            () => import('@/views/reports/FinancialReports/ClientFinancialReports')
        ),
        authority: [],
    },
]
