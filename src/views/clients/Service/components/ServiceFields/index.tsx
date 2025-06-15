import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'

type FormFieldsName = {
    name: string
    description: string
}

type ServiceFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName
}

const ServiceFields = (props: ServiceFieldsProps) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>معلومات الخدمة</h5>
            <p className="mb-6">قسم لإعداد معلومات الخدمة الأساسية</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="اسم الخدمة"
                    invalid={!!errors.name && !!touched.name}
                    errorMessage={errors.name}
                >
                    <Field
                        name="name"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="ادخل اسم الخدمة"
                        component={Input}
                    />
                </FormItem>

                <FormItem
                    label="الوصف"
                    invalid={!!errors.description && !!touched.description}
                    errorMessage={errors.description}
                >
                    <Field
                        name="description"
                        size="sm"
                        type="text"
                        placeholder="ادخل وصف الخدمة"
                        component={Input}
                    />
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default ServiceFields
