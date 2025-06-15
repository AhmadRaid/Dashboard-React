import { forwardRef } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'

import cloneDeep from 'lodash/cloneDeep'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import OrdersClientFields from './OrdersClientFields'
import { ClientWithOrdersData } from '@/@types/clients'

export const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required').min(2).max(100),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string()
        .required('Phone is required')
        .matches(/^\+?[0-9]{7,15}$/, 'Phone must be a valid number'),
    clientType: Yup.string().oneOf(['individual', 'company']).required(),
    isDeleted: Yup.boolean(),
    orders: Yup.array().of(
        Yup.object().shape({
            carModel: Yup.string().required().max(50),
            carColor: Yup.string().required().max(30),
            service: Yup.string().required().max(100),
            guarantee: Yup.array().of(
                Yup.object().shape({
                    products: Yup.array()
                        .of(Yup.string().required())
                        .min(1)
                        .required(),
                    typeGuarantee: Yup.string().required().max(50),
                    startDate: Yup.string()
                        .required()
                        .matches(/^\d{4}-\d{2}-\d{2}$/),
                    endDate: Yup.string()
                        .required()
                        .matches(/^\d{4}-\d{2}-\d{2}$/)
                        .test(
                            'is-after-start-date',
                            'End Date cannot be before Start Date',
                            function (value) {
                                const { startDate } = this.parent
                                return (
                                    !startDate ||
                                    !value ||
                                    new Date(value) >= new Date(startDate)
                                )
                            }
                        ),
                    terms: Yup.string().required().max(200),
                    coveredComponents: Yup.array()
                        .of(Yup.string().required())
                        .min(1)
                        .required(),
                })
            ),
        })
    ),
})

type SetSubmitting = (isSubmitting: boolean) => void

type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>
type OnDelete = (callback: OnDeleteCallback) => void

type OrdersClientFormProps = {
    initialData?: ClientWithOrdersData
    type: 'edit' | 'view'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit?: (
        formData: ClientWithOrdersData,
        setSubmitting: SetSubmitting
    ) => void
}

const OrdersClientForm = forwardRef<
    FormikProps<ClientWithOrdersData>,
    OrdersClientFormProps
>(({ type, initialData, onFormSubmit, onDiscard, onDelete }, ref) => {
    const readOnly = type === 'view'

    const initialValues: ClientWithOrdersData = cloneDeep(
        initialData ?? {
            fullName: '',
            email: '',
            phone: '',
            clientType: 'individual',
            isDeleted: false,
            orderStats: {
                totalOrders: 0,
                activeGuarantees: 0,
            },
            orders: [
                {
                    carModel: '',
                    carColor: '',
                    service: '',
                    guarantee: [
                        {
                            products: [],
                            typeGuarantee: '',
                            startDate: '',
                            endDate: '',
                            terms: '',
                            coveredComponents: [],
                        },
                    ],
                },
            ],
        }
    )

    return (
        <Formik
            innerRef={ref}
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                const data = cloneDeep(values)
                data.orders.forEach((order) => {
                    order.guarantee.forEach((g) => {
                        g.startDate = new Date(g.startDate).toISOString()
                        g.endDate = new Date(g.endDate).toISOString()
                    })
                })
                onFormSubmit?.(data, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2">
                                <OrdersClientFields
                                    touched={touched}
                                    errors={errors}
                                    values={values}
                                    readOnly={readOnly}
                                />
                            </div>
                        </div>
                        {!readOnly && (
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                {/* <div>
                                    {onDelete && (
                                        <DeleteProductButton
                                            onDelete={onDelete}
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
                        )}
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
})

OrdersClientForm.displayName = 'OrdersClientForm'

export default OrdersClientForm
