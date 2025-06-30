import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import ClientsTableSearch from './ClientsTableSearch'
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData } from '../store'

export const ClientsTableTools = () => {
    const dispatch = useAppDispatch()

    const branchOptions = [
        { label: 'جميع الفروع', value: '' },
        { label: 'فرع المدينة', value: 'عملاء فرع المدينة' },
        { label: 'فرع أبحر', value: 'عملاء فرع ابحر' },
        { label: 'أخرى', value: 'اخرى' },
    ]

    const handleBranchFilter = (branch: string) => {
        dispatch(setTableData({ 
            branchFilter: branch,
            pageIndex: 1,
            last50Orders: false // إلغاء فلترة آخر 50 عند تغيير الفرع
        }))
    }

    const handleLast50Orders = () => {
        dispatch(setTableData({ 
            last50Orders: true,
            pageIndex: 1,
            branchFilter: '' // إلغاء فلترة الفرع عند عرض آخر 50
        }))
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
            <h4 className="text-2xl text-bold mb-3 lg:mb-0">جدول المبيعات</h4>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <ClientsTableSearch />
                
                <Select
                    size="sm"
                    placeholder="تصفية حسب الفرع"
                    options={branchOptions}
                    onChange={(option) => handleBranchFilter(option?.value || '')}
                />
                
                <Button
                    size="sm"
                    variant="twoTone"
                    onClick={handleLast50Orders}
                >
                    عرض آخر 50 طلب
                </Button>

                <Link
                    className="block lg:inline-block md:mb-0 mb-4"
                    to="/clients/create-client"
                >
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        انشاء عميل
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ClientsTableTools