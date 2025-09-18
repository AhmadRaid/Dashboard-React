import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import BranchesTableSearch from './BranchesTableSearch' // تغيير اسم المكون
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData, resetFilters } from '../store'

export const BranchesTableTools = () => {
    const dispatch = useAppDispatch()

    const sortOptions = [
        { label: 'الأحدث أولاً', value: 'desc' },
        { label: 'الأقدم أولاً', value: 'asc' },
    ]

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
            <h4 className="text-2xl font-bold">قائمة الفروع</h4>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <BranchesTableSearch />
                
                <Select
                    size="sm"
                    placeholder="ترتيب حسب"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option?.value || '')}
                    className="min-w-[150px]"
                />

                <Link to="/app/crm/branches/add-branch">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        إضافة فرع جديد
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default BranchesTableTools