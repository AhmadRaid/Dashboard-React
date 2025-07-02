import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import { useAppDispatch, setTableData } from '../store'

const OrdersTableSearch = () => {
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
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="ابحث برقم الطلب أو العميل"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onEdit}
        />
    )
}

export default OrdersTableSearch