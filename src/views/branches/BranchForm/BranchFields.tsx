import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'
import { HiOutlineDocumentText, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'

type FormFieldsName = {
    name: string
    address: string
    phone: string
    secondPhone: string
}

type BranchFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: any
}

const BranchFields = (props: BranchFieldsProps) => {
    const { touched, errors } = props

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
                    <Field name="phone">
                        {({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                size="sm"
                                placeholder="رقم الهاتف الأساسي"
                                suffix={<HiOutlinePhone className="text-gray-400" />}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label="رقم الهاتف الثانوي"
                    invalid={!!errors.secondPhone && !!touched.secondPhone}
                    errorMessage={errors.secondPhone as string}
                >
                    <Field name="secondPhone">
                        {({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                size="sm"
                                placeholder="رقم الهاتف الثانوي"
                                suffix={<HiOutlinePhone className="text-gray-400" />}
                            />
                        )}
                    </Field>
                </FormItem>
            </div>
        </AdaptableCard>
    )
}

export default BranchFields