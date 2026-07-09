import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Typography, Button } from "@material-tailwind/react";
import {
    CurrencyDollarIcon,
    TruckIcon,
    UserGroupIcon,
    CubeIcon,
    ArrowTrendingUpIcon,
    MapIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard({ auth, stats }) {
    const data = stats || {
        totalSales: "$3,450.00",
        activeTrips: 5,
        totalCustomers: 284,
        lowStockProducts: 2,
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span className="text-lg font-bold text-gray-800 tracking-tight">Panel Administrativo</span>}
        >
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* BANNER REDISEÑADO: Más elegante y menos intrusivo */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Typography variant="h4" className="text-xl font-bold text-gray-900 tracking-tight">
                            ¡Buen día, {auth.user.name.split(' ')[0]}!
                        </Typography>
                        <Typography className="text-sm text-gray-700 mt-0.5">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Ventas del Mes"
                        value={data.totalSales}
                        icon={CurrencyDollarIcon}
                        colorTheme="green"
                        description="+14% vs mes anterior"
                    />
                    <StatCard
                        title="Rutas en Curso"
                        value={data.activeTrips}
                        icon={TruckIcon}
                        colorTheme="blue"
                        description="Unidades en la calle"
                    />
                    <StatCard
                        title="Clientes Totales"
                        value={data.totalCustomers}
                        icon={UserGroupIcon}
                        colorTheme="purple"
                        description="Cartera activa"
                    />
                    <StatCard
                        title="Alertas de Stock"
                        value={data.lowStockProducts}
                        icon={CubeIcon}
                        colorTheme="red"
                        description="2 productos críticos"
                    />
                </div>

                {/* SECCIÓN INFERIOR: Gráfico estilizado y Acciones */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* GRÁFICO SEMANAL: Barras delgadas con espacio para respirar */}
                    <Card className="p-6 col-span-1 lg:col-span-2 bg-white shadow-none border border-gray-200/80 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <Typography className="text-sm font-bold text-gray-900">Flujo de Ventas Semanal</Typography>
                                <Typography className="text-xs text-gray-700">Volumen diario estimado</Typography>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Estable
                            </span>
                        </div>

                        <div className="h-44 flex items-end justify-between gap-2 pt-2 px-2 border-b border-gray-100">
                            {[42, 65, 48, 82, 95, 35, 70].map((height, i) => (
                                <div key={i} className="w-full flex flex-col items-center gap-2 h-full justify-end group">
                                    {/* Tooltip de porcentaje al hacer hover */}
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded mb-1 absolute transform -translate-y-12">
                                        {height}%
                                    </span>
                                    <div
                                        style={{ height: `${height}%` }}
                                        className="w-6 sm:w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:from-indigo-600 shadow-[0_2px_8px_rgba(99,102,241,0.15)]"
                                    ></div>
                                </div>
                            ))}
                        </div>
                        {/* Días de la semana alineados abajo */}
                        <div className="flex justify-between px-2 pt-3 text-xs font-semibold text-gray-700">
                            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
                                <span key={i} className="w-6 sm:w-8 text-center">{day}</span>
                            ))}
                        </div>
                    </Card>

                    {/* ACCIONES DE CONTROL LIMITADAS */}
                    <Card className="p-6 bg-white shadow-none border border-gray-200/80 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-4">
                            <div>
                                <Typography className="text-sm font-bold text-gray-900">Accesos Directos</Typography>
                                <Typography className="text-xs text-gray-700">Módulos de uso frecuente</Typography>
                            </div>
                            <div className="space-y-2">
                                <Link href={route('delivery-routes.index')} className="w-full block">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 group-hover:bg-indigo-50 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                                                <MapIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-800">Ver Plan de Rutas</div>
                                                <div className="text-[10px] text-gray-600">Organizar sectores</div>
                                            </div>
                                        </div>
                                    </button>
                                </Link>
                                <Link href={route('products.index')} className="w-full block">
                                    <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 group-hover:bg-indigo-50 text-gray-500 group-hover:text-indigo-600 rounded-lg transition-colors">
                                                <PlusIcon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-800">Cargar Inventario</div>
                                                <div className="text-[10px] text-gray-600">Controlar stock nuevo</div>
                                            </div>
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="text-center pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-0.5">
                            <Typography className="text-[10px] text-gray-400 font-medium tracking-wide">
                                &copy; {new Date().getFullYear()} AguaRuta. Todos los derechos reservados.
                            </Typography>
                            <Typography className="text-[9px] text-indigo-500/80 font-bold tracking-widest uppercase">
                                Production Stable • v2.1
                            </Typography>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// COMPONENTE TARJETA ESTILIZADO CON COLORES ESTÁNDAR
function StatCard({ title, value, icon: Icon, colorTheme = "gray", description }) {

    // Cambiamos 'emerald' por 'green' y 'rose' por 'red' para usar la paleta ultra-estándar de Tailwind
    const themes = {
        green: {
            title: "text-green-700",
            iconBg: "bg-green-50",
            iconColor: "text-green-600"
        },
        blue: {
            title: "text-blue-700",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        purple: {
            title: "text-purple-700",
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        red: {
            title: "text-red-700",
            iconBg: "bg-red-50",
            iconColor: "text-red-600"
        },
        gray: {
            title: "text-slate-500",
            iconBg: "bg-slate-50",
            iconColor: "text-slate-600"
        }
    };

    const currentTheme = themes[colorTheme] || themes.gray;

    return (
        <Card className="p-5 bg-white border border-gray-200/80 shadow-none rounded-2xl flex flex-row items-center justify-between">
            <div className="space-y-1">
                <Typography className={`text-[11px] font-bold ${currentTheme.title} uppercase tracking-wider`}>
                    {title}
                </Typography>
                <Typography variant="h3" className="text-2xl font-black text-gray-900 tracking-tight">
                    {value}
                </Typography>
                <Typography className="text-[11px] text-gray-500 font-medium">
                    {description}
                </Typography>
            </div>
            <div className={`p-3 rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor} shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2]" />
            </div>
        </Card>
    );
}
