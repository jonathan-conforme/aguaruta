import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, Typography, Button, Input, Select, Option, Textarea, IconButton } from "@material-tailwind/react";
import { TrashIcon, PlusIcon, ArrowLeftIcon, CubeIcon, BanknotesIcon } from "@heroicons/react/24/solid";

export default function Create({ suppliers = [], products = [] }) {
    // Tipo de compra a nivel global del formulario (product u expense)
    const [purchaseType, setPurchaseType] = useState('product');

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        invoice_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: '',
        total_amount: '0.00',
        items: [{ product_id: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }]
    });

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
        setData(prevData => ({ ...prevData, items, total_amount: total.toFixed(2) }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        // Auto-calcular precio unitario cuando cambian cantidad o subtotal
        if (field === 'quantity' || field === 'subtotal') {
            const quantity = parseFloat(newItems[index].quantity || 0);
            const subtotal = parseFloat(newItems[index].subtotal || 0);

            if (quantity > 0) {
                newItems[index].unit_price = (subtotal / quantity).toFixed(2);
            }
        }

        calculateTotal(newItems);
    };

    const handleTypeSwitch = (type) => {
        setPurchaseType(type);
        // Reiniciar ítems para no mezclar esquemas de datos inesperadamente
        const resetItems = [{ product_id: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }];
        setData(prev => ({ ...prev, items: resetItems, total_amount: '0.00' }));
    };

    const addItem = () => {
        calculateTotal([...data.items, { product_id: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        calculateTotal(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Incluimos el purchaseType en cada ítem al enviar
        const formattedItems = data.items.map(item => ({
            ...item,
            type: purchaseType
        }));

        post(route('purchases.store'), {
            data: { ...data, items: formattedItems }
        });
    };

    return (
        <AuthenticatedLayout header={<Typography variant="h5" color="blue-gray">Registrar Compra / Egreso</Typography>}>
            <Head title="Nueva Compra" />

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* DATOS DE CABECERA */}
                    <Card className="p-6 border border-gray-200/80 shadow-sm rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <Typography variant="h6" color="blue-gray">Datos del Comprobante</Typography>
                                <Typography className="text-xs text-gray-500">Información del proveedor y la fecha</Typography>
                            </div>
                            <Link href={route('purchases.index')}>
                                <Button variant="text" size="sm" className="flex items-center gap-2 text-gray-600">
                                    <ArrowLeftIcon className="h-4 w-4" /> Volver
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <Select 
                                    label="Proveedor" 
                                    value={data.supplier_id} 
                                    onChange={(val) => setData('supplier_id', val)} 
                                    error={!!errors.supplier_id}
                                >
                                    {suppliers.map(s => <Option key={s.id} value={String(s.id)}>{s.name}</Option>)}
                                </Select>
                            </div>
                            <div>
                                <Input 
                                    label="N° Factura / Comprobante" 
                                    value={data.invoice_number} 
                                    onChange={e => setData('invoice_number', e.target.value)} 
                                />
                            </div>
                            <div>
                                <Input 
                                    type="date" 
                                    label="Fecha de Compra" 
                                    value={data.purchase_date} 
                                    onChange={e => setData('purchase_date', e.target.value)} 
                                    error={!!errors.purchase_date} 
                                />
                            </div>
                        </div>
                    </Card>

                    {/* SELECCIÓN DEL TIPO DE REGISTRO (TABS DE UX) */}
                    <Card className="p-6 border border-gray-200/80 shadow-sm rounded-xl space-y-6">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                            <div>
                                <Typography variant="h6" color="blue-gray">Detalle del Registro</Typography>
                                <Typography className="text-xs text-gray-500">¿Qué tipo de egreso estás registrando?</Typography>
                            </div>

                            {/* TOGGLE PESTAÑAS */}
                            <div className="inline-flex p-1 bg-gray-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => handleTypeSwitch('product')}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        purchaseType === 'product'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <CubeIcon className="w-4 h-4" /> Productos (Inventario)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeSwitch('expense')}
                                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        purchaseType === 'expense'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                    }`}
                                >
                                    <BanknotesIcon className="w-4 h-4" /> Gastos / Operación
                                </button>
                            </div>
                        </div>

                        {/* LISTADO DE FILAS DE COMPRA */}
                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-center gap-4 p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                                    
                                    {/* CAMPO DINÁMICO SEGÚN EL TIPO */}
                                    <div className="w-full md:flex-1">
                                        {purchaseType === 'product' ? (
                                            <Select
                                                label="Seleccionar Producto"
                                                value={item.product_id}
                                                onChange={(val) => handleItemChange(index, 'product_id', val)}
                                            >
                                                {products.map((p) => (
                                                    <Option key={p.id} value={String(p.id)}>
                                                        {p.name} {p.units_per_package > 1 ? `(Paca x${p.units_per_package})` : ''} - Stock: {p.current_stock ?? 0}
                                                    </Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Input
                                                label="Descripción del Gasto (Ej. Gasolina, Mantenimiento)"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* CANTIDAD */}
                                    <div className="w-full md:w-28">
                                        <Input
                                            type="number"
                                            label="Cantidad"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </div>

                                    {/* PRECIO UNITARIO (CALCULADO) */}
                                    <div className="w-full md:w-32">
                                        <Input
                                            disabled
                                            type="number"
                                            step="0.01"
                                            label="Precio U."
                                            value={item.unit_price}
                                        />
                                    </div>

                                    {/* SUBTOTAL */}
                                    <div className="w-full md:w-36">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            label="Subtotal ($)"
                                            value={item.subtotal}
                                            onChange={(e) => handleItemChange(index, 'subtotal', e.target.value)}
                                        />
                                    </div>

                                    {/* BOTÓN ELIMINAR */}
                                    <div className="flex justify-end w-full md:w-auto">
                                        <IconButton
                                            variant="text"
                                            color="red"
                                            onClick={() => removeItem(index)}
                                            disabled={data.items.length === 1}
                                            className="shrink-0"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ACCIONES Y TOTAL */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                            <Button
                                variant="outlined"
                                color="indigo"
                                size="sm"
                                onClick={addItem}
                                className="flex items-center gap-2 rounded-xl"
                            >
                                <PlusIcon className="h-4 w-4 stroke-[3]" /> Agregar Ítem
                            </Button>

                            <div className="flex items-center gap-3 bg-indigo-50/50 px-5 py-2.5 rounded-xl border border-indigo-100">
                                <Typography className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total a Registrar:</Typography>
                                <Typography className="text-xl font-black text-indigo-700">${data.total_amount}</Typography>
                            </div>
                        </div>
                    </Card>

                    {/* NOTAS */}
                    <Card className="p-4 border border-gray-200/80 shadow-sm rounded-xl">
                        <Textarea
                            label="Notas u observaciones adicionales"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                    </Card>

                    {/* BOTÓN SUBMIT */}
                    <div className="flex justify-end">
                        <Button type="submit" color="indigo" className="rounded-xl px-8" disabled={processing || data.items.length === 0}>
                            {processing ? 'Guardando...' : 'Guardar Comprobante'}
                        </Button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}