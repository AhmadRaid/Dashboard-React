import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import cloneDeep from 'lodash/cloneDeep'
import * as Yup from 'yup'
import CarFields from './CarFields'

type FormikRef = FormikProps<any>

type InitialData = {
    name: string
}

const initialData: InitialData = {
    name: '',
}

export const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('الاسم السيارة مطلوب')
        .min(2, 'يجب أن يكون الاسم على الأقل 2 حروف')
        .max(30, 'يجب ألا يتجاوز الاسم 30 حرف'),
})

type CarsFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: (callback: any) => void
    onFormSubmit?: (
        formData: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => void
}

const DeleteProductButton = ({ onDelete }: { onDelete: any }) => {
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
                Delete
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete project"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>Are you sure you want to delete this Project?</p>
            </ConfirmDialog>
        </>
    )
}

const CarForm = forwardRef<FormikRef, CarsFormProps>((props, ref) => {
    const {
        type,
        initialData = {
            name: '',
        },
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
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    let data = cloneDeep(values)
                    console.log('Data values:', values)
                    onFormSubmit?.(data, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting, ...form }) => {
                    return (
                        <Form>
                            <FormContainer>
                                {/* Client and Car Info Sections */}
                                <CarFields
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                />

                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && (
                                            <DeleteProductButton
                                                onDelete={onDelete as any}
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
                                            الغاء
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            {type === 'new' ? 'اضافة' : 'تحديث'}
                                        </Button>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
})

CarForm.displayName = 'CarForm'

export default CarForm
