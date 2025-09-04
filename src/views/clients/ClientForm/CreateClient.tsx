import { apiCreateClient } from "@/services/ClientsService"
import MultiStepClientForm from "./multi-step-client-form"

const NewClientPage = () => {
  const handleClientSave = async (clientData: any, confirm: boolean = false) => {
    try {
      const response = await apiCreateClient({ ...clientData }, confirm)
      console.log("Client saved:", response.data)
    } catch (error) {
      console.error("Error saving client:", error)
      throw error
    }
  }

  const handleCarSave = async (carData: any) => {
    try {
      const response = await apiCreateClient({ ...carData, step: "car" })
      console.log("Car saved:", response.data)
    } catch (error) {
      console.error("Error saving car:", error)
      throw error
    }
  }

  const handleFinalSave = async (fullData: any) => {
    try {
      const response = await apiCreateClient({ ...fullData, step: "complete" })
      console.log("Complete data saved:", response.data)
    } catch (error) {
      console.error("Error saving complete data:", error)
      throw error
    }
  }

  const handleDiscard = () => {
    console.log("Form discarded")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200/20 to-transparent dark:from-gray-700/10"></div>
      
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            إضافة عميل جديد
          </h1>
          
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            املأ البيانات المطلوبة خطوة بخطوة لإضافة عميل جديد إلى النظام
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            <MultiStepClientForm
              onClientSave={handleClientSave}
              onCarSave={handleCarSave}
              onFinalSave={handleFinalSave}
              onDiscard={handleDiscard}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            نظام إدارة العملاء © 2024
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewClientPage