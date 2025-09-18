import { apiGetBranches } from '@/services/BranchService'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export const SLICE_NAME = 'branchesListSlice'

interface TableData {
    pageIndex: number
    limit: number
    total: number
    query: string
    sort: {
        order: '' | 'asc' | 'desc'
        key: string
    }
}

export interface BranchesListState {
    branchesList: any[]
    loading: boolean
    tableData: TableData
    selectedBranch: any | null
}

const initialState: BranchesListState = {
    branchesList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        limit: 10,
        total: 0,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
    selectedBranch: null,
}

export const getBranches = createAsyncThunk(
    `${SLICE_NAME}/getBranchesList`,
    async () => {
        const response = await apiGetBranches()
        return response?.data
    }
)

const branchesListSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload,
            }
        },
        resetFilters: (state) => {
            state.tableData = {
                ...initialState.tableData,
                pageIndex: 1,
                limit: state.tableData.limit,
                total: state.tableData.total,
            }
        },
        setSelectedBranch: (state, action: PayloadAction<any | null>) => {
            state.selectedBranch = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBranches.pending, (state) => {
                state.loading = true
            })
            .addCase(getBranches.fulfilled, (state, action) => {
                // تعديل المسار هنا
                state.branchesList = action.payload.data.branches
                state.tableData.total = action.payload.data.pagination.total
                state.loading = false
            })
            .addCase(getBranches.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters, setSelectedBranch } =
    branchesListSlice.actions
export default branchesListSlice.reducer