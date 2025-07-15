// src/views/clients/ClientSingle/FinancialReports.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui'; // تأكد من أن Card و Spinner متاحان في هذا المسار
import { HiOutlineDocumentReport, HiOutlineCurrencyDollar, HiOutlineReceiptTax, HiOutlineScale } from 'react-icons/hi'; // استيراد أيقونات محددة
import { NumericFormat } from 'react-number-format';
import type { FinancialReportData } from '@/@types/invoice'; // تأكد من تعريف هذا النوع
import { apiGetFinancialReports } from '@/services/invoiceService'; // استيراد خدمة جلب البيانات المالية

interface FinancialReportData {
    totalInvoices: number;
    totalSubtotal: number;
    totalTaxAmount: number;
    totalAmount: number;
    averageInvoiceAmount: number;
    client: {
        fullName: string;
    };
    // أضف أي حقول أخرى متعلقة بالتقرير المالي هنا
}

interface FinancialReportsProps {
    clientId: string;
}

const FinancialReports = ({ clientId }: FinancialReportsProps) => {
    const [report, setReport] = useState<FinancialReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            if (!clientId) {
                setLoading(false);
                setError('معرف العميل مفقود.');
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await apiGetFinancialReports(clientId);
                console.log('Financial Report API Response:', response.data);
                // تأكد هنا أن هيكل البيانات صحيح.
                // إذا كانت البيانات الفعلية تأتي ضمن خاصية 'data' أخرى داخل الاستجابة (كما هو شائع في بعض الـ APIs)،
                // فاستخدم 'response.data.data'. وإلا، استخدم 'response.data' مباشرة.
                setReport(response.data.data || response.data);
            } catch (err) {
                setError('فشل تحميل التقارير المالية. الرجاء المحاولة لاحقاً.');
                console.error('Error fetching financial reports:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [clientId]);

    // دالة مساعدة لإنشاء بطاقات المقاييس المالية
    const renderMetricCard = (
        title: string,
        value: string | number,
        icon: React.ElementType,
        bgColorClass: string,
        textColorClass: string,
        isCurrency: boolean = false // لتحديد ما إذا كانت القيمة عملة أم لا
    ) => (
        <div className={`p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${bgColorClass}`}>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                {/* عرض الأيقونة */}
                {icon && React.createElement(icon, { className: `text-2xl ${textColorClass}` })}
            </div>
            {isCurrency ? (
                // استخدام NumericFormat لتنسيق العملات
                <NumericFormat
                    className={`text-2xl font-bold ${textColorClass}`}
                    displayType="text"
                    value={value}
                    suffix=" ر.س" // إضافة العملة السعودية
                    thousandSeparator={true} // فاصل الآلاف
                    decimalScale={2} // رقمين عشريين
                    fixedDecimalScale={true} // دائما عرض رقمين عشريين
                />
            ) : (
                // عرض القيمة كنص عادي إذا لم تكن عملة
                <p className={`text-2xl font-bold ${textColorClass}`}>{value}</p>
            )}
        </div>
    );

    // --- حالات العرض (التحميل، الخطأ، لا توجد بيانات) ---

    if (loading) {
        return (
            <Card className="p-6 min-h-[200px] flex justify-center items-center">
                <Spinner size={40} />
                <p className="ml-3 text-gray-600 dark:text-gray-300">جاري تحميل التقارير المالية...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6 min-h-[200px] flex justify-center items-center bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
                <p className="text-red-600 dark:text-red-300 text-center font-medium">{error}</p>
            </Card>
        );
    }

    if (!report || report.totalInvoices === 0) {
        return (
            <Card className="p-6 min-h-[200px] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                <HiOutlineDocumentReport className="text-7xl text-gray-400 mb-6" />
                <p className="text-gray-600 dark:text-gray-300 text-xl font-semibold">
                    لا توجد تقارير مالية لهذا العميل بعد.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    ابدأ بإنشاء فواتير جديدة لعرض الملخص المالي هنا.
                </p>
            </Card>
        );
    }

    // --- العرض الرئيسي للبيانات المالية ---

    return (
        <Card className="p-6 bg-white dark:bg-gray-900">
            {/* شبكة لعرض بطاقات المقاييس المالية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* بطاقة إجمالي الفواتير */}
                {renderMetricCard(
                    'إجمالي الفواتير',
                    report.totalInvoices,
                    HiOutlineDocumentReport,
                    'bg-gray-50 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-200'
                )}
                {/* بطاقة إجمالي المبالغ الفرعية */}
                {renderMetricCard(
                    'إجمالي المبالغ الفرعية',
                    report.totalSubtotal,
                    HiOutlineCurrencyDollar,
                    'bg-gray-50 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-200',
                    true
                )}
                {/* بطاقة إجمالي الضرائب */}
                {renderMetricCard(
                    'إجمالي الضرائب',
                    report.totalTaxAmount,
                    HiOutlineReceiptTax,
                    'bg-gray-50 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-200',
                    true
                )}
                {/* بطاقة إجمالي المبالغ المدفوعة */}
                {renderMetricCard(
                    'إجمالي المبالغ المدفوعة',
                    report.totalAmount,
                    HiOutlineCurrencyDollar,
                    'bg-gray-50 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-200',
                    true
                )}
                {/* بطاقة متوسط مبلغ الفاتورة (تظهر فقط إذا كان هناك فواتير) */}
                {report.totalInvoices > 0 && renderMetricCard(
                    'متوسط مبلغ الفاتورة',
                    report.averageInvoiceAmount,
                    HiOutlineScale,
                    'bg-gray-50 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-200',
                    true
                )}
            </div>

            {/* قسم الملاحظات الإضافية */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h5 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">ملاحظات:</h5>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                    <li>تتضمن هذه التقارير جميع الفواتير الصادرة لهذا العميل.</li>
                    <li>المبالغ المعروضة بالريال السعودي (ر.س).</li>
                </ul>
            </div>
        </Card>
    );
};

export default FinancialReports;