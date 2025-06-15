import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Roles } from '@/constants/roles.constant'

export type UserState = {
    image?: string
    email?: string
    authority?: Roles[]
    fullName: string
}

const initialState: UserState = {
    image: '',
    email: '',
    authority: [],
    fullName: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.image = action.payload?.image
            state.email = action.payload?.email
            state.authority = action.payload?.authority
            state.fullName = action.payload?.fullName
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
