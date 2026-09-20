import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import {
    CheckIcon,
    XMarkIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    SparklesIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/solid";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// 🇪🇨 DICCIONARIO DE TRADUCCIONES ACTUALIZADO
const labelTranslations = {
    // Límites
    'app_users': 'Acceso App Repartidor',
    'employees': 'Empleados',
    'clients': 'Clientes',
    'routes_per_day': 'Rutas/día',
    'products': 'Productos',

    // Módulos
    'routes': 'Gestión de Rutas',
    'inventory': 'Control Inventario',
    'cash_closing': 'Cierre de Caja',
    'purchases': 'Módulo Compras',
    'payroll': 'Nómina / Roles',
    'offline': 'Modo Offline'
};

export default function Expired({ auth, currentPlanName = 'basico', subscriptionEndsAt, allPlans }) {
    const [loading, setLoading] = useState(false);

    // DATOS DE SOPORTE WHATSAPP
    const WHATSAPP_SOPORTE = "593980659712";
    const mensajeWpp = encodeURIComponent("Hola, mi suscripción ha vencido y me gustaría realizar el pago de renovación.");

    const handleCheckStatus = () => {
        setLoading(true);
        router.get(route('dashboard'), {}, {
            onFinish: () => setLoading(false),
        });
    };

    const formattedExpiry = subscriptionEndsAt
        ? new Date(subscriptionEndsAt.includes('T') ? subscriptionEndsAt : `${subscriptionEndsAt}T00:00:00`).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
        : "Vencido / Expirado";

    // Fallback utilizando las mismas llaves del archivo PHP
    const plansToDisplay = allPlans || {
        basico: { name: 'Básico Esencial', price: 14.99, limits: { app_users: 1, employees: 3, clients: 300, routes_per_day: 25, products: 10 }, modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: false, offline: false } },
        basico_pro: { name: 'Básico Pro', price: 19.99, limits: { app_users: 2, employees: 5, clients: 500, routes_per_day: 25, products: 10 }, modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: false, offline: false } },
        premium: { name: 'Premium', price: 29.99, limits: { app_users: 4, employees: 7, clients: 1500, routes_per_day: 50, products: 20 }, modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: false, offline: false } },
        empresarial: { name: 'Empresarial', price: 49.99, limits: { app_users: 10, employees: 15, clients: 3000, routes_per_day: 999, products: 99999 }, modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: true, offline: false } },
        vip: { name: 'VIP / Corporativo', price: 99.99, limits: { app_users: 20, employees: 25, clients: 9999, routes_per_day: 9999, products: 99999 }, modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: true, offline: false } },
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
                <Head title="Suscripción Vencida" />

                <div className="max-w-[90rem] mx-auto space-y-8">

                    {/* ALERTA PRINCIPAL */}
<Card className="p-5 sm:p-6 md:p-8 border border-red-200/80 bg-gradient-to-r from-red-50/50 via-white to-white shadow-xl shadow-red-500/5 rounded-2xl">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="p-3.5 bg-red-100/80 text-red-600 rounded-2xl shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 sm:h-9 sm:w-9" />
            </div>
            <div>
                <Typography variant="h4" color="blue-gray" className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Acceso Suspendido por Vencimiento
                </Typography>
                <Typography variant="paragraph" className="mt-1 text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
                    El acceso operativo a tu planta purificadora se encuentra temporalmente pausado. Transfiere el monto correspondiente y confirma tu pago para reactivar el servicio.
                </Typography>
            </div>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3 w-full lg:w-auto">
            <Button
                color="green"
                size="md"
                className="flex items-center gap-2 shadow-md shadow-green-500/20 capitalize font-bold text-xs sm:text-sm py-3 px-4 sm:px-5 rounded-xl grow sm:grow-0 justify-center"
                onClick={() => window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWpp}`, '_blank')}
            >
                Notificar Pago (WhatsApp)
            </Button>

            <Button
                variant="outlined"
                color="indigo"
                size="md"
                disabled={loading}
                onClick={handleCheckStatus}
                className="flex items-center gap-2 capitalize font-bold text-xs sm:text-sm py-3 px-4 rounded-xl grow sm:grow-0 justify-center"
            >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Verificando...' : 'Verificar Estado'}
            </Button>

            <Button
                variant="text"
                color="gray"
                size="md"
                onClick={() => router.post(route('logout'))}
                className="flex items-center gap-1.5 capitalize font-bold text-xs sm:text-sm py-3 px-3 rounded-xl hover:bg-red-50 hover:text-red-600"
            >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Salir
            </Button>
        </div>
    </div>
</Card>

                    {/* DETALLE DEL PLAN EXPIRADO */}
                    <Card className="p-5 border border-slate-200/80 bg-white shadow-xs rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                                Estado Actual:
                            </Typography>
                            <Chip
                                size="md"
                                value={`Plan Anterior: ${plansToDisplay[currentPlanName]?.name || currentPlanName}`}
                                color="red"
                                variant="gradient"
                                className="font-bold rounded-lg capitalize"
                            />
                        </div>

                        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-100/70 border border-slate-200 rounded-xl">
                            <CalendarDaysIcon className="h-5 w-5 text-slate-500" />
                            <Typography variant="small" color="gray" className="font-semibold text-xs">
                                Venció el: <span className="text-red-600 font-bold ml-1">{formattedExpiry}</span>
                            </Typography>
                        </div>
                    </Card>

                    {/* SECCIÓN DE PLANES Y PRECIOS */}
                    <div className="space-y-4">
                        <div>
                            <Typography variant="h4" color="blue-gray" className="font-extrabold">
                                Selecciona o Renueva tu Plan
                            </Typography>
                            <Typography variant="small" color="gray" className="text-sm">
                                Explora las características de cada suscripción y elige la que se adapte al crecimiento de tu empresa.
                            </Typography>
                        </div>

                        {/* GRID DE PLANES (5 COLUMNAS RESPONSIVAS) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
                            {Object.entries(plansToDisplay).map(([key, details]) => {
                                const isCurrent = key === currentPlanName;
                                const isPopular = key === 'premium';

                                return (
                                    <Card
                                        key={key}
                                        className={`relative p-5 bg-white flex flex-col justify-between transition-all rounded-2xl ${
                                            isPopular
                                                ? 'border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/10'
                                                : isCurrent
                                                ? 'border-2 border-slate-400 shadow-md'
                                                : 'border border-slate-200 shadow-xs hover:border-slate-300'
                                        }`}
                                    >
                                        {/* Insignia para Plan Recomendado */}
                                        {isPopular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1 tracking-wider">
                                                    <SparklesIcon className="h-3 w-3" /> Recomendado
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            {/* Título y Badge */}
                                            <div className="flex justify-between items-start gap-2 mb-3">
                                                <Typography variant="h6" color="blue-gray" className="font-black leading-snug">
                                                    {details.name || key}
                                                </Typography>
                                                {isCurrent && (
                                                    <Chip size="sm" color="amber" value="Actual" className="text-[10px] px-2 py-0.5 font-bold" />
                                                )}
                                            </div>

                                            {/* Precio */}
                                            <div className="mb-5 pb-4 border-b border-slate-100">
                                                <div className="flex items-baseline gap-1">
                                                    <Typography variant="h3" color="blue-gray" className="font-black tracking-tight">
                                                        ${details.price}
                                                    </Typography>
                                                    <Typography variant="small" color="gray" className="text-xs font-medium">
                                                        /mes
                                                    </Typography>
                                                </div>
                                            </div>

                                            {/* Límites */}
                                            <div className="mb-5 space-y-2">
                                                <Typography variant="small" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                    Capacidad
                                                </Typography>
                                                <div className="space-y-1.5 text-xs">
                                                    {details.limits && Object.entries(details.limits).map(([limitKey, value]) => (
                                                        <div key={limitKey} className="flex justify-between items-center py-0.5 border-b border-slate-50">
                                                            <span className="text-slate-500">{labelTranslations[limitKey] || limitKey}:</span>
                                                            <span className="font-bold text-slate-800">
                                                                {value >= 999 ? 'Ilimitado' : value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Módulos */}
                                            <div className="space-y-2 mb-4">
                                                <Typography variant="small" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                    Módulos
                                                </Typography>
                                                <ul className="space-y-1.5 text-xs">
                                                    {details.modules && Object.entries(details.modules).map(([modKey, enabled]) => (
                                                        <li key={modKey} className="flex items-center gap-2">
                                                            {enabled ? (
                                                                <CheckIcon className="h-3.5 w-3.5 text-emerald-500 stroke-[3] shrink-0" />
                                                            ) : (
                                                                <XMarkIcon className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                                            )}
                                                            <span className={enabled ? 'text-slate-700 font-medium' : 'text-slate-400 line-through'}>
                                                                {labelTranslations[modKey] || modKey}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Botón de Selección rápida */}
                                        <div className="pt-2">
                                            <Button
                                                size="sm"
                                                variant={isPopular ? "gradient" : "outlined"}
                                                color={isPopular ? "indigo" : "blue-gray"}
                                                fullWidth
                                                className=" capitalize font-bold text-xs py-2.5 rounded-lg"
                                                onClick={() => {
                                                    const msg = encodeURIComponent(`Hola, deseo renovar mi servicio con el plan: ${details.name || key}`);
                                                    window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${msg}`, '_blank');
                                                }}
                                            >
                                                Solicitar Plan
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
