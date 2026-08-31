import React from 'react';
import StatCard from "@/Components/UI/StatCard";
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
    WrenchScrewdriverIcon,
    ArrowPathIcon,
    TruckIcon,
    QrCodeIcon,
    BanknotesIcon
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
            header={<span className="text-lg font-bold text-gray-800 tracking-tight">Panel de Operaciones</span>}
        >
            <Head title="Mi Ruta" />

            <div className="max-w-7xl mx-auto space-y-6">

                {/* BANNER DE BIENVENIDA OPERATIVO */}
               <Card className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div className="flex items-center gap-4">
        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 hidden sm:block">
            <TruckIcon className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
            <div className="flex items-center gap-2">
                <Typography variant="h4" className="text-xl font-bold text-gray-900 tracking-tight">
                    ¡Hola, {auth.user.name.split(' ')[0]}! 👋
                </Typography>

                {/* BADGE MEJORADO: Verde Esmeralda con borde visible y fondo sólido */}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300 shadow-xs">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span> Turno Activo
                </span>
            </div>
            <Typography className="text-xs text-gray-500 mt-0.5">
                Revisa el avance de tu ruta, registra cobros y cuadra tu caja en tiempo real.
            </Typography>
        </div>
    </div>
    <div className="flex gap-2 w-full sm:w-auto">
        <Link href={route('repartidor.trips.index')} className="w-full sm:w-auto">
            <Button size="sm" className="w-full flex items-center justify-center gap-2 rounded-xl normal-case bg-indigo-600 hover:bg-indigo-700 text-white shadow-none hover:shadow-none text-xs py-2.5 font-bold">
                <MapIcon className="w-4 h-4 stroke-[2.5]" /> Ver Mapa de Ruta
            </Button>
        </Link>
    </div>
</Card>

                {/* BLOQUE 1: RECAUDO Y CAJA DE HOY */}
                <div className="space-y-3">
                    <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Recaudo y Cuadre de Caja
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <StatCard
                            title="Efectivo Neto en Mano"
                            value={formatCurrency(data.collectedCash)}
                            icon={BanknotesIcon}
                            colorTheme="green"
                            description="Cobros en físico menos gastos"
                        />
                        <StatCard
                            title="Cobros por Transferencia"
                            value={formatCurrency(data.collectedTransfer)}
                            icon={QrCodeIcon}
                            colorTheme="blue"
                            description="Depositado directamente a cuenta"
                        />
                        <StatCard
                            title="Gastos Registrados"
                            value={formatCurrency(data.totalExpenses)}
                            icon={WrenchScrewdriverIcon}
                            colorTheme="amber"
                            description="Viáticos y combustible abonados"
                        />
                    </div>
                </div>

                {/* BLOQUE 2: OPERACIONES Y ENTREGAS */}
                <div className="space-y-3">
                    <Typography className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Rendimiento Operativo
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                        <StatCard
                            title="Productos Vendidos / Entregados"
                            value={`${data.totalProductsSold} pzas`}
                            icon={ShoppingBagIcon}
                            colorTheme="purple"
                            description="Unidades entregadas en la jornada"
                        />
                        <StatCard
                            title="Envases Recuperados"
                            value={`${data.recoveredBottles} pzas`}
                            icon={ArrowPathIcon}
                            colorTheme="indigo"
                            description="Botellones retornados a cabina"
                        />
                    </div>
                </div>

                {/* BLOQUE 3: ESTADO DE LA RUTA Y ACCIONES RÁPIDAS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* PROGRESO DE LA RUTA */}
                    <Card className="lg:col-span-5 p-6 bg-white shadow-sm border border-gray-100 rounded-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <Typography className="text-sm font-bold text-slate-800">Avance de Entregas</Typography>
                                    <Typography className="text-[11px] text-slate-400">Progreso del viaje en curso</Typography>
                                </div>
                                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                    {completionPercentage}%
                                </span>
                            </div>

                            <div className="my-6 space-y-2">
                                <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5">
                                    <div
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[11px] font-semibold text-slate-500 pt-1">
                                    <span>{data.completedDeliveries} Completadas</span>
                                    <span>{data.pendingDeliveries} Pendientes</span>
                                </div>
                            </div>
                        </div>

                        <Link href={route('repartidor.trips.index')} className="w-full">
                            <Button className="w-full rounded-xl normal-case shadow-none hover:shadow-none flex justify-center items-center gap-2 text-xs py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                <MapIcon className="w-4 h-4 stroke-[2]" /> Continuar Recorrido
                            </Button>
                        </Link>
                    </Card>

                    {/* CIERRE Y GESTIÓN DE GASTOS */}
                    <Card className="lg:col-span-7 p-6 bg-white shadow-sm border border-gray-100 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Typography className="text-sm font-bold text-slate-800">Cierre de Turno y Viáticos</Typography>
                                <span className="p-1 bg-amber-50 text-amber-600 rounded-lg">
                                    <ExclamationCircleIcon className="w-4 h-4 stroke-[2.5]" />
                                </span>
                            </div>
                            <Typography className="text-xs text-slate-500 leading-relaxed">
                                Reporta combustible o Imprevistos mecánicos antes de liquidar tu caja física. Al finalizar el turno, entrega el efectivo neto acumulado.
                            </Typography>
                        </div>
<div className="flex flex-col sm:flex-row gap-3 pt-2">

    {/* Registrar Gasto con variante Outlined/Filled de Material Tailwind */}
    <Link href={route('repartidor.expenses.create', data.activeTripId)} className="flex-1 ">
        <Button
            color="indigo"
            variant="outlined"
            className="w-full rounded-xl normal-case text-xs py-3 font-bold flex items-center justify-center gap-2 bg-slate-100 border-slate-300 text-slate-800"
        >
            <WrenchScrewdriverIcon className="w-4 h-4 stroke-[2] text-amber-600" />
            Registrar Gasto
        </Button>
    </Link>

    {/* Terminar Jornada */}
    <Link href={route('repartidor.shifts.close')} className="flex-1">
        <Button
            color="amber"
            className="w-full rounded-xl normal-case shadow-none text-xs py-3 text-slate-900 font-bold flex items-center justify-center gap-2"
        >
            <ClockIcon className="w-4 h-4 stroke-[2]" />
            Terminar Jornada
        </Button>
    </Link>

</div>
                    </Card>

                </div>

                {/* ACCESOS DIRECTOS */}
                <Card className="p-6 bg-white shadow-sm border border-gray-100 rounded-2xl">
                    <Typography className="text-sm font-bold text-slate-800 mb-1">Consultas y Accesos Rápidos</Typography>
                    <Typography className="text-xs text-slate-400 mb-4">Revisión de comprobantes e historial de movimientos</Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href={route('repartidor.sales.index')} className="w-full">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition group">
                                <div className="p-2.5 bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 rounded-lg transition-colors">
                                    <DocumentTextIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Historial de Ventas</div>
                                    <div className="text-[10px] text-slate-400">Ver tickets y cobros del día</div>
                                </div>
                            </div>
                        </Link>

                        <Link href={route('repartidor.shifts.index')} className="w-full">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition group">
                                <div className="p-2.5 bg-slate-50 group-hover:bg-amber-50 text-slate-500 group-hover:text-amber-600 rounded-lg transition-colors">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">Historial de Turnos</div>
                                    <div className="text-[10px] text-slate-400">Consultar cierres y horas trabajadas</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </Card>

                {/* FOOTER */}
                <div className="text-center pt-2 flex flex-col items-center justify-center gap-0.5 pb-4">
                    <Typography className="text-[10px] text-gray-400 font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} AguaRutaTech. Todos los derechos reservados.
                    </Typography>
                    <Typography className="text-[9px] text-indigo-500/80 font-bold tracking-widest uppercase">
                        Production Stable • v2.1
                    </Typography>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
