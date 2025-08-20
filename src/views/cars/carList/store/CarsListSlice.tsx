import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiGetCars } from '@/services/CarsService'
import { Car } from '@/@types/cars'

export const SLICE_NAME = 'carsListSlice'

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

export interface CarsListState {
    carsList: Car[]
    loading: boolean
    tableData: TableData
    selectedCar: any | null
}

const initialState: CarsListState = {
    carsList: [],
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
    selectedCar: null,
}

export const getCars = createAsyncThunk(
    `${SLICE_NAME}/getCarsList`,
    async () => {
        const response = await apiGetCars()
        console.log('yyyyyyyyyyy',response.data.data);
        
        return response?.data
    }
)

const carsListSlice = createSlice({
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
        setSelectedCar: (state, action: PayloadAction<any | null>) => {
            state.selectedCar = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCars.pending, (state) => {
                state.loading = true
            })
            .addCase(getCars.fulfilled, (state, action) => {
                state.carsList = action.payload.data.carTypes
                state.loading = false
            })
            .addCase(getCars.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { setTableData, resetFilters, setSelectedCar } =
    carsListSlice.actions
export default carsListSlice.reducer
