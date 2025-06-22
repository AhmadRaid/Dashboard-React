import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'clientsMenu',
        path: '',
        title: 'قسم العملاء',
        translateKey: 'nav.clientsMenu.clientsMenu',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'clientsMenu.abharClients',
                path: '/clients?branch=عملاء فرع ابحر',
                title: 'عملاء فرع أبحر',
                translateKey: 'nav.clientsMenu.abharClients',
                icon: 'clients',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'clientsMenu.madinaClients',
                path: '/clients?branch=عملاء فرع المدينة',
                title: 'عملاء فرع المدينة',
                translateKey: 'nav.clientsMenu.madinaClients',
                icon: 'clients',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'clientsMenu.otherClients',
                path: '/clients?branch=اخرى',
                title: 'أخرى',
                translateKey: 'nav.clientsMenu.otherClients',
                icon: 'clients',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'clientsMenu.createClient',
                path: '/clients/create-client',
                title: 'إضافة عميل جديد',
                translateKey: 'nav.clientsMenu.createClient',
                icon: 'createClient',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    {
        key: 'servicesMenu',
        path: '',
        title: 'قسم الخدمات',
        icon: 'iconService',
        translateKey: 'nav.servicesMenu.servicesMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'servicesMenu.servicesList',
                path: '/services',
                title: 'قائمة الخدمات',
                translateKey: 'nav.servicesMenu.servicesList',
                icon: 'listService',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesMenu.createService',
                path: '/services/create-service',
                title: 'إنشاء خدمة جديدة',
                translateKey: 'nav.servicesMenu.createService',
                icon: 'createService',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
