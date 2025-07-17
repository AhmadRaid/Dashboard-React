import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { Select } from '@/components/ui'
import { useEffect, useState } from 'react'
import { apiGetAllServices } from '@/services/ClientsService'

type FormFieldsName = {
    name: string
}

type CarFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
}

const CarFields = (props: CarFieldsProps) => {
    useEffect(() => {}, [])

    const { values, touched, errors } = props

    return (
        <AdaptableCard divider className="mb-3">
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
                        placeholder="الاسم"
                        component={Input}
                    />
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default CarFields
