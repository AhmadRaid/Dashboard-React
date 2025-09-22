import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import reducer, {
    getTasks,
    useAppDispatch,
    useAppSelector,
    setTableData,
} from '../store'
import { injectReducer } from '@/store'
import TasksTableTools from './TasksTableTools'
import { Button, Notification, Tooltip, toast, Tag } from '@/components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { ConfirmDialog } from '@/components/shared'
import { apiDeleteTask } from '@/services/TaskService'

injectReducer('tasksListSlice', reducer)

const TaskStatusTag = ({ status }: { status: string }) => {
    let color = 'bg-gray-500'
    let label = ''

    switch (status) {
        case 'completed':
            color = 'bg-emerald-600' // لون زمردي داكن
            label = 'مكتملة'
            break
        case 'in_progress':
            color = 'bg-sky-600' // لون أزرق سماوي
            label = 'قيد التنفيذ'
            break
        case 'pending':
            color = 'bg-amber-500' // لون كهرماني
            label = 'معلقة'
            break
        case 'cancelled':
            color = 'bg-red-500' // لون أحمر
            label = 'ملغاة'
            break
        default:
            label = 'غير محدد'
            color = 'bg-gray-500'
            break
    }

    return <Tag className={`rounded-full ${color}`}>{label}</Tag>
}

// الكود المعدل
const TaskPriorityTag = ({ priority }: { priority: string }) => {
    let color = ''
    let label = ''

    switch (priority) {
        case 'high':
            color = 'bg-red-500 text-red-900' // برتقالي للأهمية العالية
            label = 'عالية'
            break
        case 'medium':
            color = 'bg-yellow-400' // أصفر للأهمية المتوسطة
            label = 'متوسطة'
            break
        case 'low':
            color = 'bg-green-500' // أخضر للأهمية المنخفضة
            label = 'منخفضة'
            break
        default:
            label = 'غير محدد'
            color = 'bg-gray-500'
            break
    }
    return <Tag className={`rounded-full ${color}`}>{label}</Tag>
}

const TasksTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.tasksListSlice.data.tableData
    )

    const loading = useAppSelector((state) => state.tasksListSlice.data.loading)
    const tasksData = useAppSelector(
        (state) => state.tasksListSlice.data.tasksList
    )

    useEffect(() => {
        dispatch(getTasks({ pageIndex, limit, sort, query }))
    }, [pageIndex, limit, sort, query, dispatch])

    const handleDelete = async () => {
        if (!selectedTask) return

        try {
            await apiDeleteTask(selectedTask._id)
            toast.push(
                <Notification
                    title="تم الحذف بنجاح"
                    type="success"
                    duration={3000}
                >
                    تم حذف المهمة بنجاح
                </Notification>
            )
            dispatch(getTasks({ pageIndex, limit, sort, query }))
            setDeleteConfirmationOpen(false)
        } catch (error) {
            toast.push(
                <Notification title="حدث خطأ" type="danger" duration={3000}>
                    فشل في حذف المهمة
                </Notification>
            )
        }
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'عنوان المهمة',
                accessorKey: 'title',
                cell: (props) => (
                    <span
                        className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        onClick={() =>
                            navigate(`/app/crm/tasks/details/${props.row.original._id}`)
                        }
                    >
                        {props.getValue() || 'غير محدد'}
                    </span>
                ),
            },
            {
                header: 'الحالة',
                accessorKey: 'status',
                cell: (props) => <TaskStatusTag status={props.getValue()} />,
            },
            {
                header: 'الأولوية',
                accessorKey: 'priority',
                cell: (props) => (
                    <TaskPriorityTag priority={props.getValue()} />
                ),
            },
            {
                header: 'الموكل به',
                accessorKey: 'branch.name',
                cell: (props) => {
                    const branch = props.getValue();
                    return branch ? branch : 'غير محدد';
                },
            },
            {
                header: 'تاريخ البدء',
                accessorKey: 'startDate',
                cell: (props) => {
                    const date = props.row.original.startDate;
                    if (!date) return 'غير محدد';
                    return new Date(date).toLocaleDateString();
                },
            },
            {
                header: 'تاريخ الانتهاء',
                accessorKey: 'endDate',
                cell: (props) => {
                    const date = props.row.original.endDate;
                    if (!date) return 'غير محدد';
                    return new Date(date).toLocaleDateString();
                },
            },
            {
                header: 'الإجراءات',
                accessorKey: 'actions',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                            <Tooltip title="تعديل">
                                <Button
                                    size="xs"
                                    icon={<HiOutlinePencil />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/tasks/edit/${row._id}`)
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="حذف">
                                <Button
                                    size="xs"
                                    icon={<HiOutlineTrash />}
                                    color="red"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedTask(row)
                                        setDeleteConfirmationOpen(true)
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [navigate]
    )

    return (
        <div className="p-4">
            <TasksTableTools />

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                type="danger"
                title="حذف المهمة"
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
                confirmButtonColor="red-600"
            >
                <p>
                    هل أنت متأكد أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا
                    الإجراء.
                </p>
            </ConfirmDialog>

            {loading ? (
                <div className="text-center py-8">
                    <span className="text-lg">جاري تحميل البيانات...</span>
                </div>
            ) : tasksData && tasksData.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={tasksData}
                    loading={loading}
                    pagingData={{
                        total: total || 0,
                        pageIndex: pageIndex || 1,
                        pageSize: limit || 10,
                    }}
                    onPaginationChange={(page) => {
                        dispatch(setTableData({ pageIndex: page }))
                    }}
                    onRowClick={(row) =>
                        navigate(`/app/crm/tasks/details/${row.original._id}`)
                    }
                    rowClassName="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/20"
                    theadClass="bg-gray-50 dark:bg-gray-700"
                    thClass="!border-b-0"
                />
            ) : (
                <div className="text-center py-8">
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        لا توجد مهام متاحة
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        يمكنك إضافة مهمة جديدة الآن.
                    </p>
                    <Button
                        className="mt-4"
                        variant="solid"
                        onClick={() => navigate('/tasks/create-task')}
                    >
                        إضافة مهمة جديدة
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TasksTable