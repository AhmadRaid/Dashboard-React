import { injectReducer } from '@/store'
import reducer from './store'
import BranchesTable from './components/BranchesTable' 

injectReducer('branchesListSlice', reducer) 

const BranchesListView = () => {
    return <BranchesTable />
}

export default BranchesListView