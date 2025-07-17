// store/cars/index.ts (assuming this is the file name)

import { combineReducers } from '@reduxjs/toolkit'
// Import the default export of your slice, which is the reducer
import carsListReducer, { CarsListState, SLICE_NAME } from './carsListSlice'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store' // Assuming this is your root store file

const reducer = combineReducers({
    [SLICE_NAME]: carsListReducer,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: CarsListState
    }
> = useSelector

export * from './carsListSlice'
export { useAppDispatch } from '@/store'
export default reducer
