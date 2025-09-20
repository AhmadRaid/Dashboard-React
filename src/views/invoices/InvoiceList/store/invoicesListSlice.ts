// src/views/invoices/store/invoicesListSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    Invoice,
    GetInvoicesParams,
    GetInvoicesResponse,
    InvoiceStatus,
} from '@/@types/invoice'; // تأكد من أن 'InvoiceStatus' مستوردة هنا
import { apiGetInvoices, apiGetClientInvoices, apiUpdateInvoiceStatus } from '@/services/invoiceService';

export const SLICE_NAME = 'invoiceListSlice';

interface TableData {
    pageIndex: number;
    limit: number;
    total: number;
    query: string;
    keyword?: string;
    startDate?: string | null;
    endDate?: string | null;
    sort: {
        order: '' | 'asc' | 'desc';
        key: string;
    };
    status?: string | null;
}

export interface InvoiceListState {
    invoiceList: Invoice[];
    loading: boolean;
    tableData: TableData;
    selectedInvoice: Invoice | null;
}

const initialState: InvoiceListState = {
    invoiceList: [],
    loading: false,
    tableData: {
        pageIndex: 1,
        limit: 10,
        total: 0,
        query: '',
        keyword: '',
        startDate: null,
        endDate: null,
        sort: {
            order: 'desc',
            key: 'invoiceDate',
        },
        status: '',
    },
    selectedInvoice: null,
};

export const getInvoices = createAsyncThunk(
    `${SLICE_NAME}/getInvoices`,
    async (_, thunkAPI) => {
        const state: any = thunkAPI.getState();
        const tableData: TableData = state.invoiceListSlice?.data?.tableData;
        const params: GetInvoicesParams = {
            page: tableData.pageIndex,
            limit: tableData.limit,
            sort: tableData.sort?.key
                ? `${tableData.sort.key}:${tableData.sort.order || 'desc'}`
                : undefined,
            query: tableData.query || undefined,
            keyword: tableData.query || tableData.keyword || undefined,
            startDate: tableData.startDate || undefined,
            endDate: tableData.endDate || undefined,
            status: tableData.status || undefined,
        };
        const response = await apiGetInvoices(params);
        return response.data;
    }
);

export const getClientInvoices = createAsyncThunk(
    `${SLICE_NAME}/getClientInvoices`,
    async (clientId: string) => {
        const response = await apiGetClientInvoices(clientId);
        return response.data;
    }
);

// الدالة الجديدة لتحديث حالة الفاتورة
export const updateInvoiceStatus = createAsyncThunk(
    `${SLICE_NAME}/updateInvoiceStatus`,
    async ({ id, status }: { id: string, status: InvoiceStatus }, thunkAPI) => {
        try {
            const response = await apiUpdateInvoiceStatus(id, status);
            return response.data    ;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const invoiceListSlice = createSlice({
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
                pageIndex: 1,
                limit: state.tableData.limit,
            };
        },
        setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
            state.selectedInvoice = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getInvoices.fulfilled, (state, action) => {
                state.invoiceList = action.payload.data;
                state.tableData.total = action.payload.total;
                state.loading = false;
            })
            .addCase(getInvoices.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getClientInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(getClientInvoices.fulfilled, (state, action) => {
                state.invoiceList = action.payload.data;
                state.tableData.total = action.payload.total;
                state.loading = false;
            })
            .addCase(getClientInvoices.rejected, (state) => {
                state.loading = false;
            })
            // التعامل مع حالات التحديث
            .addCase(updateInvoiceStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateInvoiceStatus.fulfilled, (state) => {
                // بعد التحديث بنجاح، يتم إعادة تحميل البيانات لتنعكس التغييرات
                state.loading = false;
            })
            .addCase(updateInvoiceStatus.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { setTableData, resetFilters, setSelectedInvoice } = invoiceListSlice.actions;
export default invoiceListSlice.reducer;