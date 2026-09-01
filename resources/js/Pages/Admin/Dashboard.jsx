import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography } from "@material-tailwind/react";
import {
    TruckIcon,
    CubeIcon,
    MapIcon,
    PlusIcon,
    ShoppingCartIcon,
    ArrowPathIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChevronUpIcon,
    BanknotesIcon,
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    WalletIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard({
    auth,
    todaySales = 0,
    monthSales = 0,
    monthPurchases = 0,
    utilidades = 0,
    productsSoldToday = 0,
    recoveredBottles = 0,
    activeTrips = 0,
    pendingTrips = 0,
    completedTrips = 0,
    totalCustomers = 0,
    lowStockProducts = 0,
    weeklySalesFlow = [0, 0, 0, 0, 0, 0, 0],
    monthlySalesFlow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}) {
    const [viewMode, setViewMode] = useState('weekly');
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value || 0);
    };

    const totalTrips = activeTrips + pendingTrips + completedTrips;
    const completedPercentage = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0;

    const currentData = viewMode === 'weekly' ? weeklySalesFlow : monthlySalesFlow;
    const currentLabels = viewMode === 'weekly'
        ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const maxVal = Math.max(...currentData, 100);
    const points = currentData.map((val, i) => {
        const x = (i / Math.max(currentData.length - 1, 1)) * 460 + 20;
        const y = 85 - (val / maxVal) * 65;
        return { x, y, val };
    });

    const linePath = points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = a[i - 1];
        const cx = (prev.x + point.x) / 2;
        return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
    }, "");

    const areaPath = `${linePath} L ${points[points.length - 1]?.x || 480},95 L ${points[0]?.x || 20},95 Z`;
    const maxPoint = points.reduce((max, p) => (p.val >= max.val ? p : max), points[0] || { x: 250, y: 50, val: 0 });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span className="text-lg font-bold text-slate-800 tracking-tight">Panel Principal</span>}
        >
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6 pb-6">

                {/* 1. SECCIÓN HERO: SALUDO & TARJETA PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* TARJETA HERO BALANCE */}
                    <div className="lg:col-span-7 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200/50 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex justify-between items-start z-10">
                            <div>
                                <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">Balance del Mes</span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                                    {formatCurrency(utilidades)}
                                </h2>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium border backdrop-blur-md flex items-center gap-1.5 w-fit ${utilidades >= 0
                                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                                    : "bg-rose-500/20 text-rose-200 border-rose-400/30"
                                }`}>
                                {utilidades >= 0 ? (
                                    <>
                                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-300 stroke-[2.5]" />
                                        <span>Ganancia activa</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 stroke-[2.5]" />
                                        <span>Balance negativo</span>
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/15 z-10">
                            <div>
                                <span className="text-indigo-200 text-[11px] block font-medium">Ventas Acumuladas</span>
                                <span className="text-lg font-bold text-white">{formatCurrency(monthSales)}</span>
                            </div>
                            <div>
                                <span className="text-indigo-200 text-[11px] block font-medium">Egresos e Insumos</span>
                                <span className="text-lg font-bold text-purple-200">{formatCurrency(monthPurchases)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ACCESOS RÁPIDOS */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800">¡Hola, {auth.user.name.split(' ')[0]}! 👋</h3>
                                    <p className="text-xs text-slate-400">¿Qué deseas realizar hoy?</p>
                                </div>
                                <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                                    Hoy: {formatCurrency(todaySales)}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 my-2">
                                <Link href={route('trips.index')} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <PlusIcon className="w-5 h-5 stroke-[2.5]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600">Nuevo Viaje</span>
                                </Link>

                                <Link href={route('products.index')} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <CubeIcon className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-purple-600">Stock</span>
                                </Link>

                                <Link href={route('delivery-routes.index')} className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm">
                                        <MapIcon className="w-5 h-5 stroke-[2]" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-amber-600">Rutas</span>
                                </Link>
                            </div>
                        </div>

                        {lowStockProducts > 0 && (
                            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 flex items-center justify-between text-xs mt-4">
                                <div className="flex items-center gap-2 text-rose-700 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                    <span>{lowStockProducts} productos con stock crítico</span>
                                </div>
                                <Link href={route('products.index')} className="text-[11px] font-bold text-rose-600 hover:underline">
                                    Revisar
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

                {/* 2. RESUMEN DE OPERACIONES */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Métricas de Campo Hoy</h3>
                        <span className="text-xs text-slate-400 font-medium">Actualizado en tiempo real</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <TruckIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Viajes Activos</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-slate-800">{activeTrips}</span>
                                    <span className="text-[11px] text-amber-600 font-semibold">({pendingTrips} pendientes)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <ShoppingCartIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Productos Vendidos</span>
                                <span className="text-lg font-bold text-slate-800">{productsSoldToday} u.</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:px-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ArrowPathIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-medium block">Envases Retornados</span>
                                <span className="text-lg font-bold text-slate-800">{recoveredBottles} botellones</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. GRÁFICOS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ESTADO DE VIAJES */}
                    <div className="lg:col-span-5 bg-white p-6 shadow-sm border border-slate-100 rounded-3xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Estado de Viajes</h3>
                                <p className="text-[11px] text-slate-400">Avance del día en entregas</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-around my-6">
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray={`${completedPercentage} ${100 - completedPercentage}`} strokeDashoffset="0" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xl font-extrabold text-slate-800">{completedPercentage}%</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Completado</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[100px]">
                                    <span className="text-slate-400 text-[10px] block">Completados</span>
                                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {completedTrips}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[100px]">
                                    <span className="text-slate-400 text-[10px] block">Activos</span>
                                    <div className="flex items-center gap-1.5 font-bold text-indigo-600">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span> {activeTrips}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[100px]">
                                    <span className="text-slate-400 text-[10px] block">Pendientes</span>
                                    <div className="flex items-center gap-1.5 font-bold text-amber-600">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> {pendingTrips}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* GRÁFICO FLUJO DE VENTAS */}
                    <div className="lg:col-span-7 bg-white p-6 shadow-sm border border-slate-100 rounded-3xl flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    {viewMode === 'weekly' ? 'Flujo de Ventas Semanal' : 'Flujo de Ventas Anual'}
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    {viewMode === 'weekly' ? 'Comportamiento diario' : 'Consolidado mensual'}
                                </p>
                            </div>

                            <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                                <button
                                    onClick={() => setViewMode('weekly')}
                                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'weekly'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    Semana
                                </button>
                                <button
                                    onClick={() => setViewMode('monthly')}
                                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${viewMode === 'monthly'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    Año
                                </button>
                            </div>
                        </div>

                        <div className="relative my-2 h-44 flex flex-col justify-between">
                            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none pb-6">
                                <div className="border-b border-dashed border-slate-100 pb-0.5">{formatCurrency(maxVal)}</div>
                                <div className="border-b border-dashed border-slate-100 pb-0.5">{formatCurrency(maxVal * 0.5)}</div>
                                <div className="border-b border-dashed border-slate-100 pb-0.5">{formatCurrency(0)}</div>
                            </div>

                            <div className="relative w-full h-32 pt-2">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path d={areaPath} fill="url(#salesGradient)" />
                                    <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />

                                    {points.map((pt, i) => (
                                        <circle
                                            key={i}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={hoveredPoint?.x === pt.x ? "6" : "3.5"}
                                            fill={hoveredPoint?.x === pt.x ? "#6366F1" : "#FFFFFF"}
                                            stroke="#6366F1"
                                            strokeWidth="2.5"
                                            className="transition-all cursor-pointer"
                                            onMouseEnter={() => setHoveredPoint({ ...pt, label: currentLabels[i] })}
                                            onMouseLeave={() => setHoveredPoint(null)}
                                        />
                                    ))}
                                </svg>

                                {(() => {
                                    const displayPoint = hoveredPoint || maxPoint;
                                    if (!displayPoint || displayPoint.val <= 0) return null;

                                    return (
                                        <div
                                            style={{
                                                left: `${(displayPoint.x / 500) * 100}%`,
                                                top: `${(displayPoint.y / 100) * 100}%`
                                            }}
                                            className="absolute -translate-x-1/2 -translate-y-9 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg flex items-center gap-1.5 z-20 pointer-events-none whitespace-nowrap transition-all duration-150"
                                        >
                                            {hoveredPoint && <span className="text-slate-400 text-[10px] font-normal">{hoveredPoint.label}:</span>}
                                            <span className="text-emerald-400 font-extrabold">↗</span>
                                            <span className="text-white">{formatCurrency(displayPoint.val)}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
                                {currentLabels.map((label, i) => (
                                    <span key={i} className="text-center flex-1">{label}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* 4. CARDS EN 2 EN 2: FLUJO DE DINERO MÁS IMPORTANTE */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800">Flujo de Dinero Clave</h3>
                        <span className="text-[11px] text-slate-400 font-medium">Indicadores financieros</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Card 1: Ingresos de Hoy */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <ArrowDownLeftIcon className="w-5 h-5 stroke-[2.5]" />
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                    <ChevronUpIcon className="w-3 h-3 stroke-[3]" /> Ingreso
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Ventas de Hoy</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(todaySales)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 2: Ventas del Mes */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <BanknotesIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    Mensual
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Ingresos Totales (Mes)</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(monthSales)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 3: Egresos del Mes */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-purple-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <ArrowUpRightIcon className="w-5 h-5 stroke-[2.5]" />
                                </div>
                                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                    Egresos
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Compras e Insumos</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(monthPurchases)}
                                </h4>
                            </div>
                        </div>

                        {/* Card 4: Utilidad Neta */}
                        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <WalletIcon className="w-5 h-5 stroke-[2]" />
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    utilidades >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                    Utilidad
                                </span>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-400 text-xs font-medium block">Ganancia Neta</span>
                                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                                    {formatCurrency(utilidades)}
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
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
