import { injectReducer } from '@/store'
import reducer from './store'
import InvoiceList from './components/InvoicesAdminList'

injectReducer('invoicesListSlice', reducer)
const InvoicesListView = () => {
    return <InvoiceList />
}

export default InvoicesListView
