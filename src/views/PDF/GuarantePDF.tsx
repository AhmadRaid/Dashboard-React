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
    id?: string // جعلها اختيارية
    typeGuarantee: string
    startDate: string | Date
    endDate: string | Date
    terms?: string
    Notes?: string
}

interface Service {
    id?: string // جعلها اختيارية
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
    carType: string
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
    middleName: string
    lastName: string
    clientNumber: string
    phone: string
    email?: string
}

interface GuaranteeDocument {
    documentNumber: string
    issueDate: string | Date
    client: Client
    order: Order
}

// تسجيل الخطوط المحلية
Font.register({
    family: 'Tajawal',
    fonts: [
        { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Tajawal-ExtraBold.ttf', fontWeight: 'extrabold' },
    ],
})

// إنشاء الأنماط
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 15,
        fontFamily: 'Tajawal',
        textAlign: 'right',
        direction: 'rtl',
        justifyContent: 'space-between',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 2,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 8,
        color: '#4A5568',
        textAlign: 'center',
        marginBottom: 8,
    },
    documentInfo: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
        padding: 5,
        borderRadius: 4,
    },
    infoColumn: {
        width: '48%',
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'extrabold',
        color: '#1A202C',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 2,
        borderBottomColor: '#2D3748',
    },
    clientInfo: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    clientInfoItem: {
        width: '48%',
        backgroundColor: '#F3F4F6',
        padding: 6,
        borderRadius: 4,
        textAlign: 'right',
    },
    label: {
        fontSize: 8,
        color: '#4A5568',
        marginBottom: 1,
        textAlign: 'right',
    },
    value: {
        fontSize: 10,
        color: '#1A202C',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    carInfo: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    carInfoItem: {
        width: '31%',
        marginBottom: 4,
        backgroundColor: '#F3F4F6',
        padding: 4,
        borderRadius: 4,
        textAlign: 'right',
    },
    serviceSection: {
        marginBottom: 10,
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
        backgroundColor: '#E6FFFA',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#81E6D9',
        marginBottom: 8,
    },
    guaranteeTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#234E52',
        marginBottom: 4,
        textAlign: 'right',
    },
    guaranteeDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    guaranteeDetailItem: {
        width: '48%',
        marginBottom: 8,
        textAlign: 'right',
        padding: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#B2F5EA',
    },
    guaranteeLabel: {
        fontSize: 8,
        color: '#234E52',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    guaranteeValue: {
        fontSize: 9,
        color: '#234E52',
        textAlign: 'right',
    },
    termsSection: {
        backgroundColor: '#EBF8FF',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#90CDF4',
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
    validityBadge: {
        backgroundColor: '#FED7D7',
        color: '#C53030',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'flex-start',
        marginLeft: 'auto',
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
        alignSelf: 'flex-start',
        marginLeft: 'auto',
    },
    dualDate: {
        flexDirection: 'column',
    },
    gregorianDate: {
        fontSize: 9,
        color: '#1A202C',
        fontWeight: 'bold',
    },
    hijriDate: {
        fontSize: 8,
        color: '#4A5568',
        marginTop: 2,
    },
    dateContainer: {
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
    },
})

// تعريف واجهة الخصائص
interface GuaranteePDFProps {
    guaranteeDoc: GuaranteeDocument
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
    // إنشاء معرف فريد لكل خدمة إذا لم يكن موجوداً
    const servicesWithIds = guaranteeDoc.order.services.map((service, index) => ({
        ...service,
        id: service.id || `service-${index}-${Date.now()}`,
        guarantee: {
            ...service.guarantee,
            id: service.guarantee.id || `guarantee-${index}-${Date.now()}`
        }
    }))

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with Company Info and Logo */}
                <View style={styles.header}>
                    {/* English Info (Left) */}
                    <View style={styles.englishInfo}>
                        <Text style={styles.companyName}>
                            Premium Umbrella Company for Car Services
                        </Text>
                        <Text style={styles.companyAddress}>
                            Jeddah - North Obhur - Emerald District - King Saud Road
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
                        <Text style={styles.companyContact}>هاتف: 0554474543</Text>
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
                        <Text style={styles.value}>{guaranteeDoc.documentNumber}</Text>

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
                                {`${guaranteeDoc.client.firstName} ${guaranteeDoc.client.middleName} ${guaranteeDoc.client.lastName}`}
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
                            <Text style={styles.value}>{guaranteeDoc.client.phone}</Text>

                            {guaranteeDoc.client.email && (
                                <>
                                    <Text style={[styles.label, { marginTop: 2 }]}>
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
                            { label: 'نوع السيارة', value: guaranteeDoc.order.carType },
                            {
                                label: 'موديل السيارة',
                                value: guaranteeDoc.order.carModel,
                            },
                            { label: 'لون السيارة', value: guaranteeDoc.order.carColor },
                            {
                                label: 'رقم اللوحة',
                                value: guaranteeDoc.order.carPlateNumber,
                            },
                            {
                                label: 'الشركة المصنعة',
                                value: guaranteeDoc.order.carManufacturer,
                            },
                            { label: 'حجم السيارة', value: guaranteeDoc.order.carSize },
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

                {/* Services and Guarantees */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الخدمات والضمانات</Text>
                    
                    {servicesWithIds.map((service, index) => (
                        <View key={service.id} style={styles.serviceSection}>
                            {/* Service Header */}
                            <View style={styles.serviceHeader}>
                                <Text style={styles.serviceTitle}>
                                    الخدمة {index + 1}:{' '}
                                    {service.serviceType === 'protection'
                                        ? 'حماية'
                                        : service.serviceType === 'polish'
                                        ? 'تلميع'
                                        : service.serviceType === 'insulator'
                                        ? 'عازل حراري'
                                        : service.serviceType === 'additions'
                                        ? 'إضافات'
                                        : service.serviceType}
                                </Text>
                            </View>

                            {/* Service Details */}
                            <View style={styles.serviceDetails}>
                                {service.serviceDate && (
                                    <View style={styles.serviceDetailItem}>
                                        <Text style={styles.label}>تاريخ الخدمة:</Text>
                                        <Text style={styles.value}>
                                            {formatGregorianDate(service.serviceDate)}
                                            {'\n'}
                                            <Text style={{ fontSize: 8, color: '#4A5568' }}>
                                                ({toHijriDate(service.serviceDate)})
                                            </Text>
                                        </Text>
                                    </View>
                                )}
                                
                                {service.servicePrice && (
                                    <View style={styles.serviceDetailItem}>
                                        <Text style={styles.label}>سعر الخدمة:</Text>
                                        <Text style={styles.value}>
                                            {service.servicePrice.toLocaleString('ar-SA')} ريال
                                        </Text>
                                    </View>
                                )}
                                
                                {service.dealDetails && (
                                    <View style={styles.serviceDetailItem}>
                                        <Text style={styles.label}>تفاصيل الخدمة:</Text>
                                        <Text style={styles.value}>{service.dealDetails}</Text>
                                    </View>
                                )}
                                
                                {/* Service-specific details */}
                                {service.serviceType === 'protection' && (
                                    <>
                                        {service.protectionFinish && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>اللمعان:</Text>
                                                <Text style={styles.value}>
                                                    {service.protectionFinish === 'glossy'
                                                        ? 'لامع'
                                                        : service.protectionFinish === 'matte'
                                                        ? 'مطفى'
                                                        : service.protectionFinish === 'colored'
                                                        ? 'ملون'
                                                        : service.protectionFinish}
                                                </Text>
                                            </View>
                                        )}
                                        {service.protectionSize && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>الحجم:</Text>
                                                <Text style={styles.value}>
                                                    {service.protectionSize} مل
                                                </Text>
                                            </View>
                                        )}
                                        {service.protectionCoverage && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>التغطية:</Text>
                                                <Text style={styles.value}>
                                                    {service.protectionCoverage === 'full'
                                                        ? 'كامل'
                                                        : service.protectionCoverage === 'half'
                                                        ? 'نص'
                                                        : service.protectionCoverage === 'quarter'
                                                        ? 'ربع'
                                                        : service.protectionCoverage === 'edges'
                                                        ? 'أطراف'
                                                        : service.protectionCoverage === 'other'
                                                        ? 'اخرى'
                                                        : service.protectionCoverage}
                                                </Text>
                                            </View>
                                        )}
                                        {service.originalCarColor && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>لون السيارة الأصلي:</Text>
                                                <Text style={styles.value}>{service.originalCarColor}</Text>
                                            </View>
                                        )}
                                        {service.protectionColor && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>لون الحماية:</Text>
                                                <Text style={styles.value}>{service.protectionColor}</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                                
                                {service.serviceType === 'insulator' && (
                                    <>
                                        {service.insulatorType && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>نوع العازل:</Text>
                                                <Text style={styles.value}>
                                                    {service.insulatorType === 'ceramic'
                                                        ? 'سيراميك'
                                                        : service.insulatorType === 'carbon'
                                                        ? 'كاربون'
                                                        : service.insulatorType === 'crystal'
                                                        ? 'كرستال'
                                                        : service.insulatorType}
                                                </Text>
                                            </View>
                                        )}
                                        {service.insulatorCoverage && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>نطاق التغطية:</Text>
                                                <Text style={styles.value}>
                                                    {service.insulatorCoverage === 'full'
                                                        ? 'كامل'
                                                        : service.insulatorCoverage === 'half'
                                                        ? 'نص'
                                                        : service.insulatorCoverage === 'piece'
                                                        ? 'قطعة'
                                                        : service.insulatorCoverage === 'shield'
                                                        ? 'درع حماية'
                                                        : service.insulatorCoverage === 'external'
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
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>نوع التلميع:</Text>
                                                <Text style={styles.value}>
                                                    {service.polishType === 'external'
                                                        ? 'تلميع خارجي'
                                                        : service.polishType === 'internal'
                                                        ? 'تلميع داخلي'
                                                        : service.polishType === 'internalAndExternal'
                                                        ? 'تلميع خارجي وداخلي'
                                                        : service.polishType === 'seats'
                                                        ? 'كراسي'
                                                        : service.polishType === 'piece'
                                                        ? 'قطعة'
                                                        : service.polishType === 'water_polish'
                                                        ? 'تلميع مائي'
                                                        : service.polishType
                                                        }
                                                </Text>
                                            </View>
                                        )}
                                        {service.externalPolishLevel && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>مستوى التلميع الخارجي:</Text>
                                                <Text style={styles.value}>مستوى {service.externalPolishLevel}</Text>
                                            </View>
                                        )}
                                        {service.internalPolishLevel && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>مستوى التلميع الداخلي:</Text>
                                                <Text style={styles.value}>مستوى {service.internalPolishLevel}</Text>
                                            </View>
                                        )}
                                        {service.internalAndExternalPolishLevel && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>مستوى التلميع المشترك:</Text>
                                                <Text style={styles.value}>مستوى {service.internalAndExternalPolishLevel}</Text>
                                            </View>
                                        )}
                                    </>
                                )}
                                
                                {service.serviceType === 'additions' && (
                                    <>
                                        {service.additionType && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>نوع الإضافة:</Text>
                                                <Text style={styles.value}>
                                                    {service.additionType === 'detailed_wash'
                                                        ? 'غسيل تفصيلي'
                                                        : service.additionType === 'premium_wash'
                                                        ? 'غسيل تفصيلي خاص'
                                                        : service.additionType === 'leather_pedals'
                                                        ? 'دواسات جلد'
                                                        : service.additionType === 'blackout'
                                                        ? 'تكحيل'
                                                        : service.additionType === 'nano_interior_decor'
                                                        ? 'نانو داخلي ديكور'
                                                        : service.additionType === 'nano_interior_seats'
                                                        ? 'نانو داخلي مقاعد'
                                                        : service.additionType}
                                                </Text>
                                            </View>
                                        )}
                                        {service.washScope && (
                                            <View style={styles.serviceDetailItem}>
                                                <Text style={styles.label}>نطاق الغسيل:</Text>
                                                <Text style={styles.value}>
                                                    {service.washScope === 'full'
                                                        ? 'كامل'
                                                        : service.washScope === 'external_only'
                                                        ? 'خارجي فقط'
                                                        : service.washScope === 'internal_only'
                                                        ? 'داخلي فقط'
                                                        : service.washScope === 'engine'
                                                        ? 'محرك'
                                                        : service.washScope}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* Guarantee Details */}
                            {service.guarantee && (
                                <View style={styles.guaranteeSection}>
                                    <Text style={styles.guaranteeTitle}>تفاصيل الضمان</Text>
                                    
                                    <View style={styles.guaranteeDetails}>
                                        <View style={styles.guaranteeDetailItem}>
                                            <Text style={styles.guaranteeLabel}>مدة الضمان:</Text>
                                            <Text style={styles.guaranteeValue}>{service.guarantee.typeGuarantee}</Text>
                                        </View>
                                        
                                        <View style={styles.guaranteeDetailItem}>
                                            <Text style={styles.guaranteeLabel}>تاريخ البدء:</Text>
                                            <Text style={styles.guaranteeValue}>
                                                {formatGregorianDate(service.guarantee.startDate)}
                                                {'\n'}
                                                <Text style={{ fontSize: 8, color: '#4A5568' }}>
                                                    ({toHijriDate(service.guarantee.startDate)})
                                                </Text>
                                            </Text>
                                        </View>
                                        
                                        <View style={styles.guaranteeDetailItem}>
                                            <Text style={styles.guaranteeLabel}>تاريخ الانتهاء:</Text>
                                            <Text style={styles.guaranteeValue}>
                                                {formatGregorianDate(service.guarantee.endDate)}
                                                {'\n'}
                                                <Text style={{ fontSize: 8, color: '#4A5568' }}>
                                                    ({toHijriDate(service.guarantee.endDate)})
                                                </Text>
                                            </Text>
                                        </View>
                                        
                                        <View style={styles.guaranteeDetailItem}>
                                            <Text style={styles.guaranteeLabel}>حالة الضمان:</Text>
                                            <View style={styles.statusContainer}>
                                                {isGuaranteeActive(service.guarantee.endDate) ? (
                                                    <Text style={styles.activeBadge}>نشط</Text>
                                                ) : (
                                                    <Text style={styles.validityBadge}>منتهي</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Guarantee Terms */}
                                    {service.guarantee.terms && (
                                        <View style={styles.termsSection}>
                                            <Text style={styles.termsTitle}>شروط الضمان:</Text>
                                            <Text style={styles.termsText}>{service.guarantee.terms}</Text>
                                        </View>
                                    )}

                                    {/* Guarantee Notes */}
                                    {service.guarantee.Notes && (
                                        <View style={styles.notesSection}>
                                            <Text style={styles.notesTitle}>ملاحظات على الضمان:</Text>
                                            <Text style={styles.notesText}>{service.guarantee.Notes}</Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        شروط الضمان: يخضع هذا الضمان للشروط والأحكام المذكورة أعلاه
                    </Text>
                    <Text style={styles.footerText}>
                        للاستفسارات حول الضمان، يرجى الاتصال على: 0554474543
                    </Text>
                    <Text style={[styles.footerText, { marginTop: 4 }]}>
                        جميع الحقوق محفوظة لشركة مظلة التميز 2025 ©
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default GuaranteePDF