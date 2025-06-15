import { injectReducer } from '@/store'
import reducer from './store'
import ClientsList from './components/ClientsList'

injectReducer('clientsListSlice', reducer)
const ClientsListView = () => {
    return <ClientsList />
}

export default ClientsListView
