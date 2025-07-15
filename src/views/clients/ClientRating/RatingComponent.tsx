import { useField } from 'formik';
import { HiStar } from 'react-icons/hi';
import { FiEdit2 } from 'react-icons/fi';

const RatingAndNotesSection = ({ values, readOnly }) => {
    const [field, meta, helpers] = useField('notes');
    
    return (
        <>
            <div className="border rounded p-4">
                <h6 className="text-sm font-medium text-gray-500 mb-2">
                    تقييم العميل
                </h6>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => !readOnly && helpers.setValue({ ...values, rating: star })}
                            className={`text-lg ${values.rating >= star 
                                ? 'text-amber-400' 
                                : 'text-gray-300'}`}
                            disabled={readOnly}
                        >
                            <HiStar />
                        </button>
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                        ({values.rating || 0}/5)
                    </span>
                </div>
            </div>

            {/* Notes Section - يأخذ عمودين */}
            <div className="border rounded p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                    <h6 className="text-sm font-medium text-gray-500">
                        الملاحظات
                    </h6>
                    {!readOnly && <FiEdit2 className="text-gray-400 text-sm" />}
                </div>
                <textarea
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => helpers.setValue(e.target.value)}
                    className={`w-full text-sm rounded border-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 ${
                        readOnly ? 'bg-gray-50' : 'bg-white'
                    }`}
                    disabled={readOnly}
                    placeholder={readOnly ? 'لا توجد ملاحظات' : 'أدخل ملاحظاتك هنا...'}
                    rows={3}
                />
                {meta.touched && meta.error && (
                    <div className="text-red-500 text-xs mt-1">
                        {meta.error}
                    </div>
                )}
            </div>
        </>
    );
};

export default RatingAndNotesSection;