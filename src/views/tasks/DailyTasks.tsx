import {
    apiGetTasksForSpecificBranch,
    apiMakeTaskCompleted,
} from '@/services/TaskService'
import React, { useState, useEffect } from 'react'
import {
    HiCheckCircle,
    HiClock,
    HiExclamationCircle,
    HiCalendar,
    HiArrowSmRight,
    HiArrowSmUp,
    HiArrowSmDown
} from 'react-icons/hi'
import classNames from 'classnames'

// تعريف الألوان والرموز حسب الأولوية
const priorityMap = {
    low: { icon: HiArrowSmDown, color: 'text-green-500', label: 'منخفضة' },
    medium: { icon: HiArrowSmRight, color: 'text-yellow-500', label: 'متوسطة' },
    high: { icon: HiArrowSmUp, color: 'text-red-500', label: 'عالية' },
    urgent: { icon: HiExclamationCircle, color: 'text-red-700', label: 'عاجلة' },
}

const DailyTasks = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updatingTask, setUpdatingTask] = useState(null)

    const fetchTasks = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiGetTasksForSpecificBranch()
            if (response && response.data && response.data.data.tasks) {
                const fetchedTasks = response.data.data.tasks.map(
                    (task) => ({
                        id: task._id,
                        title: task.title,
                        completed: task.status === 'completed',
                        dueTime: new Date(task.endDate).toLocaleTimeString(
                            'ar-EG',
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            }
                        ),
                        description: task.description,
                        priority: task.priority, // جلب حقل الأولوية
                    })
                )
                setTasks(fetchedTasks)
            } else {
                setTasks([])
            }
        } catch (err) {
            console.error('Error fetching tasks:', err)
            setError('حدث خطأ أثناء جلب المهام. يرجى المحاولة مرة أخرى.')
            setTasks([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const toggleTaskCompletion = async (taskId) => {
        if (updatingTask === taskId) return

        setUpdatingTask(taskId)
        try {
            await apiMakeTaskCompleted(taskId)
            // تحديث الحالة في الواجهة الأمامية دون إعادة جلب البيانات
            setTasks(
                tasks.map((task) => {
                    if (task.id === taskId) {
                        return { ...task, completed: true }
                    }
                    return task
                })
            )
        } catch (err) {
            console.error('Error completing task:', err)
            // يمكن إضافة رسالة خطأ للمستخدم
        } finally {
            setUpdatingTask(null)
        }
    }

    const pendingTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <HiCalendar className="ml-2 text-blue-500" />
                    المهام اليومية
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {pendingTasks.length} مهام بانتظارك
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                    <p className="text-red-800">{error}</p>
                </div>
            ) : (
                <>
                    {/* المهام المعلقة */}
                    {pendingTasks.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <HiClock className="ml-2 text-blue-500" />
                                المهام المعلقة ({pendingTasks.length})
                            </h3>
                            <div className="space-y-3">
                                {pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleTaskCompletion(task.id)}
                                            disabled={updatingTask === task.id}
                                            className={classNames(
                                                'w-5 h-5 rounded-full border flex-shrink-0 mt-1',
                                                {
                                                    'bg-green-500 border-green-500': task.completed,
                                                    'border-gray-400': !task.completed,
                                                    'opacity-50 cursor-not-allowed': updatingTask === task.id,
                                                }
                                            )}
                                        >
                                            {updatingTask === task.id ? (
                                                <span className="block animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                                            ) : (
                                                <HiCheckCircle className="text-white text-sm" />
                                            )}
                                        </button>
                                        <div className="flex-1 mr-3">
                                            <p className="text-gray-800 font-medium">{task.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                                            <div className="flex items-center text-xs mt-1 space-x-2">
                                                <div className="flex items-center text-gray-500">
                                                    <HiClock className="ml-1" />
                                                    <span>{task.dueTime}</span>
                                                </div>
                                                {task.priority && (
                                                    <div
                                                        className={`flex items-center font-semibold ${priorityMap[task.priority]?.color}`}
                                                    >
                                                        {React.createElement(priorityMap[task.priority]?.icon, { className: 'ml-1' })}
                                                        <span>الأولوية: {priorityMap[task.priority]?.label}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {pendingTasks.length === 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                            <HiCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
                            <p className="text-green-800">
                                أحسنت! لا توجد مهام بانتظارك.
                            </p>
                        </div>
                    )}

                    {/* المهام المكتملة */}
                    {completedTasks.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <HiCheckCircle className="ml-2 text-green-500" />
                                المهام المكتملة ({completedTasks.length})
                            </h3>
                            <div className="space-y-3">
                                {completedTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200 opacity-75"
                                    >
                                        <div className="w-5 h-5 rounded-full flex-shrink-0 mt-1 flex items-center justify-center bg-green-500 border-green-500">
                                            <HiCheckCircle className="text-white text-sm" />
                                        </div>
                                        <div className="flex-1 mr-3">
                                            <p className="text-gray-800 font-medium line-through">{task.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                                            <div className="flex items-center text-xs mt-1 space-x-2">
                                                <div className="flex items-center text-gray-500">
                                                    <HiClock className="ml-1" />
                                                    <span>{task.dueTime}</span>
                                                </div>
                                                {task.priority && (
                                                    <div
                                                        className={`flex items-center font-semibold ${priorityMap[task.priority]?.color}`}
                                                    >
                                                        {React.createElement(priorityMap[task.priority]?.icon, { className: 'ml-1' })}
                                                        <span>الأولوية: {priorityMap[task.priority]?.label}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default DailyTasks