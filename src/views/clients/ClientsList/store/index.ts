import { combineReducers } from '@reduxjs/toolkit'
import reducers, { ClientsListState, SLICE_NAME } from './clientsListSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: ClientsListState
        }
    }
> = useSelector

export * from './clientsListSlice'
export { useAppDispatch } from '@/store'
export default reducer
