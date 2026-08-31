import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import {
    CheckIcon,
    XMarkIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";

// 🇪🇨 DICCIONARIO DE TRADUCCIONES PARA LÍMITES Y MÓDULOS
const labelTranslations = {
    // Límites
    'app_users': 'Personal con acceso a la App',
    'employees': 'Empleados permitidos',
    'clients': 'Clientes permitidos',
    'routes_per_day': 'Rutas por día',
    'products': 'Productos en catálogo',

    // Módulos
    'routes': 'Gestión de Rutas',
    'inventory': 'Control de Inventario',
    'cash_closing': 'Cierre de Caja',
    'purchases': 'Módulo de Compras',
    'payroll': 'Nómina / Roles de Pago'
};

export default function Expired({ auth, currentPlanName = 'basico', subscriptionEndsAt, allPlans }) {
    const [loading, setLoading] = useState(false);

    //  DATOS DE SOPORTE WHATSAPP
    const WHATSAPP_SOPORTE = "593980659712"; // Reemplaza con tu número de Ecuador
    const mensajeWpp = encodeURIComponent("Hola, mi suscripción ha vencido y me gustaría realizar el pago de renovación.");

    // Recarga el estado actual para verificar si el super_admin ya activó la cuenta
    const handleCheckStatus = () => {
        setLoading(true);
        router.get(route('dashboard'), {}, {
        onFinish: () => setLoading(false),
    });
    };

    // Formateador de fecha en español (Ecuador)
    const formattedExpiry = subscriptionEndsAt
        ? new Date(subscriptionEndsAt.includes('T') ? subscriptionEndsAt : `${subscriptionEndsAt}T00:00:00`).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
        : "Vendido / Expirado";

    // Fallback de seguridad en caso de que la ruta no envíe la variable allPlans
    const plansToDisplay = allPlans || {
        basico: {
            price: 25,
            limits: { app_users: 2, employees: 5, clients: 100, routes_per_day: 1, products: 10 },
            modules: { routes: true, inventory: true, cash_closing: true, purchases: false, payroll: false }
        },
        premium: {
            price: 45,
            limits: { app_users: 5, employees: 15, clients: 500, routes_per_day: 5, products: 50 },
            modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: false }
        },
        empresarial: {
            price: 75,
            limits: { app_users: 999, employees: 999, clients: 999, routes_per_day: 999, products: 999 },
            modules: { routes: true, inventory: true, cash_closing: true, purchases: true, payroll: true }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Suscripción Vencida" />

            <div className="max-w-7xl mx-auto">

                {/* 🚨 ALERTA PRINCIPAL DE BLOQUEO POR SUSCRIPCIÓN */}
                <Card className="mb-8 p-6 md:p-8 border-2 border-red-200 bg-white shadow-lg rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-xl text-red-600 shrink-0">
                                <ExclamationTriangleIcon className="h-10 w-10" />
                            </div>
                            <div>
                                <Typography variant="h4" color="blue-gray" className="font-bold">
                                    Tu suscripción ha vencido
                                </Typography>
                                <Typography variant="paragraph" color="gray" className="mt-1 max-w-2xl">
                                    El acceso operativo a tu planta purificadora se encuentra temporalmente pausado. Realiza tu pago por transferencia y notifica a soporte para reactivar tu servicio inmediatamente.
                                </Typography>
                            </div>
                        </div>

                        {/* ACCIONES DE REACTIVACIÓN Y LOGOUT */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <Button
                                color="green"
                                size="lg"
                                className="flex items-center justify-center gap-2 shadow-green-100"
                                onClick={() => window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWpp}`, '_blank')}
                            >
                                Notificar Pago (WhatsApp)
                            </Button>

                            <Button
                                variant="outlined"
                                color="indigo"
                                size="lg"
                                disabled={loading}
                                onClick={handleCheckStatus}
                                className="flex items-center justify-center gap-2"
                            >
                                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Verificando...' : 'Verificar Estado'}
                            </Button>

                            <Button
                                variant="text"
                                color="red"
                                size="lg"
                                onClick={() => router.post(route('logout'))}
                            >
                                Salir
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* 1. SECCIÓN DESTACADA: ESTADO DEL PLAN ANTERIOR */}
                <Card className="mb-10 p-6 border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Typography variant="h5" color="blue-gray" className="font-bold">
                                Plan Vencido:
                            </Typography>
                            <Chip
                                size="md"
                                variant="gradient"
                                value={currentPlanName === 'basico' ? 'Básico' : currentPlanName}
                                color={
                                    currentPlanName === "basico" ? "cyan" :
                                    currentPlanName === "premium" ? "purple" : "indigo"
                                }
                                className="capitalize font-bold"
                            />
                        </div>
                        <Typography variant="paragraph" color="gray" className="max-w-xl">
                            Revisa a continuación los módulos y límites correspondientes a tu plan contratado o aprovecha la renovación para actualizar a una versión superior.
                        </Typography>
                    </div>

                    <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-red-100 rounded-xl shadow-2xs">
                        <CalendarDaysIcon className="h-6 w-6 text-red-500" />
                        <div>
                            <Typography variant="small" color="gray" className="font-medium leading-none mb-1">
                                Fecha de corte:
                            </Typography>
                            <Typography variant="small" color="red" className="font-bold">
                                {formattedExpiry}
                            </Typography>
                        </div>
                    </div>
                </Card>

                {/* 2. PARRILLA COMPARATIVA DE PLANES */}
                <div className="mb-6">
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        Planes Disponibles para Renovación
                    </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {Object.entries(plansToDisplay).map(([name, details]) => {
                        const isCurrent = name === currentPlanName;

                        return (
                            <Card
                                key={name}
                                className={`p-6 bg-white border transition-all ${
                                    isCurrent
                                        ? 'border-2 border-indigo-500 shadow-md ring-4 ring-indigo-500/5 scale-[1.01]'
                                        : 'border-blue-gray-100 shadow-xs hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <Typography variant="h4" color="blue-gray" className="capitalize font-extrabold">
                                        {name === 'basico' ? 'Básico' : name}
                                    </Typography>
                                    {isCurrent && (
                                        <Chip size="sm" color="indigo" value="Tu Plan" className="font-bold rounded-full px-3" />
                                    )}
                                </div>

                                <div className="flex items-baseline gap-1 mb-6">
                                    <Typography variant="h2" color="blue-gray" className="font-extrabold">
                                        {new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(details.price)}
                                    </Typography>
                                    <Typography variant="small" color="gray" className="font-normal text-xs ml-1">
                                        / mes
                                    </Typography>
                                </div>

                                {/* Límites Operativos */}
                                <div className="mb-6">
                                    <Typography variant="small" color="blue-gray" className="font-bold uppercase tracking-wider text-xs opacity-60 mb-3">
                                        Límites incluidos
                                    </Typography>
                                    <div className="space-y-2.5">
                                        {details.limits && Object.entries(details.limits).map(([limit, value]) => (
                                            <div key={limit} className="flex justify-between items-center py-1 border-b border-blue-gray-50/50">
                                                <Typography variant="small" color="gray">
                                                    {labelTranslations[limit] || limit}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                    {value >= 999 ? 'Ilimitado' : value}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Módulos Habilitados */}
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-bold uppercase tracking-wider text-xs opacity-60 mb-3">
                                        Módulos habilitados
                                    </Typography>
                                    <ul className="space-y-2">
                                        {details.modules && Object.entries(details.modules).map(([module, enabled]) => (
                                            <li key={module} className="flex items-center gap-2.5 text-sm">
                                                {enabled ? (
                                                    <CheckIcon className="h-4 w-4 text-green-500 stroke-[3]" />
                                                ) : (
                                                    <XMarkIcon className="h-4 w-4 text-red-300" />
                                                )}
                                                <span className={` ${enabled ? 'text-gray-800 font-medium' : 'text-gray-400 line-through'}`}>
                                                    {labelTranslations[module] || module}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
