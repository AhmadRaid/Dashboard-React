// import React from 'react'
// import { Client } from '@/@types/clients'

// const ClientInfo = ({ client }: { client: Client }) => {
//     return (
//         <div>
//             <h2 className="text-xl font-semibold mb-4">معلومات العميل</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <p className="text-gray-500">الاسم الكامل</p>
//                     <p>{`${client.firstName} ${client.middleName} ${client.lastName}`}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">نوع العميل</p>
//                     <p>{client.clientType === 'individual' ? 'فردي' : 'شركة'}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">البريد الإلكتروني</p>
//                     <p>{client.email || 'غير محدد'}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">رقم الهاتف</p>
//                     <p>{client.phone}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">الفرع</p>
//                     <p>{client.branch}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">تاريخ الإنشاء</p>
//                     <p>{new Date(client.createdAt).toLocaleString()}</p>
//                 </div>
//                 <div>
//                     <p className="text-gray-500">تاريخ التحديث</p>
//                     <p>{new Date(client.updatedAt).toLocaleString()}</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ClientInfo