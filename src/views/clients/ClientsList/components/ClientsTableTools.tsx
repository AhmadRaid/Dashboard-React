import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import ClientsTableSearch from './ClientsTableSearch'
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData, resetFilters } from '../store'

export const ClientsTableTools = () => {
    const dispatch = useAppDispatch()

    const branchOptions = [
        { label: 'جميع الفروع', value: '' },
        { label: 'فرع المدينة', value: 'عملاء فرع المدينة' },
        { label: 'فرع أبحر', value: 'عملاء فرع ابحر' },
        { label: 'اخرى', value: 'اخرى' },
    ]

    const sortOptions = [
        { label: 'الأحدث أولاً', value: 'desc' },
        { label: 'الأقدم أولاً', value: 'asc' },
    ]

    const handleBranchFilter = (branch: string) => {
        dispatch(setTableData({ 
            branchFilter: branch,
            pageIndex: 1,
        }))
    }

    const handleSortChange = (sortValue: string) => {
        dispatch(setTableData({
            sort: {
                order: sortValue as '' | 'asc' | 'desc',
                key: ''
            },
            pageIndex: 1
        }))
    }


    const handleResetAllFilters = () => {
        dispatch(resetFilters())
    }

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-3">
            <h4 className="text-2xl font-bold">جدول العملاء</h4>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <ClientsTableSearch />
                
                <Select
                    size="sm"
                    placeholder="الفرع"
                    options={branchOptions}
                    onChange={(option) => handleBranchFilter(option?.value || '')}
                    className="min-w-[120px]"
                />
                
                <Select
                    size="sm"
                    placeholder="ترتيب حسب"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option?.value || '')}
                    className="min-w-[150px]"
                />
                
                <Link to="/clients/create-client" className="w-full lg:w-auto">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        عميل جديد
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ClientsTableTools