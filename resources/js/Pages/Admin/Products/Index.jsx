import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import {
    Card, Typography, Button, CardBody, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Switch, Chip, Select, Option
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, CubeIcon, ArrowsRightLeftIcon, LockClosedIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Index({ product, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);


    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        units_per_package: 1,
        price: '',
        current_stock: 0,
        empty_stock: 0,
        requires_return: false,
        is_active: true,
        category_prices: {},
    });

    const openModal = (product = null) => {
        clearErrors();

        if (product) {
            setEditingProduct(product);

            let existingPrices = {};
            if (product.customer_categories) {
                product.customer_categories.forEach(cat => {
                    existingPrices[cat.id] = cat.pivot.price;
                });
            }

            setData({
                name: product.name,
                units_per_package: product.units_per_package || 1,
                price: product.price,
                current_stock: product.current_stock,
                empty_stock: product.empty_stock,
                requires_return: product.requires_return,
                is_active: product.is_active,
                category_prices: existingPrices,
            });
        } else {
            setEditingProduct(null);
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
        if (editingProduct) {
            put(route('products.update', editingProduct.id), { onSuccess: () => closeModal() });
        } else {
            post(route('products.store'), { onSuccess: () => closeModal() });
        }
    };



    const handleCategoryPriceChange = (categoryId, value) => {
        setData('category_prices', {
            ...data.category_prices,
            [categoryId]: value
        });
    };


// ... dentro de tu componente Index:
const handlePageChange = (url) => {
    if (url) {
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    }
};

    const TABLE_HEAD = ["Producto", "Presentación", "Precio", "Stock Llenos", "Stock Vacíos", "Retornable", "Estado", "Acciones"];
    const productList = product?.data || product || [];
    const categoryList = categories || [];

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" color="blue-gray" className="flex items-center gap-2"><CubeIcon className="h-6 w-6 text-indigo-500" /> Productos</Typography>}
        >
            <Head title="Productos" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Card className="h-full w-full shadow-sm border border-gray-200">
                    <div className="rounded-none p-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <Typography variant="h5" color="blue-gray">Inventario de Productos</Typography>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={route('inventory-movements.index')}>
                                <Button variant="outlined" color="indigo" size="sm" className="flex items-center gap-2">
                                    <ArrowsRightLeftIcon strokeWidth={2} className="h-4 w-4" /> Historial
                                </Button>
                            </Link>
                            <Button onClick={() => openModal()} className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700" size="sm">
                                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Nuevo Producto
                            </Button>
                        </div>
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
                                {productList.map((product) => {
                                    const classes = "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-semibold">{product.name}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <Chip
                                                    size="sm"
                                                    variant="outlined"
                                                    value={
                                                        product.units_per_package > 1
                                                            ? `Paca x${product.units_per_package}`
                                                            : 'Unidad'
                                                    }
                                                    color="indigo"
                                                    className="inline-block"
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-bold text-green-600">${product.price}</Typography>
                                            </td>
                                            <td className={classes}>
                                                <Chip size="sm" variant="ghost" value={product.current_stock} color={product.current_stock <= 5 ? "red" : "blue-gray"} />
                                            </td>
                                            <td className={classes}>
                                                <Chip size="sm" variant="ghost" value={product.empty_stock} color={product.empty_stock <= 5 ? "red" : "blue-gray"} />
                                            </td>
                                            <td className={classes}>
                                                {product.requires_return ? <Chip size="sm" color="amber" value="Sí" /> : <Typography variant="small" color="gray">No</Typography>}
                                            </td>
                                            <td className={classes}>
                                                <Chip size="sm" variant="ghost" value={product.is_active ? 'Activo' : 'Inactivo'} color={product.is_active ? 'green' : 'red'} />
                                            </td>
                                            <td className={classes}>
                                                <div className="flex gap-2">
                                                    <IconButton variant="text" color="blue" onClick={() => openModal(product)}>
                                                        <PencilIcon className="h-4 w-4" />
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

            <Dialog open={isModalOpen} handler={closeModal} size="md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100">
                        {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </DialogHeader>
                    <DialogBody className="grid gap-4 overflow-y-auto max-h-[75vh] pr-2">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-1">
                                <Input label="Nombre (Ej: Agua Dasani) *" value={data.name} onChange={(e) => setData('name', e.target.value)} error={!!errors.name} color="indigo" />
                                {errors.name && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.name}</Typography>}
                            </div>

                            {/* SELECTOR DE PRESENTACIÓN */}
                            <div className="sm:col-span-1">
                                <Input
                                    type="number"
                                    min="1"
                                    label="Unidades por paquete"
                                    value={data.units_per_package}
                                    onChange={(e) =>
                                        setData('units_per_package', e.target.value)
                                    }
                                    color="indigo"
                                    error={!!errors.units_per_package}
                                />

                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="mt-1 text-xs"
                                >
                                    Ejemplo:
                                    1 = Unidad suelta,
                                    12 = Paca x12,
                                    24 = Paca x24
                                </Typography>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input type="number" step="0.01" label={
                                    data.units_per_package > 1
                                        ? `Precio por paquete x${data.units_per_package}`
                                        : 'Precio por unidad'
                                } value={data.price} onChange={(e) => setData('price', e.target.value)} error={!!errors.price} color="indigo" icon={<span className="text-gray-500">$</span>} />
                                {errors.price && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.price}</Typography>}
                            </div>

                            <div>
                                {editingProduct ? (
                                    <div className="relative">
                                        <Input type="number" label={`Stock Actual (${data.units_per_package})`} value={data.current_stock} disabled color="gray" icon={<LockClosedIcon className="h-4 w-4 text-gray-400" />} />
                                        <Typography variant="small" color="blue-gray" className="mt-1 text-[11px] flex items-center gap-1 opacity-70">
                                            Modifica el stock desde Historial.
                                        </Typography>
                                    </div>
                                ) : (
                                    <Input disabled type="number" label={`Stock Inicial (${data.units_per_package})`} value={data.current_stock} onChange={(e) => setData('current_stock', e.target.value)} error={!!errors.current_stock} color="indigo" />
                                )}
                            </div>
                        </div>

                        {!editingProduct && (
                            <div className="w-full md:w-1/2">
                                <Input disabled type="number" label={`Stock Vacíos (${data.units_per_package})`} value={data.empty_stock} onChange={(e) => setData('empty_stock', e.target.value)} error={!!errors.empty_stock} color="indigo" />
                            </div>
                        )}

                        {categoryList.length > 0 && (
                            <div className="mt-2 border border-blue-gray-100 rounded-lg overflow-hidden">
                                <div className="bg-blue-gray-50 p-3 border-b border-blue-gray-100">
                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                        Precios Especiales por Categoría
                                    </Typography>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {categoryList.map((category) => (
                                        <div key={category.id}>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                label={`Precio: ${category.name}`}
                                                value={data.category_prices[category.id] || ''}
                                                onChange={(e) => handleCategoryPriceChange(category.id, e.target.value)}
                                                color="indigo"
                                                icon={<span className="text-gray-500">$</span>}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <Switch
                                id="requires_return"
                                label={<Typography color="blue-gray" className="font-medium">Requiere retornar envase</Typography>}
                                checked={data.requires_return}
                                onChange={(e) => setData('requires_return', e.target.checked)}
                                color="indigo"
                            />
                            <hr className="border-gray-200" />
                            <Switch
                                id="is_active"
                                label={<Typography color="blue-gray" className="font-medium">Producto Activo</Typography>}
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                color="green"
                            />
                        </div>

                    </DialogBody>
                    <DialogFooter className="border-t border-gray-100 gap-3">
                        <Button variant="text" color="gray" onClick={closeModal}>Cancelar</Button>
                        <Button type="submit" color="indigo" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
