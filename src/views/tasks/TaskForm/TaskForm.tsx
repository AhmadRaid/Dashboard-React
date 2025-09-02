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

type FormikRef = FormikProps<any>

type InitialData = {
    taskTitle: string
    taskDescription: string
    taskPriority: string
    taskStatus: string
    estimatedTime: string
    timeUnit: string
    startDate: string
    endDate: string
    assignedTo: string
    taskCategory: string
}

const initialData: InitialData = {
    taskTitle: '',
    taskDescription: '',
    taskPriority: '',
    taskStatus: '',
    estimatedTime: '',
    timeUnit: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    taskCategory: '',
}

export const validationSchema = Yup.object().shape({
    taskTitle: Yup.string()
        .required('عنوان المهمة مطلوب')
        .min(5, 'يجب أن يكون عنوان المهمة على الأقل 5 أحرف')
        .max(100, 'يجب ألا يتجاوز عنوان المهمة 100 حرف'),

    taskDescription: Yup.string()
        .max(500, 'يجب ألا يتجاوز وصف المهمة 500 حرف'),

    taskPriority: Yup.string()
        .oneOf(['high', 'medium', 'low'], 'اختر أولوية صحيحة')
        .required('أولوية المهمة مطلوبة'),

    taskStatus: Yup.string()
        .oneOf(['not_started', 'in_progress', 'completed', 'pending'], 'اختر حالة صحيحة')
        .required('حالة المهمة مطلوبة'),

    estimatedTime: Yup.number()
        .min(0, 'يجب أن يكون الوقت المقدر رقمًا موجبًا')
        .nullable(),

    timeUnit: Yup.string()
        .oneOf(['minutes', 'hours', 'days', 'weeks'], 'اختر وحدة وقت صحيحة'),

    startDate: Yup.date()
        .nullable(),

    endDate: Yup.date()
        .nullable()
        .min(Yup.ref('startDate'), 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء'),

    assignedTo: Yup.string()
        .max(50, 'يجب ألا يتجاوز اسم المسؤول 50 حرف'),

    taskCategory: Yup.string()
        .oneOf(['development', 'design', 'testing', 'documentation', 'meeting'], 'اختر فئة صحيحة')
        .required('فئة المهمة مطلوبة'),
})

type TaskFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: () => void
    onFormSubmit?: (formData: any, setSubmitting: (isSubmitting: boolean) => void) => void
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
    const {
        type,
        initialData: initialDataProp,
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                    ...initialDataProp,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const data = {
                        ...values,
                        estimatedTime: values.estimatedTime ? parseInt(values.estimatedTime) : null,
                    }
                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <TaskFields
                                touched={touched}
                                errors={errors}
                                values={values}
                                setFieldValue={() => {}}
                            />

                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeleteTaskButton
                                            onDelete={onDelete}
                                        />
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
                                        {type === 'new' ? 'إضافة' : 'تحديث'}
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