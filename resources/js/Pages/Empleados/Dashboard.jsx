import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Typography, Button } from "@material-tailwind/react";
import {
    MapIcon,
    CurrencyDollarIcon,
    ExclamationCircleIcon,
    ClockIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    WrenchScrewdriverIcon
} from "@heroicons/react/24/outline";

export default function EmployeeDashboard({ auth, stats }) {
    // Estructura de datos optimizada para el chofer en ruta
    const data = stats || {
        totalProductsSold: 48,       // Cantidad física (ej. Garrafones entregados)
        totalExpenses: "$15.00",     // Gastos del día (gasolina, etc.)
        collectedCash: "$325.00",    // Efectivo Neto Real (Ventas - Gastos)
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span className="text-lg font-bold text-gray-800 tracking-tight">Panel de Operaciones</span>}
        >
            <Head title="Mi Ruta" />

            <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4">

                {/* BANNER DE BIENVENIDA OPERATIVO */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0 hidden sm:block">
                            <MapIcon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Typography variant="h4" className="text-lg font-bold text-gray-900 tracking-tight">
                                    ¡Hola, {auth.user.name.split(' ')[0]}!
                                </Typography>
                                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Activo
                                </span>
                            </div>
                            <Typography className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                Revisa tu inventario cargado y registra cada venta para cuadrar tu caja sin problemas.
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* MÉTRICAS DE OPERACIÓN DIARIA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <EmployeeStatCard
                        title="Entregas / Ventas"
                        value={`${data.totalProductsSold} pzas`}
                        icon={ShoppingBagIcon}
                        colorTheme="blue"
                    />
                    <EmployeeStatCard
                        title="Gastos en Ruta"
                        value={data.totalExpenses}
                        icon={WrenchScrewdriverIcon}
                        colorTheme="amber"
                    />
                    <EmployeeStatCard
                        title="Efectivo Neto en Mano"
                        value={data.collectedCash}
                        icon={CurrencyDollarIcon}
                        colorTheme="green"
                    />
                </div>

                {/* ACCIONES PRINCIPALES DE LA JORNADA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Tarjeta de Viajes Asignados y Pendientes */}
                    <Card className="p-6 bg-white shadow-none border border-gray-200/80 rounded-2xl flex flex-col justify-between space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Typography className="text-sm font-bold text-gray-900">Navegación y Ruta</Typography>
                                <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    Mi Viaje
                                </span>
                            </div>
                            <Typography className="text-xs text-gray-500 leading-relaxed">
                                Revisa el mapa de clientes, los garrafones asignados y las entregas pendientes preparadas por el administrador para tu recorrido de hoy.
                            </Typography>
                        </div>
                        <Link href={route('repartidor.trips.index')} className="w-full">
                            <Button className="w-full rounded-xl normal-case shadow-none hover:shadow-none flex justify-center items-center gap-2 text-xs py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                <MapIcon className="w-4 h-4 stroke-[2]" /> Ver Mis Viajes Pendientes
                            </Button>
                        </Link>
                    </Card>

                    {/* Tarjeta de Liquidación y Cierre Neto */}
                    <Card className="p-6 bg-white shadow-none border border-gray-200/80 rounded-2xl flex flex-col justify-between space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Typography className="text-sm font-bold text-gray-900">Gastos y Cierre de Turno</Typography>
                                <span className="p-0.5 bg-amber-50 text-amber-600 rounded-full">
                                    <ExclamationCircleIcon className="w-4.5 h-4.5 stroke-[2.5]" />
                                </span>
                            </div>
                            <Typography className="text-xs text-gray-500 leading-relaxed">
                                Controla tu dinero. Reporta viáticos de combustible o fallas mecánicas en ruta antes de realizar la entrega final de efectivo en la purificadora.
                            </Typography>
                        </div>
                        <div className="flex gap-3">
                            <Link href={route('repartidor.expenses.create', 1)} className="flex-1">
                                <Button variant="text" className="w-full rounded-xl normal-case bg-gray-50 text-gray-600 text-xs py-3.5 font-bold hover:bg-gray-100 transition-colors">
                                    Registrar Gasto
                                </Button>
                            </Link>
                            <Link href={route('repartidor.shifts.close')} className="flex-1">
                                <Button className="w-full rounded-xl normal-case shadow-none hover:shadow-none text-xs py-3.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold">
                                    Terminar Jornada
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* ACCESOS RÁPIDOS ADICIONALES (AUDITORÍA DE HISTORIALES) */}
                <div className="pt-2">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Consultas Rápidas
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link href={route('repartidor.shifts.index')} className="block">
                            <div className="p-4 bg-white border border-gray-200/60 hover:border-gray-300 rounded-xl flex items-center gap-3 transition-all group">
                                <div className="p-2 bg-slate-50 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600 rounded-lg transition-colors">
                                    <ClockIcon className="h-5 w-5 stroke-[2]" />
                                </div>
                                <div>
                                    <Typography className="text-sm font-bold text-gray-800">Historial de Turnos</Typography>
                                    <Typography className="text-[11px] text-gray-500">Revisa tus horas trabajadas y montos entregados.</Typography>
                                </div>
                            </div>
                        </Link>

                        <Link href={route('repartidor.sales.index')} className="block">
                            <div className="p-4 bg-white border border-gray-200/60 hover:border-gray-300 rounded-xl flex items-center gap-3 transition-all group">
                                <div className="p-2 bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg transition-colors">
                                    <DocumentTextIcon className="h-5 w-5 stroke-[2]" />
                                </div>
                                <div>
                                    <Typography className="text-sm font-bold text-gray-800">Historial de Ventas</Typography>
                                    <Typography className="text-[11px] text-gray-500">Comprueba los tickets y ventas cobradas hoy.</Typography>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="text-center pt-6 border-t border-gray-100 flex flex-col items-center justify-center gap-1">
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

// SUBCOMPONENTE DE MÉTRICAS ADAPTATIVO
function EmployeeStatCard({ title, value, icon: Icon, colorTheme = "gray" }) {
    const themes = {
        amber: {
            title: "text-amber-700",
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600"
        },
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
                <Typography className={`text-[10px] font-bold ${currentTheme.title} uppercase tracking-wider`}>
                    {title}
                </Typography>
                <Typography variant="h4" className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {value}
                </Typography>
            </div>
            <div className={`p-3 rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor} shrink-0`}>
                <Icon className="w-5 h-5 stroke-[2]" />
            </div>
        </Card>
    );
}
