import { injectReducer } from '@/store'
import reducer from './store'
import TasksTable from './components/TasksTable'

injectReducer('tasksListSlice', reducer)
const TasksListView = () => {
    return <TasksTable />
}

export default TasksListView
