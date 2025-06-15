import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { Button, DatePicker, Select } from '@/components/ui'
import { ClientWithOrdersData } from '@/@types/clients'
import { HiCheckCircle, HiPlusCircle, HiXCircle } from 'react-icons/hi'
import CreateGurentee from './CreateGurentee'
import { useState } from 'react'
import ChangeGuranteeStatusConfirmation from './ChangeGuranteeStatusConfirmation'
import GuaranteePdfExport from './GuaranteePdfExport'

const formatDate = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

type OrdersClientFieldsProps = {
    values: ClientWithOrdersData
    touched: FormikTouched<ClientWithOrdersData>
    errors: FormikErrors<ClientWithOrdersData>
    readOnly?: boolean
}

const clientTypes = [
    { label: 'Individual', value: 'individual' },
    { label: 'Company', value: 'company' },
]

const OrdersClientFields = (props: OrdersClientFieldsProps) => {
    const [addGuaranteeDialogOpen, setAddGuaranteeDialogOpen] = useState(false)
    const [changeGuaranteeStatusDialog, setChangeGuaranteeStatusDialog] =
        useState<{
            open: boolean
            orderId?: string
            guaranteeId?: string
            status?: string
        }>({ open: false })

    const openChangeGuaranteeStatusDialog = (
        orderId?: string,
        guaranteeId?: string,
        status?: string
    ) => {
        setChangeGuaranteeStatusDialog({
            open: true,
            orderId,
            guaranteeId,
            status,
        })
    }

    const closeChangeGuaranteeStatusDialog = () => {
        setChangeGuaranteeStatusDialog((prev) => ({
            ...prev,
            open: false,
        }))
    }
    const { values, touched, errors, readOnly } = props

    return (
        <>
            <AdaptableCard divider className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="الاسم الأول"
                        invalid={!!errors.firstName && !!touched.firstName}
                        errorMessage={errors.firstName}
                    >
                        <Field
                            name="firstName"
                            size="sm"
                            type="text"
                            component={Input}
                            disabled={readOnly}
                        />
                    </FormItem>

                    <FormItem
                        label="الاسم الثاني"
                        invalid={!!errors.middleName && !!touched.middleName}
                        errorMessage={errors.middleName}
                    >
                        <Field
                            name="middleName"
                            size="sm"
                            type="text"
                            component={Input}
                            disabled={readOnly}
                        />
                    </FormItem>

                    <FormItem
                        label="اسم العائلة"
                        invalid={!!errors.lastName && !!touched.lastName}
                        errorMessage={errors.lastName}
                    >
                        <Field
                            name="lastName"
                            size="sm"
                            type="text"
                            component={Input}
                            disabled={readOnly}
                        />
                    </FormItem>
                    <FormItem
                        label="الايميل"
                        invalid={!!errors.email && !!touched.email}
                        errorMessage={errors.email}
                    >
                        <Field
                            size="sm"
                            name="email"
                            type="email"
                            component={Input}
                            disabled={readOnly}
                        />
                    </FormItem>
                    <FormItem
                        label="رقم الهاتف"
                        invalid={!!errors.phone && !!touched.phone}
                        errorMessage={errors.phone}
                    >
                        <Field
                            size="sm"
                            type="text"
                            name="phone"
                            component={Input}
                            disabled={readOnly}
                        />
                    </FormItem>
                    <FormItem
                        label="نوع العميل"
                        invalid={!!errors.clientType && !!touched.clientType}
                        errorMessage={errors.clientType}
                    >
                        <Field name="clientType">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    field={field}
                                    form={form}
                                    size="sm"
                                    options={clientTypes}
                                    isDisabled={readOnly}
                                    value={clientTypes.find(
                                        (opt) => opt.value === values.clientType
                                    )}
                                    onChange={(option) =>
                                        form.setFieldValue(
                                            field.name,
                                            option?.value
                                        )
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                    <FormItem label="تاريخ الإنشاء">
                        <Input
                            value={formatDate(values.createdAt)}
                            disabled
                            size="sm"
                        />
                    </FormItem>
                    <FormItem label="اجمالي الطلبات">
                        <Input
                            value={values.orderStats?.totalOrders ?? 0}
                            disabled
                            size="sm"
                        />
                    </FormItem>
                </div>

                {values?.orders?.map((order, index) => {
                    console.log(order)

                    return (
                        <div
                            className="mt-8 border p-4 rounded-md shadow-sm"
                            key={order._id || index}
                        >
                            <div className="flex justify-between items-center">
                                <h5 className="mb-4">طلب #{index + 1}</h5>
                                <CreateGurentee
                                    dialogIsOpen={addGuaranteeDialogOpen}
                                    setIsOpen={setAddGuaranteeDialogOpen}
                                    orderId={order._id}
                                />
                                <div className="flex gap-2">
                                    {order.guarantee &&
                                        order.guarantee.length > 0 && (
                                            <GuaranteePdfExport
                                                guarantees={order.guarantee}
                                            />
                                        )}
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        onClick={() =>
                                            setAddGuaranteeDialogOpen(true)
                                        }
                                        icon={<HiPlusCircle />}
                                    >
                                        اضافة ضمان
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem label="نوع السيارة">
                                    <Field
                                        name={`orders[${index}].carType`}
                                        component={Input}
                                        size="sm"
                                        disabled={readOnly}
                                    />
                                </FormItem>
                                <FormItem label="موديل السيارة">
                                    <Field
                                        name={`orders[${index}].carModel`}
                                        component={Input}
                                        size="sm"
                                        disabled={readOnly}
                                    />
                                </FormItem>
                                <FormItem label="لون السيارة">
                                    <Field
                                        name={`orders[${index}].carColor`}
                                        component={Input}
                                        disabled={readOnly}
                                        size="sm"
                                    />
                                </FormItem>
                                {/* <FormItem label="الخدمة">
                                    <Field
                                        name={`orders[${index}].service`}
                                        component={Input}
                                        disabled={readOnly}
                                        size="sm"
                                    />
                                </FormItem> */}
                                {/* الضمانات */}
                                {/* pdf here */}
                                {order.guarantee?.map((g, gIndex) => (
                                    <div
                                        key={gIndex}
                                        className="col-span-2 border rounded p-3 mt-4 bg-gray-50"
                                    >
                                        <div className="flex justify-between items-center">
                                            <h6 className="mb-4 text-gray-500">
                                                ضمان #{gIndex + 1}
                                            </h6>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="twoTone"
                                                    onClick={() =>
                                                        openChangeGuaranteeStatusDialog(
                                                            order._id,
                                                            g._id,
                                                            g.status
                                                        )
                                                    }
                                                    color={
                                                        g.status === 'active'
                                                            ? 'red-600'
                                                            : 'green-600'
                                                    }
                                                    icon={
                                                        g.status ===
                                                        'active' ? (
                                                            <HiXCircle />
                                                        ) : (
                                                            <HiCheckCircle />
                                                        )
                                                    }
                                                >
                                                    {g.status === 'active'
                                                        ? ' اضغط لالغاء التفعيل'
                                                        : 'اضغط للتفعيل'}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* <FormItem label="منتجات الضمان">
                                                <Field
                                                    size="sm"
                                                    name={`orders[${index}].guarantee[${gIndex}].products`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select
                                                            size="sm"
                                                            isMulti
                                                            isDisabled={
                                                                readOnly
                                                            }
                                                            placeholder="Select products"
                                                            options={[
                                                                'Thermal Coating',
                                                                'Ceramic Layer',
                                                                'Nano Protection',
                                                            ].map((p) => ({
                                                                label: p,
                                                                value: p,
                                                            }))}
                                                            value={
                                                                field.value?.map(
                                                                    (
                                                                        val: string
                                                                    ) => ({
                                                                        label: val,
                                                                        value: val,
                                                                    })
                                                                ) || []
                                                            }
                                                            onChange={(
                                                                selected
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    selected.map(
                                                                        (
                                                                            opt: any
                                                                        ) =>
                                                                            opt.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem> */}
                                            <FormItem label="نوع الضمان">
                                                <Field
                                                    name={`orders[${index}].guarantee[${gIndex}].typeGuarantee`}
                                                    component={Input}
                                                    size="sm"
                                                    disabled={readOnly}
                                                />
                                            </FormItem>
                                            <FormItem label="تاريخ البدء">
                                                <Field
                                                    name={`orders[${index}].guarantee[${gIndex}].startDate`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            size="sm"
                                                            value={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value
                                                                      )
                                                                    : null
                                                            }
                                                            onChange={(
                                                                date: Date | null
                                                            ) => {
                                                                if (date) {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        date.toISOString()
                                                                    )
                                                                } else {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        ''
                                                                    )
                                                                }
                                                            }}
                                                            disabled={readOnly}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            <FormItem label="تاريخ الانتهاء">
                                                <Field
                                                    size="sm"
                                                    name={`orders[${index}].guarantee[${gIndex}].endDate`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            value={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value
                                                                      )
                                                                    : null
                                                            }
                                                            onChange={(
                                                                date: Date | null
                                                            ) => {
                                                                if (date) {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        date.toISOString()
                                                                    )
                                                                } else {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        ''
                                                                    )
                                                                }
                                                            }}
                                                            disabled={readOnly}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            <FormItem label="الشروط">
                                                <Field
                                                    size="sm"
                                                    name={`orders[${index}].guarantee[${gIndex}].terms`}
                                                    component={Input}
                                                    disabled={readOnly}
                                                />
                                            </FormItem>
                                            <FormItem label="المكونات المشمولة">
                                                <Field
                                                    name={`orders[${index}].guarantee[${gIndex}].coveredComponents`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select
                                                            size="sm"
                                                            isMulti
                                                            isDisabled={
                                                                readOnly
                                                            }
                                                            placeholder="Select components"
                                                            options={[
                                                                'Windshield',
                                                                'Side Windows',
                                                                'Rear Window',
                                                            ].map((c) => ({
                                                                label: c,
                                                                value: c,
                                                            }))}
                                                            value={
                                                                field.value?.map(
                                                                    (
                                                                        val: string
                                                                    ) => ({
                                                                        label: val,
                                                                        value: val,
                                                                    })
                                                                ) || []
                                                            }
                                                            onChange={(
                                                                selected
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    selected.map(
                                                                        (
                                                                            opt: any
                                                                        ) =>
                                                                            opt.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </AdaptableCard>
            <ChangeGuranteeStatusConfirmation
                status={changeGuaranteeStatusDialog.status}
                orderId={changeGuaranteeStatusDialog.orderId}
                gId={changeGuaranteeStatusDialog.guaranteeId}
                dialogIsOpen={changeGuaranteeStatusDialog.open}
                closeDialog={closeChangeGuaranteeStatusDialog}
            />
        </>
    )
}

export default OrdersClientFields
