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
    Select,
    Option,
    Textarea
} from "@material-tailwind/react";

import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    IdentificationIcon,
    MapPinIcon
} from "@heroicons/react/24/solid";

export default function Index({ customers, categories, routes }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        identification: '',
        customer_category_id: '',
        phone: '',
        address: '',
        bottle_debt: 0,
        delivery_route_id: '',
    });

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

    const handleDelete = (id) => {
        if (confirm('¿Eliminar cliente?')) {
            destroy(route('customers.destroy', id));
        }
    };

    const TABLE_HEAD = ["Cliente", "Identificación", "Teléfono", "Envases prestados", "Ruta",  "Acciones"];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-indigo-500" />
                    Clientes
                </Typography>
            }
        >
            <Head title="Clientes" />

            <div className="max-w-7xl mx-auto">
                <Card className="shadow-sm border border-gray-200">

                    {/* HEADER */}
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <Typography variant="h5">Lista de Clientes</Typography>
                            <Typography className="text-sm text-gray-500">
                                Gestiona tus clientes y rutas
                            </Typography>
                        </div>

                        <Button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 bg-indigo-600"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </div>

                    {/* TABLA */}
                    <CardBody className="px-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map(head => (
                                        <th key={head} className="p-4 bg-gray-50">
                                            <Typography variant="small">{head}</Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {customers.map((c, index) => {
                                    const isLast = index === customers.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b";

                                    return (
                                        <tr key={c.id} className="hover:bg-gray-50">

                                            <td className={classes}>
                                                <Typography className="font-semibold">
                                                    {c.name}
                                                </Typography>
                                                <Typography variant="small" color="blue">
                                                    {c.category?.name}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                {c.identification || '-'}
                                            </td>

                                            <td className={classes}>
                                                {c.phone || '-'}
                                            </td>


                                             <td className={classes}>
                                                {c.bottle_debt || 'Ninguno'}
                                            </td>
                                            <td className={classes}>
                                                {c.delivery_route?.route_name || '-'}
                                            </td>

                                            <td className={classes}>
                                                <div className="flex gap-2">
                                                    <IconButton color="blue" variant="text" onClick={() => openModal(c)}>
                                                        <PencilIcon className="h-4 w-4" />
                                                    </IconButton>

                                                    <IconButton color="red" variant="text" onClick={() => handleDelete(c.id)}>
                                                        <TrashIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>

            {/* MODAL */}
            <Dialog open={isModalOpen} handler={closeModal} size="sm">
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </DialogHeader>

                    <DialogBody className="grid gap-4">

                        <Input
                            label="Nombre *"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            icon={<UserIcon className="h-4 w-4" />}
                        />
                        {errors.name && <Typography color="red" className="text-xs">{errors.name}</Typography>}

                        <Input
                            label="Identificación (Cédula / RUC)"
                            value={data.identification}
                            onChange={(e) => setData('identification', e.target.value)}
                            icon={<IdentificationIcon className="h-4 w-4" />}
                        />
                        {errors.identification && <Typography color="red" className="text-xs">{errors.identification}</Typography>}

                        <Select
                            label="Categoría"
                            value={data.customer_category_id}
                            onChange={(val) => setData('customer_category_id', val)}
                        >
                            {categories.map(cat => (
                                <Option key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            label="Ruta"
                            value={data.delivery_route_id}
                            onChange={(val) => setData('delivery_route_id', val)}
                        >
                            {routes.map(r => (
                                <Option key={r.id} value={String(r.id)}>
                                    {r.route_name}
                                </Option>
                            ))}
                        </Select>
                        {errors.delivery_route_id && <Typography color="red" className="text-xs">{errors.delivery_route_id}</Typography>}

                        <Input
                            label="Teléfono"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />

                        <Textarea
                            label="Dirección"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />

                        <Input
                            type="number"
                            label="Deuda Envases"
                            value={data.bottle_debt}
                            onChange={(e) => setData('bottle_debt', e.target.value)}
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
        </AuthenticatedLayout>
    );
}