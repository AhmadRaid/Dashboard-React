import React, { useEffect, useState } from 'react';
import { Container } from '@/components/shared';
import { useParams } from 'react-router-dom';
import FinancialReports from './FinancialReports';
import type { ClientWithOrdersData } from '@/@types/clients'; // تأكد من تعريف هذا النوع بشكل صحيح
import { apiGetClientProfile } from '@/services/ClientsService';
import Spinner from '@/components/ui/Spinner';
import { Card } from '@/components/ui'; // تأكد من استيراد Card
import { HiOutlineUserCircle } from 'react-icons/hi'; // أيقونة لعنوان العميل

const ClientFinancialReports = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const [clientName, setClientName] = useState<string | null>(null);
    const [loadingClient, setLoadingClient] = useState(true);
    const [errorClient, setErrorClient] = useState<string | null>(null);

    useEffect(() => {
        const fetchClientName = async () => {
            if (!clientId) {
                setLoadingClient(false);
                setErrorClient('معرف العميل غير متوفر في الرابط.');
                return;
            }

            setLoadingClient(true);
            setErrorClient(null);
            try {
                const response = await apiGetClientProfile(clientId);
                console.log('Client Profile API Response:', response.data);

                if (response.data && response.data.data) {
                    const clientData = response.data.data;
                    // تجميع الاسم الكامل والتحقق من وجود الأجزاء لتجنب 'null' أو 'undefined'
                    const fullName = [
                        clientData.firstName,
                        clientData.secondName,
                        clientData.thirdName,
                        clientData.lastName
                    ].filter(Boolean).join(' '); // يقوم بتصفية القيم الفارغة ودمج الباقي بمسافة
                    
                    setClientName(fullName);
                } else {
                    setErrorClient('لم يتم العثور على بيانات العميل المطلوبة.');
                }
            } catch (err) {
                setErrorClient('فشل تحميل تفاصيل العميل. الرجاء التحقق من اتصالك بالإنترنت والمحاولة لاحقاً.');
                console.error('Error fetching client details:', err);
            } finally {
                setLoadingClient(false);
            }
        };

        fetchClientName();
    }, [clientId]);

    // --- حالات العرض المُحسّنة ---

    if (!clientId) {
        return (
            <Container className="h-full flex justify-center items-center">
                <Card className="p-6 text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        <span className="text-red-500 mr-2">خطأ:</span> معرف العميل غير متوفر.
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        الرجاء التأكد من أن الرابط الذي تتبعه صحيح.
                    </p>
                </Card>
            </Container>
        );
    }

    if (loadingClient) {
        return (
            <Container className="h-full flex flex-col items-center justify-center">
                <Spinner size={50} className="text-blue-500" /> {/* لون أزرق للسبينر */}
                <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                    جاري تحميل بيانات العميل...
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    الرجاء الانتظار قليلاً.
                </p>
            </Container>
        );
    }

    if (errorClient) {
        return (
            <Container className="h-full flex justify-center items-center">
                <Card className="p-6 text-center bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
                    <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-4">
                        <span className="mr-2">عذرًا!</span> حدث خطأ أثناء التحميل.
                    </h3>
                    <p className="text-red-600 dark:text-red-400">
                        {errorClient}
                    </p>
                    <p className="text-red-600 dark:text-red-400 mt-2">
                        يرجى المحاولة مرة أخرى في وقت لاحق.
                    </p>
                </Card>
            </Container>
        );
    }

    // --- العرض الرئيسي للبيانات ---
    return (
        <Container className="h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                    <HiOutlineUserCircle className="text-3xl text-gray-600 dark:text-gray-300" />
                    التقارير المالية للعميل: <span className="text-blue-600 dark:text-blue-400">{clientName || 'غير معروف'}</span>
                </h3>
            </div>
            
            {/* مكون FinancialReports سيعتني بتحميل وعرض بياناته المالية */}
            <FinancialReports clientId={clientId} />
        </Container>
    );
};

export default ClientFinancialReports;