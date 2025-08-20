import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import { apiGetAllServices } from '@/services/ClientsService'
import { HiOutlineDocumentText } from 'react-icons/hi'

type FormFieldsName = {
    name: string
}

type ClientFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
}

const CarFields = (props: ClientFieldsProps) => {
    const { values, touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <FormItem
    label="اسم السيارة"
    invalid={!!errors.name && !!touched.name}
    errorMessage={errors.name as string}
>
    <Field name="name">
        {({ field, form }: FieldProps) => (
            <Input
                {...field}
                type="text"
                size="sm"
                placeholder="اسم السيارة"
                suffix={<HiOutlineDocumentText className="text-gray-400" />} // إضافة الأيقونة هنا
            />
        )}
    </Field>
</FormItem>
            </div>
        </AdaptableCard>
    )
}

export default CarFields