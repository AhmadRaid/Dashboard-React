import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui'
import { HiArrowLeft, HiSave, HiStar } from 'react-icons/hi'
import { toast, Notification } from '@/components/ui'
import {  apiUpdateClient } from '@/services/ClientsService'
import { Rate } from 'antd'

const ratingSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, 'يجب أن يكون التقييم بين 1 و 5')
    .max(5, 'يجب أن يكون التقييم بين 1 و 5')
    .required('حقل التقييم مطلوب'),
  notes: Yup.string()
    .max(500, 'يجب ألا يتجاوز التعليق 500 حرف')
})

const ratingLabels: Record<number, { text: string; color: string }> = {
  1: { text: 'سيء جداً', color: 'text-red-500' },
  2: { text: 'سيء', color: 'text-orange-500' },
  3: { text: 'متوسط', color: 'text-yellow-500' },
  4: { text: 'جيد', color: 'text-lime-500' },
  5: { text: 'ممتاز', color: 'text-green-500' }
}

const ClientRatingForm = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { rating: number; notes: string }) => {
    if (!clientId) {
      toast.push(
        <Notification title="خطأ" type="danger">
          معرف العميل غير صالح
        </Notification>
      )
      return
    }
    
    setLoading(true)
    try {
      await apiUpdateClient(clientId, {
        rating: values.rating,
        notes: values.notes,
      })
      
      toast.push(
        <Notification title="تم بنجاح" type="success">
          تم حفظ تقييم العميل بنجاح
        </Notification>
      )
      
      navigate(`/clients/${clientId}`, { replace: true })
    } catch (error) {
      toast.push(
        <Notification title="خطأ" type="danger">
          حدث خطأ أثناء حفظ التقييم
        </Notification>
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden min-h-[90vh] my-4">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">تقييم العميل</h1>
              <p className="mt-1 text-gray-500 text-sm">
                الرجاء تقيم العميل واضافة ملاحظات عليه اذا وجدت لتعامل مع العميل بشكل جميل
              </p>
            </div>
            <Button
              icon={<HiArrowLeft size={16} className="text-gray-600" />}
              onClick={() => navigate(-1)}
              variant="plain"
              className="hover:bg-gray-100 p-2 rounded-full"
            />
          </div>
        </header>

        {/* Main Form Content */}
        <main className="p-6">
          <Formik
            initialValues={{ rating: 0, notes: '' }}
            validationSchema={ratingSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <FormContainer>
                  <div className="space-y-6">
                    {/* Rating Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <FormItem
                        label="كيف تقيم تجربتك مع العميل؟"
                        labelClass="text-base font-medium text-gray-700 mb-2"
                        invalid={!!errors.rating && !!touched.rating}
                        errorMessage={errors.rating}
                      >
                        <div className="flex flex-col items-center py-2">
                          <div className="relative">
                            <Rate
                              value={values.rating}
                              onChange={(val) => setFieldValue('rating', val)}
                              count={5}
                              className="text-4xl"
                              character={<HiStar className="w-10 h-10" />}
                              allowHalf={false}
                            />
                            {values.rating > 0 && (
                              <div className={`text-center mt-2 text-lg font-medium ${ratingLabels[values.rating].color}`}>
                                {ratingLabels[values.rating].text}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormItem>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <FormItem
                        label="ملاحظاتك"
                        labelClass="text-base font-medium text-gray-700 mb-2"
                        invalid={!!errors.notes && !!touched.notes}
                        errorMessage={errors.notes}
                      >
                        <Field
                          name="notes"
                          as="textarea"
                          rows={6}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                          placeholder="أدخل ملاحظاتك هنا..."
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{values.notes.length}/500 حرف</span>
                          {values.notes.length > 450 && (
                            <span className="text-amber-600">اقتربت من الحد الأقصى</span>
                          )}
                        </div>
                      </FormItem>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        {values.rating > 0 ? (
                          <span className="flex items-center">
                            <HiStar className="text-amber-400 mr-1" />
                            التقييم: {values.rating}/5
                          </span>
                        ) : (
                          'لم تقم بالتقييم بعد'
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="plain"
                          onClick={() => navigate(-1)}
                          className="px-4 py-2 border border-gray-300"
                        >
                          إلغاء
                        </Button>
                        <Button
                          type="submit"
                          variant="solid"
                          loading={loading}
                          icon={<HiSave size={16} />}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white"
                          disabled={values.rating === 0}
                        >
                          حفظ
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </main>
      </div>
    </div>
  )
}

export default ClientRatingForm