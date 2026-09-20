import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import {
    CheckIcon,
    XMarkIcon,
    CalendarDaysIcon,
    SparklesIcon,
    BuildingStorefrontIcon,
    ArrowUpRightIcon
} from "@heroicons/react/24/solid";

const labelTranslations = {
    'app_users': 'App Repartidor',
    'employees': 'Empleados',
    'clients': 'Clientes',
    'routes_per_day': 'Rutas / día',
    'products': 'Productos',
    'routes': 'Gestión de Rutas',
    'inventory': 'Control Inventario',
    'cash_closing': 'Cierre de Caja',
    'purchases': 'Módulo Compras',
    'payroll': 'Nómina / Roles',
    'offline': 'Modo Offline'
};

const planColors = {
    basico: 'cyan',
    basico_pro: 'blue',
    premium: 'purple',
    empresarial: 'indigo',
    vip: 'amber',
};

export default function Index({ auth, currentPlanName = 'basico', subscriptionEndsAt, allPlans = {} }) {
    const activePlan = allPlans[currentPlanName] || {};
    const activePlanDisplayName = activePlan.name || currentPlanName;
    const activePlanColor = planColors[currentPlanName] || 'indigo';
    const WHATSAPP_SOPORTE = "593980659712";

    const formattedExpiry = subscriptionEndsAt
        ? new Date(subscriptionEndsAt.includes('T') ? subscriptionEndsAt : `${subscriptionEndsAt}T00:00:00`).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
        : "Ilimitado / Sin vencimiento";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-extrabold text-xl text-slate-800 tracking-tight">Mi Suscripción</h2>}
        >
            <Head title="Mi Plan y Suscripción" />

            <div className="py-8 bg-slate-50/60 min-h-screen">
                <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* ENCABEZADO Y PLAN ACTIVO EN CARD COMPACTO */}
                    <Card className="p-6 border border-slate-200/80 bg-white shadow-xs rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <BuildingStorefrontIcon className="h-7 w-7" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Typography variant="h5" color="blue-gray" className="font-black">
                                        Plan Activo: {activePlanDisplayName}
                                    </Typography>
                                    <Chip size="sm" value="En servicio" color={activePlanColor} className="rounded-md font-bold text-[10px]" />
                                </div>
                                <Typography variant="small" className="text-slate-500 text-xs mt-0.5">
                                    Límites y módulos configurados según tu nivel actual de suscripción.
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl">
                            <CalendarDaysIcon className="h-5 w-5 text-indigo-500" />
                            <div className="text-xs">
                                <span className="text-slate-400 block font-medium">Renovación:</span>
                                <span className="font-bold text-slate-800">{formattedExpiry}</span>
                            </div>
                        </div>
                    </Card>

                    {/* SECCIÓN DE PLANES CON SCROLL HORIZONTAL Y ANCHO MÍNIMO REAL (RESPIRABLE) */}
                    <div className="space-y-4">
                        <div>
                            <Typography variant="h4" color="blue-gray" className="font-extrabold tracking-tight">
                                Catálogo de Planes Disponibles
                            </Typography>
                            <Typography variant="small" className="text-slate-500 text-xs">
                                Desliza horizontalmente si deseas comparar todos los planes de un vistazo.
                            </Typography>
                        </div>

                        {/* CONTENEDOR DESLIZABLE CON TARJETAS MÁS ANCHAS (min-w-[270px]) */}
                        <div className="flex overflow-x-auto gap-5 pb-6 pt-2 scrollbar-thin scrollbar-thumb-slate-300">
                            {Object.entries(allPlans).map(([name, details]) => {
                                const isCurrent = name === currentPlanName;
                                const isPopular = name === 'empresarial';

                                return (
                                    <div key={name} className="flex-1 min-w-[275px] max-w-[320px] flex">
                                        <Card
                                            className={`relative p-6 bg-white flex flex-col justify-between w-full transition-all rounded-2xl ${
                                                isPopular
                                                    ? 'border-2 border-indigo-600 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/5'
                                                    : isCurrent
                                                    ? 'border-2 border-slate-400 shadow-sm'
                                                    : 'border border-slate-200 shadow-2xs hover:border-slate-300'
                                            }`}
                                        >
                                            {isPopular && (
                                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs flex items-center gap-1 tracking-wider">
                                                        <SparklesIcon className="h-3 w-3" /> Recomendado
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                {/* Header */}
                                                <div className="flex justify-between items-start gap-2 mb-2">
                                                    <Typography variant="h6" color="blue-gray" className="font-black">
                                                        {details.name}
                                                    </Typography>
                                                    {isCurrent && (
                                                        <Chip size="sm" color="indigo" value="Actual" className="text-[10px] px-2 py-0.5 font-bold rounded-md" />
                                                    )}
                                                </div>

                                                {/* Precio */}
                                                <div className="mb-6 pb-4 border-b border-slate-100">
                                                    <div className="flex items-baseline gap-1">
                                                        <Typography variant="h3" color="blue-gray" className="font-black text-2xl tracking-tight">
                                                            {new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(details.price)}
                                                        </Typography>
                                                        <Typography variant="small" className="text-xs text-slate-400 font-medium">
                                                            /mes
                                                        </Typography>
                                                    </div>
                                                </div>

                                                {/* Límites Operativos Limpios */}
                                                <div className="mb-6 space-y-2.5">
                                                    <Typography variant="small" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                                        Límites incluidos
                                                    </Typography>
                                                    <div className="space-y-2 text-xs">
                                                        {Object.entries(details.limits || {}).map(([limit, value]) => {
                                                            const displayValue = limit === 'app_users'
                                                                ? `${value} Rep. (+1 Admin)`
                                                                : (value >= 999 ? 'Ilimitado' : value);

                                                            return (
                                                                <div key={limit} className="flex justify-between items-center py-1 border-b border-slate-50">
                                                                    <span className="text-slate-500 font-medium">
                                                                        {labelTranslations[limit] || limit}:
                                                                    </span>
                                                                    <span className="font-bold text-slate-800">
                                                                        {displayValue}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Módulos */}
                                                <div className="space-y-2.5 mb-6">
                                                    <Typography variant="small" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                                        Módulos
                                                    </Typography>
                                                    <ul className="space-y-2 text-xs">
                                                        {Object.entries(details.modules || {}).map(([module, enabled]) => (
                                                            <li key={module} className="flex items-center gap-2">
                                                                {enabled ? (
                                                                    <CheckIcon className="h-4 w-4 text-emerald-500 stroke-[3] shrink-0" />
                                                                ) : (
                                                                    <XMarkIcon className="h-4 w-4 text-slate-300 shrink-0" />
                                                                )}
                                                                <span className={enabled ? 'text-slate-700 font-medium' : 'text-slate-400 line-through'}>
                                                                    {labelTranslations[module] || module}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="pt-2">
                                                <Button
                                                    size="sm"
                                                    variant={isCurrent ? "outlined" : isPopular ? "gradient" : "text"}
                                                    color={isCurrent ? "blue-gray" : isPopular ? "indigo" : "indigo"}
                                                    fullWidth
                                                    disabled={isCurrent}
                                                    className="capitalize font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5"
                                                    onClick={() => {
                                                        const msg = encodeURIComponent(`Hola, me interesa realizar un cambio hacia el plan: ${details.name}`);
                                                        window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${msg}`, '_blank');
                                                    }}
                                                >
                                                    {isCurrent ? (
                                                        'Plan Contratado'
                                                    ) : (
                                                        <>
                                                            Solicitar Cambio
                                                            <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
