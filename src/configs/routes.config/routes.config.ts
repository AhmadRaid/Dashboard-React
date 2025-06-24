import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
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
        key: 'carsMenu.carsList',
        path: '/cars',
        component: lazy(() => import('@/views/cars/CarsList/components/CarsList')),
        authority: [],
    },
    {
        key: 'carsMenu.addCar',
        path: '/cars/add',
        component: lazy(() => import('@/views/cars/CreateCar/CreateCar')),
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
        key: 'servicesMenu.servicesList',
        path: '/services',
        component: lazy(() => import('@/views/services/ServicesList')),
        authority: [],
    },
    {
        key: 'servicesMenu.createService',
        path: '/services/create-service',
        component: lazy(
            () => import('@/views/services/CreateService/CreateService')
        ),
        authority: [],
    },
    {
        key: 'clientsMenu.branchClients',
        path: '/clients/:branchType',
        component: lazy(() => import('@/views/clients/ClientsList')),
        authority: [],
    },
]
