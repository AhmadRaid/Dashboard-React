import { combineReducers } from '@reduxjs/toolkit'
import reducers, { TasksListState, SLICE_NAME } from './tasksListSlice'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: TasksListState
        }
    }
> = useSelector

export * from './tasksListSlice'
export { useAppDispatch } from '@/store'
export default reducer