import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Typography, Button, Input, Select, Option, IconButton } from "@material-tailwind/react";
import { TrashIcon, PlusCircleIcon, LockClosedIcon, TruckIcon, UserGroupIcon, CubeIcon } from "@heroicons/react/24/outline";

export default function Create({ users, products, routes, onClose, initialData }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        driver_id: '',
        seller_id: '',
        helper_1_id: '',
        helper_2_id: '',
        delivery_route_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        notes: '',
        products: [{ product_id: '', quantity: 1 }]
    });

    // Validamos si el viaje se puede editar (solo si no hay data previa o si está "pending")
    const isReadOnly = initialData && initialData.status !== 'pending';

    useEffect(() => {
        if (initialData) {
            setData({
                driver_id: initialData.driver_id ? String(initialData.driver_id) : '',
                seller_id: initialData.seller_id ? String(initialData.seller_id) : '',
                helper_1_id: initialData.helper_1_id ? String(initialData.helper_1_id) : '',
                helper_2_id: initialData.helper_2_id ? String(initialData.helper_2_id) : '',
                delivery_route_id: initialData.delivery_route_id ? String(initialData.delivery_route_id) : '',
                date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
                status: initialData.status || 'pending',
                notes: initialData.notes || '',
                products: initialData.products && initialData.products.length > 0
                    ? initialData.products.map(p => ({
                        product_id: String(p.id || p.product_id || (p.pivot && p.pivot.product_id) || ''),
                        quantity: p.quantity || (p.pivot && p.pivot.quantity) || 1
                    }))
                    : [{ product_id: '', quantity: 1 }]
            });
        } else {
            reset();
        }
    }, [initialData]);

    const submit = (e) => {
        e.preventDefault();

        // Bloqueo extra por si acaso
        if (isReadOnly) return;

        if (initialData) {
            put(route('trips.update', initialData.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('trips.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        }
    };

    const addProductRow = () => setData('products', [...data.products, { product_id: '', quantity: 1 }]);

    const removeProductRow = (index) => {
        const newProducts = [...data.products];
        newProducts.splice(index, 1);
        setData('products', newProducts);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...data.products];
        newProducts[index][field] = value;
        setData('products', newProducts);
    };

    return (
        <form onSubmit={submit} className="space-y-5">

            {/* AVISO SI ESTÁ BLOQUEADO */}
            {isReadOnly && (
                <div className="bg-amber-50/80 p-4 rounded-xl text-amber-900 border border-amber-200/80 shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-amber-100/80 rounded-lg text-amber-700 shrink-0 mt-0.5">
                        <LockClosedIcon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                        <Typography variant="small" className="font-bold text-amber-900 text-sm">
                            Viaje Bloqueado
                        </Typography>
                        <Typography variant="small" className="text-amber-800 text-xs mt-0.5">
                            Este viaje está marcado como {initialData.status === 'active' ? 'Activo (En Ruta)' : 'Completado'}. Solo puedes consultar la información pero no realizar modificaciones.
                        </Typography>
                    </div>
                </div>
            )}

            {/* SECCIÓN 1: DATOS DEL VIAJE */}
            <div className="bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200/70 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                    <UserGroupIcon className="h-5 w-5 text-indigo-500" />
                    <Typography variant="h6" color="blue-gray" className="font-bold text-sm sm:text-base">
                        Detalles y Personal {initialData ? (isReadOnly ? "(Solo Lectura)" : "(Editando)") : ""}
                    </Typography>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Input
                            type="date"
                            label="Fecha *"
                            color="indigo"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            error={!!errors.date}
                            disabled={isReadOnly}
                            className="bg-white rounded-xl"
                        />
                        {errors.date && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.date}</Typography>}
                    </div>

                    <div>
                        <Select label="Estado" color="indigo" value={data.status} onChange={(val) => setData('status', val)} disabled={isReadOnly} className="bg-white rounded-xl">
                            <Option value="pending">Pendiente (En Bodega)</Option>
                            <Option disabled value="active">Activo (En Ruta)</Option>
                            <Option disabled value="completed">Completado</Option>
                        </Select>
                    </div>

                    <div>
                        <Select
                            label="Ruta *"
                            color="indigo"
                            value={data.delivery_route_id}
                            onChange={(val) => setData('delivery_route_id', val)}
                            error={!!errors.delivery_route_id}
                            disabled={isReadOnly}
                            className="bg-white rounded-xl"
                        >
                            {routes.map(route => (
                                <Option key={route.id} value={String(route.id)}>
                                    {route.route_name}
                                </Option>
                            ))}
                        </Select>
                        {errors.delivery_route_id && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.delivery_route_id}</Typography>}
                    </div>

                    <div>
                        <Select label="Chofer *" color="indigo" value={data.driver_id} onChange={(val) => setData('driver_id', val)} error={!!errors.driver_id} disabled={isReadOnly} className="bg-white rounded-xl">
                            {users.map(user => <Option key={user.id} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                        {errors.driver_id && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.driver_id}</Typography>}
                    </div>

                    <div>
                        <Select label="Vendedor *" color="indigo" value={data.seller_id} onChange={(val) => setData('seller_id', val)} error={!!errors.seller_id} disabled={isReadOnly} className="bg-white rounded-xl">
                            {users.map(user => <Option key={user.id} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                        {errors.seller_id && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.seller_id}</Typography>}
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: CARGA */}
            <div className="bg-slate-50/60 p-4 sm:p-5 rounded-2xl border border-slate-200/70 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
                    <CubeIcon className="h-5 w-5 text-indigo-500" />
                    <Typography variant="h6" color="blue-gray" className="font-bold text-sm sm:text-base">
                        Carga del Camión
                    </Typography>
                </div>

                <div className="space-y-3">
                    {data.products.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-3 rounded-xl border border-slate-200/70 shadow-sm">
                            <div className="flex-1">
                                <Select
                                    label="Producto"
                                    color="indigo"
                                    value={String(item.product_id)}
                                    onChange={(val) => handleProductChange(index, 'product_id', val)}
                                    error={!!errors[`products.${index}.product_id`]}
                                    disabled={isReadOnly}
                                >
                                    {products.map((p) => (
                                        <Option key={p.id} value={String(p.id)}>
                                            {p.name} - ({p.units_per_package > 1 ? `Paca x${p.units_per_package}` : 'Unidad'}) - Stock: {p.current_stock}
                                        </Option>
                                    ))}
                                </Select>
                                {errors[`products.${index}.product_id`] && (
                                    <Typography variant="small" color="red" className="mt-1 text-xs">
                                        {errors[`products.${index}.product_id`]}
                                    </Typography>
                                )}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-32 justify-between sm:justify-end">
                                <div className="w-full sm:w-28">
                                    <Input
                                        type="number"
                                        label="Cant."
                                        color="indigo"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                        error={!!errors[`products.${index}.quantity`]}
                                        disabled={isReadOnly}
                                    />
                                </div>
                                {!isReadOnly && (
                                    <IconButton
                                        variant="text"
                                        color="red"
                                        onClick={() => removeProductRow(index)}
                                        disabled={data.products.length === 1}
                                        className="rounded-xl shrink-0"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!isReadOnly && (
                    <div className="pt-2">
                        <Button
                            variant="outlined"
                            color="indigo"
                            size="sm"
                            onClick={addProductRow}
                            className="flex items-center gap-2 rounded-xl bg-white hover:bg-indigo-50/50"
                        >
                            <PlusCircleIcon className="h-4 w-4" /> Agregar Producto
                        </Button>
                    </div>
                )}

                {errors.products && (
                    <Typography variant="small" color="red" className="mt-1 font-medium text-xs">
                        {errors.products}
                    </Typography>
                )}
            </div>

            {/* BOTONES */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="text" color={isReadOnly ? "blue-gray" : "gray"} onClick={onClose} disabled={processing} className="rounded-xl">
                    {isReadOnly ? 'Cerrar' : 'Cancelar'}
                </Button>

                {!isReadOnly && (
                    <Button
                        color="indigo"
                        type="submit"
                        disabled={processing || data.products.length === 0}
                        className="rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2"
                    >
                        <TruckIcon className="h-4 w-4" />
                        {processing ? 'Guardando...' : (initialData ? 'Actualizar Despacho' : 'Guardar Despacho')}
                    </Button>
                )}
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-800 text-xs mt-4">
                    <p className="font-bold mb-1">Errores en el formulario:</p>
                    <pre className="overflow-x-auto">{JSON.stringify(errors, null, 2)}</pre>
                </div>
            )}
        </form>
    );
}
