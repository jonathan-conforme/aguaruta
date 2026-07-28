import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShiftSummaryCards from "@/Components/UI/ShiftSummaryCards";
import ShiftCard from '@/Components/Shifts/ShiftCard';

import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
    BanknotesIcon,
    ExclamationTriangleIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    FunnelIcon,
    CurrencyDollarIcon,
    ArrowDownTrayIcon,
    CalendarIcon
} from "@heroicons/react/24/solid";

export default function Index({ auth, shifts }) {
    // 💡 Al usar ->paginate() en Laravel, los registros viven en shifts.data
    const shiftsList = shifts?.data || [];
    const links = shifts?.links || [];

    const isAdminRole = auth.user.role === 'admin';

    // 🗓️ ESTADO PARA EL FILTRO DE FECHA (formato YYYY-MM-DD para el input date)
    const [selectedDate, setSelectedDate] = useState('');

    // 🔍 FILTRAR LISTA SEGÚN LA FECHA SELECCIONADA
    const filteredShifts = useMemo(() => {
        if (!selectedDate) return shiftsList;

        return shiftsList.filter((shift) => {
            const fechaShift = new Date(shift.opened_at).toISOString().split('T')[0];
            return fechaShift === selectedDate;
        });
    }, [shiftsList, selectedDate]);

    // 💰 CÁLCULO DE TOTALES (Ventas, Gastos y Neto a Recibir)
    const { totalVentas, totalGastos, totalNeto } = useMemo(() => {
        return filteredShifts.reduce(
            (acc, shift) => {
                // 1. Total Ventas del turno (Suma de las ventas en efectivo de sus viajes)
                const ventas = Array.isArray(shift.trips)
                    ? shift.trips.reduce((sum, trip) => sum + parseFloat(trip.cash_sales_sum_total || 0), 0)
                    : parseFloat(shift.total_sales || 0);

                // 2. Total Gastos del turno (Viene del backend con withSum)
                const gastos = parseFloat(shift.expenses_sum_amount || 0);

                // 3. Neto del turno (Ventas - Gastos)
                const neto = ventas - gastos;

                acc.totalVentas += isNaN(ventas) ? 0 : ventas;
                acc.totalGastos += isNaN(gastos) ? 0 : gastos;
                acc.totalNeto += isNaN(neto) ? 0 : neto;

                return acc;
            },
            { totalVentas: 0, totalGastos: 0, totalNeto: 0 }
        );
    }, [filteredShifts]);
    // 🔥 AGRUPAR POR FECHA
    const agruparPorFecha = (lista) => {
        const grupos = {};

        lista.forEach((shift) => {
            const fecha = new Date(shift.opened_at);
            const hoy = new Date();

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

    const grupos = agruparPorFecha(filteredShifts);

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

                {/* BARRA DE FILTRO POR FECHA Y BOTÓN PARA LIMPIAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-700 font-medium text-sm w-full sm:w-auto">
                        <FunnelIcon className="h-5 w-5 text-indigo-500" />
                        <span>Filtrar por día:</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full sm:w-auto text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2.5 pr-8"
                            />
                        </div>

                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate('')}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline whitespace-nowrap"
                            >
                                Ver todos
                            </button>
                        )}
                        <a
                            href={route(
                                auth.user.role === "admin"
                                    ? "admin.shifts.export.pdf"
                                    : "repartidor.shifts.export.pdf",
                                selectedDate ? { date: selectedDate } : {}
                            )}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Descargar PDF
                        </a>

                    </div>
                </div>
                {/*en components/ui/shiftsumarycards estan alli se puede editar o implementar */}
                <ShiftSummaryCards
                    totalVentas={totalVentas}
                    totalGastos={totalGastos}
                    totalNeto={totalNeto}
                />
                <a
                    href={route(
                        auth.user.role === "admin"
                            ? "admin.shifts.export.pdf"
                            : "repartidor.shifts.export.pdf",
                        selectedDate ? { date: selectedDate } : {}
                    )}
                >
                    Descargar PDF
                </a>


                <div className="flex items-center justify-between pt-2">
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        {isAdminRole ? "Historial de cajas" : "Mi historial de actividades"}
                    </Typography>

                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        Mostrando {filteredShifts.length} {filteredShifts.length === 1 ? 'registro' : 'registros'}
                    </span>
                </div>

                {filteredShifts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                        <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <Typography className="text-gray-500 font-medium text-sm">
                            {selectedDate
                                ? `No se encontraron registros para el día ${selectedDate}.`
                                : "No se encontraron registros de caja en este bloque."
                            }
                        </Typography>
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
                                            isAdmin={isAdminRole}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* BOTONES DE PAGINACIÓN COMPATIBLES CON LARAVEL PAGINATE */}
                {links.length > 3 && !selectedDate && (
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
