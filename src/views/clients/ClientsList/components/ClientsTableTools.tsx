import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import ClientsTableSearch from './ClientsTableSearch'

import { Link } from 'react-router-dom'

export const ClientsTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row  lg:items-center lg:justify-between mb-5">
            <h4 className="text-2xl text-bold mb-3 lg:mb-0">جدول العملاء</h4>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <ClientsTableSearch />

                <Link
                    className="block lg:inline-block md:mb-0 mb-4"
                    to="/clients/create-client"
                >
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        انشاء عميل{' '}
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ClientsTableTools
