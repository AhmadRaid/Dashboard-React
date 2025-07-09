import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import InvoicesTableSearch from './InvoicesTableSearch'
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData, resetFilters } from '../store'

export const InvoicesTableTools = () => {
    const dispatch = useAppDispatch()

    const statusOptions = [
        { label: 'جميع الحالات', value: '' },
        { label: 'مدفوعة', value: 'paid' },
        { label: 'غير مدفوعة', value: 'unpaid' },
    ]

    const sortOptions = [
        { label: 'الأحدث أولاً', value: 'desc' },
        { label: 'الأقدم أولاً', value: 'asc' },
    ]

    const handleStatusFilter = (status: string) => {
        dispatch(setTableData({ 
            pageIndex: 1
        }))
    }

    const handleSortChange = (sortValue: string) => {
        dispatch(setTableData({
            sort: {
                order: sortValue as '' | 'asc' | 'desc',
                key: 'invoiceDate'
            },
            pageIndex: 1
        }))
    }

    const handleResetAllFilters = () => {
        dispatch(resetFilters())
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-3">
            <h4 className="text-2xl font-bold">جدول الفواتير</h4>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <InvoicesTableSearch />
                
                <Select
                    size="sm"
                    placeholder="حالة الفاتورة"
                    options={statusOptions}
                    onChange={(option) => handleStatusFilter(option?.value || '')}
                    className="min-w-[150px]"
                />
                
                <Select
                    size="sm"
                    placeholder="ترتيب حسب التاريخ"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option?.value || '')}
                    className="min-w-[150px]"
                />

                <Link to="/invoices/create">
                    <Button
                        variant="solid"
                        icon={<HiPlusCircle />}
                    >
                        إنشاء فاتورة
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default InvoicesTableTools