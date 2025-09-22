import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, Formik, FormikProps } from 'formik'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import TaskFields from './TaskFields'
import { apiAddNewTask } from '@/services/TaskService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

type FormikRef = FormikProps<any>

type InitialData = {
    title: string
    description: string
    priority: string
    startDate: string
    endDate: string
    branchId: string
}

const initialData: InitialData = {
    title: '',
    description: '',
    priority: '',
    startDate: '',
    endDate: '',
    branchId: '',
}

export const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('عنوان المهمة مطلوب')
        .min(5, 'يجب أن يكون عنوان المهمة على الأقل 5 أحرف')
        .max(100, 'يجب ألا يتجاوز عنوان المهمة 100 حرف'),
    description: Yup.string().max(500, 'يجب ألا يتجاوز وصف المهمة 500 حرف'),
    priority: Yup.string()
        .oneOf(['high', 'medium', 'low'], 'اختر أولوية صحيحة')
        .required('أولوية المهمة مطلوبة'),
    startDate: Yup.date().nullable(),
    endDate: Yup.date()
        .nullable()
        .min(
            Yup.ref('startDate'),
            'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء'
        ),
    branchId: Yup.string().max(50, 'يجب ألا يتجاوز اسم الفرع 50 حرف'),
})

type TaskFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: () => void
    onFormSubmit?: (
        formData: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => void
}

const DeleteTaskButton = ({ onDelete }: { onDelete: any }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
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

const TaskForm = forwardRef<FormikRef, TaskFormProps>((props, ref) => {
    const { type, initialData: initialDataProp, onDiscard, onDelete } = props
    const navigate = useNavigate()

    const onFormSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        try {
            const data = { ...values }
            const success = await apiAddNewTask(data)

            // You can optionally call the parent's onFormSubmit if it exists
            props.onFormSubmit?.(data, setSubmitting)
            if (success) {
                toast.push(
                    <Notification
                        title="نجحت الاضافة"
                        type="success"
                        duration={2500}
                    >
                        تم اضافة الطلب بنجاح
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate(`/tasks`)
            }
        } catch (error) {
            console.error('Failed to add task:', error)
            // Handle error, e.g., show a toast message
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                    ...initialDataProp,
                }}
                validationSchema={validationSchema}
                onSubmit={onFormSubmit} // Use the new onFormSubmit handler
            >
                {({ values, touched, errors, isSubmitting, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <TaskFields
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
                                    {type === 'edit' && (
                                        <DeleteTaskButton onDelete={onDelete} />
                                    )}
                                </div>

                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
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
                                        {'إضافة'}
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

TaskForm.displayName = 'TaskForm'

export default TaskForm
