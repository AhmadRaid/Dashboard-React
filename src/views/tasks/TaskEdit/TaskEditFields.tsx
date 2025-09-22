import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'
import { Select } from '@/components/ui'
import { useState, useEffect } from 'react'
import { apiGetBranches } from '@/services/BranchService'

type FormFieldsName = {
    title: string
    description: string
    priority: string
    startDate: string
    endDate: string
    branchId: string
}

type TaskFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
}

const priorityOptions = [
    { label: 'عالية', value: 'high' },
    { label: 'متوسطة', value: 'medium' },
    { label: 'منخفضة', value: 'low' },
]

const TaskEditFields = (props: TaskFieldsProps) => {
    const { touched, errors, values } = props

    const [branchOptions, setBranchOptions] = useState<
        { label: string; value: string }[]
    >([])

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiGetBranches()
                if (response.data && response.data.data && response.data.data.branches) {
                    const options = response.data.data.branches.map((branch: any) => ({
                        label: branch.name,
                        value: branch._id,
                    }))
                    setBranchOptions(options)
                }
            } catch (error) {
                console.error('Failed to fetch branches:', error)
            }
        }
        fetchBranches()
    }, [])

    return (
        <AdaptableCard className="mb-4" divider>
            <p className="mb-6">
                املأ النموذج بالمعلومات المطلوبة لإنشاء أو تعديل المهمة.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="عنوان المهمة"
                    invalid={!!errors.title && !!touched.title}
                    errorMessage={errors.title}
                >
                    <Field
                        type="text"
                        name="title"
                        autoComplete="off"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="وصف المهمة"
                    invalid={!!errors.description && !!touched.description}
                    errorMessage={errors.description}
                >
                    <Field
                        type="text"
                        name="description"
                        autoComplete="off"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="الأولوية"
                    invalid={!!errors.priority && !!touched.priority}
                    errorMessage={errors.priority}
                >
                    <Field name="priority">
                        {({ field, form }: any) => (
                            <Select
                                field={field}
                                form={form}
                                options={priorityOptions}
                                value={priorityOptions.find(
                                    (option) =>
                                        option.value === values.priority
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
                    label="الفرع"
                    invalid={!!errors.branchId && !!touched.branchId}
                    errorMessage={errors.branchId}
                >
                    <Field name="branchId">
                        {({ field, form }: any) => (
                            <Select
                                field={field}
                                form={form}
                                options={branchOptions}
                                value={branchOptions.find(
                                    (option) =>
                                        option.value === values.branchId
                                )}
                                onChange={(option) => {
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }}
                                placeholder="اختر الفرع"
                            />
                        )}
                    </Field>
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

export default TaskEditFields