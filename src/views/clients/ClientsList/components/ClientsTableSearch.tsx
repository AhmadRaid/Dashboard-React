import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { ChangeEvent } from 'react'
import { useAppSelector, useAppDispatch, setTableData, getClients } from '../store'

const ClientsTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef(null)

    const tableData = useAppSelector(
        (state) => state.clientsListSlice.data.tableData
    )

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        
        dispatch(setTableData(newTableData))
        dispatch(getClients({
            limit: newTableData.limit,
            offset: (newTableData.pageIndex - 1) * newTableData.limit,
            search: val || undefined,
            branch: newTableData.branchFilter || undefined,
            last50Orders: newTableData.last50Orders || undefined
        }))
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="ابحث باسم العميل أو رقم الهاتف"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onEdit}
        />
    )
}

export default ClientsTableSearch