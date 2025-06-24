import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'

type FormFieldsName = {
    name: string
}

type CarFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName
}

const CarFields = (props: CarFieldsProps) => {
    const { values, touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>معلومات السيارة</h5>
            <p className="mb-6">قسم لإعداد معلومات السيارة الأساسية</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="اسم السيارة"
                    invalid={!!errors.name && !!touched.name}
                    errorMessage={errors.name}
                >
                    <Field
                        name="name"
                        size="sm"
                        autoComplete="off"
                        type="text"
                        placeholder="اسم السيارة"
                        component={Input}
                    />
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default CarFields