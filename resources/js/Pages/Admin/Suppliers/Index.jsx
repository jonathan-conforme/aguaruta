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
import { PlusIcon, PencilIcon, TrashIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";
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
            header={<Typography variant="h5" color="blue-gray" className="flex items-center gap-2"><BuildingOffice2Icon className="h-6 w-6 text-indigo-500" /> Proveedores</Typography>}
        >
            <Head title="Proveedores" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Card className="h-full w-full shadow-sm border border-gray-200">
                    <div className="rounded-none p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">Lista de Proveedores</Typography>
                            <Typography color="gray" className="mt-1 font-normal text-sm">Gestiona los proveedores de tu empresa.</Typography>
                        </div>
                        <Button onClick={() => openModal()} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700" size="sm">
                            <PlusIcon strokeWidth={2} className="h-4 w-4" /> Nuevo Proveedor
                        </Button>
                    </div>

                    <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">{head}</Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.data.map((supplier, index) => {
                                    const isLast = index === suppliers.data.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-semibold">{supplier.name}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">{supplier.contact_name || '-'}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">{supplier.phone || '-'}</Typography>
                                                <Typography variant="small" color="gray" className="font-normal text-xs">{supplier.email || ''}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">{supplier.ruc_or_id || '-'}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex gap-2">
                                                    <IconButton variant="text" color="blue" onClick={() => openModal(supplier)}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>
                                                    <IconButton variant="text" color="red" onClick={() => openDeleteModal(supplier)}>
                                                        <TrashIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                </Card>
            </div>

            {/* MODAL CREAR/EDITAR */}
            <Dialog open={isModalOpen} handler={closeModal} size="sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100">
                        {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                    </DialogHeader>
                    <DialogBody className="grid gap-4 overflow-y-auto max-h-[70vh]">

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <DialogFooter className="border-t border-gray-100 gap-3">
                        <Button variant="text" color="gray" onClick={closeModal}>Cancelar</Button>
                        <Button type="submit" color="indigo" disabled={processing}>
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
