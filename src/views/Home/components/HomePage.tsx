import React, { useEffect, useMemo, Suspense, lazy } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { getStatistics } from '../store/StatisticsSlice';
import { FiArrowUp, FiArrowDown, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

// استخدام React.lazy لتحميل المكون بشكل غير متزامن
const DailyTasks = lazy(() => import('@/views/tasks/DailyTasks'));

// دالة مساعدة لحساب التغير والنسبة المئوية
const calculateTrend = (currentValue, previousValue) => {
  if (previousValue === undefined || previousValue === null || previousValue === 0) {
    return { change: null, percentage: null, isUp: null };
  }
  const change = currentValue - previousValue;
  const percentage = (change / previousValue) * 100;
  return { change, percentage, isUp: change >= 0 };
};

// استخدام React.memo لتجنب إعادة عرض المكون إذا لم تتغير الـ props
const StatisticsBoxes = React.memo(({ stats }) => {
  // تعريف بيانات المربعات في مصفوفة لتقليل التكرار
  const statisticsData = useMemo(() => [
    {
      title: 'مبيعات اليوم',
      value: stats.todaySales,
      previousValue: stats.todaySalesYesterday,
      unit: 'ريال سعودي',
      colors: 'from-blue-50 to-blue-100 border-blue-200 text-blue-700 text-blue-800 text-blue-600',
      description: 'إجمالي مبيعات اليوم',
    },
    {
      title: 'أوامر قص الرولات',
      value: stats.rollCuttingOrders,
      previousValue: stats.rollCuttingOrdersYesterday,
      unit: 'طلبات اليوم',
      colors: 'from-green-50 to-green-100 border-green-200 text-green-700 text-green-800 text-green-600',
      description: 'أوامر قص الرولات',
    },
    {
      title: 'قصاصات',
      value: stats.cutRollsQuantity,
      previousValue: stats.cutRollsQuantityYesterday,
      unit: 'متر اليوم',
      colors: 'from-purple-50 to-purple-100 border-purple-200 text-purple-700 text-purple-800 text-purple-600',
      description: 'كمية الرولات المقصوصة',
    },
    {
      title: 'إجمالي الحجوزات',
      value: stats.totalAppointments,
      previousValue: stats.totalAppointmentsYesterday,
      unit: 'حجوزات نشطة',
      colors: 'from-amber-50 to-amber-100 border-amber-200 text-amber-700 text-amber-800 text-amber-600',
      description: 'إجمالي المواعيد والحجوزات',
    },
    {
      title: 'حجوزات مؤكدة',
      value: stats.confirmedBookings,
      previousValue: stats.confirmedBookingsYesterday,
      unit: 'تم الدفع',
      colors: 'from-teal-50 to-teal-100 border-teal-200 text-teal-700 text-teal-800 text-teal-600',
      description: 'حجوزات في الانتظار (مؤكدة)',
    },
    {
      title: 'عروض غير مؤكدة',
      value: stats.pendingOffers,
      previousValue: stats.pendingOffersYesterday,
      unit: 'بانتظار التأكيد',
      colors: 'from-rose-50 to-rose-100 border-rose-200 text-rose-700 text-rose-800 text-rose-600',
      description: 'العروض (حجوز غير مؤكدة)',
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statisticsData.map((item, index) => {
        const { change, percentage, isUp } = calculateTrend(item.value, item.previousValue);
        const textColor = isUp ? 'text-green-500' : 'text-red-500';

        return (
          <div 
            key={index} 
            className={`bg-gradient-to-br rounded-lg p-4 shadow-md border ${item.colors.split(' ')[0]} ${item.colors.split(' ')[1]} ${item.colors.split(' ')[2]}`}
          >
            <h3 className={`text-sm font-medium ${item.colors.split(' ')[3]}`}>{item.title}</h3>
            <p className={`text-2xl font-bold ${item.colors.split(' ')[4]}`}>
              {item.value ? item.value.toLocaleString('ar-SA') : 0}
            </p>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${item.colors.split(' ')[5]} ml-2`}>{item.unit}</span>
              {percentage !== null && (
                <span className={`flex items-center text-xs font-semibold ${textColor}`}>
                  {isUp ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />}
                  {Math.abs(percentage).toFixed(2)}% 
                  {change !== 0 && (
                     <span className="mr-1"> ({change > 0 ? '+' : ''}{change.toLocaleString('ar-SA')})</span>
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

const HomePage = () => {
  const dispatch = useAppDispatch();
  const statistics = useAppSelector(
    (state) => state.StatisticsSlice.data.statistics || {}
  );

  useEffect(() => {
    dispatch(getStatistics());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم الرئيسية</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Link to="/clients/add-service">
            <Button
              size="sm"
              variant="solid"
              icon={<FiPlusCircle />}
              className="w-full sm:w-auto"
            >
              إضافة خدمة
            </Button>
          </Link>
          
          <Link to="/clients/create-client">
            <Button
              size="sm"
              variant="solid"
              icon={<FiPlusCircle />}
              className="w-full sm:w-auto"
            >
              إضافة سيارة لعميل
            </Button>
          </Link>
        </div>
      </div>
      
      <StatisticsBoxes stats={statistics} />
      
      <Suspense fallback={<div>جاري تحميل المهام...</div>}>
        <DailyTasks />
      </Suspense>
    </div>
  );
};

export default HomePage;