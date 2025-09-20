import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import InvoicesTableSearch from './InvoicesTableSearch'
import { Link } from 'react-router-dom'
import { Select, DatePicker } from '@/components/ui'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector, setTableData, resetFilters } from '../store'

export const InvoicesTableTools = () => {
    const dispatch = useAppDispatch()
    const { startDate, endDate } = useAppSelector(
        (state) => state.invoiceListSlice.data.tableData
    )

    const statusOptions = [
        { label: 'جميع الحالات', value: '' },
        { label: 'مفتوحة', value: 'paid' },
        { label: 'معلقة', value: 'unpaid' },
        { label: 'مقبولة', value: 'unpaid' },
        { label: 'مرفوضة', value: 'unpaid' },
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

    const handleStartDateChange = (date: Date | null) => {
        dispatch(setTableData({
            startDate: date ? dayjs(date).format('YYYY-MM-DD') : null,
            pageIndex: 1,
        }))
    }

    const handleEndDateChange = (date: Date | null) => {
        dispatch(setTableData({
            endDate: date ? dayjs(date).format('YYYY-MM-DD') : null,
            pageIndex: 1,
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

                <div className="flex items-center gap-3">
                    <DatePicker
                        size="sm"
                        inputFormat="YYYY-MM-DD"
                        placeholder="من تاريخ"
                        value={startDate ? dayjs(startDate, 'YYYY-MM-DD').toDate() : null}
                        onChange={handleStartDateChange}
                        className="min-w-[150px]"
                    />
                    <DatePicker
                        size="sm"
                        inputFormat="YYYY-MM-DD"
                        placeholder="إلى تاريخ"
                        value={endDate ? dayjs(endDate, 'YYYY-MM-DD').toDate() : null}
                        onChange={handleEndDateChange}
                        className="min-w-[150px]"
                    />
                </div>
                
                <Select
                    size="sm"
                    placeholder="ترتيب حسب التاريخ"
                    options={sortOptions}
                    onChange={(option) => handleSortChange(option?.value || '')}
                    className="min-w-[150px]"
                />

              

            </div>
        </div>
    )
}

export default InvoicesTableTools