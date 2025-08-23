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
    id: string
    typeGuarantee: string
    startDate: string | Date
    endDate: string | Date
    terms?: string
    Notes?: string
}

interface Service {
    id: string
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

// تسجيل الخط مسبقاً
Font.register({
    family: 'Tajawal',
    src: 'https://fonts.gstatic.com/s/tajawal/v3/Iurf6YBj_oCad4k1l5qjHrRpiYlJ_.ttf',
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
        width: 120,
        height: 80,
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
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 1,
    },
    companyAddress: {
        fontSize: 6,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyContact: {
        fontSize: 6,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyTax: {
        fontSize: 6,
        color: '#4A5568',
    },
    title: {
        fontSize: 16,
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
        flexDirection: 'row',
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
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 6,
        paddingBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#2D3748',
    },
    clientInfo: {
        flexDirection: 'row',
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
        fontSize: 9,
        color: '#1A202C',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    carInfo: {
        flexDirection: 'row',
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
        marginBottom: 8,
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
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 10,
    },
    guaranteeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    guaranteeTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    statusContainer: {
        flexDirection: 'row',
    },
    activeStatus: {
        backgroundColor: '#F0FFF4',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#9AE6B4',
    },
    expiredStatus: {
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FEB2B2',
    },
    statusText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    activeText: {
        color: '#22543D',
    },
    expiredText: {
        color: '#C53030',
    },
    guaranteeTable: {
        marginBottom: 8,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        paddingVertical: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#EDF2F7',
    },
    tableCellLabel: {
        width: '40%' /* قم بتغيير العرض من 35% إلى 40% */,
        paddingRight: 6,
        justifyContent: 'center',
    },
    tableCellValue: {
        width: '60%' /* قم بتغيير العرض من 65% إلى 60% */,
        paddingLeft: 6,
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
    },
    tableLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#4A5568',
        textAlign: 'right',
    },
    tableValue: {
        fontSize: 9,
        color: '#2D3748',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    dualDate: {
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
    },
    remainingDays: {
        fontSize: 9,
        color: '#2B6CB0',
        fontWeight: 'bold',
    },
    termsSection: {
        backgroundColor: '#EBF8FF',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#90CDF4',
        marginBottom: 6,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2C5282',
        marginBottom: 3,
        textAlign: 'right',
    },
    termsText: {
        fontSize: 8,
        color: '#2C5282',
        textAlign: 'right',
        lineHeight: 1.4,
    },
    notesSection: {
        backgroundColor: '#FAF5FF',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D6BCFA',
        marginBottom: 6,
    },
    notesTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#553C9A',
        marginBottom: 3,
        textAlign: 'right',
    },
    notesText: {
        fontSize: 8,
        color: '#553C9A',
        textAlign: 'right',
        lineHeight: 1.4,
    },
    footer: {
        marginTop: 10,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        textAlign: 'center',
        fontSize: 7,
        color: '#4A5568',
    },
    footerText: {
        marginBottom: 2,
    },
})

// تعريف واجهة الخصائص
interface GuaranteePDFProps {
    guaranteeDoc: GuaranteeDocument
}

// دالة لتحويل التاريخ إلى الهجري
const toHijriDate = (gregorianDate: string | Date): string => {
    if (!gregorianDate) return ''

    try {
        const date = new Date(gregorianDate)
        if (isNaN(date.getTime())) return 'تاريخ غير صالح'

        // استخدام مكتبة بسيطة للتحويل (يمكن استبدالها بمكتبة متخصصة)
        const hijriMonths = [
            'محرم',
            'صفر',
            'ربيع الأول',
            'ربيع الثاني',
            'جمادى الأولى',
            'جمادى الآخرة',
            'رجب',
            'شعبان',
            'رمضان',
            'شوال',
            'ذو القعدة',
            'ذو الحجة',
        ]

        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear() - 579 // تحويل تقريبي

        return `${day} ${hijriMonths[month]} ${year} هـ`
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

// دالة لحساب الأيام المتبقية
const calculateRemainingDays = (endDate: string | Date): number => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const GuaranteePDF: React.FC<GuaranteePDFProps> = ({ guaranteeDoc }) => (
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
                        Jeddah - North Obhur - Emerald District
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
                        جدة - أبحر الشمالية - حي الزمرد
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
                    <Text style={styles.value}>
                        {guaranteeDoc.documentNumber}
                    </Text>

                    <Text style={[styles.label, { marginTop: 2 }]}>
                        تاريخ الإصدار:
                    </Text>
                    <Text style={styles.value}>
                        {formatGregorianDate(guaranteeDoc.issueDate)}
                        {'\n'}
                        <Text style={{ fontSize: 7, color: '#4A5568' }}>
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
                        <Text style={{ fontSize: 7, color: '#4A5568' }}>
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
                        <Text style={styles.value}>
                            {guaranteeDoc.client.phone}
                        </Text>

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
                        {
                            label: 'نوع السيارة',
                            value: guaranteeDoc.order.carType,
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
                            label: 'الشركة المصنعة',
                            value: guaranteeDoc.order.carManufacturer,
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

            {/* Services and Guarantees */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>الخدمات والضمانات</Text>

                {guaranteeDoc.order.services.map((service, index) => (
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
                                    <Text style={styles.label}>
                                        تاريخ الخدمة:
                                    </Text>
                                    <Text style={styles.value}>
                                        {formatGregorianDate(
                                            service.serviceDate
                                        )}
                                        {'\n'}
                                        <Text
                                            style={{
                                                fontSize: 7,
                                                color: '#4A5568',
                                            }}
                                        >
                                            ({toHijriDate(service.serviceDate)})
                                        </Text>
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
                        </View>

                        {/* Guarantee Details */}
                        {service.guarantee && (
                            <View style={styles.guaranteeSection}>
                                <View style={styles.guaranteeHeader}>
                                    <View style={styles.statusContainer}>
                                        {isGuaranteeActive(
                                            service.guarantee.endDate
                                        ) ? (
                                            <View style={styles.activeStatus}>
                                                <Text
                                                    style={[
                                                        styles.statusText,
                                                        styles.activeText,
                                                    ]}
                                                >
                                                    نشط
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.expiredStatus}>
                                                <Text
                                                    style={[
                                                        styles.statusText,
                                                        styles.expiredText,
                                                    ]}
                                                >
                                                    منتهي
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.guaranteeTitle}>
                                        تفاصيل الضمان - الخدمة {index + 1}
                                    </Text>
                                </View>

                                <View style={styles.guaranteeTable}>
                                    {/* مدة الضمان */}
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCellValue}>
                                            <Text style={styles.tableValue}>
                                                {
                                                    service.guarantee
                                                        .typeGuarantee
                                                }
                                            </Text>
                                        </View>
                                        <View style={styles.tableCellLabel}>
                                            <Text style={styles.tableLabel}>
                                                مدة الضمان
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.tableRow}>
                                        {/* الجزء الخاص بالقيمة */}
                                        <View style={styles.tableCellValue}>
                                            <View style={styles.dualDate}>
                                                <Text
                                                    style={styles.gregorianDate}
                                                >
                                                    {formatGregorianDate(
                                                        service.guarantee
                                                            .startDate
                                                    )}
                                                </Text>
                                                <Text style={styles.hijriDate}>
                                                    (
                                                    {toHijriDate(
                                                        service.guarantee
                                                            .startDate
                                                    )}
                                                    )
                                                </Text>
                                            </View>
                                        </View>
                                        {/* الجزء الخاص بالوصف */}
                                        <View style={styles.tableCellLabel}>
                                            <Text style={styles.tableLabel}>
                                                تاريخ البدء
                                            </Text>
                                        </View>
                                    </View>

                                    {/* تاريخ الانتهاء */}
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCellValue}>
                                            <View style={styles.dualDate}>
                                                <Text
                                                    style={styles.gregorianDate}
                                                >
                                                    {formatGregorianDate(
                                                        service.guarantee
                                                            .endDate
                                                    )}
                                                </Text>
                                                <Text style={styles.hijriDate}>
                                                    (
                                                    {toHijriDate(
                                                        service.guarantee
                                                            .endDate
                                                    )}
                                                    )
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableCellLabel}>
                                            <Text style={styles.tableLabel}>
                                                تاريخ الانتهاء
                                            </Text>
                                        </View>
                                    </View>

                                    {/* الأيام المتبقية */}
                                    {isGuaranteeActive(
                                        service.guarantee.endDate
                                    ) && (
                                        <View style={styles.tableRow}>
                                            <View style={styles.tableCellValue}>
                                                <Text
                                                    style={styles.remainingDays}
                                                >
                                                    {calculateRemainingDays(
                                                        service.guarantee
                                                            .endDate
                                                    )}{' '}
                                                    يوم
                                                </Text>
                                            </View>
                                            <View style={styles.tableCellLabel}>
                                                <Text style={styles.tableLabel}>
                                                    الأيام المتبقية
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* شروط الضمان */}
                                {service.guarantee.terms && (
                                    <View style={styles.termsSection}>
                                        <Text style={styles.termsTitle}>
                                            شروط الضمان:
                                        </Text>
                                        <Text style={styles.termsText}>
                                            {service.guarantee.terms}
                                        </Text>
                                    </View>
                                )}

                                {/* ملاحظات الضمان */}
                                {service.guarantee.Notes && (
                                    <View style={styles.notesSection}>
                                        <Text style={styles.notesTitle}>
                                            ملاحظات على الضمان:
                                        </Text>
                                        <Text style={styles.notesText}>
                                            {service.guarantee.Notes}
                                        </Text>
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
                <Text style={styles.footerText}>
                    جميع الحقوق محفوظة لشركة مظلة التميز 2025 ©
                </Text>
            </View>
        </Page>
    </Document>
)

export default GuaranteePDF
