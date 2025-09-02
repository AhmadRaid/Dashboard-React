import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import { useState } from 'react'

type FormFieldsName = {
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

type TaskFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
    setFieldValue: (field: string, value: any) => void
}

const priorityOptions = [
    { label: 'عالي', value: 'high' },
    { label: 'متوسط', value: 'medium' },
    { label: 'منخفض', value: 'low' },
]

const statusOptions = [
    { label: 'لم يبدأ', value: 'not_started' },
    { label: 'قيد التنفيذ', value: 'in_progress' },
    { label: 'مكتمل', value: 'completed' },
    { label: 'معلق', value: 'pending' },
]

const timeUnitOptions = [
    { label: 'دقائق', value: 'minutes' },
    { label: 'ساعات', value: 'hours' },
    { label: 'أيام', value: 'days' },
    { label: 'أسابيع', value: 'weeks' },
]

const categoryOptions = [
    { label: 'تطوير', value: 'development' },
    { label: 'تصميم', value: 'design' },
    { label: 'اختبار', value: 'testing' },
    { label: 'توثيق', value: 'documentation' },
    { label: 'اجتماع', value: 'meeting' },
]

const TaskFields = (props: TaskFieldsProps) => {
    const { values, touched, errors, setFieldValue } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5 className="text-lg font-semibold">معلومات المهمة</h5>
            <p className="mb-6 text-sm text-gray-500">
                قسم لإعداد معلومات المهمة الأساسية
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="عنوان المهمة"
                    invalid={!!errors.taskTitle && !!touched.taskTitle}
                    errorMessage={errors.taskTitle}
                >
                    <Field
                        name="taskTitle"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="أدخل عنوان المهمة"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="وصف المهمة"
                    invalid={!!errors.taskDescription && !!touched.taskDescription}
                    errorMessage={errors.taskDescription}
                >
                    <Field
                        name="taskDescription"
                        as="textarea"
                        rows={3}
                        size="sm"
                        placeholder="أدخل وصف المهمة"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="الأولوية"
                    invalid={!!errors.taskPriority && !!touched.taskPriority}
                    errorMessage={errors.taskPriority}
                >
                    <Field name="taskPriority">
                        {({ field, form }: FieldProps) => (
                            <Select
                                field={field}
                                size="sm"
                                form={form}
                                options={priorityOptions}
                                value={priorityOptions.find(
                                    (option) => option.value === values.taskPriority
                                )}
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }}
                                placeholder="اختر الأولوية"
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="المسند إلى"
                    invalid={!!errors.assignedTo && !!touched.assignedTo}
                    errorMessage={errors.assignedTo}
                >
                    <Field
                        name="assignedTo"
                        size="sm"
                        type="text"
                        placeholder="أدخل اسم المسؤول"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="تاريخ البدء"
                    invalid={!!errors.startDate && !!touched.startDate}
                    errorMessage={errors.startDate}
                >
                    <Field
                        name="startDate"
                        type="date"
                        size="sm"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="تاريخ الانتهاء"
                    invalid={!!errors.endDate && !!touched.endDate}
                    errorMessage={errors.endDate}
                >
                    <Field
                        name="endDate"
                        type="date"
                        size="sm"
                        component={Input}
                    />
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default TaskFields