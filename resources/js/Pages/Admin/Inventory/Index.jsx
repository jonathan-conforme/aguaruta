import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Typography, Button, Input, Chip,
    Dialog, DialogHeader, DialogBody, DialogFooter, IconButton, 
} from "@material-tailwind/react";
import {
    ArrowLeftIcon,
    ArrowRightIcon
} from "@heroicons/react/24/solid";

// 1. Helper para humanizar la acción en la tabla
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

// 2. Helper para renderizar los Chips con colores dinámicos (Diferenciando Ediciones)
const renderMovementChip = (mov) => {
    const isEdit = mov.description?.toLowerCase().includes('edición');

    // --- ÍCONOS ---
    const inIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
    const outIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>;
    const syncIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;

    // --- LÓGICA DE EDICIÓN ---
    if (isEdit) {
        if (mov.type === 'in') {
            // Devolución al inventario por edición (Azul)
            return <Chip variant="ghost" color="blue" size="sm" value={`+ ${mov.quantity}`} icon={syncIcon} />;
        }
        if (mov.type === 'out') {
            // Salida del inventario por edición (Morado)
            return <Chip variant="ghost" color="purple" size="sm" value={`- ${mov.quantity}`} icon={syncIcon} />;
        }
    }

    // --- LÓGICA NORMAL (Física) ---
    if (mov.type === 'in') {
        return <Chip variant="ghost" color="green" size="sm" value={`+ ${mov.quantity}`} icon={inIcon} />;
    }
    if (mov.type === 'out') {
        return <Chip variant="ghost" color="red" size="sm" value={`- ${mov.quantity}`} icon={outIcon} />;
    }
    if (mov.type === 'packaging') {
        return <Chip variant="ghost" color="indigo" size="sm" value={` ${mov.quantity}`} icon={syncIcon} />;
    }

    return null;
};

export default function Index({ movements, products }) {
    // Estado para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset('quantity', 'description', 'type', 'product_id'); // Reseteamos todo
        clearErrors();
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        type: 'in', // 'in', 'out', 'packaging'
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

    // paginación
    const movementsList = movements?.data || [];
    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    // 3. Lógica para el cálculo dinámico del texto de ayuda
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
            return `Nota: 1 Paca de este producto equivale a ${selectedProduct.units_per_package} unidades.`;
        }

        return data.type === 'in'
            ? "Se sumará esta cantidad al inventario."
            : "Se restará esta cantidad del inventario.";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Movimientos de Inventario" />

            <div className="p-6 max-w-7xl mx-auto">

                {/* ENCABEZADO DE LA PÁGINA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Typography variant="h4" color="blue-gray" className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-indigo-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                            Historial de Inventario
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Monitorea las entradas por abastecimiento, salidas por mermas y procesos de envasado.
                        </Typography>
                    </div>

                    {/* BOTÓN PARA ABRIR MODAL */}
                    <Button
                        color="indigo"
                        className="flex items-center gap-2 w-full sm:w-auto justify-center shadow-md"
                        onClick={handleOpenModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Registrar Movimiento
                    </Button>
                </div>

                {/* TABLA DE MOVIMIENTOS */}
                <div className="bg-white rounded-xl shadow-sm border border-blue-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Presentación</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Movimiento</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Motivo / Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {movementsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-300">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                                </svg>
                                                <Typography variant="h5" color="blue-gray">Aún no hay movimientos</Typography>
                                                <Typography variant="small" className="font-normal mt-1">Registra la primera entrada o salida de tus productos.</Typography>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    movementsList.map(mov => (
                                        <tr key={mov.id} className="hover:bg-blue-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Typography variant="small" color="gray" className="font-medium">
                                                    {new Date(mov.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </Typography>
                                                <Typography variant="small" color="gray" className="text-xs">
                                                    {new Date(mov.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {mov.product?.name}
                                                </Typography>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Typography variant="small" color="gray" className="font-medium">
                                                    {mov.product?.units_per_package > 1 ? `Paca x${mov.product.units_per_package}` : 'Unidad'}
                                                </Typography>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center">
                                                    {/* Usamos nuestro nuevo helper para renderizar el Chip correspondiente */}
                                                    {renderMovementChip(mov)}
                                                </div>
                                            </td>

                                            {/* Columna de Descripción Humanizada */}
                                            <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                                                <div className="flex flex-col gap-1">
                                                    <Typography variant="small" color="blue-gray" className="font-semibold leading-tight">
                                                        {getMovementAction(mov)}
                                                    </Typography>
                                                    {mov.description ? (
                                                        <Typography variant="small" color="gray" className="text-xs flex items-start gap-1 mt-0.5">
                                                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-gray-400 mt-[1.5px] shrink-0">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                            </svg>
                                                            <span>{mov.description}</span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="small" className="text-xs text-gray-400 italic">
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


                        {/* BARRA DE PAGINACIÓN */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
                            <Typography variant="small" color="gray" className="font-normal text-center sm:text-left">
                                Página <strong className="text-blue-gray-900">{movements.current_page}</strong> de{" "}
                                <strong className="text-blue-gray-900">{movements.last_page}</strong>
                            </Typography>

                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(movements.prev_page_url)}
                                    disabled={!movements.prev_page_url}
                                >
                                    <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" /> <span className="hidden sm:inline">Anterior</span>
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(movements.next_page_url)}
                                    disabled={!movements.next_page_url}
                                >
                                    <span className="hidden sm:inline">Siguiente</span> <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE REGISTRO */}
            <Dialog
                open={isModalOpen}
                handler={handleCloseModal}
                size="sm"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            >
                <div className="flex items-center justify-between pe-4">
                    <DialogHeader className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <Typography variant="h5" color="blue-gray">
                            Registrar Movimiento
                        </Typography>
                    </DialogHeader>
                    <IconButton variant="text" color="blue-gray" onClick={handleCloseModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </div>

                <form onSubmit={handleSubmit}>
                    <DialogBody divider className="flex flex-col gap-5">

                        {/* SELECT PRODUCTO */}
                        <div>
                            <label className="block text-sm font-medium text-blue-gray-700 mb-1">Producto *</label>
                            <div className="relative">
                                <select
                                    className="w-full border-blue-gray-200 text-blue-gray-700 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm shadow-sm py-2.5 pl-3 pr-10 appearance-none bg-white"
                                    value={data.product_id}
                                    onChange={e => setData('product_id', e.target.value)}
                                >
                                    <option value="" disabled>Seleccionar producto...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                            {product.units_per_package > 1
                                                ? ` - Paca x${product.units_per_package}`
                                                : ' - Unidad'}
                                            {` (Llenos: ${product.current_stock ?? 0} | Vacíos: ${product.empty_stock ?? 0})`}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.product_id && <Typography variant="small" color="red" className="mt-1">{errors.product_id}</Typography>}
                        </div>

                        {/* SELECT TIPO DE MOVIMIENTO */}
                        <div>
                            <label className="block text-sm font-medium text-blue-gray-700 mb-1">Tipo de Movimiento</label>
                            <div className="relative">
                                <select
                                    className="w-full border-blue-gray-200 text-blue-gray-700 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm shadow-sm py-2.5 pl-3 pr-10 appearance-none bg-white font-medium"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                >
                                    <option value="in">📥 ENTRADA (Aumentar Stock Lleno)</option>
                                    <option value="out">📤 SALIDA (Restar Stock / Merma)</option>
                                    <option value="packaging">🔄 ENVASADO (Vacíos a Llenos)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
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
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                                    </svg>
                                }
                            />
                            {/* Implementación del texto de ayuda reactivo */}
                            <Typography
                                variant="small"
                                className={`mt-1.5 text-xs font-medium transition-colors ${data.quantity ? 'text-indigo-600' : 'text-gray-500'}`}
                            >
                                {getDynamicHelpText()}
                            </Typography>
                            {errors.quantity && <Typography variant="small" color="red" className="mt-1">{errors.quantity}</Typography>}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div>
                            <Input
                                type="text"
                                label="Motivo / Descripción"
                                placeholder={data.type === 'packaging' ? "Ej. Envasado del turno mañana..." : "Ej. Lote recibido, envases rotos..."}
                                color="indigo"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                                }
                            />
                        </div>

                    </DialogBody>

                    <DialogFooter className="space-x-2 bg-gray-50/50 rounded-b-lg">
                        <Button variant="text" color="gray" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="indigo" disabled={processing} className="flex items-center gap-2">
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : 'Guardar Movimiento'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}