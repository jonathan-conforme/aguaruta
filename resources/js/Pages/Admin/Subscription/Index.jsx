import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Chip } from "@material-tailwind/react";
import { CheckIcon, XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

// 🇪🇨 DICCIONARIO DE TRADUCCIONES PARA LÍMITES Y MÓDULOS
const labelTranslations = {
    // Límites
    'employees': 'Empleados permitidos',
    'clients': 'Clientes máximos',
    'routes_per_day': 'Rutas por día',
    'products': 'Productos en catálogo',

    // Módulos
    'routes': 'Gestión de Rutas',
    'inventory': 'Control de Inventario',
    'cash_closing': 'Cierre de Caja',
    'purchases': 'Módulo de Compras',
    'payroll': 'Nómina / Roles de Pago'
};

export default function Index({ auth, currentPlanName, subscriptionEndsAt, allPlans }) {

    // Formateador de fecha en español (Ecuador)
    const formattedExpiry = subscriptionEndsAt
        ? new Date(subscriptionEndsAt).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
        : "Ilimitado / Sin vencimiento";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Suscripción</h2>}
        >
            <Head title="Mi Plan y Suscripción" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ENCABEZADO DE LA SECCIÓN */}
                    <div className="mb-8">
                        <Typography variant="h4" color="blue-gray" className="font-bold">
                            Estado del Servicio
                        </Typography>
                        <Typography variant="small" color="gray" className="font-normal mt-1">
                            Consulta las características de tu plan actual y conoce las opciones para hacer crecer tu negocio.
                        </Typography>
                    </div>

                    {/* 1. SECCIÓN SUPERIOR: SECTOR DESTACADO DEL PLAN ACTUAL */}
                    <Card className="mb-10 p-6 border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Typography variant="h5" color="blue-gray" className="font-bold">
                                    Plan Activo:
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
                                Tu empresa cuenta actualmente con los límites operativos y accesos modulares configurados para el nivel <span className="font-semibold capitalize text-indigo-600">{currentPlanName === 'basico' ? 'Básico' : currentPlanName}</span>.
                            </Typography>
                        </div>

                        <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-2xs">
                            <CalendarDaysIcon className="h-6 w-6 text-indigo-500" />
                            <div>
                                <Typography variant="small" color="gray" className="font-medium leading-none mb-1">
                                    Vence el
                                </Typography>
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                    {formattedExpiry}
                                </Typography>
                            </div>
                        </div>
                    </Card>

                    <hr className="border-blue-gray-50 mb-10" />

                    {/* 2. SECCIÓN INFERIOR: PARRILLA COMPARATIVA DE PLANES */}
                    <div className="mb-6">
                        <Typography variant="h5" color="blue-gray" className="font-bold">
                            Planes del Sistema
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {Object.entries(allPlans).map(([name, details]) => {
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
                                    {/* Cabecera del Plan */}
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography variant="h4" color="blue-gray" className="capitalize font-extrabold">
                                            {name === 'basico' ? 'Básico' : name}
                                        </Typography>
                                        {isCurrent && (
                                            <Chip size="sm" color="indigo" value="Tu Plan" className="font-bold rounded-full px-3" />
                                        )}
                                    </div>

                                    {/* 🛠️ AQUÍ SE HACE EL CAMBIO: PRECIO FORMATEADO EN USD */}
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <Typography variant="h2" color="blue-gray" className="font-extrabold">
                                            {new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(details.price)}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal text-xs ml-1">
                                            / mes
                                        </Typography>
                                    </div>

                                    {/* Límites Operativos Traducidos */}
                                    <div className="mb-6">
                                        <Typography variant="small" color="blue-gray" className="font-bold uppercase tracking-wider text-xs opacity-60 mb-3">
                                            Límites incluidos
                                        </Typography>
                                        <div className="space-y-2.5">
                                            {Object.entries(details.limits).map(([limit, value]) => (
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

                                    {/* Módulos Disponibles Traducidos */}
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="font-bold uppercase tracking-wider text-xs opacity-60 mb-3">
                                            Módulos habilitados
                                        </Typography>
                                        <ul className="space-y-2">
                                            {Object.entries(details.modules).map(([module, enabled]) => (
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
        </AuthenticatedLayout>
    );
}
