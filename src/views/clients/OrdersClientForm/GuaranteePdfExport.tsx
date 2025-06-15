import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { HiDocumentDownload } from 'react-icons/hi';
import { Spinner } from '@/components/ui';
import { OrdersGuarantee } from '@/@types/clients';
// Import types but not the actual implementation to keep dynamic loading
import type { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface GuaranteePdfExportProps {
    guarantees: OrdersGuarantee[];
}

const GuaranteePdfExport: React.FC<GuaranteePdfExportProps> = ({ guarantees }) => {
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handleExportPdf = async () => {
        if (guarantees.length === 0) {
            alert('لا يوجد ضمانات للتصدير');
            return;
        }

        setIsLoading(true);

        try {
            // Dynamically import react-pdf only when needed
            const ReactPDF = await import('@react-pdf/renderer');
            const { Document, Page, Text, View, StyleSheet, pdf, Font } = ReactPDF;
            
            // Register Amiri font (Arabic support)
            Font.register({
                family: 'Amiri',
                src: 'https://fonts.cdnfonts.com/s/14885/Amiri-Regular.woff'
            });
            
            // Create styles
            const styles = StyleSheet.create({
                page: {
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    padding: 30,
                    fontFamily: 'Amiri'
                },
                title: {
                    fontSize: 24,
                    textAlign: 'center',
                    marginBottom: 20,
                    color: '#333333',
                    fontWeight: 'bold'
                },
                table: {
                    display: 'flex',
                    width: 'auto',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#bfbfbf',
                    marginBottom: 10
                },
                tableRow: {
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#bfbfbf',
                    borderBottomStyle: 'solid',
                    alignItems: 'center',
                    minHeight: 35
                },
                tableRowHeader: {
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#bfbfbf',
                    borderBottomStyle: 'solid',
                    alignItems: 'center',
                    minHeight: 35,
                    backgroundColor: '#f2f2f2'
                },
                tableCol: {
                    width: '20%',
                    borderRightWidth: 1,
                    borderRightColor: '#bfbfbf',
                    borderRightStyle: 'solid',
                    paddingLeft: 5,
                    paddingRight: 5,
                    textAlign: 'right'
                },
                tableCell: {
                    fontSize: 10,
                    textAlign: 'right',
                    paddingTop: 5,
                    paddingBottom: 5
                },
                headerCell: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'right'
                },
                footer: {
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                    fontSize: 10,
                    color: '#666666'
                },
                active: {
                    color: '#4CAF50'
                },
                inactive: {
                    color: '#F44336'
                }
            });
            
            // Create PDF Document component
            const MyDocument = () => (
                <Document>
                    <Page size="A4" style={styles.page}>
                        <Text style={styles.title}>تقرير الضمانات</Text>
                        
                        <View style={styles.table}>
                            {/* Table Header */}
                            <View style={styles.tableRowHeader}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.headerCell}>نوع الضمان</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.headerCell}>تاريخ البدء</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.headerCell}>تاريخ الانتهاء</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.headerCell}>الشروط</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.headerCell}>الحالة</Text>
                                </View>
                            </View>
                            
                            {/* Table Rows */}
                            {guarantees.map((guarantee, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{guarantee.typeGuarantee || ''}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{formatDate(guarantee.startDate)}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{formatDate(guarantee.endDate)}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={styles.tableCell}>{guarantee.terms || ''}</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={[styles.tableCell, guarantee.status === 'active' ? styles.active : styles.inactive]}>
                                            {guarantee.status === 'active' ? 'نشط' : 'غير نشط'}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        
                        <Text style={styles.footer}>
                            تاريخ التصدير: {new Date().toLocaleDateString('en-US')}
                        </Text>
                    </Page>
                </Document>
            );
            
            // Generate PDF blob
            const blob = await pdf(<MyDocument />).toBlob();
            
            // Create download link and trigger download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'guarantees-report.pdf';
            link.click();
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('حدث خطأ أثناء إنشاء ملف PDF');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="solid"
            size="sm"
            color="blue-600"
            icon={isLoading ? <Spinner size={20} /> : <HiDocumentDownload />}
            onClick={handleExportPdf}
            disabled={isLoading}
        >
            {isLoading ? 'جاري التصدير...' : 'تصدير PDF'}
        </Button>
    );
};

export default GuaranteePdfExport;
