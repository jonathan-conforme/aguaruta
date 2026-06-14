import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShiftCard from '@/Components/Shifts/ShiftCard';
import { Typography } from "@material-tailwind/react";
import { BanknotesIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function Index({ auth, shifts }) {
    // 💡 Al usar ->paginate() en Laravel, los registros viven en shifts.data
    const shiftsList = shifts?.data || [];
    const links = shifts?.links || [];

    const isAdminRole = auth.user.role === 'admin';

    // 🔥 AGRUPAR POR FECHA (Tratando de manera segura el array limpio)
    const agruparPorFecha = (lista) => {
        const grupos = {};

        lista.forEach((shift) => {
            const fecha = new Date(shift.opened_at);
            const hoy = new Date();

            // Forzar comparación limpia de fechas eliminando horas
            hoy.setHours(0, 0, 0, 0);
            const fechaCaja = new Date(fecha);
            fechaCaja.setHours(0, 0, 0, 0);

            const diff = Math.floor((hoy - fechaCaja) / (1000 * 60 * 60 * 24));

            let label = fecha.toLocaleDateString();
            if (diff === 0) label = "Hoy";
            else if (diff === 1) label = "Ayer";
            else if (diff === 2) label = "Antes de ayer";

            if (!grupos[label]) {
                grupos[label] = [];
            }
            grupos[label].push(shift);
        });

        return grupos;
    };

    const grupos = agruparPorFecha(shiftsList);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <BanknotesIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-none">
                                Historial de Cajas
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {isAdminRole ? "Control global de ingresos por turno" : "Mis turnos y arqueos"}
                            </p>
                        </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            }
        >
            <Head title="Historial de Cajas" />

            <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
                <Typography variant="h5" color="blue-gray" className="font-bold">
                    {isAdminRole ? "Historial de cajas" : "Mi historial de actividades"}
                </Typography>

                {shiftsList.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                        <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <Typography className="text-gray-500 font-medium text-sm">No se encontraron registros de caja en este bloque.</Typography>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 pl-6 ml-2 space-y-8">
                        {Object.entries(grupos).map(([fecha, items]) => (
                            <div key={fecha} className="relative">
                                {/* PUNTO DEL TIMELINE */}
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-sm font-bold" />

                                <Typography className="mb-4 font-bold text-xs uppercase tracking-wider text-gray-500 bg-gray-100 inline-block px-2.5 py-1 rounded">
                                    {fecha}
                                </Typography>

                                <div className="flex flex-col gap-6">
                                    {items.map((shift) => (
                                        <ShiftCard
                                            key={shift.id}
                                            shift={shift}
                                            isAdmin={isAdminRole} // Pasamos de forma dinámica el rol actual
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* BOTONES DE PAGINACIÓN COMPATIBLES CON LARAVEL PAGINATE */}
                {links.length > 3 && (
                    <div className="flex justify-center items-center gap-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-6">
                        {links.map((link, index) => {
                            const label = link.label.replace('&laquo; Previous', 'Anterior').replace('Next &raquo;', 'Siguiente');
                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    disabled={!link.url}
                                    as="button"
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${link.active
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : !link.url
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}