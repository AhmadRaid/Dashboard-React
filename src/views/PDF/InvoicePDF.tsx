// components/InvoicePDF.tsx
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer'

// Define types for the invoice data
interface Service {
    serviceType: 'protection' | 'polish' | 'insulator' | 'additions' | string
    dealDetails?: string
    servicePrice: number
    guarantee: {
        typeGuarantee: string
        startDate: string | Date
        endDate: string | Date
        terms?: string
        notes?: string
        status?: string
        accepted: boolean
    }
    category?: string // New field for Category
}

interface Order {
    orderNumber: string
    carModel: string
    carColor: string
    carPlateNumber: string
    carManufacturer: string
    carSize: string
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

interface Invoice {
    invoiceNumber: string
    createdAt: string | Date
    subtotal: number
    taxRate: number
    taxAmount: number
    totalAmount: number
    notes?: string
    client: Client
    order: Order
}

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 15, // Reduced padding for maximum space
        fontFamily: 'Tajawal',
        textAlign: 'right', // Default text alignment for the whole page
        direction: 'rtl', // Default direction for the whole page
        justifyContent: 'space-between', // Pushes header to top, footer to bottom
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8, // Reduced margin
        paddingBottom: 6, // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
    },
    logoContainer: {
        width: '40%', // Increased width for logo container
        alignItems: 'center',
    },
    logo: {
        width: 220, // Even Larger logo width
        height: 140, // Even Larger logo height
        objectFit: 'contain',
    },
    arabicInfo: {
        width: '30%', // Adjusted width for side info
        textAlign: 'right', // Ensure text is aligned right
    },
    englishInfo: {
        width: '30%', // Adjusted width for side info
        textAlign: 'left', // Ensure text is aligned left
        direction: 'ltr', // Explicitly LTR for English info
    },
    companyName: {
        fontSize: 11, // Slightly smaller font for company name
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 1, // Reduced margin
    },
    companyAddress: {
        fontSize: 6.5, // Smaller font
        color: '#4A5568',
        marginBottom: 1, // Reduced margin
    },
    companyContact: {
        fontSize: 6.5, // Smaller font
        color: '#4A5568',
        marginBottom: 1, // Reduced margin
    },
    companyTax: {
        fontSize: 6.5, // Smaller font
        color: '#4A5568',
    },
    title: {
        fontSize: 18, // Smaller title
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 2, // Reduced margin
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 8, // Smaller font
        color: '#4A5568',
        textAlign: 'center',
        marginBottom: 8, // Reduced margin
    },
    invoiceInfo: {
        flexDirection: 'row-reverse', // Key change: Reverse the order of flex items (boxes)
        justifyContent: 'space-between',
        marginBottom: 8, // Reduced margin
        backgroundColor: '#F3F4F6',
        padding: 5, // Reduced padding
        borderRadius: 4,
    },
    infoColumn: {
        width: '48%',
        // No explicit direction here, it will inherit from parent or be overridden by specific text styles
    },
    section: {
        marginBottom: 8, // Reduced margin
    },
    sectionTitle: {
        fontSize: 12, // Smaller font
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 4, // Reduced margin
        paddingBottom: 2, // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
    },
    clientInfo: {
        flexDirection: 'row-reverse', // Key change: Reverse the order of flex items (boxes) for RTL
        justifyContent: 'space-between',
        marginBottom: 6, // Reduced margin
    },
    clientInfoItem: {
        width: '48%',
        backgroundColor: '#F3F4F6',
        padding: 6, // Reduced padding
        borderRadius: 4,
        textAlign: 'right', // Ensure text is aligned right within the box
    },
    label: {
        fontSize: 8, // Smaller font
        color: '#4A5568',
        marginBottom: 1, // Reduced margin
        textAlign: 'right', // Ensure label is aligned right
    },
    value: {
        fontSize: 10, // Smaller font
        color: '#1A202C',
        fontWeight: 'bold',
        textAlign: 'right', // Ensure value is aligned right
    },
    carInfo: {
        flexDirection: 'row-reverse', // RTL
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 6, // Reduced margin
    },
    carInfoItem: {
        width: '48%', // two per row to avoid large leftover gaps
        marginBottom: 4, // Reduced margin
        backgroundColor: '#F3F4F6',
        padding: 6, // Slightly larger for readability
        borderRadius: 4,
        textAlign: 'right', // Ensure text is aligned right within the box
    },
    table: {
        width: '100%',
        marginBottom: 10, // Reduced margin
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        overflow: 'hidden',
        textAlign: 'right',
    },
    tableHeader: {
        flexDirection: 'row', // Adjusted to LTR for correct visual order of headers
        backgroundColor: '#2D3748',
        paddingVertical: 4, // Reduced padding
        paddingHorizontal: 6, // Reduced padding
        textAlign: 'right',
    },
    tableHeaderText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 8, // Smaller font
        textAlign: 'right', // Ensure header text is right-aligned
    },
    tableRow: {
        flexDirection: 'row', // Adjusted to LTR for correct visual order of cells
        paddingVertical: 5, // Significantly reduced padding
        paddingHorizontal: 6, // Reduced padding
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        textAlign: 'right',
    },
    tableCol: {
        paddingHorizontal: 1, // Reduced padding
        justifyContent: 'center',
        textAlign: 'right',
    },
    col_itemNumber: {
        // Item number column (رقم)
        width: '12%',
        textAlign: 'right',
    },
    col_service: {
        // Service column (الخدمة)
        width: '58%',
        textAlign: 'right',
    },
    col_price: {
        // Price column (السعر)
        width: '30%',
        textAlign: 'right',
    },
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Pushes the box to the right
        marginBottom: 8, // Reduced margin
        textAlign: 'right',
    },
    totalsBox: {
        width: '40%',
        backgroundColor: '#F3F4F6',
        padding: 7, // Reduced padding
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        textAlign: 'right', // Ensure text is aligned right within the box
    },
    totalsRow: {
        flexDirection: 'row-reverse', // Totals row remains RTL
        justifyContent: 'space-between',
        marginBottom: 3, // Reduced margin
        textAlign: 'right',
    },
    totalLabel: {
        fontSize: 9, // Smaller font
        color: '#4A5568',
        fontWeight: 'normal',
        textAlign: 'right', // Ensure label is aligned right
    },
    totalValue: {
        fontSize: 11, // Smaller font
        color: '#1A202C',
        fontWeight: 'bold',
        textAlign: 'left', // Keep value aligned left so numbers align on the decimal, despite overall RTL
    },
    grandTotal: {
        fontSize: 13, // Smaller font
        color: '#1A202C',
        fontWeight: 'bold',
    },
    notesSection: {
        marginBottom: 8, // Reduced margin
        backgroundColor: '#F3F4F6',
        padding: 7, // Reduced padding
        borderRadius: 4,
        borderRightWidth: 2, // Border on the right for RTL
        borderLeftWidth: 0, // Remove left border
        borderColor: '#6B7280',
        textAlign: 'right', // Ensure text is aligned right within the box
    },
    notesTitle: {
        fontSize: 10, // Smaller font
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 2, // Reduced margin
        textAlign: 'right', // Ensure title is aligned right
    },
    notesText: {
        fontSize: 8, // Smaller font
        color: '#4A5568',
        textAlign: 'right', // Ensure text is aligned right
    },
    footer: {
        marginTop: 10, // Ensure some space above footer
        paddingTop: 7, // Reduced padding
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        textAlign: 'center',
        fontSize: 6, // Even smaller font for footer for crucial fit
        color: '#4A5568',
    },
    footerText: {
        marginBottom: 1, // Reduced margin
    },
    guaranteeBadge: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        paddingHorizontal: 4, // Reduced padding
        paddingVertical: 1, // Reduced padding
        borderRadius: 6, // Slightly less rounded
        fontSize: 7, // Smaller font
        marginTop: 1, // Reduced margin
        fontWeight: 'normal',
        textAlign: 'right', // Ensure badge text is right-aligned
    },
})

// Define props interface
interface InvoicePDFProps {
    invoice: Invoice
}

Font.register({
    family: 'Tajawal',
    fonts: [
        { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Tajawal-ExtraBold.ttf', fontWeight: 'bold' },
    ],
})

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
    // حساب المجموع الفرعي من servicePrice لجميع الخدمات
    const subtotal = invoice.order.services.reduce((sum, service) => {
        return sum + (service.servicePrice || 0);
    }, 0);

    // حساب قيمة الضريبة
    const taxAmount = subtotal * (invoice.taxRate / 100);
    
    // حساب المجموع الكلي
    const totalAmount = subtotal + taxAmount;

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

                {/* Invoice Title */}
                <View>
                    <Text style={styles.title}>فاتورة ضريبية</Text>
                    <Text style={styles.subtitle}>
                        فاتورة خدمات عزل وتلميع السيارات
                    </Text>
                </View>

                {/* Invoice Info */}
                <View style={styles.invoiceInfo}>
                    {/* Invoice Number & Date (Right in RTL) */}
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>رقم الفاتورة:</Text>
                        <Text style={styles.value}>{invoice.invoiceNumber}</Text>

                        <Text style={[styles.label, { marginTop: 2 }]}>
                            تاريخ الفاتورة:
                        </Text>
                        <Text style={styles.value}>
                            {new Date(invoice.createdAt).toLocaleDateString(
                                'ar-SA',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </Text>
                    </View>
                    {/* Order Info (Left in RTL) */}
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>رقم الطلب:</Text>
                        <Text style={styles.value}>
                            {invoice.order.orderNumber}
                        </Text>

                        <Text style={[styles.label, { marginTop: 2 }]}>
                            تاريخ الطلب:
                        </Text>
                        <Text style={styles.value}>
                            {new Date(invoice.order.createdAt).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>

                {/* Client Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات العميل</Text>
                    <View style={styles.clientInfo}>
                        {/* Client Name & Number (Right in RTL) */}
                        <View style={styles.clientInfoItem}>
                            <Text style={styles.label}>اسم العميل:</Text>
                            <Text style={styles.value}>
                                {`${invoice.client.firstName} ${invoice.client.secondName} ${invoice.client.thirdName} ${invoice.client.lastName}`}
                            </Text>

                            <Text style={[styles.label, { marginTop: 2 }]}>
                                رقم العميل:
                            </Text>
                            <Text style={styles.value}>
                                {invoice.client.clientNumber}
                            </Text>
                        </View>
                        {/* Phone & Email (Left in RTL) */}
                        <View style={styles.clientInfoItem}>
                            <Text style={styles.label}>رقم الجوال:</Text>
                            <Text style={styles.value}>{invoice.client.phone}</Text>

                            {invoice.client.email && (
                                <>
                                    <Text style={[styles.label, { marginTop: 2 }]}>
                                        البريد الإلكتروني:
                                    </Text>
                                    <Text style={styles.value}>
                                        {invoice.client.email}
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
                            { label: 'الشركة المصنعة ونوع السيارة', value: invoice.order.carManufacturer },
                            {
                                label: 'موديل السيارة',
                                value: invoice.order.carModel,
                            },
                            { label: 'لون السيارة', value: invoice.order.carColor },
                            {
                                label: 'رقم اللوحة',
                                value: invoice.order.carPlateNumber,
                            },
                            { label: 'حجم السيارة', value: invoice.order.carSize },
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

                {/* Services Table */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                        <View style={[styles.tableCol, styles.col_price]}>
                                <Text style={styles.tableHeaderText}>السعر</Text>
                            </View>
                        
                            <View style={[styles.tableCol, styles.col_service]}>
                                <Text style={styles.tableHeaderText}>الخدمة</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col_itemNumber]}>
                                <Text style={styles.tableHeaderText}>رقم</Text>
                            </View>
                        </View>

                        {/* Table Rows */}
                        {invoice.order.services.map((service, index) => (
                            <View key={index} style={styles.tableRow}>
                                    <View style={[styles.tableCol, styles.col_price]}>
                                    <Text style={styles.value}>{service.servicePrice}</Text>
                                </View>
                               
                                <View style={[styles.tableCol, styles.col_service]}>
                                    <Text style={styles.value}>
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
                                    {service.dealDetails && (
                                        <Text
                                            style={{
                                                fontSize: 7,
                                                color: '#4A5568',
                                                marginTop: 1,
                                                textAlign: 'right',
                                            }}
                                        >
                                            {service.dealDetails}
                                        </Text>
                                    )}
                                    {service.guarantee &&
                                        service.guarantee.accepted && (
                                            <Text style={styles.guaranteeBadge}>
                                                ضمان:{' '}
                                                {service.guarantee.typeGuarantee}
                                            </Text>
                                        )}
                                </View>
                                <View style={[styles.tableCol, styles.col_itemNumber]}>
                                    <Text style={styles.value}>{index + 1}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Notes */}
                {invoice.notes && (
                    <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>ملاحظات:</Text>
                        <Text style={styles.notesText}>{invoice.notes}</Text>
                    </View>
                )}

                {/* Totals */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                            <Text style={styles.totalValue}>{subtotal}</Text>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalLabel}>
                                الضريبة ({invoice.taxRate}%):
                            </Text>
                            <Text style={styles.totalValue}>{taxAmount}</Text>
                        </View>
                        <View
                            style={[
                                styles.totalsRow,
                                {
                                    marginTop: 4,
                                    paddingTop: 4,
                                    borderTopWidth: 1,
                                    borderTopColor: '#D1D5DB',
                                },
                            ]}
                        >
                            <Text style={[styles.totalLabel, styles.grandTotal]}>
                                المجموع الكلي:
                            </Text>
                            <Text style={[styles.totalValue, styles.grandTotal]}>
                                {totalAmount}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        شكراً لثقتكم وتعاملكم مع شركة مظلة التميز لخدمات السيارات
                    </Text>
                    <Text style={styles.footerText}>
                        للاستفسارات، يرجى الاتصال على: 0554474543
                    </Text>
                    <Text style={[styles.footerText, { marginTop: 4 }]}>
                        جميع الحقوق محفوظة لشركة مظلة التميز 2025 ©
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default InvoicePDF