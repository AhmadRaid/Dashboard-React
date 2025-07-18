import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { userRoles } from '@/@types/roles'

const navigationConfig: NavigationTree[] = [
    // 1. العملاء (Existing Clients Section)
    {
        key: 'clientsMenu',
        path: '',
        title: 'العملاء',
        translateKey: 'nav.clientsMenu.clientsMenu',
        icon: 'clientss',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'clientsMenu.clientsList',
                path: '/clients',
                title: 'قائمة العملاء',
                translateKey: 'nav.clientsMenu.updateClient',
                icon: 'userEdit',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.addClient',
                path: '/clients/create-client',
                title: 'إضافة عميل',
                translateKey: 'nav.clientsMenu.addClient',
                icon: 'userPlus',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },

            {
                key: 'clientsMenu.customReport',
                path: '/clients/custom-report',
                title: 'تقرير عملاء مخصص',
                translateKey: 'nav.clientsMenu.customReport',
                icon: 'report',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN],
                subMenu: [],
            },
        ],
    },

    // 2. الخدمات والمبيعات (Services & Sales)
    {
        key: 'servicesSales',
        path: '',
        title: 'الخدمات والمبيعات',
        icon: 'sales',
        translateKey: 'nav.servicesSales.servicesSales',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'order.orderList',
                path: '/orders',
                title: 'قائمة الخدمات والمبيعات',
                translateKey: 'nav.servicesSales.createInvoice',
                icon: 'invoice',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.createQuote',
                path: '/sales/create-quote',
                title: 'إنشاء عرض سعر',
                translateKey: 'nav.servicesSales.createQuote',
                icon: 'quote',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.paymentVouchers',
                path: '/sales/payment-vouchers',
                title: 'سند صرف وقبض',
                translateKey: 'nav.servicesSales.paymentVouchers',
                icon: 'payment',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.bookAppointment',
                path: '/appointments/book',
                title: 'حجز موعد',
                translateKey: 'nav.servicesSales.bookAppointment',
                icon: 'calendar',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.statusReport',
                path: '/reports/status',
                title: 'تقرير حالة',
                translateKey: 'nav.servicesSales.statusReport',
                icon: 'status',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesMenu',
                path: '',
                title: 'إدارة الخدمات',
                translateKey: 'nav.servicesMenu.servicesMenu',
                icon: 'services',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'servicesMenu.servicesList',
                        path: '/services',
                        title: 'قائمة الخدمات',
                        translateKey: 'nav.servicesMenu.servicesList',
                        icon: 'list',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'servicesMenu.createService',
                        path: '/services/create-service',
                        title: 'إنشاء خدمة جديدة',
                        translateKey: 'nav.servicesMenu.createService',
                        icon: 'plus',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },

    // 3. المستخدمين (Users)
    {
        key: 'users',
        path: '',
        title: 'المستخدمين',
        icon: 'users',
        translateKey: 'nav.users.users',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'users.manageUsers',
                path: '/users/manage',
                title: 'إدارة المستخدمين',
                translateKey: 'nav.users.manageUsers',
                icon: 'userManagement',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'users.rolesPermissions',
                path: '/users/roles',
                title: 'الصلاحيات والأدوار',
                translateKey: 'nav.users.rolesPermissions',
                icon: 'permissions',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'users.activityLog',
                path: '/users/activity-log',
                title: 'سجل النشاطات',
                translateKey: 'nav.users.activityLog',
                icon: 'activity',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    {
        key: 'cars',
        path: '',
        title: 'السيارات',
        translateKey: 'nav.clientsMenu.clientsMenu',
        icon: 'clientss',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'carsMenu.carsList',
                path: '/cars',
                title: 'قائمة السيارات',
                translateKey: 'nav.clientsMenu.addClient',
                icon: 'userPlus',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'carsMenu.addCar',
                path: '/cars/add-car',
                title: 'إضافة سيارة',
                translateKey: 'nav.clientsMenu.addClient',
                icon: 'userPlus',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    // 4. المستودع (Warehouse)
    {
        key: 'warehouse',
        path: '',
        title: 'المستودع',
        icon: 'warehouse',
        translateKey: 'nav.warehouse.warehouse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
        subMenu: [
            {
                key: 'warehouse.expenses',
                path: '/warehouse/expenses',
                title: 'المصروفات (المشتريات)',
                translateKey: 'nav.warehouse.expenses',
                icon: 'expenses',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.branchInventory',
                path: '/warehouse/inventory',
                title: 'مخزون الفرع',
                translateKey: 'nav.warehouse.branchInventory',
                icon: 'inventory',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.internalSupply',
                path: '/warehouse/internal-supply',
                title: 'طلب توريد داخلي',
                translateKey: 'nav.warehouse.internalSupply',
                icon: 'internal',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.externalSupply',
                path: '/warehouse/external-supply',
                title: 'طلب توريد خارجي',
                translateKey: 'nav.warehouse.externalSupply',
                icon: 'external',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
        ],
    },

    // 5. إدارة فروع (Branches Management - Existing)
    {
        key: 'branchesManagement',
        path: '',
        title: 'إدارة فروع',
        icon: 'branches',
        translateKey: 'nav.branchesManagement.branchesManagement',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
        subMenu: [
            {
                key: 'branchesManagement.dailyReports',
                path: '',
                title: 'تقرير يومي',
                translateKey: 'nav.branchesManagement.dailyReports',
                icon: 'report',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [
                    {
                        key: 'branchesManagement.dailyServicesReport',
                        path: '/reports/daily-services',
                        title: 'تقرير خدمات مقدمة في نفس اليوم',
                        translateKey:
                            'nav.branchesManagement.dailyServicesReport',
                        icon: 'services',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                    {
                        key: 'branchesManagement.dateRangeReport',
                        path: '/reports/date-range',
                        title: 'تقرير لفترة',
                        translateKey: 'nav.branchesManagement.dateRangeReport',
                        icon: 'calendar',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                    {
                        key: 'branchesManagement.serviceTypeReport',
                        path: '/reports/service-type',
                        title: 'تقرير لنوع الخدمة',
                        translateKey:
                            'nav.branchesManagement.serviceTypeReport',
                        icon: 'serviceType',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'branchesManagement.monthlyClosing',
                path: '',
                title: 'الاغلاق الشهري',
                translateKey: 'nav.branchesManagement.monthlyClosing',
                icon: 'monthly',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [
                    {
                        key: 'branchesManagement.incomeClosing',
                        path: '/monthly-closing/income',
                        title: 'اغلاق الدخل الشهري',
                        translateKey: 'nav.branchesManagement.incomeClosing',
                        icon: 'income',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                    {
                        key: 'branchesManagement.warehouseClosing',
                        path: '/monthly-closing/warehouse',
                        title: 'اغلاق المستودعات الداخلية',
                        translateKey: 'nav.branchesManagement.warehouseClosing',
                        icon: 'warehouse',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default navigationConfig
