import { combineReducers } from '@reduxjs/toolkit'
import StatisticsSlice, { SLICE_NAME, StatisticsState } from './StatisticsSlice'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: StatisticsSlice,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: StatisticsState
        }
    }
> = useSelector

export { useAppDispatch } from '@/store'
export default reducer