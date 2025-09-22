// src/components/task/TasksTableTools.tsx
import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import TasksTableSearch from './TasksTableSearch'
import { Link } from 'react-router-dom'
import { Select } from '@/components/ui'
import { useAppDispatch, setTableData, resetFilters } from '../store'

export const TasksTableTools = () => {
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
            <h4 className="text-2xl font-bold">قائمة المهام</h4>
            
            <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                <TasksTableSearch />
                <Select
                    className="w-full lg:w-auto"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option.value)}
                    placeholder="فرز حسب"
                />
                <Button
                    variant="plain"
                    onClick={handleResetAllFilters}
                    size="sm"
                    className="w-full lg:w-auto"
                >
                    إعادة تعيين
                </Button>
                
                <Link to="/tasks/add">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        إضافة مهمة جديدة
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default TasksTableTools