import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { toast, Notification } from '@/components/ui'
import * as Yup from 'yup'
import TaskEditFields from './TaskEditFields'
import {
    apiGetTaskDetails,
    apiUpdateTask,
    apiDeleteTask,
} from '@/services/TaskService'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import { FormContainer } from '@/components/ui/Form'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Loading, Container } from '@/components/shared'

type InitialData = {
    title: string
    description: string
    priority: string
    startDate: string
    endDate: string
    branchId: string
}

export const validationSchema = Yup.object().shape({
    title: Yup.string().required('عنوان المهمة مطلوب'),
    description: Yup.string(),
    priority: Yup.string().required('الأولوية مطلوبة'),
    startDate: Yup.date().required('تاريخ البدء مطلوب').nullable(),
    endDate: Yup.date().nullable().min(Yup.ref('startDate'), 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء'),
    branchId: Yup.string().required('الفرع مطلوب'),
})

const DeleteTaskButton = ({ onDelete }: { onDelete: () => void }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete()
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                حذف
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="حذف المهمة"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>هل أنت متأكد من أنك تريد حذف هذه المهمة؟</p>
            </ConfirmDialog>
        </>
    )
}

const TaskEdit = () => {
    const navigate = useNavigate()
    const { taskId } = useParams()
    const [loading, setLoading] = useState(true)
    const [initialData, setInitialData] = useState<InitialData | null>(null)

    useEffect(() => {
        const fetchTaskData = async () => {
            if (!taskId) {
                navigate('/tasks')
                return
            }
            setLoading(true)
            try {
                const response = await apiGetTaskDetails(taskId)
                if (response.data && response.data.data) {
                    const taskData = response.data.data
                    setInitialData({
                        title: taskData.title || '',
                        description: taskData.description || '',
                        priority: taskData.priority || '',
                        startDate: taskData.startDate
                            ? new Date(taskData.startDate)
                                  .toISOString()
                                  .split('T')[0]
                            : '',
                        endDate: taskData.endDate
                            ? new Date(taskData.endDate)
                                  .toISOString()
                                  .split('T')[0]
                            : '',
                        branchId: taskData.branch?._id || '',
                    })
                } else {
                    toast.push(
                        <Notification title="خطأ" type="danger">
                            فشل في جلب بيانات المهمة
                        </Notification>
                    )
                    navigate('/tasks')
                }
            } catch (error) {
                console.error('Failed to fetch task data:', error)
                navigate('/tasks')
            } finally {
                setLoading(false)
            }
        }
        fetchTaskData()
    }, [taskId, navigate])

    const handleFormSubmit = async (
        values: InitialData,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitting(true)
        try {
            if (taskId) {
                const updatedValues = {
                    ...values,
                    branchId: values.branchId,
                }
                const response = await apiUpdateTask(taskId, updatedValues)
                if (response.data) {
                    toast.push(
                        <Notification
                            title="نجح التعديل"
                            type="success"
                            duration={2500}
                        >
                            تم تعديل المهمة بنجاح
                        </Notification>,
                        { placement: 'top-center' }
                    )
                    navigate(`/tasks`)
                }
            }
        } catch (error) {
            toast.push(
                <Notification
                    title="للاسف تم رفض الطلب! الرجاء المحاولة مرة اخرى"
                    type="danger"
                    duration={2500}
                />,
                { placement: 'top-center' }
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate(`/tasks`)
    }

    const handleDelete = async () => {
        if (!taskId) return
        try {
            await apiDeleteTask(taskId)
            toast.push(
                <Notification title="تم الحذف بنجاح" type="success" duration={3000}>
                    تم حذف المهمة بنجاح.
                </Notification>
            )
            navigate('/tasks')
        } catch (error) {
            console.error('Failed to delete task:', error)
            toast.push(
                <Notification title="حدث خطأ" type="danger" duration={3000}>
                    فشل في حذف المهمة.
                </Notification>
            )
        }
    }

    return (
        <Container>
            <h3 className="text-2xl font-bold mb-5">تعديل المهمة</h3>
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Loading loading={true} />
                </div>
            ) : initialData ? (
                <Formik
                    initialValues={initialData}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ touched, errors, values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <FormContainer>
                                <TaskEditFields 
                                    touched={touched} 
                                    errors={errors} 
                                    values={values} 
                                    setFieldValue={setFieldValue} 
                                />
                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        <DeleteTaskButton onDelete={handleDelete} />
                                    </div>
                                    <div className="md:flex items-center">
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={handleDiscard}
                                        >
                                            إلغاء
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            حفظ التعديلات
                                        </Button>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            ) : (
                <div className="text-center py-10">
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        لم يتم العثور على المهمة
                    </h4>
                </div>
            )}
        </Container>
    )
}

export default TaskEdit