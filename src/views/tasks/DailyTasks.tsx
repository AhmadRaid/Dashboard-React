import React, { useState, useEffect } from 'react'
import {
    HiCheckCircle,
    HiClock,
    HiExclamationCircle,
    HiPlusCircle,
    HiCalendar,
} from 'react-icons/hi'

const DailyTasks = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    // محاكاة جلب البيانات من API
    useEffect(() => {
        // في التطبيق الحقيقي، ستجلب البيانات من الخادم
        const fetchTasks = async () => {
            setLoading(true)
            try {
                // محاكاة اتصال بالخادم
                setTimeout(() => {
                    const mockTasks = [
                        {
                            id: 1,
                            title: 'مراجعة طلبات العملاء الجدد',
                            completed: false,
                            dueTime: '10:00 ص',
                        },
                        {
                            id: 2,
                            title: 'متابعة المبيعات اليومية',
                            completed: true,
                            dueTime: '11:30 ص',
                        },
                        {
                            id: 3,
                            title: 'الرد على استفسارات العملاء',
                            completed: false,
                            dueTime: '01:00 م',
                        },
                        {
                            id: 4,
                            title: 'تحديث تقارير المخزون',
                            completed: false,
                            dueTime: '03:30 م',
                        },
                        {
                            id: 5,
                            title: 'اجتماع مع فريق المبيعات',
                            completed: false,
                            dueTime: '04:45 م',
                        },
                    ]
                    setTasks(mockTasks)
                    setLoading(false)
                }, 800)
            } catch (error) {
                console.error('Error fetching tasks:', error)
                setLoading(false)
            }
        }

        fetchTasks()
    }, [])

    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        )
    }

    const addNewTask = () => {
        if (newTaskTitle.trim()) {
            const newTask = {
                id: tasks.length + 1,
                title: newTaskTitle,
                completed: false,
                dueTime: 'بدون وقت',
            }
            setTasks([...tasks, newTask])
            setNewTaskTitle('')
        }
    }

    const pendingTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <HiCalendar className="ml-2 text-blue-500" />
                    المهام اليومية ({pendingTasks.length}) 
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {pendingTasks.length} مهام بانتظارك
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {/* المهام المعلقة */}
                    {pendingTasks.length > 0 ? (
                        <div className="mb-6">
                            <div className="space-y-3">
                                {pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleTaskCompletion(task.id)
                                            }
                                            className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                                                task.completed
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-400'
                                            }`}
                                        >
                                            {task.completed && (
                                                <HiCheckCircle className="text-white text-sm" />
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <p className="text-gray-800">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <HiClock className="inline ml-1" />
                                                {task.dueTime}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button className="text-gray-500 hover:text-blue-500 p-1">
                                                <HiExclamationCircle className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                            <HiCheckCircle className="text-green-500 text-2xl mx-auto mb-2" />
                            <p className="text-green-800">
                                أحسنت! لا توجد مهام pendingTasks
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
                                        className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200 opacity-75"
                                    >
                                        <button
                                            onClick={() =>
                                                toggleTaskCompletion(task.id)
                                            }
                                            className="w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center bg-green-500 border-green-500"
                                        >
                                            <HiCheckCircle className="text-white text-sm" />
                                        </button>
                                        <div className="flex-1">
                                            <p className="text-gray-800 line-through">
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <HiClock className="inline ml-1" />
                                                {task.dueTime}
                                            </p>
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
