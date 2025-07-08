import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import OrdersClientForm from '../ClientProfile'
import reducer, {
    getClientOrders,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'
import { Loading } from '@/components/shared'
import ClientOrdersTools from './components/ClientOrdersTools'
import CreateGurentee from '../ClientProfile/CreateGurentee'

injectReducer('clientOrdersSlice', reducer)

const ClientOrders = () => {
    const { clientId } = useParams()
    const dispatch = useAppDispatch()

    const ordersData = useAppSelector(
        (state) => state?.clientOrdersSlice?.data?.ordersData
    )

    const loading = useAppSelector(
        (state) => state?.clientOrdersSlice?.data?.loading
    )

    useEffect(() => {
        dispatch(getClientOrders(clientId))
    }, [clientId, dispatch])


    return (
        <>
            {loading ? (
                <Loading loading={loading} />
            ) : (
                <>
                    <OrdersClientForm initialData={ordersData} type="view" />
                </>
            )}
        </>
    )
}

export default ClientOrders
