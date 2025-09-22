import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { userRoles } from '@/@types/roles'

const navigationConfig: NavigationTree[] = [
    // الوصول السريع (Quick Access)
    {
        key: 'quickAccess',
        path: '',
        title: 'الخدمات',
        translateKey: 'nav.quickAccess.quickAccess',
        icon: 'users',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'quickAccess.addCar',
                path: '/clients/create-client',
                title: 'اضافة سيارة',
                translateKey: 'nav.quickAccess.addCar',
                icon: 'plusCircle',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'quickAccess.addService',
                path: '/clients/add-service',
                title: 'اضافة خدمة',
                translateKey: 'nav.quickAccess.addService',
                icon: 'plusCircle',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'clientsMenu.addClient',
                path: '/clients/create-client',
                title: 'إضافة عميل',
                translateKey: 'nav.clientsMenu.addClient',
                icon: 'userAdd', // أيقونة إضافة مستخدم
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.workOrder',
                path: '/clients/work-order',
                title: 'امر عمل',
                translateKey: 'nav.clientsMenu.workOrder',
                icon: 'documentText', // أيقونة مستند نصي
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
        ],
    },
    {
        key: 'clientsMenu',
        path: '',
        title: 'العملاء',
        translateKey: 'nav.clientsMenu.clientsMenu',
        icon: 'users', // تغيير من 'clientss' إلى 'users' (أكثر وضوحًا)
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'clientsMenu.clientsList',
                path: '/clients',
                title: 'قائمة العملاء',
                translateKey: 'nav.clientsMenu.updateClient',
                icon: 'userGroup', // أيقونة مجموعة المستخدمين
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.addClient',
                path: '/clients/create-client',
                title: 'إضافة عميل',
                translateKey: 'nav.clientsMenu.addClient',
                icon: 'userAdd', // أيقونة إضافة مستخدم
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.workOrder',
                path: '/clients/work-order',
                title: 'امر عمل',
                translateKey: 'nav.clientsMenu.workOrder',
                icon: 'documentText', // أيقونة مستند نصي
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.customReport',
                path: '/clients/custom-report',
                title: 'تقرير عملاء مخصص',
                translateKey: 'nav.clientsMenu.customReport',
                icon: 'chartBar', // أيقونة الرسم البياني
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
        title: 'المبيعات',
        icon: 'shoppingCart', // تغيير من 'sales' إلى 'shoppingCart'
        translateKey: 'nav.servicesSales.servicesSales',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'order.orderList',
                path: '/orders',
                title: 'قائمة المبيعات',
                translateKey: 'nav.servicesSales.createInvoice',
                icon: 'listBullet', // أيقونة قائمة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.createQuote',
                path: '/clients/create-offer-price',
                title: 'إنشاء عرض سعر',
                translateKey: 'nav.servicesSales.createQuote',
                icon: 'documentDuplicate', // أيقونة مستند مكرر (للعروض)
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.paymentVouchers',
                path: '/sales/payment-vouchers',
                title: 'سند صرف وقبض',
                translateKey: 'nav.servicesSales.paymentVouchers',
                icon: 'creditCard', // أيقونة بطاقة ائتمان
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.bookAppointment',
                path: '/appointments/book',
                title: 'حجز موعد',
                translateKey: 'nav.servicesSales.bookAppointment',
                icon: 'calendar', // أيقونة التقويم (مناسبة)
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesSales.statusReport',
                path: '/reports/status',
                title: 'تقرير حالة',
                translateKey: 'nav.servicesSales.statusReport',
                icon: 'chartPie', // أيقونة رسم بياني دائري
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'servicesMenu',
                path: '',
                title: 'إدارة الخدمات',
                translateKey: 'nav.servicesMenu.servicesMenu',
                icon: 'cog', // أيقونة الإعدادات/التروس
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN],
                subMenu: [
                    {
                        key: 'servicesMenu.servicesList',
                        path: '/services',
                        title: 'قائمة الخدمات',
                        translateKey: 'nav.servicesMenu.servicesList',
                        icon: 'viewList', // أيقونة عرض القائمة
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'servicesMenu.createService',
                        path: '/services/create-service',
                        title: 'إنشاء خدمة جديدة',
                        translateKey: 'nav.servicesMenu.createService',
                        icon: 'plusCircle', // أيقونة إضافة دائرة
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },

    {
        key: 'invoicesMenu',
        path: '',
        title: 'الفواتير',
        translateKey: 'nav.invoicesMenu.invoicesMenu',
        icon: 'invoices',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'clientsMenu.clientsList',
                path: '/invoices',
                title: 'قائمة الفواتير',
                translateKey: 'nav.clientsMenu.updateClient',
                icon: 'userGroup', // أيقونة مجموعة المستخدمين
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            // {
            //     key: 'clientsMenu.clientsList',
            //     path: '/invoices',
            //     title: 'الفواتير المفتوحة',
            //     translateKey: 'nav.clientsMenu.updateClient',
            //     icon: 'userGroup', // أيقونة مجموعة المستخدمين
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
            //     subMenu: [],
            // },
        ],
    },

    {
        key: 'invoicesMenu',
        path: '',
        title: 'المهام',
        translateKey: 'nav.invoicesMenu.invoicesMenu',
        icon: 'invoices',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'taskMenu.tasksList',
                path: '/tasks',
                title: 'قائمة المهام',
                translateKey: 'nav.clientsMenu.updateClient',
                icon: 'userGroup', // أيقونة مجموعة المستخدمين
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'clientsMenu.clientsList',
                path: '/tasks/add',
                title: 'اضافة مهام',
                translateKey: 'nav.clientsMenu.updateClient',
                icon: 'userGroup', // أيقونة مجموعة المستخدمين
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
        ],
    },

    {
        key: 'branchesMenu',
        path: '',
        title: 'الافرع',
        translateKey: 'nav.branchesMenu.branchesMenu',
        icon: 'branches',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'branchesMenu.branchesList',
                path: '/branches',
                title: 'قائمة الافرع',
                translateKey: 'nav.branchesMenu.updateBranches',
                icon: 'branches',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'branchesMenu.branchesList',
                path: '/branches/create-branch',
                title: 'اضافة فرع جديد',
                translateKey: 'nav.branchesMenu.updateBranches',
                icon: 'branches',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    // 3. المستخدمين (Users)
    {
        key: 'users',
        path: '',
        title: 'المستخدمين',
        icon: 'userGroup', // تغيير من 'users' إلى 'userGroup'
        translateKey: 'nav.users.users',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'users.clientsCommunication',
                path: '/clients-communication',
                title: 'اتصالات العملاء',
                translateKey: 'nav.users.clientsCommunication',
                icon: 'clipboardList', // أيقونة قائمة الحافظة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'users.manageUsers',
                path: '/users/manage',
                title: 'إدارة المستخدمين',
                translateKey: 'nav.users.manageUsers',
                icon: 'userCircle', // أيقونة دائرة المستخدم
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'users.rolesPermissions',
                path: '/users/roles',
                title: 'الصلاحيات والأدوار',
                translateKey: 'nav.users.rolesPermissions',
                icon: 'key', // أيقونة المفتاح (للصلاحيات)
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'users.activityLog',
                path: '/users/activity-log',
                title: 'سجل النشاطات',
                translateKey: 'nav.users.activityLog',
                icon: 'clipboardList', // أيقونة قائمة الحافظة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    // 4. السيارات (Cars)
    {
        key: 'cars',
        path: '',
        title: 'السيارات',
        translateKey: 'nav.cars.cars',
        icon: 'truck', // أيقونة السيارة/الشاحنة
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'carsMenu.carsList',
                path: '/cars',
                title: 'قائمة السيارات',
                translateKey: 'nav.cars.carsList',
                icon: 'listBullet', // أيقونة القائمة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'carsMenu.addCar',
                path: '/cars/add-car',
                title: 'إضافة سيارة',
                translateKey: 'nav.cars.addCar',
                icon: 'plus', // أيقونة الإضافة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

    // 5. المستودع (Warehouse)
    {
        key: 'warehouse',
        path: '',
        title: 'المستودع',
        icon: 'archive', // تغيير من 'warehouse' إلى 'archive'
        translateKey: 'nav.warehouse.warehouse',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
        subMenu: [
            {
                key: 'warehouse.expenses',
                path: '/warehouse/expenses',
                title: 'المصروفات (المشتريات)',
                translateKey: 'nav.warehouse.expenses',
                icon: 'currencyDollar', // أيقونة العملة
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.branchInventory',
                path: '/warehouse/inventory',
                title: 'مخزون الفرع',
                translateKey: 'nav.warehouse.branchInventory',
                icon: 'cube', // أيقونة المكعب (للمخزون)
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.internalSupply',
                path: '/warehouse/internal-supply',
                title: 'طلب توريد داخلي',
                translateKey: 'nav.warehouse.internalSupply',
                icon: 'arrowCircleDown', // أيقونة السهم الدائري للداخل
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
            {
                key: 'warehouse.externalSupply',
                path: '/warehouse/external-supply',
                title: 'طلب توريد خارجي',
                translateKey: 'nav.warehouse.externalSupply',
                icon: 'arrowCircleUp', // أيقونة السهم الدائري للخارج
                type: NAV_ITEM_TYPE_ITEM,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [],
            },
        ],
    },

    // 6. إدارة المهام (Tasks Management)
    {
        key: 'TaskManagement',
        path: '',
        title: 'المهام',
        icon: 'officeBuilding', // أيقونة مبنى المكاتب
        translateKey: 'nav.branchesManagement.branchesManagement',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [userRoles.ADMIN],
        subMenu: [
            {
                key: 'taskMenu.TaskList',
                path: '/tasks',
                title: 'عرض المهام مهمة',
                translateKey: 'nav.tasks.showTasks',
                icon: 'documentReport', // أيقونة تقرير
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN],
                subMenu: [],
            },
            {
                key: 'taskMenu.AddTask',
                path: '/tasks/add',
                title: 'اضافة مهمة جديدة',
                translateKey: 'nav.tasks.addNewTask',
                icon: 'documentReport', // أيقونة تقرير
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN],
                subMenu: [],
            },
        ],
    },

    // 7. إدارة فروع (Branches Management)
    {
        key: 'branchesManagement',
        path: '',
        title: 'إدارة فروع',
        icon: 'officeBuilding', // أيقونة مبنى المكاتب
        translateKey: 'nav.branchesManagement.branchesManagement',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
        subMenu: [
            {
                key: 'branchesManagement.dailyReports',
                path: '',
                title: 'تقرير يومي',
                translateKey: 'nav.branchesManagement.dailyReports',
                icon: 'documentReport', // أيقونة تقرير
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [
                    {
                        key: 'branchesManagement.dailyServicesReport',
                        path: '/reports/daily-services',
                        title: 'تقرير خدمات مقدمة في نفس اليوم',
                        translateKey:
                            'nav.branchesManagement.dailyServicesReport',
                        icon: 'clock', // أيقونة الساعة (للتقارير اليومية)
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                    {
                        key: 'branchesManagement.dateRangeReport',
                        path: '/reports/date-range',
                        title: 'تقرير لفترة',
                        translateKey: 'nav.branchesManagement.dateRangeReport',
                        icon: 'calendar', // أيقونة التقويم
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
                        icon: 'tag', // أيقونة الوسم (لأنواع الخدمات)
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
                icon: 'lockClosed', // أيقونة القفل (للإغلاق)
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                subMenu: [
                    {
                        key: 'branchesManagement.incomeClosing',
                        path: '/monthly-closing/income',
                        title: 'اغلاق الدخل الشهري',
                        translateKey: 'nav.branchesManagement.incomeClosing',
                        icon: 'cash', // أيقونة النقود
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [userRoles.ADMIN, userRoles.EMPLOYEE],
                        subMenu: [],
                    },
                    {
                        key: 'branchesManagement.warehouseClosing',
                        path: '/monthly-closing/warehouse',
                        title: 'اغلاق المستودعات الداخلية',
                        translateKey: 'nav.branchesManagement.warehouseClosing',
                        icon: 'archive', // أيقونة الأرشيف
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
