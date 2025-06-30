import React from 'react'
import { Input } from '@/components/ui'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import { useAppDispatch } from '@/store'
import { setTableData } from './store'
//import { useAppDispatch, setTableData } from '@/store/slices/carTypesListSlice'

const CarTypesTableSearch = () => {
    const dispatch = useAppDispatch()

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setTableData({ 
            query: e.target.value,
            pageIndex: 1
        }))
    }, 500)

    return (
        <Input
            placeholder="بحث..."
            prefix={<HiOutlineSearch />}
            onChange={handleSearch}
            className="max-w-md"
        />
    )
}

export default CarTypesTableSearch