export const ClientOrdersTools = ({ clientNumber }: { clientNumber?: string }) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
            <div className="">
                <h3 className="text-2xl font-bold mb-1">
                    تفاصيل العميل
                    {clientNumber && (
                        <span className="mr-2 text-indigo-600 dark:text-indigo-400 text-xl">
                        #{clientNumber}
                        </span>
                    )}
                </h3>
                <p className="mb-6">قسم لعرض بيانات العميل والطلبات الخاصة به</p>
            </div>
        </div>
    )
}