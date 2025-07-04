// import React from 'react'
// import { Order } from '@/@types/orders'

// const OrderInfo = ({ order }: { order?: Order }) => {
//     if (!order) {
//         return <div>لا يوجد طلب مرتبط بهذا العميل</div>
//     }

//     const calculateTotal = () => {
//         if (!order.services) return 0
//         return order.services.reduce((sum, service) => sum + (service.servicePrice || 0), 0)
//     }

//     return (
//         <div>
//             <h2 className="text-xl font-semibold mb-4">معلومات الطلب</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <p className="text-gray-500">رقم الطلب</p>
//                     <p>{order._id.substring(0, 8)}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">حالة الطلب</p>
//                     <p>
//                         {order.services?.some(s => s.guarantee?.status === 'active') 
//                             ? 'نشط' 
//                             : 'مكتمل'}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">تاريخ الإنشاء</p>
//                     <p>{new Date(order.createdAt).toLocaleString()}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">تاريخ التحديث</p>
//                     <p>{new Date(order.updatedAt).toLocaleString()}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">عدد الخدمات</p>
//                     <p>{order.services?.length || 0}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">الإجمالي</p>
//                     <p>{calculateTotal()} ر.س</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default OrderInfo