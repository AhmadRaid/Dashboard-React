// src/components/branch/BranchFields.tsx

import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'
import {
    HiOutlineDocumentText,
    HiOutlinePhone,
    HiOutlineLocationMarker,
} from 'react-icons/hi'
import InputGroup from '@/components/ui/InputGroup'

type FormFieldsName = {
    name: string
    address: string
    phone: string
    secondPhone: string
}

type BranchFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName // تأكد من وجود هذه الخاصية
}

const BranchFields = (props: BranchFieldsProps) => {
    const { touched, errors, values } = props

    return (
        <AdaptableCard divider className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="اسم الفرع"
                    invalid={!!errors.name && !!touched.name}
                    errorMessage={errors.name as string}
                >
                    <Field name="name">
                        {({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                size="sm"
                                placeholder="اسم الفرع"
                                suffix={<HiOutlineDocumentText className="text-gray-400" />}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="العنوان"
                    invalid={!!errors.address && !!touched.address}
                    errorMessage={errors.address as string}
                >
                    <Field name="address">
                        {({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                size="sm"
                                placeholder="العنوان"
                                suffix={<HiOutlineLocationMarker className="text-gray-400" />}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="رقم الهاتف الأساسي"
                    invalid={!!errors.phone && !!touched.phone}
                    errorMessage={errors.phone as string}
                >
                    <InputGroup className="w-full">
                        <InputGroup.Addon>05</InputGroup.Addon>
                        <Field name="phone">
                            {({ field, form }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    size="sm"
                                    placeholder="xxxxxxxx"
                                    maxLength={8}
                                    value={field.value?.startsWith('05') ? field.value.slice(2) : field.value}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^05/, '') // إزالة أي بادئة 05
                                        form.setFieldValue(field.name, '05' + value)
                                    }}
                                    suffix={<HiOutlinePhone className="text-gray-400" />}
                                />
                            )}
                        </Field>
                    </InputGroup>
                </FormItem>

                <FormItem
                    label="رقم الهاتف الثانوي"
                    invalid={!!errors.secondPhone && !!touched.secondPhone}
                    errorMessage={errors.secondPhone as string}
                >
                    <InputGroup className="w-full">
                        <InputGroup.Addon>05</InputGroup.Addon>
                        <Field name="secondPhone">
                            {({ field, form }) => (
                                <Input
                                    {...field}
                                    type="tel"
                                    size="sm"
                                    placeholder="xxxxxxxx"
                                    maxLength={8}
                                    value={field.value?.startsWith('05') ? field.value.slice(2) : field.value}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/^05/, '')
                                        form.setFieldValue(field.name, '05' + value)
                                    }}
                                    suffix={<HiOutlinePhone className="text-gray-400" />}
                                />
                            )}
                        </Field>
                    </InputGroup>
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default BranchFields