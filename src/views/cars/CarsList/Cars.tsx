import { injectReducer } from '@/store'
import reducer from './store'
import CarsTable from './components/CarsList'

injectReducer('carsListSlice', reducer)

const Cars = () => {
    return <CarsTable />
}

export default Cars
