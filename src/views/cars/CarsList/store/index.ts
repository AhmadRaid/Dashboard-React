import { combineReducers } from '@reduxjs/toolkit'
import reducers, { CarsListState } from './carsListSlice'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

export const SLICE_NAME = 'carsListSlice'

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

export * from './carsListSlice'
export { useAppDispatch } from '@/store'
export default reducer
