import { combineReducers } from '@reduxjs/toolkit'
import reducers, { CarsListState, SLICE_NAME } from './BranchesListSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: CarsListState
        }
    }
> = useSelector

export * from './BranchesListSlice'
export { useAppDispatch } from '@/store'
export default reducer