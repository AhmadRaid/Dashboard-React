import { useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Field, FieldProps, FormikProps } from 'formik';
import Button from '@/components/ui/Button';
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';
import Checkbox from '@/components/ui/Checkbox';
import Radio from '@/components/ui/Radio'; // Now imports from the barrel file

type Service = {
    id: string;
    serviceType?: string;
    protectionFilm?: {
        finish?: string;
        size?: string;
        coverage?: string;
    };
    thermalInsulator?: {
        type?: string;
        percentage?: string;
        coverage?: string;
    };
    polishing?: {
        type?: string;
        level?: string;
        nanoType?: string;
    };
    additions?: {
        type?: string;
        blackoutType?: string;
        washScope?: string;
    };
    serviceDetails?: string;
    servicePrice?: number;
};

type FormFieldsName = {
    services: Service[];
};

type ServiceFieldsProps = {
    values: any;
    form: FormikProps<any>;
};

const WorkOrderFields = (props: ServiceFieldsProps) => {
    const { values, form } = props;
    const [serviceCounter, setServiceCounter] = useState(1);

    const addService = () => {
        const newServiceId = `service-${serviceCounter}`;
        form.setFieldValue(`services[${serviceCounter}]`, {
            id: newServiceId,
            serviceType: '',
        });
        setServiceCounter(serviceCounter + 1);
    };

    const removeService = (index: number) => {
        if (values.services.length <= 1) {
            return;
        }
        const services = [...values.services];
        services.splice(index, 1);
        form.setFieldValue('services', services);
    };

    const renderRadioGroup = (
        name: string,
        options: { label: string; value: string }[],
        label: string
    ) => {
        return (
            <FormItem label={label}>
                <Field name={name}>
                    {({ field }: FieldProps) => (
                        <Radio.Group
                            value={field.value}
                            onChange={(val: string) => form.setFieldValue(field.name, val)}
                        >
                            <div className="flex flex-col gap-2">
                                {options.map((option) => (
                                    <Radio key={option.value} value={option.value}>
                                        <span className="text-lg">{option.label}</span>
                                    </Radio>
                                ))}
                            </div>
                        </Radio.Group>
                    )}
                </Field>
            </FormItem>
        );
    };

    return (
        <AdaptableCard divider className="mb-4">
            <h5 className="text-lg font-semibold">تفاصيل الخدمات</h5>
            <p className="mb-6 text-sm text-gray-500">
                قسم لإعداد الخدمات المقدمة للعميل
            </p>

            {values.services?.map((service: Service, index: number) => (
                <div 
                    key={service.id} 
                    className="mt-6 p-6 border rounded-lg bg-white shadow-sm"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold">الخدمة {index + 1}</h4>
                        {values.services.length > 1 && (
                            <Button
                                size="xs"
                                variant="plain"
                                type="button"
                                icon={<HiOutlineTrash />}
                                onClick={() => removeService(index)}
                            >
                                حذف الخدمة
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <FormItem label="أفلام حماية">
                            <Checkbox
                                className="text-lg"
                                checked={service.serviceType === 'protection'}
                                onChange={(checked) => {
                                    if (checked) {
                                        form.setFieldValue(`services[${index}].serviceType`, 'protection');
                                        form.setFieldValue(`services[${index}].protectionFilm`, {});
                                    } else if (service.serviceType === 'protection') {
                                        form.setFieldValue(`services[${index}].serviceType`, '');
                                        form.setFieldValue(`services[${index}].protectionFilm`, undefined);
                                    }
                                }}
                            >
                                اختيار
                            </Checkbox>
                        </FormItem>
                        <FormItem label="عازل حراري">
                            <Checkbox
                                className="text-lg"
                                checked={service.serviceType === 'insulator'}
                                onChange={(checked) => {
                                    if (checked) {
                                        form.setFieldValue(`services[${index}].serviceType`, 'insulator');
                                        form.setFieldValue(`services[${index}].thermalInsulator`, {});
                                    } else if (service.serviceType === 'insulator') {
                                        form.setFieldValue(`services[${index}].serviceType`, '');
                                        form.setFieldValue(`services[${index}].thermalInsulator`, undefined);
                                    }
                                }}
                            >
                                اختيار
                            </Checkbox>
                        </FormItem>
                        <FormItem label="تلميع">
                            <Checkbox
                                className="text-lg"
                                checked={service.serviceType === 'polishing'}
                                onChange={(checked) => {
                                    if (checked) {
                                        form.setFieldValue(`services[${index}].serviceType`, 'polishing');
                                        form.setFieldValue(`services[${index}].polishing`, {});
                                    } else if (service.serviceType === 'polishing') {
                                        form.setFieldValue(`services[${index}].serviceType`, '');
                                        form.setFieldValue(`services[${index}].polishing`, undefined);
                                    }
                                }}
                            >
                                اختيار
                            </Checkbox>
                        </FormItem>
                        <FormItem label="إضافات">
                            <Checkbox
                                className="text-lg"
                                checked={service.serviceType === 'additions'}
                                onChange={(checked) => {
                                    if (checked) {
                                        form.setFieldValue(`services[${index}].serviceType`, 'additions');
                                        form.setFieldValue(`services[${index}].additions`, {});
                                    } else if (service.serviceType === 'additions') {
                                        form.setFieldValue(`services[${index}].serviceType`, '');
                                        form.setFieldValue(`services[${index}].additions`, undefined);
                                    }
                                }}
                            >
                                اختيار
                            </Checkbox>
                        </FormItem>
                    </div>

                    <hr className="my-4" />

                    {service.serviceType === 'protection' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {renderRadioGroup(
                                `services[${index}].protectionFilm.finish`,
                                [
                                    { label: 'لامع', value: 'glossy' },
                                    { label: 'مطفى', value: 'matte' },
                                    { label: 'ملون', value: 'colored' },
                                ],
                                'النوع'
                            )}
                            {renderRadioGroup(
                                `services[${index}].protectionFilm.size`,
                                [
                                    { label: '10 مل', value: '10' },
                                    { label: '7 مل', value: '7' },
                                    { label: '8 مل', value: '8' },
                                    { label: '5 مل', value: '5' },
                                ],
                                'الحجم'
                            )}
                            {renderRadioGroup(
                                `services[${index}].protectionFilm.coverage`,
                                [
                                    { label: 'كامل', value: 'full' },
                                    { label: 'نص', value: 'half' },
                                    { label: 'ربع', value: 'quarter' },
                                    { label: 'أطراف', value: 'edges' },
                                    { label: 'أخرى', value: 'other' },
                                ],
                                'التغطية'
                            )}
                        </div>
                    )}

                    {service.serviceType === 'insulator' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {renderRadioGroup(
                                `services[${index}].thermalInsulator.type`,
                                [
                                    { label: 'سيراميك', value: 'ceramic' },
                                    { label: 'كاربون', value: 'carbon' },
                                    { label: 'كرست', value: 'crystal' },
                                ],
                                'النوع'
                            )}
                            {renderRadioGroup(
                                `services[${index}].thermalInsulator.percentage`,
                                [
                                    { label: '5%', value: '5' },
                                    { label: '7%', value: '7' },
                                    { label: '10%', value: '10' },
                                ],
                                'النسبة'
                            )}
                            {renderRadioGroup(
                                `services[${index}].thermalInsulator.coverage`,
                                [
                                    { label: 'كامل', value: 'full' },
                                    { label: 'نص', value: 'half' },
                                    { label: 'قطعة', value: 'piece' },
                                    { label: 'درع حماية', value: 'shield' },
                                    { label: 'خارجي', value: 'external' },
                                ],
                                'التغطية'
                            )}
                        </div>
                    )}

                    {service.serviceType === 'polishing' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {renderRadioGroup(
                                `services[${index}].polishing.type`,
                                [
                                    { label: 'خارجي', value: 'external' },
                                    { label: 'داخلي', value: 'internal' },
                                    { label: 'كراسي', value: 'seats' },
                                    { label: 'قطعة', value: 'piece' },
                                    { label: 'تلميع مائي', value: 'water_polish' },
                                    { label: 'نانو سيراميك طبقة', value: 'nano_ceramic_1' },
                                    { label: 'نانو سيراميك طبقتين', value: 'nano_ceramic_2' },
                                    { label: 'نانو سيراميك ماستر', value: 'nano_ceramic_master' },
                                ],
                                'النوع'
                            )}
                            {renderRadioGroup(
                                `services[${index}].polishing.level`,
                                [
                                    { label: 'مستوى 1', value: '1' },
                                    { label: 'مستوى 2', value: '2' },
                                    { label: 'مستوى 3', value: '3' },
                                ],
                                'المستوى'
                            )}
                            {renderRadioGroup(
                                `services[${index}].polishing.nanoType`,
                                [
                                    { label: 'عادي', value: 'normal' },
                                    { label: 'ممتاز', value: 'premium' },
                                    { label: 'احترافي', value: 'professional' },
                                ],
                                'نوع النانو'
                            )}
                        </div>
                    )}

                    {service.serviceType === 'additions' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            {renderRadioGroup(
                                `services[${index}].additions.type`,
                                [
                                    { label: 'غسيل تفصيلي', value: 'detailed_wash' },
                                    { label: 'غسيل تفصيلي خاص', value: 'premium_wash' },
                                    { label: 'دواسات جلد', value: 'leather_pedals' },
                                    { label: 'تكحيل', value: 'blackout' },
                                    { label: 'نانو داخلي ديكور', value: 'nano_interior_decor' },
                                    { label: 'نانو داخلي مقاعد', value: 'nano_interior_seats' },
                                ],
                                'النوع'
                            )}
                            {renderRadioGroup(
                                `services[${index}].additions.blackoutType`,
                                [
                                    { label: 'شمعة', value: 'candle' },
                                    { label: 'اسطبات', value: 'pads' },
                                ],
                                'نوع التكحيل'
                            )}
                        </div>
                    )}

                    <hr className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem label="تفاصيل الخدمة">
                            <Field
                                name={`services[${index}].serviceDetails`}
                                type="text"
                                size="sm"
                                placeholder="أدخل تفاصيل الخدمة"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label="سعر الخدمة">
                            <Field
                                name={`services[${index}].servicePrice`}
                                type="number"
                                size="sm"
                                placeholder="أدخل سعر الخدمة"
                                component={Input}
                            />
                        </FormItem>
                    </div>
                </div>
            ))}

            <div className="mt-6">
                <Button
                    type="button"
                    onClick={addService}
                    icon={<HiPlus />}
                >
                    إضافة خدمة جديدة
                </Button>
            </div>
        </AdaptableCard>
    );
};

export default WorkOrderFields;