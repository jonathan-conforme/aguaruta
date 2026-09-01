import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography } from "@material-tailwind/react";
import {
    MapIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowPathIcon,
    TruckIcon,
    QrCodeIcon,
    BanknotesIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    WalletIcon,
    ExclamationCircleIcon
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

    // Mapeo seguro de métricas con valores por defecto
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

    // Cálculo del porcentaje de avance de ruta
    const completionPercentage = data.totalDeliveries > 0
        ? Math.round((data.completedDeliveries / data.totalDeliveries) * 100)
        : 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span className="text-lg font-bold text-slate-800 tracking-tight">Panel de Operaciones</span>}
        >
            <Head title="Mi Ruta" />

            <div className="max-w-7xl mx-auto space-y-6 pb-6">

                {/* 1. SECCIÓN HERO: BIENVENIDA & TARJETA PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* TARJETA HERO BALANCE DE EFECTIVO */}
                    <div className="lg:col-span-7 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex justify-between items-start z-10">
                            <div>
                                <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Efectivo Neto en Mano</span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                                    {formatCurrency(data.collectedCash)}
                                </h2>
                            </div>
                            <span className="text-xs px-3 py-1.5 rounded-full font-medium border backdrop-blur-md flex items-center gap-1.5 w-fit bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>Turno Activo</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/15 z-10">
                            <div>
                                <span className="text-indigo-200 text-[11px] block font-medium">Transferencias</span>
                                <span className="text-lg font-bold text-white">{formatCurrency(data.collectedTransfer)}</span>
                            </div>
                            <div>
                                <span className="text-indigo-200 text-[11px] block font-medium">Gastos Registrados</span>
                                <span className="text-lg font-bold text-purple-200">{formatCurrency(data.totalExpenses)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ACCESOS RÁPIDOS Y ACCIONES */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">¡Hola, {auth.user.name.split(' ')[0]}! 👋</h3>
                                    <p className="text-xs text-slate-400">¿Qué deseas realizar en tu ruta?</p>
                                </div>
                                <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                    <TruckIcon className="w-3.5 h-3.5" /> En Servicio
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 my-2">
                                <Link href={route('repartidor.trips.index')} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <MapIcon className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600 text-center">Ver Mapa</span>
                                </Link>

                                <Link href={route('repartidor.expenses.create', data.activeTripId)} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <WrenchScrewdriverIcon className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-amber-600 text-center">Gasto</span>
                                </Link>

                                <Link href={route('repartidor.shifts.close')} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <ClockIcon className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-600 text-center">Cerrar Turno</span>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between text-xs mt-4">
                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                <ExclamationCircleIcon className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="truncate">Recuerda reportar viáticos antes del cierre</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* 2. RESUMEN DE OPERACIONES Y RENDIMIENTO */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Métricas de Campo Hoy</h3>
                        <span className="text-xs text-slate-400 font-medium">Jornada actual</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <ShoppingBagIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Productos Vendidos</span>
                                <span className="text-lg font-bold text-slate-800">{data.totalProductsSold} pzas</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ArrowPathIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Envases Recuperados</span>
                                <span className="text-lg font-bold text-slate-800">{data.recoveredBottles} pzas</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <TruckIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Total Entregas</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-slate-800">{data.totalDeliveries}</span>
                                    <span className="text-[11px] text-indigo-600 font-semibold">({data.completedDeliveries} listas)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PROGRESO DE LA RUTA Y ACCESOS RAPIDOS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ESTADO DE AVANCE DE RUTA */}
                    <div className="lg:col-span-5 bg-white p-6 shadow-sm border border-slate-100 rounded-3xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Avance de Ruta</h3>
                                <p className="text-[11px] text-slate-400">Progreso del viaje en curso</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-around my-6">
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#6366F1" strokeWidth="4.5" strokeDasharray={`${completionPercentage} ${100 - completionPercentage}`} strokeDashoffset="0" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xl font-extrabold text-slate-800">{completionPercentage}%</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Completado</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[100px]">
                                    <span className="text-slate-400 text-[10px] block">Completadas</span>
                                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {data.completedDeliveries}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[100px]">
                                    <span className="text-slate-400 text-[10px] block">Pendientes</span>
                                    <div className="flex items-center gap-1.5 font-bold text-amber-600">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> {data.pendingDeliveries}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href={route('repartidor.trips.index')} className="w-full">
                            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2">
                                <MapIcon className="w-4 h-4 stroke-[2.5]" /> Continuar Recorrido
                            </button>
                        </Link>
                    </div>

                    {/* HISTORIAL Y CONSULTAS */}
                    <div className="lg:col-span-7 bg-white p-6 shadow-sm border border-slate-100 rounded-3xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">Consultas e Historiales</h3>
                            <p className="text-[11px] text-slate-400 mb-4">Revisión de comprobantes e historial de movimientos</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link href={route('repartidor.sales.index')} className="w-full group">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-all">
                                        <div className="p-3 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white rounded-xl transition-all">
                                            <DocumentTextIcon className="w-5 h-5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Historial de Ventas</div>
                                            <div className="text-[10px] text-slate-400">Ver tickets y cobros</div>
                                        </div>
                                    </div>
                                </Link>

                                <Link href={route('repartidor.shifts.index')} className="w-full group">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 group-hover:border-purple-200 group-hover:bg-purple-50/30 transition-all">
                                        <div className="p-3 bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white rounded-xl transition-all">
                                            <ClockIcon className="w-5 h-5 stroke-[2]" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Historial de Turnos</div>
                                            <div className="text-[10px] text-slate-400">Consultar cierres pasados</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span>Estado de la red: Conectado</span>
                            <span className="font-semibold text-slate-600">AquaRuta v2.1</span>
                        </div>
                    </div>

                </div>

                {/* 4. CARDS EN 2 EN 2: FLUJO DE CAJA Y RECAUDO */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800">Recaudo y Cuadre de Caja</h3>
                        <span className="text-[11px] text-slate-400 font-medium">Desglose del día</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Card 1: Efectivo Neto */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <BanknotesIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <ArrowDownLeftIcon className="w-3 h-3 stroke-[3]" /> Físico
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Efectivo en Mano</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(data.collectedCash)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 2: Transferencias */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <QrCodeIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                    Bancario
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Transferencias</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(data.collectedTransfer)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 3: Gastos Registrados */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-amber-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <WrenchScrewdriverIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <ArrowUpRightIcon className="w-3 h-3 stroke-[3]" /> Salida
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Gastos / Viáticos</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(data.totalExpenses)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 4: Unidades Totales Vendidas */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-purple-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <WalletIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                    Jornada
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Productos Entregados</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {data.totalProductsSold} u.
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="text-center pt-4 flex flex-col items-center justify-center gap-0.5">
                    <Typography className="text-[10px] text-slate-400 font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} Aqua<span className="text-blue-500">RutaTech</span>. Todos los derechos reservados.
                    </Typography>
                    <span className="text-[9px] text-indigo-500/80 font-bold tracking-widest uppercase">
                        Production Stable • v2.1
                    </span>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
