import { injectReducer } from '@/store'
import reducer from './store'
import CarsList from './components/CarsList'

injectReducer('carsListSlice', reducer)
const CarsListView = () => {
    return <CarsList />
}

export default CarsListView
