import { injectReducer } from '@/store'
import reducer from './store'
import OrdersTable from './components/OrdersTable' 

injectReducer('ordersListSlice', reducer) 

const OrdersListView = () => {
    return <OrdersTable />
}

export default OrdersListView