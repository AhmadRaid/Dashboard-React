import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Invoice } from '@/@types/invoice'
import { apiGetInvoiceById } from '@/services/invoiceService'
import { Button, toast, Notification } from '@/components/ui'
import {
    FiAlertCircle,
    FiLoader,
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiPercent,
    FiInfo,
    FiUser,
    FiTruck,
    FiShield,
} from 'react-icons/fi'
import {
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaCar,
    FaCreditCard,
    FaExclamationCircle,
} from 'react-icons/fa'

const InvoiceDetails = () => {
    const { invoiceId } = useParams()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchInvoice()
    }, [invoiceId])

    const fetchInvoice = async () => {
        try {
            setLoading(true)
            if (!invoiceId) return
            const response = await apiGetInvoiceById(invoiceId)
            setInvoice(response.data.data)
        } catch (error) {
            console.error('Failed to fetch invoice:', error)
            toast.push(
                <Notification title="فشل" type="error">
                    فشل في تحميل تفاصيل الفاتورة
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    const formatSAR = (value?: number) =>
        typeof value === 'number' ? `${value.toFixed(2)} ر.س` : '-'

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'

        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'rejected':
                return {
                    text: 'مرفوض',
                    icon: <FaTimesCircle className="text-white text-xl" />,
                    color: 'bg-red-500',
                    textColor: 'text-red-700',
                    bgColor: 'bg-red-100',
                }
            case 'pending':
                return {
                    text: 'قيد المراجعة',
                    icon: <FaHourglassHalf className="text-white text-xl" />,
                    color: 'bg-amber-500',
                    textColor: 'text-amber-700',
                    bgColor: 'bg-amber-100',
                }
            case 'open':
                return {
                    text: 'مفتوحة',
                    icon: (
                        <FaExclamationCircle className="text-white text-xl" />
                    ),
                    color: 'bg-blue-500',
                    textColor: 'text-blue-700',
                    bgColor: 'bg-blue-100',
                }
            case 'approved':
                return {
                    text: 'مقبول',
                    icon: <FaCheckCircle className="text-white text-xl" />,
                    color: 'bg-green-500',
                    textColor: 'text-green-700',
                    bgColor: 'bg-green-100',
                }
            default:
                return {
                    text: 'غير معروف',
                    icon: <FaTimesCircle className="text-white text-xl" />,
                    color: 'bg-gray-500',
                    textColor: 'text-gray-700',
                    bgColor: 'bg-gray-100',
                }
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-100 dark:bg-gray-950 p-4">
                <FiLoader className="animate-spin text-5xl text-blue-600 dark:text-blue-400" />
                <p className="text-gray-700 dark:text-gray-300 text-xl font-medium">
                    جاري جلب بيانات الفاتورة...
                </p>
            </div>
        )
    }

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-white dark:bg-gray-800 rounded-xl m-4 border border-gray-200 dark:border-gray-700 shadow-md">
                <FiAlertCircle className="text-6xl text-rose-500 dark:text-rose-400" />
                <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        خطأ في تحميل الفاتورة
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                        تعذر العثور على الفاتورة المطلوبة. قد يكون الرابط خاطئاً
                        أو تم حذف الفاتورة.
                    </p>
                </div>
                <Button
                    className="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    <FiFileText />
                    <span>إعادة المحاولة</span>
                </Button>
            </div>
        )
    }

    const statusInfo = getStatusInfo(invoice.status || '')

    return (
        <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-950 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                    تفاصيل الفاتورة
                    {invoice.invoiceNumber && (
                        <span className="mr-2 text-blue-600 dark:text-blue-400 text-2xl font-medium">
                            #{invoice.invoiceNumber}
                        </span>
                    )}
                </h3>
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${statusInfo.color}`}
                >
                    {statusInfo.icon}
                    <span>{statusInfo.text}</span>
                </div>
            </div>

            <div className="space-y-8">
                {/* معلومات الفاتورة */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <FiFileText className="text-4xl text-blue-600 dark:text-blue-400" />
                            <div>
                                <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    معلومات الفاتورة
                                </h5>
                                <p className="text-gray-500 dark:text-gray-400">
                                    تفاصيل الفاتورة ووقت الإنشاء
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    رقم الفاتورة
                                </h3>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">
                                    {invoice.invoiceNumber || '-'}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    تاريخ الفاتورة
                                </h3>
                                <p className="text-lg font-bold text-gray-800 dark:text-white">
                                    {formatDate(invoice.invoiceDate)}
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    حالة الفاتورة
                                </h3>
                                <div
                                    className={`px-4 py-1 rounded-full text-white font-semibold ${statusInfo.color} mt-1`}
                                >
                                    {statusInfo.text}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* معلومات العميل */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <FiUser className="text-4xl text-blue-600 dark:text-blue-400" />
                            <div>
                                <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    معلومات العميل
                                </h5>
                                <p className="text-gray-500 dark:text-gray-400">
                                    تفاصيل العميل وصاحب الفاتورة
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                        اسم العميل
                                    </h3>
                                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                                        {invoice.client?.firstName}{' '}
                                        {invoice.client?.secondName}{' '}
                                        {invoice.client?.thirdName}{' '}
                                        {invoice.client?.lastName}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                        رقم الهاتف 
                                    </h3>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        {invoice.client?.phone || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                        رقم العميل
                                    </h3>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        {invoice.client?.clientNumber || '-'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                         رقم الهاتف الثاني
                                    </h3>
                                    <p className="text-lg text-gray-800 dark:text-white">
                                        {invoice.client?.secondPhone || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* معلومات المركبة */}
                {invoice.order && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <FaCar className="text-4xl text-blue-600 dark:text-blue-400" />
                                <div>
                                    <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        معلومات السيارة والطلب
                                    </h5>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        تفاصيل المركبة والخدمات المقدمة
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            الشركة المصنعة ونوع السيارة
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.carManufacturer ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            موديل السيارة
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.carModel || '-'}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            لون السيارة
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.carColor || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            رقم الطلب
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.orderNumber || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            رقم اللوحة
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.carPlateNumber ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                            الحجم
                                        </h3>
                                        <p className="text-lg text-gray-800 dark:text-white">
                                            {invoice.order.carSize || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* التفاصيل المالية */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <FiDollarSign className="text-4xl text-blue-600 dark:text-blue-400" />
                            <div>
                                <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    التفاصيل المالية
                                </h5>
                                <p className="text-gray-500 dark:text-gray-400">
                                    ملخص مبالغ الفاتورة والضرائب
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                <span className="text-sm text-gray-800 dark:text-gray-100 font-bold mb-1">
                                    الإجمالي
                                </span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatSAR(invoice.totalAmount)}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    المبلغ قبل الضريبة
                                </span>
                                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {formatSAR(invoice.subtotal)}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    قيمة الضريبة ({invoice.taxRate}%)
                                </span>
                                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {formatSAR(invoice.taxAmount)}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    تاريخ الإنشاء
                                </span>
                                <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    {formatDate(invoice.invoiceDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* الخدمات */}
                {invoice.order?.services &&
                    invoice.order.services.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                    <FiShield className="text-4xl text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                            الخدمات المقدمة
                                        </h5>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            تفاصيل الخدمات والضمانات
                                        </p>
                                    </div>
                                </div>
                                {invoice.order.services.map(
                                    (service, index) => (
                                        <div
                                            key={service._id || index}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6 last:mb-0 border border-gray-200 dark:border-gray-600 shadow-sm"
                                        >
                                            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                                {service.serviceType ===
                                                'protection'
                                                    ? 'حماية'
                                                    : service.serviceType ===
                                                      'polish'
                                                    ? 'تلميع'
                                                    : service.serviceType ===
                                                      'insulator'
                                                    ? 'عازل حراري'
                                                    : service.serviceType ===
                                                      'additions'
                                                    ? 'إضافات'
                                                    : service.serviceType}
                                                <span className="mr-auto text-green-600 dark:text-green-400 font-extrabold text-xl">
                                                    {formatSAR(
                                                        service.servicePrice
                                                    )}
                                                </span>
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                {service.insulatorType && (
                                                    <div>
                                                        <h5 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                                            نوع العازل
                                                        </h5>
                                                        <p className="text-lg text-gray-800 dark:text-white">
                                                            {service.insulatorType ===
                                                            'ceramic'
                                                                ? 'سيراميك'
                                                                : service.insulatorType}
                                                        </p>
                                                    </div>
                                                )}
                                                {service.insulatorCoverage && (
                                                    <div>
                                                        <h5 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                                                            نطاق التغطية
                                                        </h5>
                                                        <p className="text-lg text-gray-800 dark:text-white">
                                                            {service.insulatorCoverage ===
                                                            'piece'
                                                                ? 'قطعة'
                                                                : service.insulatorCoverage ===
                                                                  'full'
                                                                ? 'كامل'
                                                                : service.insulatorCoverage}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {service.guarantee && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                                                    <h5 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                                                        <FiInfo className="text-blue-600" />{' '}
                                                        تفاصيل الضمان
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div>
                                                            <h6 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                                                مدة الضمان
                                                            </h6>
                                                            <p className="text-gray-800 dark:text-white">
                                                                {service
                                                                    .guarantee
                                                                    .typeGuarantee ||
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h6 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                                                تاريخ البدء
                                                            </h6>
                                                            <p className="text-gray-800 dark:text-white">
                                                            {formatDate(
                                                                    service
                                                                        .guarantee
                                                                        .startDate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h6 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                                                تاريخ الانتهاء
                                                            </h6>
                                                            <p className="text-gray-800 dark:text-white">
                                                                {formatDate(
                                                                    service
                                                                        .guarantee
                                                                        .endDate
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h6 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                                                حالة الضمان
                                                            </h6>
                                                            <span
                                                                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                                                                    service
                                                                        .guarantee
                                                                        .status ===
                                                                    'active'
                                                                        ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200'
                                                                        : 'bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200'
                                                                }`}
                                                            >
                                                                {service
                                                                    .guarantee
                                                                    .status ===
                                                                'inactive'
                                                                    ? 'غير مفعل'
                                                                    : service
                                                                          .guarantee
                                                                          .status ===
                                                                      'active'
                                                                    ? 'مفعل'
                                                                    : service
                                                                          .guarantee
                                                                          .status ||
                                                                      'غير معروف'}
                                                            </span>
                                                        </div>
                                                        {service.guarantee
                                                            .notes && (
                                                            <div className="md:col-span-4">
                                                                <h6 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
                                                                    ملاحظات
                                                                </h6>
                                                                <p className="text-gray-800 dark:text-white leading-relaxed">
                                                                    {
                                                                        service
                                                                            .guarantee
                                                                            .notes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                {/* ملاحظات إضافية */}
                {invoice.notes && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <FiInfo className="text-4xl text-blue-600 dark:text-blue-400" />
                                <div>
                                    <h5 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        ملاحظات إضافية
                                    </h5>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        معلومات إضافية حول الفاتورة
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 shadow-sm">
                                <p className="text-gray-800 dark:text-white leading-relaxed">
                                    {invoice.notes}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InvoiceDetails
