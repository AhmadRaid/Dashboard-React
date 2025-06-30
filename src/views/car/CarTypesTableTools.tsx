import React from 'react'
import { Button } from '@/components/ui'
import { HiPlus } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import CarTypesTableSearch from './CarTypesTableSearch'

const CarTypesTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
            <h3 className="mb-4 lg:mb-0">أنواع السيارات</h3>
            <div className="flex flex-col md:flex-row gap-2">
                <CarTypesTableSearch />
                <Link to="/car-types/new">
                    <Button variant="solid" icon={<HiPlus />}>
                        إضافة جديد
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default CarTypesTableTools