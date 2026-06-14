import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, Typography, Button, Input, Select, Option, Textarea, IconButton } from "@material-tailwind/react";
import { TrashIcon, PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Create({ suppliers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        invoice_number: '',
        purchase_date: new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: '',
        total_amount: 0,
        items: [{ product_id: '', quantity: 1, unit_price: 0, subtotal: 0 }]
    });

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
        setData(prevData => ({ ...prevData, items, total_amount: total.toFixed(2) }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'subtotal') {

            const quantity = parseFloat(newItems[index].quantity || 0);
            const subtotal = parseFloat(newItems[index].subtotal || 0);

            if (quantity > 0) {
                newItems[index].unit_price = (subtotal / quantity).toFixed(2);
            }
        }
        calculateTotal(newItems);
    };

    const addItem = () => {
        calculateTotal([...data.items, { product_id: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        calculateTotal(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    return (
        <AuthenticatedLayout header={<Typography variant="h5" color="blue-gray">Nueva Compra</Typography>}>
            <Head title="Nueva Compra" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-6 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant="h6">Datos de la Cabecera</Typography>
                            <Link href={route('purchases.index')}>
                                <Button variant="text" size="sm" className="flex items-center gap-2"><ArrowLeftIcon className="h-4 w-4" /> Volver</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Select label="Proveedor" value={data.supplier_id} onChange={(val) => setData('supplier_id', val)} error={!!errors.supplier_id}>
                                    {suppliers.map(s => <Option key={s.id} value={String(s.id)}>{s.name}</Option>)}
                                </Select>
                            </div>
                            <Input label="N° Factura (Opcional)" value={data.invoice_number} onChange={e => setData('invoice_number', e.target.value)} />
                            <Input type="date" label="Fecha" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} error={!!errors.purchase_date} />
                        </div>
                    </Card>

                    <Card className="p-4 sm:p-6 border border-gray-200 shadow-sm">

                        <Typography variant="h6" className="mb-4">
                            Detalle de Productos
                        </Typography>

                        {data.items.map((item, index) => (

                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-5 gap-7 py-2 items-center border-b last:border-0"
                            >

                                {/* PRODUCTO */}
                             {/* PRODUCTO */}
<div className="lg:col-span-1">
    <Select
        label="Producto"
        value={item.product_id}
        onChange={(val) =>
            handleItemChange(index, 'product_id', val)
        }
    >
        {products.map((p) => (
            <Option key={p.id} value={String(p.id)}>
                {p.name} 
                {p.units_per_package > 1 ? ` - Paca x${p.units_per_package}` : ' - Unidad'} 
                {` (Llenos: ${p.current_stock ?? 0} | Vacíos: ${p.empty_stock ?? 0})`}
            </Option>
        ))}
    </Select>
</div>

                                {/* CANTIDAD */}
                                <div className="lg:col-span-1">
                                    <Input
                                        type="number"
                                        label="Cant."
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) =>
                                            handleItemChange(index, 'quantity', e.target.value)
                                        }
                                    />
                                </div>

                                {/* PRECIO */}
                                <div className="lg:col-span-1">
                                    <Input
                                        disabled
                                        type="number"
                                        step="0.01"
                                        label="Precio U."
                                        value={item.unit_price}
                                        onChange={(e) =>
                                            handleItemChange(index, 'unit_price', e.target.value)
                                        }
                                    />
                                </div>

                                {/* SUBTOTAL */}
                                <Input
                                    type="number"
                                    step="0.01"
                                    label="Subtotal"
                                    value={item.subtotal}
                                    onChange={(e) =>
                                        handleItemChange(index, 'subtotal', e.target.value)
                                    }
                                />

                                {/* ELIMINAR */}
                                <div className="lg:col-span-1 flex items-center justify-center">
                                    <IconButton
                                        variant="text"
                                        color="red"
                                        onClick={() => removeItem(index)}
                                        disabled={data.items.length === 1}
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </IconButton>
                                </div>
                            </div>
                        ))}

                        {/* FOOTER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 border-t pt-4">

                            <Button
                                variant="text"
                                color="indigo"
                                onClick={addItem}
                                className="flex items-center gap-2"
                            >
                                <PlusCircleIcon className="h-5 w-5" />
                                Agregar Fila
                            </Button>

                            <Typography variant="h5" color="blue-gray">
                                Total: ${data.total_amount}
                            </Typography>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="submit" color="indigo" disabled={processing || data.items.length === 0}>
                            {processing ? 'Guardando...' : 'Guardar Compra'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}