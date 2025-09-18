import { combineReducers } from '@reduxjs/toolkit'
import reducers, { InvoiceListState, SLICE_NAME } from './invoicesListSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: InvoiceListState
        }
    }
> = useSelector

export * from './invoicesListSlice'
export { useAppDispatch } from '@/store'
export default reducer