import { injectReducer } from '@/store'
import reducer from './store'
import ClientsCommunicationTable from './components/clientsCommunicationList'

injectReducer('clientCommunicationListSlice', reducer)
const clientCommunicationListView = () => {
    return <ClientsCommunicationTable />
}

export default clientCommunicationListView
