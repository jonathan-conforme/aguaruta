
import React, { useState } from 'react';
import StatCard from "@/Components/UI/StatCard";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Typography, Button } from "@material-tailwind/react";
import {
    CurrencyDollarIcon,
    TruckIcon,
    UserGroupIcon,
    CubeIcon,
    MapIcon,
    PlusIcon,
    ShoppingCartIcon,
    ArrowPathIcon,
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
    // ESTADO PARA ALTERNAR ENTRE VISTA SEMANAL Y MENSUAL (12 MESES)
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'monthly'
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const totalTrips = activeTrips + pendingTrips + completedTrips;
    const completedPercentage = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0;

    // SELECCIÓN DE DATOS Y ETIQUETAS SEGÚN EL MODO ACTIVO
    const currentData = viewMode === 'weekly' ? weeklySalesFlow : monthlySalesFlow;
    const currentLabels = viewMode === 'weekly'
        ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // CÁLCULO DE CURVA SVG DINÁMICA
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
            header={<span className="text-lg font-bold text-gray-800 tracking-tight">Panel Administrativo</span>}
        >
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* BANNER DE BIENVENIDA */}
                <Card className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Typography variant="h4" className="text-xl font-bold text-gray-900 tracking-tight">
                            ¡Buen día, {auth.user.name.split(' ')[0]}! 👋
                        </Typography>
                        <Typography className="text-xs text-gray-500 mt-0.5">
                            Aquí tienes el rendimiento general de <span className="font-semibold text-indigo-600">AguaRuta</span> para hoy.
                        </Typography>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link href={route('trips.index')} className="flex-1 sm:flex-none">
                            <Button size="sm" color="indigo" className="w-full flex items-center justify-center gap-2 rounded-xl normal-case shadow-none hover:shadow-none text-xs py-2.5">
                                <PlusIcon className="w-4 h-4 stroke-[2.5]" /> Nuevo Viaje
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* BLOQUE 1: FINANZAS DEL MES */}
                <div className="space-y-3">
                    <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Finanzas del Mes
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Ventas del Día"
                            value={formatCurrency(todaySales)}
                            icon={CurrencyDollarIcon}
                            colorTheme="green"
                            description="Ingresos registrados hoy"
                        />
                        <StatCard
                            title="Ventas del Mes"
                            value={formatCurrency(monthSales)}
                            icon={CurrencyDollarIcon}
                            colorTheme="blue"
                            description="Acumulado mensual"
                        />
                        <StatCard
                            title="Egresos del Mes"
                            value={formatCurrency(monthPurchases)}
                            icon={CurrencyDollarIcon}
                            colorTheme="red"
                            description="Compras e insumos totales"
                        />
                        <StatCard
                            title="Utilidad Neta"
                            value={formatCurrency(utilidades)}
                            icon={CurrencyDollarIcon}
                            colorTheme={utilidades >= 0 ? "emerald" : "red"}
                            description={utilidades >= 0 ? "Ganancia real del mes" : "Balance temporal negativo"}
                        />
                    </div>
                </div>

                {/* BLOQUE 2: OPERACIONES Y RUTAS */}
                <div className="space-y-3">
                    <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Operaciones y Campo
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard
                            title="Viajes Activos"
                            value={activeTrips}
                            icon={TruckIcon}
                            colorTheme="purple"
                            description={`Pendientes: ${pendingTrips}`}
                        />
                        <StatCard
                            title="Productos Vendidos"
                            value={productsSoldToday}
                            icon={ShoppingCartIcon}
                            colorTheme="blue"
                            description="Unidades vendidas hoy"
                        />
                        <StatCard
                            title="Envases Recuperados"
                            value={recoveredBottles}
                            icon={ArrowPathIcon}
                            colorTheme="green"
                            description="Envases retornados hoy"
                        />
                        <StatCard
                            title="Stock Bajo"
                            value={lowStockProducts}
                            icon={CubeIcon}
                            colorTheme="red"
                            description="Productos en alerta crítica"
                        />
                    </div>
                </div>

                {/* BLOQUE 3: GRÁFICOS Y ANALÍTICA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* GRÁFICO CIRCULAR DE ESTADO DE VIAJES */}
                    <Card className="lg:col-span-5 p-6 bg-white shadow-sm border border-gray-100 rounded-2xl flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <Typography className="text-sm font-bold text-slate-800">Estado de Viajes y Rutas</Typography>
                                <Typography className="text-[11px] text-slate-400">Distribución operativa general</Typography>
                            </div>
                        </div>

                        <div className="flex items-center justify-around my-4">
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10B981" strokeWidth="4.5" strokeDasharray={`${completedPercentage} ${100 - completedPercentage}`} strokeDashoffset="0" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-base font-bold text-slate-800">{totalTrips}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Viajes Totales</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-400 text-[10px]">Completados</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {completedTrips}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10px]">Activos</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span> {activeTrips}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-[10px]">Pendientes</span>
                                    <div className="flex items-center gap-2 font-bold text-slate-800">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> {pendingTrips}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* GRÁFICO DE FLUJO DE VENTAS (SEMANAL / ANUAL EN CURVA) */}
                    <Card className="lg:col-span-7 p-6 bg-white shadow-sm border border-gray-100 rounded-2xl flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                                <Typography className="text-sm font-bold text-slate-800">
                                    {viewMode === 'weekly' ? 'Flujo de Ventas Semanal' : 'Flujo de Ventas Anual'}
                                </Typography>
                                <Typography className="text-[11px] text-slate-400">
                                    {viewMode === 'weekly' ? 'Comportamiento diario de ingresos' : 'Tendencia mensual consolidada'}
                                </Typography>
                            </div>

                            {/* BOTONES DE CAMBIO DE VISTA (SEMANA / MESES) */}
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
                                    Año (Meses)
                                </button>
                            </div>
                        </div>

                        <div className="relative my-2 h-44 flex flex-col justify-between">
                            {/* GUÍAS HORIZONTALES Y EJE Y */}
                            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none pb-6">
                                <div className="border-b border-dashed border-gray-100 pb-0.5">{formatCurrency(maxVal)}</div>
                                <div className="border-b border-dashed border-gray-100 pb-0.5">{formatCurrency(maxVal * 0.66)}</div>
                                <div className="border-b border-dashed border-gray-100 pb-0.5">{formatCurrency(maxVal * 0.33)}</div>
                                <div className="border-b border-dashed border-gray-100 pb-0.5">{formatCurrency(0)}</div>
                            </div>

                            {/* LIENZO SVG DE LA CURVA */}

                            <div className="relative w-full h-32 pt-2">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                                        </linearGradient>
                                    </defs>
                                    <path d={areaPath} fill="url(#salesGradient)" />
                                    <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />

                                    {/* NODOS CON DETECCIÓN DE CURSOR */}
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

                                {/* TOOLTIP DINÁMICO: Muestra el punto activo o, por defecto, el pico más alto */}
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
                                            {hoveredPoint && <span className="text-gray-400 text-[10px] font-normal">{hoveredPoint.label}:</span>}
                                            <span className="text-emerald-400 font-extrabold">↗</span>
                                            <span className="text-blue-gray-700">{formatCurrency(displayPoint.val)}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* EJE X: DÍAS O MESES DINÁMICOS */}
                            <div className="flex justify-between text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                                {currentLabels.map((label, i) => (
                                    <span key={i} className="text-center flex-1">{label}</span>
                                ))}
                            </div>
                        </div>
                    </Card>

                </div>

                {/* ACCESOS DIRECTOS */}
                <Card className="p-6 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <Typography className="text-sm font-bold text-slate-800 mb-1">Accesos Directos de Gestión</Typography>
                    <Typography className="text-xs text-slate-400 mb-4">Módulos de uso frecuente y consultas rápidas</Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href={route('delivery-routes.index')} className="w-full">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition group">
                                <div className="p-2.5 bg-gray-50 group-hover:bg-indigo-50 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                                    <MapIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Plan de Rutas</div>
                                    <div className="text-[10px] text-slate-400">Organizar sectores</div>
                                </div>
                            </div>
                        </Link>

                        <Link href={route('products.index')} className="w-full">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition group">
                                <div className="p-2.5 bg-gray-50 group-hover:bg-indigo-50 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                                    <PlusIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Cargar Inventario</div>
                                    <div className="text-[10px] text-slate-400">Controlar stock nuevo</div>
                                </div>
                            </div>
                        </Link>

                        <Link href={route('admin.shifts.index')} className="w-full">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition group">
                                <div className="p-2.5 bg-gray-50 group-hover:bg-indigo-50 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Historial de Cajas</div>
                                    <div className="text-[10px] text-slate-400">Cierres y gastos de ruta</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </Card>

                {/* FOOTER */}
                <div className="text-center pt-2 flex flex-col items-center justify-center gap-0.5 pb-4">
                    <Typography className="text-[10px] text-gray-400 font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} AguaRuta. Todos los derechos reservados.
                    </Typography>
                    <Typography className="text-[9px] text-indigo-500/80 font-bold tracking-widest uppercase">
                        Production Stable • v2.1
                    </Typography>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
