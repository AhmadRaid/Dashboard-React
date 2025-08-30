import { injectReducer } from '@/store'
import reducer from './store'
import HomePage from './components/HomePage'

injectReducer('StatisticsSlice', reducer)
const HomePageView = () => {
    return <HomePage />
}

export default HomePageView
