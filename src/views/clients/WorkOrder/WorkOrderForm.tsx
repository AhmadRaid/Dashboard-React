import { Formik, Form } from 'formik'
import { Button } from '@/components/ui/Button'
import WorkOrderFields from './WorkOrderField'

const ServiceForm = () => {
  const initialValues = {
    services: [
      {
        id: 'service-0',
        serviceType: '',
      }
    ]
  }

  const handleSubmit = (values) => {
    console.log(values)
    // إرسال البيانات إلى الخادم
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, ...form }) => (
        <Form>
          <WorkOrderFields values={values} form={form} />
          <Button type="submit">حفظ الخدمات</Button>
        </Form>
      )}
    </Formik>
  )
}

export default ServiceForm