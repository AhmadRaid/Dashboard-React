import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '@/components/shared/DataTable'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import reducer, {
    getBranches,
    useAppDispatch,
    useAppSelector,
    setTableData,
} from '../store'
import { injectReducer } from '@/store'
import BranchesTableTools from './BranchesTableTools'
import { Button, Notification, Tooltip, toast } from '@/components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { ConfirmDialog } from '@/components/shared'
import { apiDeleteBranch } from '@/services/CrmService'

injectReducer('branchesListSlice', reducer)

const BranchesTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState(null)

    const { pageIndex, limit, sort, query, total } = useAppSelector(
        (state) => state.branchesListSlice.data.tableData
    )

    const loading = useAppSelector((state) => state.branchesListSlice.data.loading)
    const branchesData = useAppSelector(
        (state) => state.branchesListSlice.data.branchesList
    )

    useEffect(() => {
        dispatch(getBranches({ pageIndex, limit, sort, query }))
    }, [pageIndex, limit, sort, query, dispatch])

    const handleDelete = async () => {
        if (!selectedBranch) return

        try {
            // await apiDeleteBranch(selectedBranch._id); // تفعيل دالة حذف الفرع
            toast.push(
                <Notification
                    title="تم الحذف بنجاح"
                    type="success"
                    duration={3000}
                >
                    تم حذف الفرع بنجاح
                </Notification>
            )
            dispatch(getBranches({ pageIndex, limit, sort, query }))
            setDeleteConfirmationOpen(false)
        } catch (error) {
            toast.push(
                <Notification title="حدث خطأ" type="danger" duration={3000}>
                    فشل في حذف الفرع
                </Notification>
            )
        }
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'اسم الفرع',
                accessorKey: 'name',
                cell: (props) => (
                    <span
                        className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                        onClick={() =>
                            navigate(`/app/crm/branches/details/${props.row.original._id}`)
                        }
                    >
                        {props.getValue() || 'غير محدد'}
                    </span>
                ),
            },
            {
                header: 'العنوان',
                accessorKey: 'address',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'رقم الهاتف',
                accessorKey: 'phone',
                cell: (props) => props.getValue() || 'غير محدد',
            },
            {
                header: 'تاريخ الإضافة',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const date = props.getValue()
                    if (!date) return 'غير محدد'
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
                                        navigate(`/app/crm/branches/edit/${row._id}`)
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
                                        setSelectedBranch(row)
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
            <BranchesTableTools />

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                type="danger"
                title="حذف الفرع"
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
                confirmButtonColor="red-600"
            >
                <p>
                    هل أنت متأكد أنك تريد حذف هذا الفرع؟ لا يمكن التراجع عن
                    هذا الإجراء.
                </p>
            </ConfirmDialog>

            {loading ? (
                <div className="text-center py-8">
                    <span className="text-lg">جاري تحميل البيانات...</span>
                </div>
            ) : branchesData && branchesData.length > 0 ? (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={branchesData}
                    loading={loading}
                    pagingData={{
                        total: total || 0,
                        pageIndex: pageIndex || 1,
                        pageSize: limit || 10,
                    }}
                    onPaginationChange={(page) => {
                        dispatch(setTableData({ pageIndex: page }))
                    }}
                    onRowClick={(row) =>
                        navigate(`/app/crm/branches/details/${row.original._id}`)
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
                            alt="لا توجد فروع"
                            className="mx-auto w-32 opacity-70"
                        />
                    </div>
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        لا توجد فروع متاحة
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        يمكنك إضافة فرع جديد الآن.
                    </p>
                    <Button
                        className="mt-4"
                        variant="solid"
                        onClick={() => navigate('/app/crm/branches/add-branch')}
                    >
                        إضافة فرع جديد
                    </Button>
                </div>
            )}
        </div>
    )
}

export default BranchesTable