import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography } from "@material-tailwind/react";
import {
    ShoppingCartIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowPathIcon,
    QrCodeIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function EmployeeDashboard({ auth, stats }) {
    const formatCurrency = (value) => {
        const numericValue = typeof value === 'number'
            ? value
            : parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numericValue);
    };

    const data = {
        totalProductsSold: stats?.totalProductsSold ?? 0,
        recoveredBottles: stats?.recoveredBottles ?? 0,
        totalExpenses: stats?.totalExpenses ?? 0,
        collectedCash: stats?.collectedCash ?? 0,
        collectedTransfer: stats?.collectedTransfer ?? 0,
        completedDeliveries: stats?.completedDeliveries ?? 0,
        pendingDeliveries: stats?.pendingDeliveries ?? 0,
        totalDeliveries: stats?.totalDeliveries ?? (stats?.completedDeliveries || 0) + (stats?.pendingDeliveries || 0),
        activeTripId: stats?.activeTripId ?? 1,
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span className="text-lg font-bold text-gray-800 tracking-tight">Modo Repartidor</span>}
        >
            <Head title="Mi Jornada en Vivo" />

            <div className="max-w-7xl mx-auto space-y-6 pb-8">

                {/* BLOQUE SUPERIOR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* 1. TARJETA DE TURNO ASIGNADO & ACCESO AL POS */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Turno Asignado Activo</span>
                            </div>
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 font-bold">
                                Repartidor: {auth.user.name.split(' ')[0]}
                            </span>
                        </div>

                        {/* BOTÓN PRINCIPAL AL TURNO ASIGNADO / POS */}
                        <Link href={route('repartidor.trips.index')} className="block group">
                            <div className="bg-indigo-600 group-hover:bg-indigo-700 active:scale-[0.99] transition-all rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/15 rounded-xl shrink-0">
                                        <ShoppingCartIcon className="w-7 h-7 text-white stroke-[2]" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Ir al Turno Asignado / Registrar Ventas (POS)</h3>
                                        <p className="text-xs text-indigo-100 mt-0.5">Ingresar al punto de venta y registrar cobranzas</p>
                                    </div>
                                </div>
                                <ChevronRightIcon className="w-6 h-6 text-white stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* RESUMEN RÁPIDO DE VENTAS DEL TURNO */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-semibold">
                            <span>Estado de Operación</span>
                            <span className="text-indigo-600 font-bold">Listo para registrar pedidos en ruta</span>
                        </div>
                    </div>

                    {/* 2. EFECTIVO EN MANO Y GASTOS */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Efectivo Neto en Mano</span>
                                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
                                    {formatCurrency(data.collectedCash)}
                                </h2>
                            </div>
                            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-100 shrink-0">
                                Cobrado Físico
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                                    <QrCodeIcon className="w-4 h-4 stroke-[2.5]" />
                                    <span className="text-xs font-bold">Transferencias</span>
                                </div>
                                <span className="text-base sm:text-lg font-extrabold text-gray-800 block">{formatCurrency(data.collectedTransfer)}</span>
                            </div>

                            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                                    <WrenchScrewdriverIcon className="w-4 h-4 stroke-[2.5]" />
                                    <span className="text-xs font-bold">Gastos / Viáticos</span>
                                </div>
                                <span className="text-base sm:text-lg font-extrabold text-gray-800 block">{formatCurrency(data.totalExpenses)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <Link href={route('repartidor.expenses.create', data.activeTripId)} className="block">
                                <button className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-gray-950 font-bold text-xs py-3 px-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2">
                                    <WrenchScrewdriverIcon className="w-4 h-4 stroke-[2.5]" />
                                    Registrar Gasto
                                </button>
                            </Link>

                            <Link href={route('repartidor.shifts.close')} className="block">
                                <button className="w-full bg-gray-100 hover:bg-gray-200 hover:border-indigo-100 active:scale-[0.98] text-gray-800 font-bold text-xs py-3 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 border border-gray-200">
                                    <ClockIcon className="w-4 h-4 stroke-[2.5]" />
                                    Cerrar Jornada
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

                {/* BLOQUE INFERIOR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* RESUMEN DE INVENTARIO */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Resumen de Envases e Inventario</span>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3.5 p-4 bg-purple-50/60 rounded-2xl border border-purple-100/50">
                                <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                                    <ShoppingBagIcon className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-gray-800 block leading-tight">{data.totalProductsSold} u.</span>
                                    <span className="text-xs text-gray-500 font-medium">Vendidas hoy</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/50">
                                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                                    <ArrowPathIcon className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-gray-800 block leading-tight">{data.recoveredBottles} u.</span>
                                    <span className="text-xs text-gray-500 font-medium">Retornadas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONSULTAS RÁPIDAS */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Consultas Rápidas</span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href={route('repartidor.sales.index')} className="block group">
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gray-50 group-hover:bg-indigo-600 text-gray-500 group-hover:text-white rounded-xl transition-all">
                                            <DocumentTextIcon className="w-5 h-5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800 group-hover:text-indigo-600">Historial de Ventas</div>
                                            <div className="text-[10px] text-gray-400">Ver comprobantes emitidos</div>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link href={route('repartidor.shifts.index')} className="block group">
                                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 group-hover:border-purple-200 group-hover:bg-purple-50/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-gray-50 group-hover:bg-purple-600 text-slate-500 group-hover:text-white rounded-xl transition-all">
                                            <ClockIcon className="w-5 h-5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-800 group-hover:text-purple-600">Historial de Turnos</div>
                                            <div className="text-[10px] text-gray-400">Consultar cierres pasados</div>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                            <span>AquaRutaTech Operaciones</span>
                            <span className="font-semibold text-gray-600">v2.1 Stable</span>
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="text-center pt-2">
                    <Typography className="text-[10px] text-gray-400 font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} Aqua<span className="text-blue-500">RutaTech</span>. Todos los derechos reservados.
                    </Typography>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
