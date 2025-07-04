// import React, { useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { Button, Card, Notification, toast } from '@/components/ui'
// import { HiArrowLeft, HiOutlinePrinter } from 'react-icons/hi'
// import { useAppDispatch, useAppSelector } from '@/store'
// import { getClientDetails } from '../store/clientSlice'
// import { getOrderDetails } from '../store/orderSlice'

// const ClientDetails = () => {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useAppDispatch()

//     const client = useAppSelector((state) => state.clientSlice.data.selectedClient)
//     const order = useAppSelector((state) => state.orderSlice.data.selectedOrder)
//     const loading = useAppSelector((state) => state.clientSlice.data.loading)

//     useEffect(() => {
//         if (id) {
//             dispatch(getClientDetails(id))
//             // افترض أن كل عميل لديه طلب واحد فقط لهذا المثال
//             dispatch(getOrderDetails(id)) 
//         }
//     }, [id, dispatch])

//     const handlePrint = () => {
//         toast.push(
//             <Notification title="جاري الطباعة" type="info">
//                 يتم تحضير البيانات للطباعة
//             </Notification>
//         )
//         setTimeout(() => {
//             window.print()
//         }, 500)
//     }

//     if (loading || !client) {
//         return <div>جاري تحميل بيانات العميل...</div>
//     }

//     return (
//         <div className="container mx-auto p-4 print:p-0">
//             <div className="flex justify-between items-center mb-6 print:hidden">
//                 <Button
//                     size="sm"
//                     variant="plain"
//                     icon={<HiArrowLeft />}
//                     onClick={() => navigate(-1)}
//                 >
//                     رجوع
//                 </Button>
//                 <Button
//                     size="sm"
//                     variant="solid"
//                     icon={<HiOutlinePrinter />}
//                     onClick={handlePrint}
//                 >
//                     طباعة
//                 </Button>
//             </div>

//             <h1 className="text-2xl font-bold mb-6 print:text-center">
//                 تفاصيل العميل والطلب
//             </h1>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* معلومات العميل */}
//                 <Card className="print:shadow-none print:border-0">
//                     <ClientInfo client={client} />
//                 </Card>

//                 {/* معلومات الطلب */}
//                 <Card className="print:shadow-none print:border-0">
//                     <OrderInfo order={order} />
//                 </Card>
//             </div>

//             {/* معلومات السيارة */}
//             {order && (
//                 <Card className="mt-6 print:shadow-none print:border-0">
//                     <h2 className="text-xl font-semibold mb-4">معلومات السيارة</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <p className="text-gray-500">نوع السيارة</p>
//                             <p>{order.carType || 'غير محدد'}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">الموديل</p>
//                             <p>{order.carModel || 'غير محدد'}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">اللون</p>
//                             <p>{order.carColor || 'غير محدد'}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">رقم اللوحة</p>
//                             <p>{order.carPlateNumber || 'غير محدد'}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">الشركة المصنعة</p>
//                             <p>{order.carManufacturer || 'غير محدد'}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">الحجم</p>
//                             <p>{order.carSize || 'غير محدد'}</p>
//                         </div>
//                     </div>
//                 </Card>
//             )}

//             {/* الخدمات والضمانات */}
//             {order?.services?.length > 0 && (
//                 <Card className="mt-6 print:shadow-none print:border-0">
//                     <h2 className="text-xl font-semibold mb-4">الخدمات والضمانات</h2>
//                     {order.services.map((service, index) => (
//                         <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
//                             <h3 className="text-lg font-medium mb-2">
//                                 الخدمة {index + 1}: {service.serviceType}
//                             </h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <p className="text-gray-500">تفاصيل الاتفاق</p>
//                                     <p>{service.dealDetails || 'لا يوجد'}</p>
//                                 </div>
//                                 {service.servicePrice && (
//                                     <div>
//                                         <p className="text-gray-500">السعر</p>
//                                         <p>{service.servicePrice} ر.س</p>
//                                     </div>
//                                 )}
//                                 {/* تفاصيل إضافية حسب نوع الخدمة */}
//                                 {service.serviceType === 'protection' && (
//                                     <>
//                                         <div>
//                                             <p className="text-gray-500">درجة اللمعان</p>
//                                             <p>{service.protectionFinish || 'غير محدد'}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">حجم الفيلم</p>
//                                             <p>{service.protectionSize || 'غير محدد'}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">نوع التغطية</p>
//                                             <p>{service.protectionCoverage || 'غير محدد'}</p>
//                                         </div>
//                                     </>
//                                 )}
//                                 {/* يمكنك إضافة حقول أخرى لأنواع الخدمات المختلفة */}
//                             </div>

//                             {/* تفاصيل الضمان */}
//                             {service.guarantee && (
//                                 <div className="mt-4">
//                                     <h4 className="font-medium mb-2">تفاصيل الضمان</h4>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <p className="text-gray-500">نوع الضمان</p>
//                                             <p>{service.guarantee.typeGuarantee || 'غير محدد'}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">تاريخ البدء</p>
//                                             <p>
//                                                 {new Date(service.guarantee.startDate).toLocaleDateString() || 'غير محدد'}
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">تاريخ الانتهاء</p>
//                                             <p>
//                                                 {new Date(service.guarantee.endDate).toLocaleDateString() || 'غير محدد'}
//                                             </p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">الشروط</p>
//                                             <p>{service.guarantee.terms || 'لا يوجد'}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-gray-500">ملاحظات</p>
//                                             <p>{service.guarantee.Notes || 'لا يوجد'}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </Card>
//             )}
//         </div>
//     )
// }

// export default ClientDetails