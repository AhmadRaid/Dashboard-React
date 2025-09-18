// src/utils/hooks/useAuth.ts
import Cookies from 'js-cookie'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { Roles } from '@/constants/roles.constant'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    // ملاحظة: لا نعتمد الآن على Redux token، بل نعتمد على الكوكيز
    const accessToken = Cookies.get('accessToken');
    const signedIn = !!accessToken;
    
    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined                             
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { accessToken, user } = resp.data.data
                
                // حفظ التوكن في الكوكيز من الواجهة الأمامية
                Cookies.set('accessToken', accessToken, {
                    expires: 1, // ينتهي بعد يوم واحد
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict'
                });

                dispatch(
                    setUser({
                        email: user.email,
                        fullName: user.fullName,
                        image: user.image || '',
                        authority: [user.role as Roles],
                    })
                )
                
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)

            if (resp.data) {
                const { accessToken, user } = resp.data.data
                
                // حفظ التوكن في الكوكيز من الواجهة الأمامية
                Cookies.set('accessToken', accessToken, {
                    expires: 1, // ينتهي بعد يوم واحد
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict'
                });

                dispatch(
                    setUser({
                        email: user.employeeId,
                        fullName: user.fullName,
                        image: user.image || '',
                        authority: [user.role as Roles],
                    })
                )

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            console.log('errors', errors)

            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                image: '',
                email: '',
                authority: [],
                fullName: '',
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        // حذف الكوكيز من الواجهة الأمامية
        Cookies.remove('accessToken');
        handleSignOut();
    }

    return {
        authenticated: signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth