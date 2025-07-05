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
        component: lazy(() => import('@/views/clients/ClientRating/ClientRatingForm')),
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
        key: 'ordersMenu.AddService',
        path: '/orders/add-service/:clientId',
        component: lazy(
            () => import('@/views/orders/OrderService/ServiceForm')
        ),
        authority: [],
    },
    {
        key: 'ordersMenu.AddService',
        path: '/clients/updateProfile/:clientId',
        component: lazy(() => import('@/views/clients/ClientProfile')),
        authority: [],
    },

    // {
    //     key: 'clientsMenu.addService',
    //     path: '/clients/:clientId/add-service',
    //     component: lazy(
    //         () => import('@/views/clients/AddService/AddServicePage')
    //     ),
    //     authority: [],
    // },
    {
        key: 'servicesMenu.createService',
        path: '/services/create-service',
        component: lazy(
            () => import('@/views/services/CreateService/CreateService')
        ),
        authority: [],
    },
    //     {
    //     key: 'order.ordersList',
    //     path: '/orders',
    //     component: lazy(
    //         () => import('@/views/orders/orderList/components/OrdersTable')
    //     ),
    //     authority: [],
    // },
    {
        key: 'clientsMenu.branchClients',
        path: '/clients/:branchType',
        component: lazy(() => import('@/views/clients/ClientsList')),
        authority: [],
    },
    // Commented routes remain unchanged
    // {
    //     key: 'ordersMenu.createOrder',
    //     path: '/orders/create-order',
    //     component: lazy(() => import('@/views/orders/CreateOrder/CreateOrder')),
    //     authority: [],
    // },
    // {
    //     key: 'ordersMenu.viewOrder',
    //     path: '/orders/:orderId',
    //     component: lazy(() => import('@/views/orders/OrderDetails/OrderDetails')),
    //     authority: [],
    // },
    // {
    //     key: 'ordersMenu.clientOrders',
    //     path: '/clients/:clientId/orders',
    //     component: lazy(() => import('@/views/orders/ClientOrders/ClientOrders')),
    //     authority: [],
    // },
    // {
    //     key: 'carsMenu.carsList',
    //     path: '/cars',
    //     component: lazy(() => import('@/views/cars/CarsList/components/CarsList')),
    //     authority: [],
    // },
    // {
    //     key: 'carsMenu.addCar',
    //     path: '/cars/add',
    //     component: lazy(() => import('@/views/cars/CreateCar/CreateCar')),
    //     authority: [],
    // },
    // {
    //     key: 'servicesMenu.servicesList',
    //     path: '/services',
    //     component: lazy(() => import('@/views/services/ServicesList')),
    //     authority: [],
    // },
]
