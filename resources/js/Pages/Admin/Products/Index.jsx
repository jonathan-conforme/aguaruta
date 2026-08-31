import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    Card, Typography, Button, CardBody, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Switch, Chip
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, CubeIcon, ArrowsRightLeftIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function Index({ product, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
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

    const TABLE_HEAD = ["Producto", "Presentación", "Precio", "Stock Llenos", "Stock Vacíos", "Retornable", "Estado", "Acciones"];
    const productList = product?.data || product || [];
    const categoryList = categories || [];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <CubeIcon className="h-6 w-6 text-indigo-500" /> Productos
                </Typography>
            }
        >
            <Head title="Productos" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-3 sm:py-0">
                <Card className="h-full w-full shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
                    {/* Header Principal */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold text-lg sm:text-xl">
                                Inventario de Productos
                            </Typography>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href={route('inventory-movements.index')} className="w-full sm:w-auto">
                                <Button variant="outlined" color="indigo" size="sm" className="w-full flex items-center justify-center gap-2 rounded-xl">
                                    <ArrowsRightLeftIcon strokeWidth={2} className="h-4 w-4" /> Historial
                                </Button>
                            </Link>
                            <Button onClick={() => openModal()} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100" size="sm">
                                <PlusIcon strokeWidth={2.5} className="h-4 w-4" /> Nuevo
                            </Button>
                        </div>
                    </div>

                    {/* VISTA ESCRITORIO (Tabla) */}
                    <CardBody className="hidden md:block overflow-x-auto px-0 pt-0 pb-2 bg-white">
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
                                {productList.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-bold">
                                                {prod.name}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Chip
                                                size="sm"
                                                variant="outlined"
                                                value={prod.units_per_package > 1 ? `Paca x${prod.units_per_package}` : 'Unidad'}
                                                color="indigo"
                                                className="inline-block rounded-lg"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" className="font-bold text-emerald-600">
                                                ${prod.price}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Chip size="sm" variant="ghost" value={prod.current_stock} color={prod.current_stock <= 5 ? "red" : "blue-gray"} className="rounded-lg" />
                                        </td>
                                        <td className="p-4">
                                            <Chip size="sm" variant="ghost" value={prod.empty_stock} color={prod.empty_stock <= 5 ? "red" : "blue-gray"} className="rounded-lg" />
                                        </td>
                                        <td className="p-4">
                                            {prod.requires_return ? <Chip size="sm" color="amber" value="Sí" className="rounded-lg" /> : <Typography variant="small" color="gray">No</Typography>}
                                        </td>
                                        <td className="p-4">
                                            <Chip size="sm" variant="ghost" value={prod.is_active ? 'Activo' : 'Inactivo'} color={prod.is_active ? 'green' : 'red'} className="rounded-lg" />
                                        </td>
                                        <td className="p-4">
                                            <IconButton variant="text" color="blue" onClick={() => openModal(prod)} className="rounded-lg hover:bg-blue-50">
                                                <PencilIcon className="h-4 w-4" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardBody>

                    {/* VISTA MÓVIL (Con Llenos y Vacíos SIEMPRE visibles) */}
                    <div className="block md:hidden p-3 space-y-3">
                        {productList.map((prod) => (
                            <div
                                key={prod.id}
                                onClick={() => openModal(prod)}
                                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all active:scale-[0.99]"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                                        <CubeIcon className="h-6 w-6" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 text-[15px] leading-tight">
                                            {prod.name}
                                        </span>
                                        <span className="text-xs text-slate-400 font-normal mt-0.5">
                                            {prod.units_per_package > 1 ? `Paca x${prod.units_per_package}` : 'Unidad suelta'}
                                            {prod.requires_return ? ' • Retornable' : ' • No retornable'}
                                        </span>

                                        {/* Muestra Llenos y Vacíos de manera incondicional */}
                                        <div className="mt-1 flex items-center gap-1.5 text-[13px]">
                                            <span className="font-extrabold text-blue-600">${parseFloat(prod.price).toFixed(2)}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="font-medium text-slate-600">
                                                Llenos: <strong className="text-slate-900">{prod.current_stock}</strong>
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="font-medium text-slate-600">
                                                Vacíos: <strong className="text-slate-900">{prod.empty_stock}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <IconButton variant="text" color="blue" size="sm" onClick={(e) => { e.stopPropagation(); openModal(prod); }} className="rounded-full shrink-0">
                                    <PencilIcon className="h-4 w-4 text-slate-400" />
                                </IconButton>
                            </div>
                        ))}

                        {productList.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm bg-white rounded-2xl">
                                No hay productos registrados.
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* MODAL CREAR / EDITAR */}
            <Dialog
                open={isModalOpen}
                handler={closeModal}
                size="sm"
                className="w-[95%] sm:w-full max-w-lg mx-auto rounded-2xl p-0 overflow-hidden shadow-2xl"
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/50">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </Typography>
                    </DialogHeader>

                    <DialogBody className="grid gap-4 p-5 overflow-y-auto max-h-[75vh]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input label="Nombre (Ej: Agua Dasani) *" value={data.name} onChange={(e) => setData('name', e.target.value)} error={!!errors.name} color="indigo" />
                                {errors.name && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.name}</Typography>}
                            </div>

                            <div>
                                <Input
                                    type="number"
                                    min="1"
                                    label="Unidades por paquete"
                                    value={data.units_per_package}
                                    onChange={(e) => setData('units_per_package', e.target.value)}
                                    color="indigo"
                                    error={!!errors.units_per_package}
                                />
                                <Typography variant="small" color="gray" className="mt-1 text-[11px]">
                                    1 = Unidad, 12 = Paca x12, 24 = Paca x24
                                </Typography>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    type="number"
                                    step="0.01"
                                    label={data.units_per_package > 1 ? `Precio paca x${data.units_per_package}` : 'Precio por unidad'}
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    error={!!errors.price}
                                    color="indigo"
                                    icon={<span className="text-gray-500">$</span>}
                                />
                                {errors.price && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.price}</Typography>}
                            </div>

                            <div>
                                {editingProduct ? (
                                    <div>
                                        <Input type="number" label={`Stock Llenos (${data.units_per_package})`} value={data.current_stock} disabled color="gray" icon={<LockClosedIcon className="h-4 w-4 text-gray-400" />} />
                                        <Typography variant="small" color="blue-gray" className="mt-1 text-[10px] opacity-70">
                                            Modifica el stock desde Historial.
                                        </Typography>
                                    </div>
                                ) : (
                                    <Input disabled type="number" label={`Stock Llenos (${data.units_per_package})`} value={data.current_stock} onChange={(e) => setData('current_stock', e.target.value)} error={!!errors.current_stock} color="indigo" />
                                )}
                            </div>
                        </div>

                        {!editingProduct && (
                            <div className="w-full sm:w-1/2">
                                <Input disabled type="number" label={`Stock Vacíos (${data.units_per_package})`} value={data.empty_stock} onChange={(e) => setData('empty_stock', e.target.value)} error={!!errors.empty_stock} color="indigo" />
                            </div>
                        )}

                        {categoryList.length > 0 && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 p-3 border-b border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                        Precios Especiales por Categoría
                                    </Typography>
                                </div>
                                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div className="flex flex-col gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Switch
                                id="requires_return"
                                label={<Typography color="blue-gray" className="font-medium text-sm">Requiere retornar envase</Typography>}
                                checked={data.requires_return}
                                onChange={(e) => setData('requires_return', e.target.checked)}
                                color="indigo"
                            />
                            <hr className="border-gray-200" />
                            <Switch
                                id="is_active"
                                label={<Typography color="blue-gray" className="font-medium text-sm">Producto Activo</Typography>}
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                color="green"
                            />
                        </div>
                    </DialogBody>

                    <DialogFooter className="border-t border-gray-100 gap-3 px-5 py-4 bg-gray-50/50">
                        <Button variant="text" color="gray" onClick={closeModal} className="rounded-xl">Cancelar</Button>
                        <Button type="submit" color="indigo" disabled={processing} className="rounded-xl shadow-md shadow-indigo-100">
                            {processing ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
