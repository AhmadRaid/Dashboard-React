import { injectReducer } from '@/store'
import reducer from './store'
import CarsTable from './components/CarsTable' 

injectReducer('carsListSlice', reducer) 

const CarsListView = () => {
    return <CarsTable />
}

export default CarsListView