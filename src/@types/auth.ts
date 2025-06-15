import { Roles } from '@/constants/roles.constant'

export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    status: string
    code: number
    data: {
        accessToken: string
        refreshToken: string
        user: {
            _id: string
            fullName: string
            userName: string | null
            email: string
            image: string | null
            status: string
            role: string
        }
    }
    message: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    fullName: string
    email: string
    image?: string
    password: string
    role: Roles
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
