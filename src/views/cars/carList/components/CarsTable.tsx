import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import reducer, {
    getCars,
    useAppDispatch,
    useAppSelector,
    setTableData,
} from '../store'
import { injectReducer } from '@/store'
import CarsTableTools from './CarsTableTools'
import { Button, Notification, Tooltip, toast } from '@/components/ui'
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { ConfirmDialog } from '@/components/shared'

injectReducer('carsListSlice', reducer)

const CarsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [selectedCar, setSelectedCar] = useState(null)

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.carsListSlice.data.tableData
    )

    const loading = useAppSelector((state) => state.carsListSlice.data.loading)
    const carsData = useAppSelector(
        (state) => state.carsListSlice.data.carsList
    )

    useEffect(() => {
        dispatch(getCars())
    }, [pageIndex, limit, sort, query, dispatch])

    const handleDelete = async () => {
        if (!selectedCar) return

        try {
            // await apiDeleteCar(selectedCar._id); // تفعيل هذه الدالة عند الحاجة
            toast.push(
                <Notification
                    title="تم الحذف بنجاح"
                    type="success"
                    duration={3000}
                >
                    تم حذف السيارة بنجاح
                </Notification>
            )
            dispatch(getCars())
            setDeleteConfirmationOpen(false)
        } catch (error) {
            toast.push(
                <Notification title="حدث خطأ" type="danger" duration={3000}>
                    فشل في حذف السيارة
                </Notification>
            )
        }
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'اسم السيارة',
                accessorKey: 'name',
                cell: (props) => (
                    <span
                        className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        onClick={() =>
                            navigate(`/cars/details/${props.row.original._id}`)
                        }
                    >
                        {props.getValue() || 'غير محدد'}
                    </span>
                ),
            },
            {
                header: 'تاريخ الإضافة',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const date = props.getValue()
                    if (!date) return 'غير محدد'
                    // سيقوم بتنسيق التاريخ على شكل MM/DD/YYYY أو تنسيق الأرقام المحلي
                    return new Date(date).toLocaleDateString()
                },
            },
            {
                header: 'الإجراءات',
                accessorKey: 'actions',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                            <Tooltip title="تعديل">
                                <Button
                                    size="xs"
                                    icon={<HiOutlinePencil />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/cars/edit/${row._id}`)
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="حذف">
                                <Button
                                    size="xs"
                                    icon={<HiOutlineTrash />}
                                    color="red"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedCar(row)
                                        setDeleteConfirmationOpen(true)
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [navigate]
    )

    return (
        <div className="p-4">
            <CarsTableTools />

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                type="danger"
                title="حذف السيارة"
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
                confirmButtonColor="red-600"
            >
                <p>
                    هل أنت متأكد أنك تريد حذف هذه السيارة؟ لا يمكن التراجع عن
                    هذا الإجراء.
                </p>
            </ConfirmDialog>

            {loading ? (
                <div className="text-center py-8">
                    <span className="text-lg">جاري تحميل البيانات...</span>
                </div>
            ) : carsData && carsData.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={carsData}
                    loading={loading}
                    pagingData={{
                        total: total || carsData.length || 0,
                        pageIndex: pageIndex || 1,
                        pageSize: limit || 10,
                    }}
                    onPaginationChange={(page) => {
                        dispatch(setTableData({ pageIndex: page }))
                    }}
                    onRowClick={(row) =>
                        navigate(`/cars/details/${row.original._id}`)
                    }
                    rowClassName="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/20"
                    theadClass="bg-gray-50 dark:bg-gray-700"
                    thClass="!border-b-0"
                />
            ) : (
                <div className="text-center py-8">
                    <div className="mb-4">
                        <img
                            src="/img/empty-car.png"
                            alt="لا توجد سيارات"
                            className="mx-auto w-32 opacity-70"
                        />
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        لا توجد سيارات متاحة
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        يمكنك إضافة سيارة جديدة الآن.
                    </p>
                    <Button
                        className="mt-4"
                        variant="solid"
                        onClick={() => navigate('/cars/add-car')}
                    >
                        إضافة سيارة جديدة
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CarsTable
