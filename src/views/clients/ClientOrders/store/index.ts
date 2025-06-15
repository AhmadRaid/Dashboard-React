import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'
import reducers, { clientOrdersState, SLICE_NAME } from './ClientOrdersSlice'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: clientOrdersState
        }
    }
> = useSelector

export * from './ClientOrdersSlice'
export { useAppDispatch } from '@/store'
export default reducer
