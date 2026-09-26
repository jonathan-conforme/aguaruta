import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    BanknotesIcon,
    CubeIcon,
    DocumentTextIcon,
    ReceiptPercentIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/outline";

export default function Show({ purchase, auth }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value || 0);
    };

    const totalItems = purchase.items?.length || 0;
    const totalUnits = purchase.items?.reduce((acc, item) => acc + Number(item.quantity || 0), 0) || 0;

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<span className="text-base font-semibold text-gray-900">Detalle de Compra</span>}
        >
            <Head title={`Compra #${purchase.invoice_number || purchase.id}`} />

            <div className="bg-gray-50 -mt-6 pt-6 pb-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* 1. CABECERA CON ACENTO AZUL */}
                    <div className="bg-white rounded-xl p-5 border border-gray-200 border-l-4 border-l-blue-600 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('purchases.index')}
                                className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors border border-blue-100"
                                title="Volver"
                            >
                                <ArrowLeftIcon className="w-4 h-4 stroke-[2.5]" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Comprobante</span>
                                    <span className="text-xs text-gray-300">•</span>
                                    <span className="text-xs font-mono font-semibold text-gray-500">ID #{purchase.id}</span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                    {purchase.invoice_number ? `Factura ${purchase.invoice_number}` : `Registro #${purchase.id}`}
                                </h1>
                            </div>
                        </div>

                        {/* BADGE DE ESTADO CON COLOR ESTÁNDAR (GREEN / AMBER / RED) */}
                        <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                purchase.status === 'completed'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : purchase.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                {purchase.status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-green-600 stroke-[2]" />}
                                {purchase.status === 'pending' && <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 stroke-[2]" />}
                                {purchase.status === 'canceled' && <XCircleIcon className="w-4 h-4 text-red-600 stroke-[2]" />}
                                <span className="capitalize">{purchase.status === 'completed' ? 'Completado' : purchase.status === 'pending' ? 'Pendiente' : 'Cancelado'}</span>
                            </span>
                        </div>
                    </div>

                    {/* 2. TARJETAS DE INFORMACIÓN CON COLORES COMPATIBLES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* PROVEEDOR */}
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Proveedor</span>
                                <p className="text-base font-bold text-gray-900 truncate max-w-[180px]">
                                    {purchase.supplier?.name || 'No asignado'}
                                </p>
                                {purchase.supplier?.ruc_or_id ? (
                                    <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                                        RUC/ID: {purchase.supplier.ruc_or_id}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">Sin identificador</span>
                                )}
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                <BuildingOfficeIcon className="w-5 h-5 stroke-[2]" />
                            </div>
                        </div>

                        {/* FECHA Y DOCUMENTO */}
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Fecha de Emisión</span>
                                <p className="text-base font-bold text-gray-900 font-mono">
                                    {purchase.purchase_date}
                                </p>
                                <span className="text-xs font-medium text-gray-600 block">
                                    Doc: <span className="font-semibold text-gray-800">{purchase.invoice_number ? `#${purchase.invoice_number}` : 'S/N Factura'}</span>
                                </span>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                                <CalendarIcon className="w-5 h-5 stroke-[2]" />
                            </div>
                        </div>

                        {/* TOTAL REGISTRADO */}
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Monto Total</span>
                                <p className="text-2xl font-black text-gray-900 font-mono tracking-tight">
                                    {formatCurrency(purchase.total_amount)}
                                </p>
                                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 inline-block">
                                    Monto Neto Confirmado
                                </span>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100 shrink-0">
                                <BanknotesIcon className="w-5 h-5 stroke-[2]" />
                            </div>
                        </div>

                    </div>

                    {/* 3. TABLA DE PRODUCTOS */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                        {/* Cabecera de la tabla */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-blue-50/50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                    <ShoppingBagIcon className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-900">Items de la Compra</h2>
                            </div>
                            <span className="text-xs font-bold text-blue-700 bg-blue-100/60 border border-blue-200 px-3 py-1 rounded-lg font-mono">
                                {totalItems} ítems ({totalUnits} ud.)
                            </span>
                        </div>

                        {/* Tabla Desktop */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-6">Tipo</th>
                                        <th className="py-3.5 px-6">Descripción / Producto</th>
                                        <th className="py-3.5 px-6 text-center">Cantidad</th>
                                        <th className="py-3.5 px-6 text-right">Precio Unitario</th>
                                        <th className="py-3.5 px-6 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-xs">
                                    {purchase.items && purchase.items.length > 0 ? (
                                        purchase.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    {item.product ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                            <CubeIcon className="w-3.5 h-3.5" /> Inventario
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            <ReceiptPercentIcon className="w-3.5 h-3.5" /> Gasto Directo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="font-bold text-gray-900 text-sm block">
                                                        {item.product ? item.product.name : item.description || 'Gasto no especificado'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono font-medium text-gray-600">
                                                    {formatCurrency(item.unit_price)}
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono font-bold text-gray-900 text-sm">
                                                    {formatCurrency(item.subtotal)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-400">
                                                Sin ítems registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PIE DE TABLA CON GRIS OSCURO Y VERDE ESTÁNDAR */}
                        <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-medium hidden sm:inline-block">
                                Transacción verificada y procesada correctamente
                            </span>

                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <span className="text-xs font-bold uppercase text-gray-300 tracking-wider">Total a Pagar:</span>
                                <span className="text-2xl font-black text-black font-mono">
                                    {formatCurrency(purchase.total_amount)}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* 4. NOTAS CON BORDE INDIGO */}
                    {purchase.notes && (
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-1.5 border-l-4 border-l-indigo-500">
                            <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider">
                                <DocumentTextIcon className="w-4 h-4 text-indigo-600" />
                                <span>Notas u Observaciones</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed pl-6">
                                {purchase.notes}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
