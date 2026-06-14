import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Typography, Button, Input, Select, Option, IconButton, Card } from "@material-tailwind/react";
import { TrashIcon, PlusCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";

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
        <form onSubmit={submit} className="space-y-6">

            {/* AVISO SI ESTÁ BLOQUEADO */}
            {isReadOnly && (
               <div className="bg-orange-100 p-4 rounded-lg text-orange-900 border border-orange-200 mb-6">
    <div className="flex items-center gap-2 mb-1">
        <LockClosedIcon className="h-5 w-5" strokeWidth={2} />
        <Typography variant="small" className="font-bold">
            Viaje Bloqueado
        </Typography>
    </div>
    <Typography variant="small">
        Este viaje está marcado como {initialData.status === 'active' ? 'Activo (En Ruta)' : 'Completado'}. Solo puedes ver los detalles, no editarlos.
    </Typography>
</div>
            )}

            {/* SECCIÓN 1: DATOS DEL VIAJE */}
            <Card className="p-6 border border-gray-200 shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-6">
                    Detalles y Personal {initialData ? (isReadOnly ? "(Solo Lectura)" : "(Editando)") : ""}
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <Input
                            type="date"
                            label="Fecha *"
                            color="indigo"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            error={!!errors.date}
                            disabled={isReadOnly}
                        />
                        {errors.date && <Typography variant="small" color="red" className="mt-1">{errors.date}</Typography>}
                    </div>

                    <div>
                        <Select label="Estado" color="indigo" value={data.status} onChange={(val) => setData('status', val)} disabled={isReadOnly}>
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
                        >
                            {routes.map(route => (
                                <Option key={route.id} value={String(route.id)}>
                                    {route.route_name}
                                </Option>
                            ))}
                        </Select>
                        {errors.delivery_route_id && <Typography variant="small" color="red" className="mt-1">{errors.delivery_route_id}</Typography>}
                    </div>

                    <div>
                        <Select label="Chofer *" color="indigo" value={data.driver_id} onChange={(val) => setData('driver_id', val)} error={!!errors.driver_id} disabled={isReadOnly}>
                            {users.map(user => <Option key={user.id} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                        {errors.driver_id && <Typography variant="small" color="red" className="mt-1">{errors.driver_id}</Typography>}
                    </div>

                    <div>
                        <Select label="Vendedor *" color="indigo" value={data.seller_id} onChange={(val) => setData('seller_id', val)} error={!!errors.seller_id} disabled={isReadOnly}>
                            {users.map(user => <Option key={user.id} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                        {errors.seller_id && <Typography variant="small" color="red" className="mt-1">{errors.seller_id}</Typography>}
                    </div>

                    <div>
                        <Select label="Ayudante 1" color="indigo" value={data.helper_1_id} onChange={(val) => setData('helper_1_id', val)} disabled={isReadOnly}>
                            <Option value="">Ninguno</Option>
                            {users.map(user => <Option key={`h1-${user.id}`} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                    </div>

                    <div>
                        <Select label="Ayudante 2" color="indigo" value={data.helper_2_id} onChange={(val) => setData('helper_2_id', val)} disabled={isReadOnly}>
                            <Option value="">Ninguno</Option>
                            {users.map(user => <Option key={`h2-${user.id}`} value={String(user.id)}>{user.name}</Option>)}
                        </Select>
                    </div>
                </div>
            </Card>

            {/* SECCIÓN 2: CARGA */}
            <Card className="p-6 border border-gray-200 shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                    Carga del Camión
                </Typography>

                {data.products.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
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
                                        {p.name} -
                                        ({p.units_per_package > 1
                                            ? `Paca x${p.units_per_package}`
                                            : 'Unidad'
                                        })
                                        - Stock: {p.current_stock}
                                    </Option>
                                ))}
                            </Select>
                            {errors[`products.${index}.product_id`] && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors[`products.${index}.product_id`]}
                                </Typography>
                            )}
                        </div>
                        <div className="w-24">
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
                            <IconButton variant="text" color="red" onClick={() => removeProductRow(index)} disabled={data.products.length === 1}>
                                <TrashIcon className="h-5 w-5" />
                            </IconButton>
                        )}
                    </div>
                ))}

                {!isReadOnly && (
                    <div className="flex items-center mt-4 border-t pt-4">
                        <Button variant="text" color="indigo" onClick={addProductRow} className="flex items-center gap-2">
                            <PlusCircleIcon className="h-5 w-5" /> Agregar Producto
                        </Button>
                    </div>
                )}

                {errors.products && (
                    <Typography variant="small" color="red" className="mt-2 font-medium">
                        {errors.products}
                    </Typography>
                )}
            </Card>

            {/* BOTONES */}
            <div className="flex items-center justify-end gap-4">
                <Button variant="text" color={isReadOnly ? "blue-gray" : "red"} onClick={onClose} disabled={processing}>
                    {isReadOnly ? 'Cerrar' : 'Cancelar'}
                </Button>
                
                {!isReadOnly && (
                    <Button color="indigo" type="submit" disabled={processing || data.products.length === 0}>
                        {processing ? 'Guardando...' : (initialData ? 'Actualizar Despacho' : 'Guardar Despacho')}
                    </Button>
                )}
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-100 p-4 rounded text-red-800 text-xs mb-4 mt-4">
                    <p className="font-bold">Errores ocultos detectados:</p>
                    <pre>{JSON.stringify(errors, null, 2)}</pre>
                </div>
            )}
        </form>
    );
}