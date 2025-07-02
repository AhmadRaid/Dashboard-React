import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import OrdersTableSearch from './OrdersTableSearch'
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData, resetFilters } from '../store'

export const OrdersTableTools = () => {
    const dispatch = useAppDispatch()

    const statusOptions = [
        { label: 'جميع الحالات', value: '' },
        { label: 'نشط', value: 'active' },
        { label: 'مكتمل', value: 'completed' },
        { label: 'غير مكتمل', value: 'incomplete' },
    ]

    const sortOptions = [
        { label: 'الأحدث أولاً', value: 'desc' },
        { label: 'الأقدم أولاً', value: 'asc' },
    ]

    const handleStatusFilter = (status: string) => {
        dispatch(setTableData({ 
            statusFilter: status,
            pageIndex: 1,
        }))
    }

    const handleSortChange = (sortValue: string) => {
        dispatch(setTableData({
            sort: {
                order: sortValue as '' | 'asc' | 'desc',
                key: 'createdAt'
            },
            pageIndex: 1
        }))
    }

    const handleResetAllFilters = () => {
        dispatch(resetFilters())
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-3">
            <h4 className="text-2xl font-bold">جدول الطلبات</h4>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <OrdersTableSearch />
                
                <Select
                    size="sm"
                    placeholder="حالة الطلب"
                    options={statusOptions}
                    onChange={(option) => handleStatusFilter(option?.value || '')}
                    className="min-w-[150px]"
                />
                
                <Select
                    size="sm"
                    placeholder="ترتيب حسب"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option?.value || '')}
                    className="min-w-[150px]"
                />
                
                <Link to="/orders/create-order" className="w-full lg:w-auto">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        طلب جديد
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default OrdersTableTools