import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

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
    Select,
    Option,
    Textarea,
    Chip,
} from "@material-tailwind/react";

import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    IdentificationIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    BeakerIcon,
} from "@heroicons/react/24/solid";
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import StatCard from '@/Components/UI/StatCard';

export default function Index({ customers, categories, routes, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customersToDelete, setCustomersToDelete] = useState(null);
    const isFirstRender = useRef(true);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        identification: '',
        customer_category_id: '',
        phone: '',
        address: '',
        bottle_debt: 0,
        delivery_route_id: '',
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            if (search.length > 0 && search.length < 2) return;

            router.get(
                route('customers.index'),
                { search: search || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const openModal = (customer = null) => {
        clearErrors();

        if (customer) {
            setEditingCustomer(customer);
            setData({
                name: customer.name,
                identification: customer.identification || '',
                customer_category_id: String(customer.customer_category_id),
                phone: customer.phone || '',
                address: customer.address || '',
                bottle_debt: customer.bottle_debt || 0,
                delivery_route_id: String(customer.delivery_route_id),
            });
        } else {
            setEditingCustomer(null);
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

        if (editingCustomer) {
            put(route('customers.update', editingCustomer.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('customers.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handlePageChange = (url) => {
        if (!url) return;

        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const openDeleteModal = (customer) => {
        setCustomersToDelete(customer);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCustomersToDelete(null);
    };

    const confirmDelete = () => {
        if (!customersToDelete) return;

        destroy(route('customers.destroy', customersToDelete.id), {
            onSuccess: () => closeDeleteModal(),
        });
    };

    const TABLE_HEAD = ["Cliente", "Identificación", "Teléfono", "Envases prestados", "Ruta", "Acciones"];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2 font-bold text-gray-800">
                    <UserIcon className="h-6 w-6 text-indigo-500" />
                    Clientes
                </Typography>
            }
        >
            <Head title="Clientes" />

            <div className="py-6 space-y-6 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* TARJETAS DE ESTADÍSTICAS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Clientes registrados"
                            value={stats.total}
                            icon={UsersIcon}
                            colorTheme="blue"
                            description="Total de clientes"
                        />
                        <StatCard
                            title="Clientes con deuda"
                            value={stats.with_debt}
                            icon={ExclamationTriangleIcon}
                            colorTheme="red"
                            description="Tienen envases pendientes"
                        />
                        <StatCard
                            title="Envases pendientes"
                            value={stats.bottle_debt}
                            icon={BeakerIcon}
                            colorTheme="purple"
                            description="Total de envases adeudados"
                        />
                    </div>

                    <Card className="shadow-sm border border-gray-200 overflow-hidden">

                        {/* CABECERA Y BUSCADOR */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <Typography variant="h5" className="font-bold text-gray-900">
                                    Lista de Clientes
                                </Typography>
                                <Typography className="text-xs sm:text-sm text-gray-500">
                                    Gestiona tus clientes y rutas de entrega
                                </Typography>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <div className="w-full sm:w-64">
                                    <Input
                                        label="Buscar cliente..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        color="indigo"
                                    />
                                </div>
                                <Button
                                    onClick={() => openModal()}
                                    className="flex items-center justify-center gap-2 bg-indigo-600 w-full sm:w-auto shrink-0"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Nuevo Cliente
                                </Button>
                            </div>
                        </div>

                        {/* 📱 VISTA MÓVIL ESTILO TARJETAS */}
                        <div className="block md:hidden p-3 space-y-3 bg-gray-50/30">
                            {customers.data.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm space-y-3"
                                >
                                    {/* CABECERA DE LA TARJETA */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-0.5 max-w-[70%]">
                                            <span className="text-[10px] font-medium text-gray-400 block uppercase tracking-wider">
                                                Cliente
                                            </span>
                                            <Typography variant="h6" color="blue-gray" className="font-bold leading-tight break-words">
                                                {customer.name}
                                            </Typography>
                                            {customer.address && (
                                                <Typography className="text-[11px] text-gray-500 line-clamp-1">
                                                    📍 {customer.address}
                                                </Typography>
                                            )}
                                        </div>

                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={customer.category?.name || 'Sin categoría'}
                                            color="blue"
                                            className="text-[10px] font-bold capitalize shrink-0"
                                        />
                                    </div>

                                    {/* GRID ADAPTATIVO 2x2 */}
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-left">
                                        {/* COLUMNA 1: CÉDULA / RUC */}
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] text-gray-400 block font-medium">Identificación</span>
                                            <span className="text-xs font-bold text-gray-800 font-mono block break-all">
                                                {customer.identification || '-'}
                                            </span>
                                        </div>

                                        {/* COLUMNA 2: TELÉFONO */}
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] text-gray-400 block font-medium">Teléfono</span>
                                            <span className="text-xs font-bold text-gray-800 block break-all">
                                                {customer.phone || '-'}
                                            </span>
                                        </div>

                                        {/* COLUMNA 3: ENVASES Y RUTA */}
                                        <div className="space-y-0.5 pt-1">
                                            <span className="text-[10px] text-gray-400 block font-medium">Deuda Envases / Ruta</span>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-xs font-bold ${customer.bottle_debt > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                     {customer.bottle_debt || 0} envases
                                                </span>
                                                <span className="text-[10px] font-medium text-indigo-600 truncate">
                                                     {customer.delivery_route?.route_name || 'Sin Ruta'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* COLUMNA 4: ACCIONES */}
                                        <div className="space-y-0.5 pt-1">
                                            <span className="text-[10px] text-gray-400 block font-medium">Acciones</span>
                                            <div className="flex items-center gap-1 pt-0.5">
                                                <button
                                                    onClick={() => openModal(customer)}
                                                    className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(customer)}
                                                    className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {customers.data.length === 0 && (
                                <div className="p-6 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 text-sm">
                                    No se encontraron clientes registrados.
                                </div>
                            )}
                        </div>

                        {/* 💻 VISTA ESCRITORIO (TABLA TRADICIONAL) */}
                        <CardBody className="hidden md:block px-0 py-0 overflow-x-auto">
                            <table className="w-full text-left table-auto">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map(head => (
                                            <th key={head} className="p-4 bg-gray-50/80 border-b border-gray-100">
                                                <Typography variant="small" className="font-bold text-gray-600">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {customers.data.map((customer, index) => {
                                        const isLast = index === customers.data.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                                        return (
                                            <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">

                                                <td className={classes}>
                                                    <Typography className="font-semibold text-gray-900 text-sm">
                                                        {customer.name}
                                                    </Typography>
                                                    <Typography variant="small" className="text-indigo-600 text-xs font-medium">
                                                        {customer.category?.name || 'Sin categoría'}
                                                    </Typography>
                                                </td>

                                                <td className={classes}>
                                                    <span className="font-mono text-sm text-gray-700">
                                                        {customer.identification || '-'}
                                                    </span>
                                                </td>

                                                <td className={classes}>
                                                    <span className="text-sm text-gray-700">
                                                        {customer.phone || '-'}
                                                    </span>
                                                </td>

                                                <td className={classes}>
                                                    <span className={`text-sm font-semibold ${customer.bottle_debt > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {customer.bottle_debt || '0'}
                                                    </span>
                                                </td>

                                                <td className={classes}>
                                                    <span className="text-sm text-gray-700">
                                                        {customer.delivery_route?.route_name || '-'}
                                                    </span>
                                                </td>

                                                <td className={classes}>
                                                    <div className="flex gap-1">
                                                        <IconButton color="blue" variant="text" onClick={() => openModal(customer)}>
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>

                                                        <IconButton variant="text" color="red" onClick={() => openDeleteModal(customer)}>
                                                            <TrashIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}

                                    {customers.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                                                No se encontraron clientes registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>

                        {/* BARRA DE PAGINACIÓN */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-4 bg-white">
                            <Typography variant="small" color="gray" className="font-normal text-center sm:text-left">
                                Página <strong className="text-gray-900">{customers.current_page}</strong> de{" "}
                                <strong className="text-gray-900">{customers.last_page}</strong>
                            </Typography>

                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(customers.prev_page_url)}
                                    disabled={!customers.prev_page_url}
                                >
                                    <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" /> <span className="hidden sm:inline">Anterior</span>
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(customers.next_page_url)}
                                    disabled={!customers.next_page_url}
                                >
                                    <span className="hidden sm:inline">Siguiente</span> <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* MODAL NUEVO / EDITAR CLIENTE */}
            <Dialog open={isModalOpen} handler={closeModal} size="sm">
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </DialogHeader>

                    <DialogBody className="grid gap-4 max-h-[70vh] overflow-y-auto">

                        <div>
                            <Input
                                label="Nombre *"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                icon={<UserIcon className="h-4 w-4" />}
                                color="indigo"
                            />
                            {errors.name && <Typography color="red" className="text-xs mt-1">{errors.name}</Typography>}
                        </div>

                        <div>
                            <Input
                                label="Identificación (Cédula / RUC)"
                                value={data.identification}
                                onChange={(e) => setData('identification', e.target.value)}
                                icon={<IdentificationIcon className="h-4 w-4" />}
                                color="indigo"
                            />
                            {errors.identification && <Typography color="red" className="text-xs mt-1">{errors.identification}</Typography>}
                        </div>

                        <Select
                            label="Categoría"
                            value={data.customer_category_id}
                            onChange={(val) => setData('customer_category_id', val)}
                            color="indigo"
                        >
                            {categories.map(cat => (
                                <Option key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>

                        <div>
                            <Select
                                label="Ruta"
                                value={data.delivery_route_id}
                                onChange={(val) => setData('delivery_route_id', val)}
                                color="indigo"
                            >
                                {routes.map(r => (
                                    <Option key={r.id} value={String(r.id)}>
                                        {r.route_name}
                                    </Option>
                                ))}
                            </Select>
                            {errors.delivery_route_id && <Typography color="red" className="text-xs mt-1">{errors.delivery_route_id}</Typography>}
                        </div>

                        <Input
                            label="Teléfono"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            color="indigo"
                        />

                        <Textarea
                            label="Dirección"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            color="indigo"
                        />

                        <Input
                            type="number"
                            label="Deuda Envases"
                            value={data.bottle_debt}
                            onChange={(e) => setData('bottle_debt', e.target.value)}
                            color="indigo"
                        />

                    </DialogBody>

                    <DialogFooter className="gap-2">
                        <Button variant="text" onClick={closeModal}>
                            Cancelar
                        </Button>

                        <Button type="submit" color="indigo" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Cliente'}
                        </Button>
                    </DialogFooter>

                </form>
            </Dialog>

            {/* MODAL ELIMINAR */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={`al cliente ${customersToDelete?.name}`}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
