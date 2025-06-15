import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps } from 'formik'

import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import ServiceFields from '../ServiceFields'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any

type FormikRef = FormikProps<any>

type InitialData = {
    name: ''
    description: ''
}

export const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('اسم الخدمة مطلوب')
        .min(2, 'يجب أن يكون اسم الخدمة على الأقل 2 حروف')
        .max(50, 'يجب ألا يتجاوز اسم الخدمة الكامل 50 حرف'),

    description: Yup.string()
        .required('الوصف مطلوب')
        .min(10, 'يجب أن يكون الوصف على الأقل 10 حروف')
        .max(500, 'يجب ألا يتجاوز الوصف 500 حرف'),
})

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ServiceForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit?: (formData: any, setSubmitting: SetSubmitting) => void
}

// const DeleteProductButton = ({ onDelete }: { onDelete: OnDelete }) => {
//     const [dialogOpen, setDialogOpen] = useState(false)

//     const onConfirmDialogOpen = () => {
//         setDialogOpen(true)
//     }

//     const onConfirmDialogClose = () => {
//         setDialogOpen(false)
//     }

//     const handleConfirm = () => {
//         onDelete?.(setDialogOpen)
//     }

//     return (
//         <>
//             <Button
//                 className="text-red-600"
//                 variant="plain"
//                 size="sm"
//                 icon={<HiOutlineTrash />}
//                 type="button"
//                 onClick={onConfirmDialogOpen}
//             >
//                 Delete
//             </Button>
//             <ConfirmDialog
//                 isOpen={dialogOpen}
//                 type="danger"
//                 title="Delete project"
//                 confirmButtonColor="red-600"
//                 onClose={onConfirmDialogClose}
//                 onRequestClose={onConfirmDialogClose}
//                 onCancel={onConfirmDialogClose}
//                 onConfirm={handleConfirm}
//             >
//                 <p>Are you sure you want to delete this Project?</p>
//             </ConfirmDialog>
//         </>
//     )
// }

const ServiceForm = forwardRef<FormikRef, ServiceForm>((props, ref) => {
    const {
        type,
        initialData = {
            name: '',
            description: '',
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
                    onFormSubmit?.(values, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <ServiceFields
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                    />
                                </div>
                            </div>

                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                {/* <div>
                                    {type === 'edit' && (
                                        <DeleteProductButton
                                            onDelete={onDelete as OnDelete}
                                        />
                                    )}
                                </div> */}

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
                                        اضافة
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

ServiceForm.displayName = 'ServiceForm'

export default ServiceForm
