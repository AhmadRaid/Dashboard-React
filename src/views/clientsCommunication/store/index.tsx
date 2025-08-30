import { combineReducers } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'
import reducers, { 
  SLICE_NAME, 
  clientCommunicationListState,
  setTableData,
  resetFilters 
} from './clientCommunicationListSlice'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: clientCommunicationListState
        }
    }
> = useSelector

// تصدير الـ actions والـ hooks
export { useAppDispatch } from '@/store'
export { setTableData, resetFilters }

export default reducer