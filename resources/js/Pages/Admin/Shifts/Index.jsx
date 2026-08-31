import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ShiftSummaryCards from "@/Components/UI/ShiftSummaryCards";
import ShiftCard from '@/Components/Shifts/ShiftCard';
import Modal from '@/Components/Modal';

import { Typography } from "@material-tailwind/react";
import {
    BanknotesIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/solid";

export default function Index({ auth, shifts, totals, filters }) {
    const isAdminRole = auth?.user?.role === 'admin';
    const shiftsList = shifts?.data || [];
    const links = shifts?.links || [];

    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    // === ESTADOS PARA EL MODAL DE VALIDACIÓN ===
    const [modalError, setModalError] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Helper para verificar validez silenciosa (para el botón de PDF)
    const checkIsInvalid = (start, end) => {
        if (!start || !end) return false;
        const startD = new Date(start);
        const endD = new Date(end);
        if (endD < startD) return true;

        const diffDays = Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24));
        return diffDays > 31;
    };

    const isInvalidRange = checkIsInvalid(startDate, endDate);

    // Función para aplicar filtros con validación y Modal
    const handleFilter = (start, end) => {
        if (start && end) {
            const startD = new Date(start);
            const endD = new Date(end);

            if (endD < startD) {
                setModalError("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
                setShowModal(true);
                return;
            }

            const diffDays = Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24));
            if (diffDays > 31) {
                setModalError("Solo puedes consultar o descargar reportes de hasta 1 mes (31 días).");
                setShowModal(true);
                return;
            }
        }

        router.get(
            route(isAdminRole ? 'admin.shifts.index' : 'repartidor.shifts.index'),
            {
                ...(start && { start_date: start }),
                ...(end && { end_date: end })
            },
            { preserveState: true, replace: true }
        );
    };

    // FUNCIÓN PARA RANGOS RÁPIDOS (Hoy, 7 días, 15 días, Mes)
    const applyPredefinedRange = (days) => {
        const today = new Date();
        const end = new Date(today);
        const start = new Date(today);

        if (days > 0) {
            start.setDate(today.getDate() - days);
        }

        // Formato local YYYY-MM-DD sin desfase UTC
        const formatDate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startStr = formatDate(start);
        const endStr = formatDate(end);

        setStartDate(startStr);
        setEndDate(endStr);
        handleFilter(startStr, endStr);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        router.get(route(isAdminRole ? 'admin.shifts.index' : 'repartidor.shifts.index'));
    };

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

            if (!grupos[label]) grupos[label] = [];
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
                {/* FILTRO Y EXPORTACIÓN */}
                <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm w-full sm:w-auto">
                            <FunnelIcon className="h-5 w-5 text-indigo-500" />
                            <span>Rango de fechas:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Desde:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        handleFilter(e.target.value, endDate);
                                    }}
                                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Hasta:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        handleFilter(startDate, e.target.value);
                                    }}
                                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {(startDate || endDate) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline whitespace-nowrap"
                                >
                                    Limpiar
                                </button>
                            )}

                            {/* BOTÓN PDF CON CONTROL DE DESACTIVACIÓN */}
                            {isInvalidRange ? (
                                <button
                                    type="button"
                                    disabled
                                    title="Selecciona un rango válido (máximo 31 días) para descargar el PDF"
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed shadow-none ml-auto sm:ml-0"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                    Descargar PDF
                                </button>
                            ) : (
                                <a
                                    href={route(
                                        isAdminRole ? "admin.shifts.export.pdf" : "repartidor.shifts.export.pdf",
                                        {
                                            ...(startDate && { start_date: startDate }),
                                            ...(endDate && { end_date: endDate }),
                                        }
                                    )}
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-indigo-700 transition-all ml-auto sm:ml-0"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                    Descargar PDF
                                </a>
                            )}
                        </div>
                    </div>

                    {/* BOTONES DE SELECCIÓN RÁPIDA DE FECHA */}
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                        <span className="text-xs font-medium text-gray-400 mr-1">Filtros rápidos:</span>
                        <button
                            type="button"
                            onClick={() => applyPredefinedRange(0)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
                        >
                            Hoy
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPredefinedRange(7)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
                        >
                            7 días
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPredefinedRange(15)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
                        >
                            15 días
                        </button>
                        <button
                            type="button"
                            onClick={() => applyPredefinedRange(30)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all"
                        >
                            Mes
                        </button>
                    </div>
                </div>

                {/* TARJETAS DE RESUMEN */}
                <ShiftSummaryCards {...totals} />

                <div className="flex items-center justify-between pt-2">
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                        {isAdminRole ? "Historial de cajas" : "Mi historial de actividades"}
                    </Typography>

                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        Mostrando {shiftsList.length} registros
                    </span>
                </div>

                {shiftsList.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                        <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <Typography className="text-gray-500 font-medium text-sm">
                            {(startDate || endDate)
                                ? "No se encontraron registros para el rango seleccionado."
                                : "No se encontraron registros de caja en este bloque."
                            }
                        </Typography>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 pl-6 ml-2 space-y-8">
                        {Object.entries(grupos).map(([fecha, items]) => (
                            <div key={fecha} className="relative">
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

                {/* PAGINACIÓN */}
                {links.length > 3 && (
                    <div className="flex justify-center items-center gap-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-6">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                disabled={!link.url}
                                as="button"
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    link.active
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : !link.url
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {link.label.replace('&laquo; Previous', 'Anterior').replace('Next &raquo;', 'Siguiente')}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* INTEGRACIÓN DEL COMPONENTE MODAL */}
            <Modal
                show={showModal}
                maxWidth="md"
                onClose={() => setShowModal(false)}
            >
                <div className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
                        <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Rango de fechas no permitido
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        {modalError}
                    </p>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
