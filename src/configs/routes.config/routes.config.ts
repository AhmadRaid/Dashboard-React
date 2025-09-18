import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    ///////////////////////////////////// Home Page Route /////////////////////////////////////

    {
        key: 'HomePage',
        path: '/home-page',
        component: lazy(() => import('@/views/Home/index')),
        authority: [],
    },

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
            () => import('@/views/clients/ClientForm/CreateClient')
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
        key: 'clientsMenu.addService',
        path: '/clients/add-service',
        component: lazy(
            () => import('@/views/clients/ClientService/ClientServiceForm')
        ),
        authority: [],
    },

    {
        key: 'clientsMenu.workOrder',
        path: '/clients/work-order',
        component: lazy(
            () => import('@/views/clients/WorkOrder/WorkOrderForm')
        ),
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

    {
        key: 'clientsMenu.branchClients',
        path: '/clients/:branchType',
        component: lazy(() => import('@/views/clients/ClientsList')),
        authority: [],
    },

    {
        key: 'ordersMenu.UpdateProfile',
        path: '/clients/updateProfile/:clientId',
        component: lazy(() => import('@/views/clients/ClientProfile')),
        authority: [],
    },

    {
        key: 'users.clientsCommunication',
        path: '/clients-communication',
        component: lazy(
            () =>
                import(
                    '@/views/clientsCommunication/components/clientsCommunicationList'
                )
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
        component: lazy(() => import('@/views/orders/CreateOrder')),
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
        key: 'ordersMenu.UpdateOrder',
        path: '/orders/UpdateOrder/:orderId',
        component: lazy(() => import('@/views/orders/EditOrder')),
        authority: [],
    },

    {
        key: 'ordersMenu.OrderDetails',
        path: '/orders/:orderId',
        component: lazy(() => import('@/views/orders/OrderDetails')),
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
        key: 'invoicesMenu.InvoiceDetails',
        path: '/invoices/:invoiceId',
        component: lazy(() => import('@/views/invoices/InvoiceDetails')),
        authority: [],
    },

    {
        key: 'invoicesMenu.reportInvoices',
        path: '/invoices/financial-reports/:clientId',
        component: lazy(
            () =>
                import(
                    '@/views/reports/FinancialReports/ClientFinancialReports'
                )
        ),
        authority: [],
    },

    ///////////////////////////////////// Car Route /////////////////////////////////////

    {
        key: 'carsMenu.carsList',
        path: '/cars',
        component: lazy(
            () => import('@/views/cars/carList/components/CarsTable')
        ),
        authority: [],
    },

    {
        key: 'carsMenu.AddCar',
        path: '/cars/add-car',
        component: lazy(() => import('@/views/cars/CreateCar')),
        authority: [],
    },

    {
        key: 'carsMenu.EditCar',
        path: '/cars/edit/:carId',
        component: lazy(() => import('@/views/cars/EditCar')),
        authority: [],
    },

    ///////////////////////////////////// Task Route /////////////////////////////////////

    {
        key: 'taskMenu.TaskList',
        path: '/tasks',
        component: lazy(() => import('@/views/tasks/TaskForm/TaskForm')),
        authority: [],
    },

    {
        key: 'taskMenu.AddTask',
        path: '/tasks/add',
        component: lazy(() => import('@/views/tasks/TaskForm/TaskForm')),
        authority: [],
    },


    /////////////////////////////////// Offer Price ////////////////////////////////////////
    {
        key: 'users.clientsOffersPrice',
        path: '/clients/create-offer-price',
        component: lazy(
            () =>
                import(
                    '@/views/clients/ClientOfferPrice/ClientOfferPriceForm'
                )
        ),
        authority: [],
    },

    // {
    //     key: 'users.clientsCommunication',
    //     path: '/clients-communication',
    //     component: lazy(
    //         () =>
    //             import(
    //                 '@/views/clients/ClientOfferPrice'
    //             )
    //     ),
    //     authority: [],
    // },



        /////////////////////////////////// Branch ////////////////////////////////////////

        {
            key: 'branches.BranchesForm',
            path: '/branches/create-branch',
            component: lazy(
                () =>
                    import(
                        '@/views/branches/BranchForm/BranchForm'
                    )
            ),
            authority: [],
        },

        {
            key: 'branches.BranchesList',
            path: '/branches',
            component: lazy(
                () =>
                    import(
                        '@/views/branches/BranchList/components/BranchesTable'
                    )
            ),
            authority: [],
        }

]
