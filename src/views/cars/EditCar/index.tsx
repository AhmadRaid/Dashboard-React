import React, { useEffect, useState } from 'react';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGetCarDetails, apiDeleteCar, apiUpdateCar } from '@/services/CarsService'; // تأكد من وجود هذه الدوال
import CarForm from '../CarForm/CarForm';

const EditCar = () => {
    const navigate = useNavigate();
    const { carId } = useParams(); // الحصول على الـ ID من الرابط
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCarData = async () => {
            if (carId) {
                try {
                    const response = await apiGetCarDetails(carId);
                    setCarData(response.data);
                } catch (error) {
                    console.error('فشل في جلب بيانات السيارة:', error);
                    toast.push(
                        <Notification title="خطأ" type="danger" duration={2500}>
                            فشل في جلب بيانات السيارة.
                        </Notification>,
                        { placement: 'top-center' }
                    );
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCarData();
    }, [carId]);

    const updateCar = async (data: any) => {
        try {
            await apiUpdateCar(carId, data);
            toast.push(
                <Notification title="نجح التحديث" type="success" duration={2500}>
                    تم تحديث السيارة بنجاح.
                </Notification>,
                { placement: 'top-center' }
            );
            navigate(`/cars`); // يمكنك تعديل هذا المسار
        } catch (error) {
            toast.push(
                <Notification title="فشل التحديث" type="danger" duration={2500}>
                    فشل في تحديث بيانات السيارة.
                </Notification>,
                { placement: 'top-center' }
            );
        }
    };

    const deleteCar = async (setDialogOpen: (open: boolean) => void) => {
        try {
            await apiDeleteCar(carId);
            setDialogOpen(false);
            toast.push(
                <Notification title="تم الحذف" type="success" duration={2500}>
                    تم حذف السيارة بنجاح.
                </Notification>,
                { placement: 'top-center' }
            );
            navigate(`/cars`);
        } catch (error) {
            setDialogOpen(false);
            toast.push(
                <Notification title="فشل الحذف" type="danger" duration={2500}>
                    فشل في حذف السيارة.
                </Notification>,
                { placement: 'top-center' }
            );
        }
    };

    const handleFormSubmit = async (values: any, setSubmitting: any) => {
        setSubmitting(true);
        await updateCar(values);
        setSubmitting(false);
    };

    const handleDiscard = () => {
        navigate('/cars');
    };

    return (
        <>
            <h2 className="text-3xl font-bold mb-6">تعديل السيارة</h2>
            {loading ? (
                <div className="text-center py-8">
                    <span className="text-lg">جاري تحميل بيانات السيارة...</span>
                </div>
            ) : carData ? (
                <CarForm
                    type="edit"
                    initialData={carData}
                    onFormSubmit={handleFormSubmit}
                    onDiscard={handleDiscard}
                    onDelete={deleteCar}
                />
            ) : (
                <div className="text-center py-8">
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        لم يتم العثور على بيانات السيارة.
                    </h4>
                </div>
            )}
        </>
    );
};

export default EditCar;