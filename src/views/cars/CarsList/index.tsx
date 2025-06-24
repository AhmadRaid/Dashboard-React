// views/cars/CarsList/index.tsx

import CarsTable from "./components/CarsList"

const CarsList = () => {
    return (
        <div className="p-4">
            <h3 className="mb-4">قائمة السيارات</h3>
            <CarsTable />
        </div>
    )
}

export default CarsList