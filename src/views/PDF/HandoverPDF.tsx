// components/HandoverPDF.tsx
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer'

interface ClientData {
    clientNumber: string
    firstName: string
    secondName: string
    thirdName: string
    lastName: string
    email: string
    phone: string
}

interface ServiceData {
    _id: string
    serviceType: string
    dealDetails: string
    protectionSize: string
    protectionCoverage: string
    servicePrice: number
    guarantee: {
        typeGuarantee: string
        startDate: string
        endDate: string
        notes: string
    }
    protectionFinish?: string
    originalCarColor?: string
    protectionColor?: string
    insulatorType?: string
    insulatorCoverage?: string
    polishType?: string
    externalPolishLevel?: string
    internalPolishLevel?: string
    internalAndExternalPolishLevel?: string
    additionType?: string
    washScope?: string
}

interface OrderData {
    _id: string
    orderNumber: string
    clientId: ClientData
    carModel: string
    carManufacturer: string
    carColor: string
    carPlateNumber: string
    carSize: string
    services: ServiceData[]
    createdAt: string
    updatedAt: string
    invoice: {
        invoiceNumber: string
        totalAmount: number
    }
    client: ClientData
}

interface HandoverDocumentProps {
    orderData: OrderData
    handoverDate: string
    odometerReading: number
    employeeName: string
}

Font.register({
    family: 'Tajawal',
    fonts: [
        { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Tajawal-ExtraBold.ttf', fontWeight: 'bold' },
    ],
})

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 16,
        fontFamily: 'Tajawal',
        textAlign: 'right',
        direction: 'rtl',
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        paddingBottom: 4,
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
        fontSize: 8,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 1,
    },
    companyAddress: {
        fontSize: 5,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyContact: {
        fontSize: 5,
        color: '#4A5568',
        marginBottom: 1,
    },
    companyTax: {
        fontSize: 5,
        color: '#4A5568',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: 10,
        textAlign: 'center',
    },
    section: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'extrabold',
        color: '#1A202C',
        marginBottom: 6,
        paddingBottom: 3,
        borderBottomWidth: 2,
        borderBottomColor: '#2D3748',
    },
    infoContainer: {
        flexDirection: 'row-reverse',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoItemBox: {
        width: '48%',
        backgroundColor: '#F7FAFC',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 6,
    },
    infoItemFullWidth: {
        width: '100%',
        backgroundColor: '#F7FAFC',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 6,
    },
    label: {
        fontSize: 7,
        color: '#4A5568',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    value: {
        fontSize: 9,
        color: '#1A202C',
        fontWeight: 'bold',
    },
    acknowledgmentSection: {
        marginTop: 15,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 6,
        borderLeftWidth: 4,
        borderLeftColor: '#4C51BF',
    },
    acknowledgmentText: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#374151',
        textAlign: 'right',
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    signatureBox: {
        alignItems: 'center',
        width: '45%',
        paddingVertical: 8,
    },
    signatureLabel: {
        fontSize: 9,
        marginBottom: 6,
        fontWeight: 'bold',
    },
    signatureLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        textAlign: 'center',
        fontSize: 6,
        color: '#4A5568',
        borderTopWidth: 1,
        borderTopColor: '#D1D5DB',
        paddingTop: 4,
    },
    footerText: {
        marginBottom: 1,
    },
    serviceItem: {
        backgroundColor: '#F7FAFC',
        padding: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 6,
        flexDirection: 'column',
    },
    guaranteeDetails: {
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 5,
    },
    serviceTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#374151',
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E0',
        paddingBottom: 3,
    },
    paymentNote: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'right',
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#EBF4FF',
        borderLeftWidth: 4,
        borderLeftColor: '#4299E1',
        borderRadius: 4,
    },
    disclaimer: {
        fontSize: 9, // حجم خط مناسب
        fontWeight: 'bold', // جعل النص غامق
        color: '#B91C1C', // لون أحمر داكن ليلفت الانتباه
        textAlign: 'center', // توسيط النص
        marginTop: 15, // مسافة علوية
        marginBottom: 15, // مسافة سفلية
        padding: 12, // مسافة داخلية
        backgroundColor: '#FEF2F2', // لون خلفية أحمر خفيف جدًا
        borderWidth: 1, // إضافة إطار
        borderColor: '#EF4444', // لون الإطار أحمر
        borderRadius: 8, // حواف دائرية
    },
})

const HandoverPDF: React.FC<HandoverDocumentProps> = ({
    orderData,
    handoverDate,
    odometerReading,
    employeeName,
}) => {
    const {
        client,
        carModel,
        carManufacturer,
        carColor,
        carPlateNumber,
        services,
    } = orderData
    const clientName = `${client.firstName} ${client.secondName} ${client.thirdName} ${client.lastName}`

    const getArabicServiceType = (serviceType: string) => {
        switch (serviceType) {
            case 'protection':
                return 'حماية'
            case 'polish':
                return 'تلميع'
            case 'insulator':
                return 'عازل حراري'
            case 'additions':
                return 'إضافات'
            default:
                return serviceType
        }
    }

    const renderServiceDetails = (service: ServiceData, index: number) => {
        const fields = []

        // General Details
        fields.push({
            label: 'نوع الخدمة',
            value: getArabicServiceType(service.serviceType),
        })
        if (service.dealDetails) {
            fields.push({
                label: 'تفاصيل الخدمة',
                value: service.dealDetails,
            })
        }

        // Protection Specifics
        if (service.serviceType === 'protection') {
            if (service.protectionFinish) {
                fields.push({
                    label: 'اللمعان',
                    value: service.protectionFinish,
                })
            }
            if (service.protectionSize) {
                fields.push({
                    label: 'الحجم',
                    value: service.protectionSize,
                })
            }
            if (service.protectionCoverage) {
                fields.push({
                    label: 'التغطية',
                    value: service.protectionCoverage,
                })
            }
            if (service.originalCarColor) {
                fields.push({
                    label: 'لون السيارة الأصلي',
                    value: service.originalCarColor,
                })
            }
            if (service.protectionColor) {
                fields.push({
                    label: 'لون الحماية',
                    value: service.protectionColor,
                })
            }
        }

        // Insulator Specifics
        if (service.serviceType === 'insulator') {
            if (service.insulatorType) {
                fields.push({
                    label: 'نوع العازل',
                    value: service.insulatorType,
                })
            }
            if (service.insulatorCoverage) {
                fields.push({
                    label: 'نطاق التغطية',
                    value: service.insulatorCoverage,
                })
            }
        }

        // Polish Specifics
        if (service.serviceType === 'polish') {
            if (service.polishType) {
                fields.push({
                    label: 'نوع التلميع',
                    value: service.polishType,
                })
            }
            if (service.externalPolishLevel) {
                fields.push({
                    label: 'مستوى التلميع الخارجي',
                    value: service.externalPolishLevel,
                })
            }
            if (service.internalPolishLevel) {
                fields.push({
                    label: 'مستوى التلميع الداخلي',
                    value: service.internalPolishLevel,
                })
            }
            if (service.internalAndExternalPolishLevel) {
                fields.push({
                    label: 'مستوى التلميع المشترك',
                    value: service.internalAndExternalPolishLevel,
                })
            }
        }

        // Additions Specifics
        if (service.serviceType === 'additions') {
            if (service.additionType) {
                fields.push({
                    label: 'نوع الإضافة',
                    value: service.additionType,
                })
            }
            if (service.washScope) {
                fields.push({
                    label: 'نطاق الغسيل',
                    value: service.washScope,
                })
            }
        }

        // Split fields into pairs to render side-by-side
        const pairedFields = []
        for (let i = 0; i < fields.length; i += 2) {
            pairedFields.push(fields.slice(i, i + 2))
        }

        return (
            <View
                key={service._id}
                style={styles.serviceItem}
                break={index > 0}
            >
                <Text style={styles.serviceTitle}>الخدمة رقم {index + 1}</Text>
                {pairedFields.map((pair, pairIndex) => (
                    <View key={pairIndex} style={styles.infoContainer}>
                        {pair.map((field, fieldIndex) => (
                            <View key={fieldIndex} style={styles.infoItemBox}>
                                <Text style={styles.label}>{field.label}</Text>
                                <Text style={styles.value}>{field.value}</Text>
                            </View>
                        ))}
                    </View>
                ))}
                {service.guarantee && (
                    <View style={styles.guaranteeDetails}>
                        <Text style={styles.label}>تفاصيل الضمان</Text>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoItemBox}>
                                <Text style={styles.label}>مدة الضمان</Text>
                                <Text style={styles.value}>
                                    {service.guarantee.typeGuarantee}
                                </Text>
                            </View>
                            <View style={styles.infoItemBox}>
                                <Text style={styles.label}>تاريخ البدء</Text>
                                <Text style={styles.value}>
                                    {new Date(
                                        service.guarantee.startDate
                                    ).toLocaleDateString('EN-US')}
                                </Text>
                            </View>
                            <View style={styles.infoItemBox}>
                                <Text style={styles.label}>
                                    تاريخ الانتهاء
                                </Text>
                                <Text style={styles.value}>
                                    {new Date(
                                        service.guarantee.endDate
                                    ).toLocaleDateString('EN-US')}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        )
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header} fixed>
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
                    <View style={styles.logoContainer}>
                        <Image src="/logo.jpg" style={styles.logo} />
                    </View>
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
                ---
                <Text style={styles.title}>إقرار تسليم سيارة</Text>
                ---
                {/* Handover Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>تفاصيل التسليم</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>تاريخ التسليم</Text>
                            <Text style={styles.value}>
                                {new Date(handoverDate).toLocaleDateString(
                                    'EN-US'
                                )}
                            </Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>قراءة العداد</Text>
                            <Text style={styles.value}>
                                {odometerReading} كم
                            </Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>الموظف المسؤول</Text>
                            <Text style={styles.value}>{employeeName}</Text>
                        </View>
                    </View>
                </View>
                ---
                {/* Client Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات العميل</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>الاسم</Text>
                            <Text style={styles.value}>{clientName}</Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>رقم العميل</Text>
                            <Text style={styles.value}>
                                {client.clientNumber}
                            </Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>رقم الجوال</Text>
                            <Text style={styles.value}>{client.phone}</Text>
                        </View>
                        {client.email && (
                            <View style={styles.infoItemBox}>
                                <Text style={styles.label}>
                                    البريد الإلكتروني
                                </Text>
                                <Text style={styles.value}>{client.email}</Text>
                            </View>
                        )}
                    </View>
                </View>
                ---
                {/* Car Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات السيارة</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>
                                الشركة المصنعة ونوع السيارة
                            </Text>
                            <Text style={styles.value}>{carManufacturer}</Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>الموديل</Text>
                            <Text style={styles.value}>{carModel}</Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>اللون</Text>
                            <Text style={styles.value}>{carColor}</Text>
                        </View>
                        <View style={styles.infoItemBox}>
                            <Text style={styles.label}>رقم اللوحة</Text>
                            <Text style={styles.value}>{carPlateNumber}</Text>
                        </View>
                    </View>
                </View>
                ---
                {/* Services Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>الخدمات المقدمة</Text>
                    {services.map((service, index) =>
                        renderServiceDetails(service, index)
                    )}
                </View>
                ---
                {/* Acknowledgment Section */}
                <View style={styles.disclaimer}>
                    <Text>
                        شركة مظلة التميز غير مسؤولة عن أي اعطال مكانيكية او
                        كهربائية كما انها ليست مسؤول عن أي أضرار تنتج للقطع
                        المعاد طلائها أو التجارية
                    </Text>
                </View>
                ---
                {/* Signature Section */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>توقيع العميل</Text>
                        <View style={styles.signatureLine} />
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureLabel}>توقيع الموظف:</Text>
                        <View style={styles.signatureLine} />
                    </View>
                </View>
                ---
                {/* Payment Note Section */}
                <View style={styles.paymentNote}>
                    <Text>
                        يتم إرسال فاتورة للعميل بالمبلغ المدفوع مباشرة بعد
                        الانتهاء من إجراءات الدخول. نرجو عدم التردد في حال لم
                        تستلم فاتورتك، التواصل معنا.
                    </Text>
                </View>
                ---
                {/* Footer fixed */}
                <View style={styles.footer} fixed>
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
        </Document>
    )
}

export default HandoverPDF
