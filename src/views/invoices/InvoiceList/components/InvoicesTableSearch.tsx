import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import { useAppDispatch, setTableData } from '../store'

const InvoicesTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef(null)

    const debounceFn = debounce((val: string) => {
        dispatch(setTableData({ 
            query: val,
            pageIndex: 1
        }))
    }, 500)

    const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="w-[160px] md:w-[200px] md:mb-0 mb-0"
            size="sm"
            placeholder="ابحث برقم الفاتورة أو العميل"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onEdit}
        />
    )
}

export default InvoicesTableSearch