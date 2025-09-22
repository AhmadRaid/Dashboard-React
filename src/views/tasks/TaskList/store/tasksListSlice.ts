import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiGetTasks } from '@/services/TaskService';

export const SLICE_NAME = 'tasksListSlice';

interface TableData {
    pageIndex: number;
    limit: number;
    total: number;
    query: string;
    sort: {
        order: '' | 'asc' | 'desc';
        key: string;
    };
}

export interface TasksListState {
    tasksList: any[]; // Using 'any' for simplicity
    loading: boolean;
    tableData: TableData;
}

const initialState: TasksListState = {
    tasksList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        limit: 10,
        total: 0,
        query: '',
        sort: {
            order: '',
            key: 'createdAt',
        },
    },
};

export const getTasks = createAsyncThunk(
    `${SLICE_NAME}/getTasks`,
    async (params: TableData) => {
        const response = await apiGetTasks(params);
        return response.data;
    }
);

const tasksListSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<Partial<TableData>>) => {
            state.tableData = {
                ...state.tableData,
                ...action.payload,
            };
        },
        resetFilters: (state) => {
            state.tableData = {
                ...initialState.tableData,
                limit: state.tableData.limit,
                total: state.tableData.total,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                // تعديل هنا للوصول إلى البيانات الصحيحة
                state.tasksList = action.payload.data.tasks;
                state.tableData.total = action.payload.data.pagination.total;
                state.loading = false;
            })
            .addCase(getTasks.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setTableData, resetFilters } = tasksListSlice.actions;
export default tasksListSlice.reducer;