import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Card,
    Typography,
    Button,
    CardBody,
    IconButton,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
} from "@material-tailwind/react";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    BuildingOffice2Icon,
    PhoneIcon,
    EnvelopeIcon,
    UserIcon,
    IdentificationIcon
} from "@heroicons/react/24/solid";
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';

export default function Index({ auth, suppliers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        address: '',
        ruc_or_id: '',
    });

    const openModal = (supplier = null) => {
        clearErrors();
        if (supplier) {
            setEditingSupplier(supplier);
            setData({
                name: supplier.name,
                contact_name: supplier.contact_name || '',
                phone: supplier.phone || '',
                email: supplier.email || '',
                address: supplier.address || '',
                ruc_or_id: supplier.ruc_or_id || '',
            });
        } else {
            setEditingSupplier(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSupplier) {
            put(route('suppliers.update', editingSupplier.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('suppliers.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // 2.LÓGICA DE ELIMINACIÓN MODULAR
    const openDeleteModal = (supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSupplierToDelete(null);
    };

    const confirmDelete = () => {
        if (!supplierToDelete) return;

        destroy(route('suppliers.destroy', supplierToDelete.id), {
            onSuccess: () => closeDeleteModal(),
        });
    };

    const TABLE_HEAD = ["Proveedor", "Contacto", "Teléfono/Email", "RUC/ID", "Acciones"];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <BuildingOffice2Icon className="h-6 w-6 text-indigo-500" /> Proveedores
                </Typography>
            }
        >
            <Head title="Proveedores" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 sm:py-0">
                <Card className="h-full w-full shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden">
                    {/* Header Principal */}
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold">
                                Lista de Proveedores
                            </Typography>
                            <Typography color="gray" className="mt-0.5 font-normal text-xs sm:text-sm">
                                Gestiona los proveedores registrados en tu empresa.
                            </Typography>
                        </div>
                        <Button
                            onClick={() => openModal()}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 rounded-xl py-2.5 px-4"
                            size="sm"
                        >
                            <PlusIcon strokeWidth={2.5} className="h-4 w-4" /> Nuevo Proveedor
                        </Button>
                    </div>

                    {/* VISTA ESCRITORIO (Tabla) */}
                    <CardBody className="hidden md:block overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-gray-100 bg-gray-50/70 p-4">
                                            <Typography variant="small" className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                                    <BuildingOffice2Icon className="h-5 w-5" />
                                                </div>
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {supplier.name}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal flex items-center gap-1.5 text-gray-700">
                                                {supplier.contact_name ? (
                                                    <>
                                                        <UserIcon className="h-4 w-4 text-gray-400" />
                                                        {supplier.contact_name}
                                                    </>
                                                ) : '-'}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-0.5">
                                                {supplier.phone && (
                                                    <span className="text-xs font-medium text-gray-800 flex items-center gap-1">
                                                        <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                                                        {supplier.phone}
                                                    </span>
                                                )}
                                                {supplier.email && (
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                                                        {supplier.email}
                                                    </span>
                                                )}
                                                {!supplier.phone && !supplier.email && <span className="text-xs text-gray-400">-</span>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {supplier.ruc_or_id ? (
                                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-mono">
                                                    <IdentificationIcon className="h-3.5 w-3.5 text-gray-400" />
                                                    {supplier.ruc_or_id}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <IconButton variant="text" color="blue" onClick={() => openModal(supplier)} className="rounded-lg hover:bg-blue-50">
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                                <IconButton variant="text" color="red" onClick={() => openDeleteModal(supplier)} className="rounded-lg hover:bg-red-50">
                                                    <TrashIcon className="h-4 w-4" />
                                                </IconButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {suppliers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center">
                                            <Typography variant="small" color="gray">No hay proveedores registrados.</Typography>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardBody>

                    {/* VISTA MÓVIL (Tarjetas limpias) */}
                    <div className="block md:hidden p-4 divide-y divide-gray-100">
                        {suppliers.data.map((supplier) => (
                            <div key={supplier.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                            <BuildingOffice2Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="font-bold text-base leading-tight">
                                                {supplier.name}
                                            </Typography>
                                            {supplier.contact_name && (
                                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <UserIcon className="h-3 w-3" /> {supplier.contact_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <IconButton variant="text" color="blue" size="sm" onClick={() => openModal(supplier)}>
                                            <PencilIcon className="h-4 w-4" />
                                        </IconButton>
                                        <IconButton variant="text" color="red" size="sm" onClick={() => openDeleteModal(supplier)}>
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </div>
                                </div>

                                <div className="mt-1 pl-10 flex flex-wrap gap-2 text-xs text-gray-600">
                                    {supplier.ruc_or_id && (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px]">
                                            RUC: {supplier.ruc_or_id}
                                        </span>
                                    )}
                                    {supplier.phone && (
                                        <span className="flex items-center gap-1 bg-indigo-50/60 text-indigo-700 px-2 py-0.5 rounded text-[11px]">
                                            <PhoneIcon className="h-3 w-3" /> {supplier.phone}
                                        </span>
                                    )}
                                    {supplier.email && (
                                        <span className="flex items-center gap-1 bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[11px] truncate max-w-[200px]">
                                            <EnvelopeIcon className="h-3 w-3" /> {supplier.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {suppliers.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                No hay proveedores registrados.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* MODAL CREAR/EDITAR */}
            <Dialog
                open={isModalOpen}
                handler={closeModal}
                size="sm"
                className="w-[90%] sm:w-full max-w-md mx-auto rounded-2xl p-0 overflow-hidden shadow-2xl"
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                            {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                        </Typography>
                    </DialogHeader>
                    <DialogBody className="grid gap-4 p-6 overflow-y-auto max-h-[70vh]">

                        <div>
                            <Input label="Nombre de la Empresa / Proveedor *" value={data.name} onChange={(e) => setData('name', e.target.value)} error={!!errors.name} color="indigo" />
                            {errors.name && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.name}</Typography>}
                        </div>

                        <div>
                            <Input label="RUC o Identificación" value={data.ruc_or_id} onChange={(e) => setData('ruc_or_id', e.target.value)} error={!!errors.ruc_or_id} color="indigo" />
                            {errors.ruc_or_id && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.ruc_or_id}</Typography>}
                        </div>

                        <div>
                            <Input label="Nombre del Contacto" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} error={!!errors.contact_name} color="indigo" />
                            {errors.contact_name && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.contact_name}</Typography>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input label="Teléfono" value={data.phone} onChange={(e) => setData('phone', e.target.value)} error={!!errors.phone} color="indigo" />
                                {errors.phone && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.phone}</Typography>}
                            </div>
                            <div>
                                <Input type="email" label="Correo Electrónico" value={data.email} onChange={(e) => setData('email', e.target.value)} error={!!errors.email} color="indigo" />
                                {errors.email && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.email}</Typography>}
                            </div>
                        </div>

                        <div>
                            <Textarea label="Dirección Física" value={data.address} onChange={(e) => setData('address', e.target.value)} error={!!errors.address} color="indigo" />
                            {errors.address && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.address}</Typography>}
                        </div>

                    </DialogBody>
                    <DialogFooter className="border-t border-gray-100 gap-3 px-6 py-4 bg-gray-50/50">
                        <Button variant="text" color="gray" onClick={closeModal} className="rounded-xl">Cancelar</Button>
                        <Button type="submit" color="indigo" disabled={processing} className="rounded-xl shadow-md shadow-indigo-100">
                            {processing ? 'Guardando...' : 'Guardar Proveedor'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={`al proveedor ${supplierToDelete?.name}`}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
