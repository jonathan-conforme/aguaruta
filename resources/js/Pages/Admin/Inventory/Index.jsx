import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Card, Typography, Button, CardBody, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Chip
} from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowPathIcon,
    ArrowsRightLeftIcon,
    PlusIcon,
} from "@heroicons/react/24/solid";

// 1. Helper para humanizar la acción
const getMovementAction = (mov) => {
    const cantidad = mov.quantity;
    const producto = mov.product?.name?.toLowerCase() || 'productos';

    switch (mov.type) {
        case 'packaging':
            return `Se transformaron ${cantidad} ${producto} de vacíos a llenos`;
        case 'in':
            return `Ingresaron ${cantidad} ${producto}`;
        case 'out':
            return `Salieron ${cantidad} ${producto}`;
        default:
            return 'Movimiento registrado';
    }
};

// 2. Helper para renderizar los Chips
const renderMovementChip = (mov) => {
    const isEdit = mov.description?.toLowerCase().includes('edición');

    const inIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
    const outIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
    const syncIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;

    if (isEdit) {
        if (mov.type === 'in') return <Chip variant="ghost" color="blue" size="sm" value={`+ ${mov.quantity}`} icon={syncIcon} className="rounded-lg" />;
        if (mov.type === 'out') return <Chip variant="ghost" color="purple" size="sm" value={`- ${mov.quantity}`} icon={syncIcon} className="rounded-lg" />;
    }

    if (mov.type === 'in') return <Chip variant="ghost" color="green" size="sm" value={`+ ${mov.quantity}`} icon={inIcon} className="rounded-lg" />;
    if (mov.type === 'out') return <Chip variant="ghost" color="red" size="sm" value={`- ${mov.quantity}`} icon={outIcon} className="rounded-lg" />;
    if (mov.type === 'packaging') return <Chip variant="ghost" color="indigo" size="sm" value={`${mov.quantity}`} icon={syncIcon} className="rounded-lg" />;

    return null;
};

export default function Index({ movements, products }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset('quantity', 'description', 'type', 'product_id');
        clearErrors();
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        type: 'packaging',
        quantity: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventory-movements.store'), {
            onSuccess: () => {
                reset('quantity', 'description', 'product_id', 'type');
                setIsModalOpen(false);
            },
        });
    };

    const movementsList = movements?.data || [];
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const selectedProduct = products.find(p => p.id === parseInt(data.product_id));

    const getDynamicHelpText = () => {
        if (!selectedProduct) {
            return data.type === 'packaging'
                ? "Selecciona un producto y la cantidad a transformar."
                : "Selecciona un producto para ver el impacto en el inventario.";
        }

        const isPackage = selectedProduct.units_per_package > 1;
        const multiplier = isPackage ? selectedProduct.units_per_package : 1;
        const inputQty = parseInt(data.quantity) || 0;
        const totalUnits = inputQty * multiplier;

        if (data.type === 'packaging') {
            if (inputQty > 0 && isPackage) {
                return `Se transformarán ${inputQty} pacas (Total: ${totalUnits} unidades) de 'Stock Vacíos' a 'Stock Llenos'.`;
            }
            return "Se descontará esta cantidad de 'Stock Vacíos' y se sumará automáticamente a 'Stock Llenos'.";
        }

        if (inputQty > 0 && isPackage) {
            const actionText = data.type === 'in' ? 'agregará' : 'descontará';
            return `El sistema ${actionText} ${totalUnits} unidades individuales al inventario.`;
        }

        if (isPackage) {
            return `Nota: 1 Paca equivale a ${selectedProduct.units_per_package} unidades.`;
        }

        return data.type === 'in'
            ? "Se sumará esta cantidad al inventario."
            : "Se restará esta cantidad del inventario.";
    };

    const TABLE_HEAD = ["Fecha", "Producto", "Presentación", "Movimiento", "Motivo / Descripción"];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-indigo-500" /> Movimientos de Inventario
                </Typography>
            }
        >
            <Head title="Historial de Movimientos" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-3 sm:py-0">
                <Card className="h-full w-full shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden bg-slate-50/50">

                    {/* Header Principal estilo Productos */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold text-lg sm:text-xl">
                                Historial de Inventario
                            </Typography>
                            <Typography color="gray" className="mt-0.5 text-xs sm:text-sm font-normal">
                                Monitorea las entradas por abastecimiento, salidas por mermas y envasados.
                            </Typography>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleOpenModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100"
                                size="sm"
                            >
                                <PlusIcon strokeWidth={2.5} className="h-4 w-4" /> Registrar Movimiento
                            </Button>
                        </div>
                    </div>

                    {/* VISTA ESCRITORIO (Tabla) */}
                    <CardBody className="hidden md:block overflow-x-auto px-0 pt-0 pb-2 bg-white">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head, idx) => (
                                        <th key={head} className={`border-b border-gray-100 bg-gray-50/70 p-4 ${idx === 3 ? 'text-center' : ''}`}>
                                            <Typography variant="small" className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {movementsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">
                                            Aún no hay movimientos registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    movementsList.map((mov) => (
                                        <tr key={mov.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="p-4">
                                                <Typography variant="small" color="gray" className="font-medium">
                                                    {new Date(mov.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="text-xs">
                                                    {new Date(mov.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {mov.product?.name}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Chip
                                                    size="sm"
                                                    variant="outlined"
                                                    value={mov.product?.units_per_package > 1 ? `Paca x${mov.product.units_per_package}` : 'Unidad'}
                                                    color="indigo"
                                                    className="inline-block rounded-lg"
                                                />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center">
                                                    {renderMovementChip(mov)}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-xs">
                                                <div className="flex flex-col gap-0.5">
                                                    <Typography variant="small" color="blue-gray" className="font-semibold text-xs leading-tight">
                                                        {getMovementAction(mov)}
                                                    </Typography>
                                                    {mov.description ? (
                                                        <Typography variant="small" color="gray" className="text-[11px] flex items-start gap-1">
                                                            <span className="italic">{mov.description}</span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="small" className="text-[10px] text-gray-400 italic">
                                                            Origen automático
                                                        </Typography>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardBody>

                    {/* VISTA MÓVIL (Con tarjetas interactivas) */}
                    <div className="block md:hidden p-3 space-y-3">
                        {movementsList.map((mov) => (
                            <div
                                key={mov.id}
                                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 flex flex-col gap-2.5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <ArrowsRightLeftIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-[14px] leading-tight">
                                                {mov.product?.name}
                                            </span>
                                            <span className="text-xs text-slate-400 font-normal mt-0.5">
                                                {mov.product?.units_per_package > 1 ? `Paca x${mov.product.units_per_package}` : 'Unidad suelta'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        {renderMovementChip(mov)}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-2.5 rounded-xl text-xs">
                                    <span className="font-semibold text-slate-700 block">
                                        {getMovementAction(mov)}
                                    </span>
                                    {mov.description ? (
                                        <span className="text-slate-500 italic mt-0.5 block text-[11px]">
                                            "{mov.description}"
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic text-[10px] block mt-0.5">
                                            Origen automático
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-end pt-1 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                                    {new Date(mov.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(mov.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}

                        {movementsList.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm bg-white rounded-2xl">
                                No hay movimientos registrados.
                            </div>
                        )}
                    </div>

                    {/* PAGINACIÓN ESTILO PRODUCTOS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-3 bg-white">
                        <Typography variant="small" color="gray" className="font-normal text-xs sm:text-sm text-center sm:text-left">
                            Página <strong className="text-blue-gray-900">{movements.current_page}</strong> de{" "}
                            <strong className="text-blue-gray-900">{movements.last_page}</strong>
                        </Typography>

                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                            <Button
                                variant="outlined"
                                color="indigo"
                                size="sm"
                                className="flex items-center justify-center gap-1 rounded-xl flex-1 sm:flex-initial"
                                onClick={() => handlePageChange(movements.prev_page_url)}
                                disabled={!movements.prev_page_url}
                            >
                                <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" />
                                <span>Anterior</span>
                            </Button>

                            <Button
                                variant="outlined"
                                color="indigo"
                                size="sm"
                                className="flex items-center justify-center gap-1 rounded-xl flex-1 sm:flex-initial"
                                onClick={() => handlePageChange(movements.next_page_url)}
                                disabled={!movements.next_page_url}
                            >
                                <span>Siguiente</span>
                                <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* MODAL MODERNO ESTILO PRODUCTOS */}
            <Dialog
                open={isModalOpen}
                handler={handleCloseModal}
                size="sm"
                className="w-[95%] sm:w-full max-w-lg mx-auto rounded-2xl p-0 overflow-hidden shadow-2xl"
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/50">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                            Registrar Movimiento
                        </Typography>
                        <IconButton variant="text" color="blue-gray" size="sm" onClick={handleCloseModal} className="rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </IconButton>
                    </DialogHeader>

                    <DialogBody className="grid gap-4 p-5 overflow-y-auto max-h-[75vh]">

                        {/* SELECT PRODUCTO */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Producto *</label>
                            <div className="relative">
                                <select
                                    className="w-full border border-gray-300 text-blue-gray-700 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5 pl-3 pr-10 appearance-none bg-white truncate"
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                >
                                    <option value="" disabled>Seleccionar producto...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} {product.units_per_package > 1 ? `(Paca x${product.units_per_package})` : ''} (Lleno: {product.current_stock ?? 0} | Vacio: {product.empty_stock ?? 0})
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.product_id && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.product_id}</Typography>}
                        </div>

                        {/* TIPO DE MOVIMIENTO */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de Movimiento</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-full border border-gray-300 text-blue-gray-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm py-2.5 pl-3 pr-10 bg-white font-medium flex items-center gap-2 text-left transition-all truncate"
                                >
                                    {data.type === 'out' && <ArrowRightIcon className="h-4 w-4 text-red-500 shrink-0" />}
                                    {data.type === 'packaging' && <ArrowPathIcon className="h-4 w-4 text-indigo-500 shrink-0" />}
                                    {data.type === 'in' && <ArrowLeftIcon className="h-4 w-4 text-emerald-500 shrink-0" />}

                                    <span className="truncate">
                                        {data.type === 'in' && 'ENTRADA (Aumentar Stock Lleno)'}
                                        {data.type === 'packaging' && 'ENVASADO (Vacíos a Llenos)'}
                                        {!data.type && 'Seleccionar tipo...'}
                                        {data.type === 'out' && 'SALIDA (Restar Stock / Merma)'}
                                    </span>

                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="absolute z-50 mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-medium border border-gray-100 overflow-hidden">
                                        <div className="py-1">
                                            <button
                                                type="button"
                                                onClick={() => { setData('type', 'in'); setIsOpen(false); }}
                                                className={`flex items-center gap-2 w-full px-4 py-2.5 text-blue-gray-700 hover:bg-gray-50 text-left ${data.type === 'in' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                                            >
                                                <ArrowLeftIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                                                <span>ENTRADA (Aumentar Stock Lleno)</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setData('type', 'packaging'); setIsOpen(false); }}
                                                className={`flex items-center gap-2 w-full px-4 py-2.5 text-blue-gray-700 hover:bg-gray-50 text-left ${data.type === 'packaging' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                                            >
                                                <ArrowPathIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                                                <span>ENVASADO (Vacíos a Llenos)</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setData('type', 'out'); setIsOpen(false); }}
                                                className={`flex items-center gap-2 w-full px-4 py-2.5 text-blue-gray-700 hover:bg-gray-50 text-left ${data.type === 'out' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                                            >
                                                <ArrowRightIcon className="h-4 w-4 text-red-500 shrink-0" />
                                                <span>SALIDA (Restar Stock / Merma)</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CANTIDAD */}
                        <div>
                            <Input
                                type="number"
                                min="1"
                                label="Cantidad *"
                                color="indigo"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                error={!!errors.quantity}
                            />
                            <Typography
                                variant="small"
                                className={`mt-1 text-[11px] font-medium transition-colors ${data.quantity ? 'text-indigo-600' : 'text-gray-500'}`}
                            >
                                {getDynamicHelpText()}
                            </Typography>
                            {errors.quantity && <Typography variant="small" color="red" className="mt-1 text-xs">{errors.quantity}</Typography>}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <Input
                                type="text"
                                label="Motivo / Descripción"
                                placeholder={data.type === 'packaging' ? "Ej. Envasado turno mañana..." : "Ej. Lote recibido..."}
                                color="indigo"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                        </div>

                    </DialogBody>

                    <DialogFooter className="border-t border-gray-100 gap-3 px-5 py-4 bg-gray-50/50">
                        <Button variant="text" color="gray" onClick={handleCloseModal} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button type="submit" color="indigo" disabled={processing} className="rounded-xl shadow-md shadow-indigo-100">
                            {processing ? 'Guardando...' : 'Guardar Movimiento'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
