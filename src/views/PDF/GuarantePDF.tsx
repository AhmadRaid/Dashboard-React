// components/GuaranteePDF.tsx
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer'

// تعريف أنواع بيانات الضمان
interface Guarantee {
    typeGuarantee: string
    startDate: string | Date
    endDate: string | Date
    terms?: string
    Notes?: string
}

interface Service {
    serviceType: 'protection' | 'polish' | 'insulator' | 'additions' | string
    dealDetails?: string
    protectionFinish?: string
    protectionSize?: string
    protectionCoverage?: string
    originalCarColor?: string
    protectionColor?: string
    insulatorType?: string
    insulatorCoverage?: string
    polishType?: string
    polishSubType?: string
    externalPolishLevel?: string
    internalPolishLevel?: string
    internalAndExternalPolishLevel?: string
    additionType?: string
    washScope?: string
    servicePrice?: number
    serviceDate?: string | Date
    guarantee: Guarantee
}

interface Order {
    orderNumber: string
    carModel: string
    carColor: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
    orderStatus: 'new' | 'maintenance'
    services: Service[]
    createdAt: string | Date
}

interface Client {
    firstName: string
    secondName: string
    thirdName: string
    lastName: string
    clientNumber: string
    phone: string
    email?: string
}

interface GuaranteeDocument {
    orderNumber: string
    createdAt: string | Date
    documentNumber: string
    issueDate: string | Date
    clientId: Client
    order: Order
}

// تسجيل الخطوط المحلية
Font.register({
    family: 'Tajawal',
    fonts: [
        { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Tajawal-ExtraBold.ttf', fontWeight: 'bold' },
    ],
})

// إنشاء الأنماط
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 24,
        fontFamily: 'Tajawal',
        textAlign: 'right',
        direction: 'rtl',
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
    },
    logoContainer: {
        width: '40%',
        alignItems: 'center',
    },
    logo: {
        width: 220,
        height: 140,
        objectFit: 'contain',
    },
    arabicInfo: {
        width: '30%',
        textAlign: 'right',
    },
    englishInfo: {
        width: '30%',
        textAlign: 'left',
        direction: 'ltr',
    },
    companyName: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 1,
    },
    companyAddress: {
        fontSize: 6.5,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyContact: {
        fontSize: 6.5,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyTax: {
        fontSize: 6.5,
        color: '#4A5568',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 10,
        color: '#4A5568',
        textAlign: 'center',
        marginBottom: 12,
    },
    documentInfo: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: '#EEF2F7',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E0',
    },
    infoColumn: {
        width: '48%',
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'extrabold',
        color: '#1A202C',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#2D3748',
    },
    clientInfo: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    clientInfoItem: {
        width: '48%',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        minHeight: 68,
        textAlign: 'right',
    },
    label: {
        fontSize: 10,
        color: '#4A5568',
        marginBottom: 2,
        textAlign: 'right',
    },
    value: {
        fontSize: 12,
        color: '#1A202C',
        fontWeight: 'bold',
        lineHeight: 1.4,
        textAlign: 'right',
    },
    ltrValue: {
        direction: 'ltr',
        textAlign: 'left',
    },
    carInfo: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    carInfoItem: {
        width: '48%',
        marginBottom: 10,
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        minHeight: 60,
        textAlign: 'right',
    },
    serviceSection: {
        marginBottom: 6,
    },
    serviceHeader: {
        backgroundColor: '#2D3748',
        padding: 6,
        borderRadius: 4,
        marginBottom: 4,
    },
    serviceTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'right',
    },
    serviceDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    serviceDetailItem: {
        width: '48%',
        marginBottom: 4,
        padding: 4,
        textAlign: 'right',
    },
    guaranteeSection: {
        backgroundColor: '#F3F4F6',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2D3748',
        marginBottom: 8,
    },
    guaranteeTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#234E52',
        marginBottom: 8,
        textAlign: 'center',
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#2D3748',
    },
    guaranteeContainer: {
        marginBottom: 4,
    },
    guaranteeItem: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    guaranteeLabel: {
        width: '25%',
        fontSize: 9,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'right',
        paddingTop: 4,
    },
    guaranteeValueContainer: {
        width: '73%',
        backgroundColor: '#FFFFFF',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    guaranteeValue: {
        fontSize: 9,
        color: '#2D3748',
        textAlign: 'right',
    },
    guaranteeDateContainer: {
        flexDirection: 'column',
    },
    gregorianDate: {
        fontSize: 9,
        color: '#2D3748',
        fontWeight: 'bold',
    },
    hijriDate: {
        fontSize: 8,
        color: '#718096',
        marginTop: 2,
    },
    guaranteeStatus: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    termsSection: {
        backgroundColor: '#EBF8FF',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2D3748',
        marginBottom: 8,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2C5282',
        marginBottom: 4,
        textAlign: 'right',
    },
    termsText: {
        fontSize: 8,
        color: '#2C5282',
        textAlign: 'right',
    },
    notesSection: {
        backgroundColor: '#FAF5FF',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D6BCFA',
        marginBottom: 8,
    },
    notesTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#553C9A',
        marginBottom: 4,
        textAlign: 'right',
    },
    notesText: {
        fontSize: 8,
        color: '#553C9A',
        textAlign: 'right',
    },
    footer: {
        marginTop: 10,
        paddingTop: 7,
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        textAlign: 'center',
        fontSize: 6,
        color: '#4A5568',
    },
    footerText: {
        marginBottom: 1,
    },
    footerFixed: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 28,
        textAlign: 'center',
        fontSize: 8,
        color: '#4A5568',
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        paddingTop: 6,
    },
    validityBadge: {
        backgroundColor: '#FED7D7',
        color: '#C53030',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    activeBadge: {
        backgroundColor: '#C6F6D5',
        color: '#22543D',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        fontSize: 12,
        color: '#2D3748',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    servicesHeaderCard: {
        flexDirection: 'row-reverse',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E0',
        overflow: 'hidden',
        marginBottom: 12,
    },
    servicesHeaderAccent: {
        width: 6,
        backgroundColor: '#2C5282',
    },
    servicesHeaderContent: {
        flexGrow: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    servicesHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C',
        textAlign: 'center',
    },
    servicesHeaderSubtitle: {
        fontSize: 10,
        color: '#4A5568',
        textAlign: 'center',
        marginTop: 2,
    },
})

// تعريف واجهة الخصائص
interface GuaranteePDFProps {
    guaranteeDoc: any
}

// دالة لتحويل التاريخ إلى الهجري مع تحسينات
const toHijriDate = (gregorianDate: string | Date): string => {
    if (!gregorianDate) return ''

    try {
        const date = new Date(gregorianDate)
        if (isNaN(date.getTime())) return 'تاريخ غير صالح'

        const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date)

        return hijri
    } catch (error) {
        console.error('Error converting to Hijri date:', error)
        return 'خطأ في التحويل'
    }
}

// دالة لعرض التاريخ بالميلادي بشكل منسق
const formatGregorianDate = (date: string | Date): string => {
    if (!date) return ''

    try {
        const d = new Date(date)
        if (isNaN(d.getTime())) return 'تاريخ غير صالح'

        const day = d.getDate().toString().padStart(2, '0')
        const month = (d.getMonth() + 1).toString().padStart(2, '0')
        const year = d.getFullYear()

        return `${day}/${month}/${year}`
    } catch (error) {
        console.error('Error formatting Gregorian date:', error)
        return 'خطأ في التنسيق'
    }
}

// دالة للتحقق من حالة الضمان
const isGuaranteeActive = (endDate: string | Date): boolean => {
    const today = new Date()
    const end = new Date(endDate)
    return end > today
}

const GuaranteePDF: React.FC<GuaranteePDFProps> = ({ guaranteeDoc }) => {
    if (!guaranteeDoc || !guaranteeDoc.order || !guaranteeDoc.order.services) {
        return (
            <Document>
                <Page size="A4">
                    <Text>خطأ: بيانات الضمان غير متوفرة</Text>
                </Page>
            </Document>
        )
    }

    // تقسيم الخدمات إلى صفحات تحتوي خدمتين في كل صفحة
    const chunkArray = (array: any[], size: number) => {
        const result: any[] = []
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size))
        }
        return result
    }

    const serviceChunks = chunkArray(guaranteeDoc.order.services || [], 2)

    return (
        <Document>
            {/* Page 1: Document + Client + Car Info */}
            <Page size="A4" style={styles.page}>
                {/* Header with Company Info and Logo */}
                <View style={styles.header}>
                    {/* English Info (Left) */}
                    <View style={styles.englishInfo}>
                        <Text style={styles.companyName}>
                            Premium Umbrella Company for Car Services
                        </Text>
                        <Text style={styles.companyAddress}>
                            Jeddah - North Obhur - Emerald District - King Saud
                            Road
                        </Text>
                        <Text style={styles.companyTax}>C.R: 7036331400</Text>
                        <Text style={styles.companyTax}>
                            VAT No: 312682121400003
                        </Text>
                    </View>

                    {/* Logo (Center) */}
                    <View style={styles.logoContainer}>
                        <Image src="/logo.jpg" style={styles.logo} />
                    </View>

                    {/* Arabic Info (Right) */}
                    <View style={styles.arabicInfo}>
                        <Text style={styles.companyName}>
                            شركة مظلة التميز لخدمات السيارات
                        </Text>
                        <Text style={styles.companyAddress}>
                            جدة - أبحر الشمالية - حي الزمرد - طريق الملك سعود
                        </Text>
                        <Text style={styles.companyContact}>
                            هاتف: 0554474543
                        </Text>
                        <Text style={styles.companyTax}>
                            الرقم الضريبي: 312682121400003
                        </Text>
                    </View>
                </View>

                {/* Document Title */}
                <View>
                    <Text style={styles.title}>وثيقة الضمان</Text>
                    <Text style={styles.subtitle}>
                        وثيقة ضمان خدمات عزل وتلميع السيارات
                    </Text>
                </View>

                {/* Document Info */}
                <View style={styles.documentInfo}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>رقم الوثيقة:</Text>
                        <Text style={styles.value}>
                            {guaranteeDoc.documentNumber}
                        </Text>

                        <Text style={[styles.label, { marginTop: 2 }]}>
                            تاريخ الإصدار:
                        </Text>
                        <Text style={styles.value}>
                            {formatGregorianDate(guaranteeDoc.issueDate)}
                            {'\n'}
                            <Text style={{ fontSize: 8, color: '#4A5568' }}>
                                ({toHijriDate(guaranteeDoc.issueDate)})
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>رقم الطلب:</Text>
                        <Text style={styles.value}>
                            {guaranteeDoc.order.orderNumber}
                        </Text>

                        <Text style={[styles.label, { marginTop: 2 }]}>
                            تاريخ الطلب:
                        </Text>
                        <Text style={styles.value}>
                            {formatGregorianDate(guaranteeDoc.order.createdAt)}
                            {'\n'}
                            <Text style={{ fontSize: 8, color: '#4A5568' }}>
                                ({toHijriDate(guaranteeDoc.order.createdAt)})
                            </Text>
                        </Text>
                    </View>
                </View>

                {/* Client Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات العميل</Text>
                    <View style={styles.clientInfo}>
                        <View style={styles.clientInfoItem}>
                            <Text style={styles.label}>اسم العميل:</Text>
                            <Text style={styles.value}>
                                {`${guaranteeDoc.client.firstName} 
                                    ${guaranteeDoc.client.secondName} 
                                ${guaranteeDoc.client.thirdName}
                                ${guaranteeDoc.client.lastName}`}
                            </Text>

                            <Text style={[styles.label, { marginTop: 2 }]}>
                                رقم العميل:
                            </Text>
                            <Text style={styles.value}>
                                {guaranteeDoc.client.clientNumber}
                            </Text>
                        </View>
                        <View style={styles.clientInfoItem}>
                            <Text style={styles.label}>رقم الجوال:</Text>
                            <Text style={styles.value}>
                                {guaranteeDoc.client.phone}
                            </Text>

                            {guaranteeDoc.client.email && (
                                <>
                                    <Text
                                        style={[styles.label, { marginTop: 2 }]}
                                    >
                                        البريد الإلكتروني:
                                    </Text>
                                    <Text style={styles.value}>
                                        {guaranteeDoc.client.email}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                {/* Car Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات السيارة</Text>
                    <View style={styles.carInfo}>
                        {[
                            {
                                label: 'الشركة المصنعة ونوع السيارة',
                                value: guaranteeDoc.order.carManufacturer,
                            },
                            {
                                label: 'موديل السيارة',
                                value: guaranteeDoc.order.carModel,
                            },
                            {
                                label: 'لون السيارة',
                                value: guaranteeDoc.order.carColor,
                            },
                            {
                                label: 'رقم اللوحة',
                                value: guaranteeDoc.order.carPlateNumber,
                            },

                            {
                                label: 'حجم السيارة',
                                value: guaranteeDoc.order.carSize,
                            },
                        ].map((item, index) => (
                            <View key={index} style={styles.carInfoItem}>
                                <Text style={styles.label}>{item.label}</Text>
                                <Text style={styles.value}>
                                    {item.value || 'غير محدد'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                <Text
                    fixed
                    style={styles.pageNumber}
                    render={({ pageNumber }) => `${pageNumber}`}
                />

                {/* Footer fixed on every page */}
                <View style={styles.footerFixed} fixed>
                    <Text style={styles.footerText}>
                        شروط الضمان: يخضع هذا الضمان للشروط والأحكام المذكورة
                        أعلاه
                    </Text>
                    <Text style={styles.footerText}>
                        للإستفسارات حول الضمان، يرجى الاتصال على: 0554474543
                    </Text>
                    <Text style={[styles.footerText, { marginTop: 2 }]}>
                        جميع الحقوق محفوظة لشركة مظلة التميز 2025 ©
                    </Text>
                </View>
            </Page>

            {/* Service pages: two services per page */}
            {serviceChunks.map((servicesPair: any[], chunkIndex: number) => (
                <Page
                    key={`services-page-${chunkIndex}`}
                    size="A4"
                    style={styles.page}
                >
                    {/* Header for services page */}
                    <View style={styles.servicesHeaderCard}>
                        <View style={styles.servicesHeaderAccent} />
                        <View style={styles.servicesHeaderContent}>
                            <Text style={styles.servicesHeaderTitle}>
                                الخدمات والضمانات
                            </Text>
                            <Text style={styles.servicesHeaderSubtitle}>
                                تفاصيل الخدمات المقدمة ومعلومات الضمان لكل خدمة
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        {servicesPair.map((service: any, index: number) => (
                            <View
                                key={`service-${chunkIndex * 2 + index}`}
                                style={styles.serviceSection}
                            >
                                <View style={styles.serviceHeader}>
                                    <Text style={styles.serviceTitle}>
                                        {`الخدمة ${
                                            chunkIndex * 2 + index + 1
                                        }: `}
                                        {service.serviceType === 'protection'
                                            ? 'حماية'
                                            : service.serviceType === 'polish'
                                            ? 'تلميع'
                                            : service.serviceType ===
                                              'insulator'
                                            ? 'عازل حراري'
                                            : service.serviceType ===
                                              'additions'
                                            ? 'إضافات'
                                            : service.serviceType}
                                    </Text>
                                </View>

                                <View style={styles.serviceDetails}>
                                    {service.serviceDate && (
                                        <View style={styles.serviceDetailItem}>
                                            <Text style={styles.label}>
                                                تاريخ الخدمة:
                                            </Text>
                                            <Text style={styles.value}>
                                                {formatGregorianDate(
                                                    service.serviceDate
                                                )}
                                            </Text>
                                        </View>
                                    )}
                                    {service.servicePrice && (
                                        <View style={styles.serviceDetailItem}>
                                            <Text style={styles.label}>
                                                سعر الخدمة:
                                            </Text>
                                            <Text style={styles.value}>
                                                {service.servicePrice.toLocaleString(
                                                    'ar-SA'
                                                )}{' '}
                                                ريال
                                            </Text>
                                        </View>
                                    )}
                                    {service.dealDetails && (
                                        <View style={styles.serviceDetailItem}>
                                            <Text style={styles.label}>
                                                تفاصيل الخدمة:
                                            </Text>
                                            <Text style={styles.value}>
                                                {service.dealDetails}
                                            </Text>
                                        </View>
                                    )}

                                    {service.serviceType === 'protection' && (
                                        <>
                                            {service.protectionFinish && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        اللمعان:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.protectionFinish ===
                                                        'glossy'
                                                            ? 'لامع'
                                                            : service.protectionFinish ===
                                                              'matte'
                                                            ? 'مطفى'
                                                            : service.protectionFinish ===
                                                              'colored'
                                                            ? 'ملون'
                                                            : service.protectionFinish}
                                                    </Text>
                                                </View>
                                            )}
                                            {service.protectionSize && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        الحجم:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.protectionSize}{' '}
                                                        مل
                                                    </Text>
                                                </View>
                                            )}
                                            {service.protectionCoverage && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        التغطية:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.protectionCoverage ===
                                                        'full'
                                                            ? 'كامل'
                                                            : service.protectionCoverage ===
                                                              'half'
                                                            ? 'نص'
                                                            : service.protectionCoverage ===
                                                              'quarter'
                                                            ? 'ربع'
                                                            : service.protectionCoverage ===
                                                              'edges'
                                                            ? 'أطراف'
                                                            : service.protectionCoverage ===
                                                              'other'
                                                            ? 'اخرى'
                                                            : service.protectionCoverage}
                                                    </Text>
                                                </View>
                                            )}

                                            {service.protectionColor && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        لون الحماية:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {
                                                            service.protectionColor
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    )}

                                    {service.serviceType === 'insulator' && (
                                        <>
                                            {service.insulatorType && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        نوع العازل:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.insulatorType ===
                                                        'ceramic'
                                                            ? 'سيراميك'
                                                            : service.insulatorType ===
                                                              'carbon'
                                                            ? 'كاربون'
                                                            : service.insulatorType ===
                                                              'crystal'
                                                            ? 'كرستال'
                                                            : service.insulatorType}
                                                    </Text>
                                                </View>
                                            )}
                                            {service.insulatorCoverage && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        نطاق التغطية:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.insulatorCoverage ===
                                                        'full'
                                                            ? 'كامل'
                                                            : service.insulatorCoverage ===
                                                              'half'
                                                            ? 'نص'
                                                            : service.insulatorCoverage ===
                                                              'piece'
                                                            ? 'قطعة'
                                                            : service.insulatorCoverage ===
                                                              'shield'
                                                            ? 'درع حماية'
                                                            : service.insulatorCoverage ===
                                                              'external'
                                                            ? 'خارجية'
                                                            : service.insulatorCoverage}
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    )}

                                    {service.serviceType === 'polish' && (
                                        <>
                                            {service.polishType && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        نوع التلميع:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.polishType ===
                                                        'external'
                                                            ? 'تلميع خارجي'
                                                            : service.polishType ===
                                                              'internal'
                                                            ? 'تلميع داخلي'
                                                            : service.polishType ===
                                                              'internalAndExternal'
                                                            ? 'تلميع خارجي وداخلي'
                                                            : service.polishType ===
                                                              'seats'
                                                            ? 'كراسي'
                                                            : service.polishType ===
                                                              'piece'
                                                            ? 'قطعة'
                                                            : service.polishType ===
                                                              'water_polish'
                                                            ? 'تلميع مائي'
                                                            : service.polishType}
                                                    </Text>
                                                </View>
                                            )}
                                            {service.externalPolishLevel && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        مستوى التلميع الخارجي:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        مستوى{' '}
                                                        {
                                                            service.externalPolishLevel
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                            {service.internalPolishLevel && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        مستوى التلميع الداخلي:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        مستوى{' '}
                                                        {
                                                            service.internalPolishLevel
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                            {service.internalAndExternalPolishLevel && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        مستوى التلميع المشترك:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        مستوى{' '}
                                                        {
                                                            service.internalAndExternalPolishLevel
                                                        }
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    )}

                                    {service.serviceType === 'additions' && (
                                        <>
                                            {service.additionType && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        نوع الإضافة:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.additionType ===
                                                        'detailed_wash'
                                                            ? 'غسيل تفصيلي'
                                                            : service.additionType ===
                                                              'premium_wash'
                                                            ? 'غسيل تفصيلي خاص'
                                                            : service.additionType ===
                                                              'leather_pedals'
                                                            ? 'دواسات جلد'
                                                            : service.additionType ===
                                                              'blackout'
                                                            ? 'تكحيل'
                                                            : service.additionType ===
                                                              'nano_interior_decor'
                                                            ? 'نانو داخلي ديكور'
                                                            : service.additionType ===
                                                              'nano_interior_seats'
                                                            ? 'نانو داخلي مقاعد'
                                                            : service.additionType}
                                                    </Text>
                                                </View>
                                            )}
                                            {service.washScope && (
                                                <View
                                                    style={
                                                        styles.serviceDetailItem
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        نطاق الغسيل:
                                                    </Text>
                                                    <Text style={styles.value}>
                                                        {service.washScope ===
                                                        'full'
                                                            ? 'كامل'
                                                            : service.washScope ===
                                                              'external_only'
                                                            ? 'خارجي فقط'
                                                            : service.washScope ===
                                                              'internal_only'
                                                            ? 'داخلي فقط'
                                                            : service.washScope ===
                                                              'engine'
                                                            ? 'محرك'
                                                            : service.washScope}
                                                    </Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>

                                {service.guarantee && (
                                    <View style={styles.guaranteeSection}>
                                        <Text style={styles.guaranteeTitle}>
                                            تفاصيل الضمان
                                        </Text>
                                        <View style={styles.guaranteeContainer}>
                                            <View style={styles.guaranteeItem}>
                                                <Text
                                                    style={
                                                        styles.guaranteeLabel
                                                    }
                                                >
                                                    مدة الضمان:
                                                </Text>
                                                <View
                                                    style={
                                                        styles.guaranteeValueContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.guaranteeValue
                                                        }
                                                    >
                                                        {
                                                            service.guarantee
                                                                .typeGuarantee
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.guaranteeItem}>
                                                <Text
                                                    style={
                                                        styles.guaranteeLabel
                                                    }
                                                >
                                                    تاريخ البدء:
                                                </Text>
                                                <View
                                                    style={
                                                        styles.guaranteeValueContainer
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            styles.guaranteeDateContainer
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.gregorianDate
                                                            }
                                                        >
                                                            {formatGregorianDate(
                                                                service
                                                                    .guarantee
                                                                    .startDate
                                                            )}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.guaranteeItem}>
                                                <Text
                                                    style={
                                                        styles.guaranteeLabel
                                                    }
                                                >
                                                    تاريخ الانتهاء:
                                                </Text>
                                                <View
                                                    style={
                                                        styles.guaranteeValueContainer
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            styles.guaranteeDateContainer
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.gregorianDate
                                                            }
                                                        >
                                                            {formatGregorianDate(
                                                                service
                                                                    .guarantee
                                                                    .endDate
                                                            )}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.guaranteeItem}>
                                                <Text
                                                    style={
                                                        styles.guaranteeLabel
                                                    }
                                                >
                                                    حالة الضمان:
                                                </Text>
                                                <View
                                                    style={
                                                        styles.guaranteeValueContainer
                                                    }
                                                >
                                                    <View
                                                        style={
                                                            styles.guaranteeStatus
                                                        }
                                                    >
                                                        {service.guarantee
                                                            .status ==
                                                        'active' ? (
                                                            <Text
                                                                style={
                                                                    styles.activeBadge
                                                                }
                                                            >
                                                                فعال
                                                            </Text>
                                                        ) : (
                                                            <Text
                                                                style={
                                                                    styles.validityBadge
                                                                }
                                                            >
                                                                غير فعال
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    <Text
                        fixed
                        style={styles.pageNumber}
                        render={({ pageNumber }) => `${pageNumber}`}
                    />
                    {/* Footer fixed on every page */}
                    <View style={styles.footerFixed} fixed>
                        <Text style={styles.footerText}>
                            شروط الضمان: يخضع هذا الضمان للشروط والأحكام
                            المذكورة أعلاه
                        </Text>
                        <Text style={styles.footerText}>
                            للإستفسارات حول الضمان، يرجى الاتصال على: 0554474543
                        </Text>
                        <Text style={[styles.footerText, { marginTop: 2 }]}>
                            جميع الحقوق محفوظة لشركة مظلة التميز 2025 ©
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>
    )
}

export default GuaranteePDF
