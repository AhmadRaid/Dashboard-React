// components/InvoicePDF.tsx
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
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
}

interface Order {
    orderNumber: string
    carType: string
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
    middleName: string
    lastName: string
    clientNumber: string
    phone: string
    email?: string
}

interface Invoice {
    invoiceNumber: string
    invoiceDate: string | Date
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
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottom: 1,
        borderColor: '#E5E7EB',
        paddingBottom: 20,
    },
    logo: {
        width: 120,
        height: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'right',
    },
    invoiceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
        borderBottom: 1,
        borderColor: '#E5E7EB',
        paddingBottom: 5,
    },
    clientInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    clientInfoItem: {
        width: '48%',
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 3,
    },
    value: {
        fontSize: 14,
        color: '#111827',
        fontWeight: 'medium',
    },
    carInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    carInfoItem: {
        width: '30%',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableCol: {
        paddingHorizontal: 5,
    },
    col1: {
        width: '40%',
    },
    col2: {
        width: '20%',
        textAlign: 'right',
    },
    col3: {
        width: '20%',
        textAlign: 'right',
    },
    col4: {
        width: '20%',
        textAlign: 'right',
    },
    totals: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    totalsRow: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    totalValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: 'medium',
    },
    grandTotal: {
        fontSize: 16,
        color: '#111827',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 30,
        paddingTop: 20,
        borderTop: 1,
        borderColor: '#E5E7EB',
        textAlign: 'center',
        fontSize: 10,
        color: '#6B7280',
    },
})

// Define props interface
interface InvoicePDFProps {
    invoice: any
}

const InvoicePDF: React.FC<any> = ({ invoice }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>فاتورة ضريبية</Text>
            </View>

            {/* Invoice Info */}
            <View style={styles.invoiceInfo}>
                <View>
                    <Text style={styles.label}>رقم الفاتورة:</Text>
                    <Text style={styles.value}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.label}>تاريخ الفاتورة:</Text>
                    <Text style={styles.value}>
                        {new Date(invoice.invoiceDate).toLocaleDateString('ar-SA')}
                    </Text>
                </View>
                <View>
                    <Text style={styles.label}>رقم الطلب:</Text>
                    <Text style={styles.value}>{invoice.order.orderNumber}</Text>
                    <Text style={styles.label}>تاريخ الطلب:</Text>
                    <Text style={styles.value}>
                        {new Date(invoice.order.createdAt).toLocaleDateString('ar-SA')}
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
                            {`${invoice.client.firstName} ${invoice.client.middleName} ${invoice.client.lastName}`}
                        </Text>
                        <Text style={styles.label}>رقم العميل:</Text>
                        <Text style={styles.value}>{invoice.client.clientNumber}</Text>
                    </View>
                    <View style={styles.clientInfoItem}>
                        <Text style={styles.label}>رقم الجوال:</Text>
                        <Text style={styles.value}>{invoice.client.phone}</Text>
                        {invoice.client.email && (
                            <>
                                <Text style={styles.label}>البريد الإلكتروني:</Text>
                                <Text style={styles.value}>{invoice.client.email}</Text>
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
                        { label: 'نوع السيارة', value: invoice.order.carType },
                        { label: 'موديل السيارة', value: invoice.order.carModel },
                        { label: 'لون السيارة', value: invoice.order.carColor },
                        { label: 'رقم اللوحة', value: invoice.order.carPlateNumber },
                        { label: 'الشركة المصنعة', value: invoice.order.carManufacturer },
                        { label: 'حجم السيارة', value: invoice.order.carSize },
                    ].map((item, index) => (
                        <View key={index} style={styles.carInfoItem}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.value}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Services Table */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <View style={[styles.tableCol, styles.col1]}>
                            <Text>الخدمة</Text>
                        </View>
                        <View style={[styles.tableCol, styles.col2]}>
                            <Text>السعر</Text>
                        </View>
                        <View style={[styles.tableCol, styles.col3]}>
                            <Text>الكمية</Text>
                        </View>
                        <View style={[styles.tableCol, styles.col4]}>
                            <Text>المجموع</Text>
                        </View>
                    </View>

                    {/* Table Rows */}
                    {invoice.order.services.map((service, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={[styles.tableCol, styles.col1]}>
                                <Text>
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
                                    <Text style={{ fontSize: 10, color: '#6B7280' }}>
                                        {service.dealDetails}
                                    </Text>
                                )}
                            </View>
                            <View style={[styles.tableCol, styles.col2]}>
                                <Text>
                                    {service.servicePrice.toLocaleString('ar-SA')} ر.س
                                </Text>
                            </View>
                            <View style={[styles.tableCol, styles.col3]}>
                                <Text>1</Text>
                            </View>
                            <View style={[styles.tableCol, styles.col4]}>
                                <Text>
                                    {service.servicePrice.toLocaleString('ar-SA')} ر.س
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <View style={{ width: '30%' }}>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                        <Text style={styles.totalValue}>
                            {invoice.subtotal.toLocaleString('ar-SA')} ر.س
                        </Text>
                    </View>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalLabel}>
                            الضريبة ({invoice.taxRate}%):
                        </Text>
                        <Text style={styles.totalValue}>
                            {invoice.taxAmount.toLocaleString('ar-SA')} ر.س
                        </Text>
                    </View>
                    <View style={styles.totalsRow}>
                        <Text style={[styles.totalLabel, styles.grandTotal]}>
                            المجموع الكلي:
                        </Text>
                        <Text style={[styles.totalValue, styles.grandTotal]}>
                            {invoice.totalAmount.toLocaleString('ar-SA')} ر.س
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>شكراً لتعاملكم معنا</Text>
                <Text>للاستفسارات، يرجى الاتصال على: 0123456789</Text>
                <Text>© {new Date().getFullYear()} جميع الحقوق محفوظة</Text>
            </View>
        </Page>
    </Document>
)

export default InvoicePDF
