import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, CardHeader, CardBody, Chip } from "@material-tailwind/react";
import StatCard from '@/Components/UI/StatCard';
import Modal from '@/Components/Modal';

import {
    BanknotesIcon,
    ArrowsRightLeftIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    ArrowDownTrayIcon,
    CurrencyDollarIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    ShoppingBagIcon
} from "@heroicons/react/24/solid";

const PaymentBadge = ({ method }) => {
    const methods = {
        cash: {
            color: "green",
            label: "Efectivo",
            icon: <BanknotesIcon className="h-4 w-4" />
        },
        transfer: {
            color: "blue",
            label: "Transferencia",
            icon: <ArrowsRightLeftIcon className="h-4 w-4" />
        },
        credit: {
            color: "amber",
            label: "Crédito",
            icon: <CreditCardIcon className="h-4 w-4" />
        },
    };

    const selected = methods[method] || {
        color: "gray",
        label: "Desconocido",
        icon: <QuestionMarkCircleIcon className="h-4 w-4" />
    };

    return (
        <Chip
            variant="ghost"
            color={selected.color}
            size="sm"
            value={
                <span className="flex items-center gap-1.5">
                    {selected.icon}
                    {selected.label}
                </span>
            }
            className="w-max font-medium"
        />
    );
};

export default function Index({ auth, sales = [], totalEarned = 0, salesByMethod = {}, currentDateFilter, filters, baseUrl }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';

    const [startDate, setStartDate] = useState(filters?.start_date || currentDateFilter || '');
    const [endDate, setEndDate] = useState(filters?.end_date || currentDateFilter || '');
    const [reportRange, setReportRange] = useState('day');

    const [modalError, setModalError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const checkIsInvalid = (start, end) => {
        if (!start || !end) return false;
        const startD = new Date(start);
        const endD = new Date(end);
        if (endD < startD) return true;

        const diffDays = Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24));
        return diffDays > 31;
    };

    const isInvalidRange = checkIsInvalid(startDate, endDate);

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
            baseUrl || route('admin.sales.index'),
            {
                ...(start && { start_date: start, date: start }),
                ...(end && { end_date: end })
            },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        router.get(baseUrl || route('admin.sales.index'));
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        setIsDownloading(true);

        const routeName = isAdmin
            ? 'admin.reports.sales.download'
            : 'repartidor.reports.sales.download';

        const url = route(routeName, {
            ...(startDate && { start_date: startDate, date: startDate }),
            ...(endDate && { end_date: endDate }),
            range: reportRange
        });

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                },
            });

            if (!response.ok) throw new Error('Error al descargar el PDF');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `reporte_ventas_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error durante la descarga:', error);
            setModalError('Ocurrió un problema al descargar el reporte PDF.');
            setShowModal(true);
        } finally {
            setIsDownloading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value || 0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Ventas</h2>}
        >
            <Head title="Historial de Ventas" />

            <div className="py-8 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* TARJETAS DE MÉTRICAS / RESUMEN */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Vendido"
                            value={formatCurrency(totalEarned)}
                            icon={CurrencyDollarIcon}
                            colorTheme="green"
                            description="Ventas acumuladas en el periodo"
                        />
                        <StatCard
                            title="Cobrado en Efectivo"
                            value={formatCurrency(salesByMethod?.cash)}
                            icon={BanknotesIcon}
                            colorTheme="blue"
                            description="Ingresos directos en caja"
                        />
                        <StatCard
                            title="Transferencias / Crédito"
                            value={formatCurrency((salesByMethod?.transfer || 0) + (salesByMethod?.credit || 0))}
                            icon={ArrowsRightLeftIcon}
                            colorTheme="purple"
                            description="Ventas no efectivas"
                        />
                    </div>

                    {/* BARRA DE FILTROS Y EXPORTACIÓN */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                            <FunnelIcon className="h-5 w-5 text-indigo-500" />
                            <span>Filtro y Exportación:</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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

                            <select
                                value={reportRange}
                                onChange={(e) => setReportRange(e.target.value)}
                                className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                            >
                                <option value="day">Diario</option>
                                <option value="week">Semanal</option>
                                <option value="fortnight">Quincenal</option>
                                <option value="month">Mensual</option>
                            </select>

                            {/* BOTÓN EXPORTAR PDF CON VALIDACIÓN Y ESTADO DINÁMICO */}
                            {isInvalidRange ? (
                                <button
                                    type="button"
                                    disabled
                                    title="Selecciona un rango válido (máximo 31 días) para descargar el PDF"
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed shadow-none"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    Exportar PDF
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md transition-all ${
                                        isDownloading
                                            ? 'bg-indigo-400 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-95'
                                    }`}
                                >
                                    {isDownloading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Generando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                            <span>Descargar PDF</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* DETALLE DE VENTA / TABLA */}
                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm">
                        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Detalle de Transacciones
                                    </Typography>
                                    <Typography color="gray" className="mt-1 font-normal text-sm">
                                        Mostrando <span className="font-medium text-blue-600">{sales.length}</span> ventas para el rango seleccionado.
                                    </Typography>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="px-0 py-0">
                            {sales.length > 0 ? (
                                <>
                                    {/* VISTA MÓVIL */}
                                    <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                        {sales.map((sale) => {
                                            const saleTime = new Date(sale.created_at).toLocaleTimeString('es-ES', {
                                                hour: '2-digit', minute: '2-digit'
                                            });

                                            return (
                                                <div
                                                    key={sale.id}
                                                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-3"
                                                >
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                                            {saleTime}
                                                        </span>
                                                        <Typography variant="h6" color="blue-gray" className="font-bold text-base">
                                                            {formatCurrency(sale.total)}
                                                        </Typography>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                                                        {isAdmin && (
                                                            <div className="col-span-2 flex flex-col gap-0.5">
                                                                <span className="text-gray-400 font-medium">Vendedor</span>
                                                                <span className="font-bold text-gray-800">{sale.shift?.user?.name || 'N/A'}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-gray-400 font-medium">Cliente</span>
                                                            <span className="text-gray-800 font-medium">{sale.customer?.name || 'Consumidor Final'}</span>
                                                        </div>
                                                        <div className="flex flex-col gap-0.5 items-end">
                                                            <span className="text-gray-400 font-medium">Viaje</span>
                                                            <span className="text-gray-600 font-mono">#{sale.trip?.trip_number ?? sale.trip_id}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Productos</span>
                                                        <div className="flex flex-col gap-1">
                                                            {sale.details && sale.details.length > 0 ? (
                                                                sale.details.map((item) => (
                                                                    <Typography key={item.id} variant="small" color="gray" className="font-normal text-xs">
                                                                        <span className="font-bold text-indigo-600">{item.quantity}x</span> {item.product?.name || 'Producto eliminado'}
                                                                    </Typography>
                                                                ))
                                                            ) : (
                                                                <Typography variant="small" color="gray" className="italic text-xs text-center">
                                                                    Sin detalles
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-1">
                                                        <span className="text-xs text-gray-400 font-medium">Método de pago</span>
                                                        <PaymentBadge method={sale.payment_method} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* VISTA ESCRITORIO */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full table-auto text-left">
                                            <thead>
                                                <tr>
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Hora</th>
                                                    {isAdmin && <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Vendedor</th>}
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Cliente</th>
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Viaje</th>
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Producto</th>
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Método de Pago</th>
                                                    <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales.map((sale, index) => {
                                                    const classes = index === sales.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50";
                                                    const saleTime = new Date(sale.created_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    });

                                                    return (
                                                        <tr key={sale.id} className="hover:bg-blue-gray-50/50 transition-colors">
                                                            <td className={classes}>
                                                                <Typography variant="small" color="blue-gray" className="font-medium">
                                                                    {saleTime}
                                                                </Typography>
                                                            </td>
                                                            {isAdmin && (
                                                                <td className={classes}>
                                                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                                                        {sale.shift?.user?.name || 'N/A'}
                                                                    </Typography>
                                                                </td>
                                                            )}
                                                            <td className={classes}>
                                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                                    {sale.customer?.name || 'Consumidor Final'}
                                                                </Typography>
                                                            </td>
                                                            <td className={classes}>
                                                                <Typography variant="small" color="gray" className="font-normal text-xs">
                                                                    #{sale.trip?.trip_number ?? sale.trip_id}
                                                                </Typography>
                                                            </td>
                                                            <td className={classes}>
                                                                <div className="flex flex-col gap-1">
                                                                    {sale.details && sale.details.length > 0 ? (
                                                                        sale.details.map((item) => (
                                                                            <Typography key={item.id} variant="small" color="gray" className="font-normal text-xs">
                                                                                <span className="font-medium text-blue-gray-700">{item.quantity}x</span> {item.product?.name || 'Producto eliminado'}
                                                                            </Typography>
                                                                        ))
                                                                    ) : (
                                                                        <Typography variant="small" color="gray" className="italic text-xs">
                                                                            Sin detalles
                                                                        </Typography>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className={classes}>
                                                                <PaymentBadge method={sale.payment_method} />
                                                            </td>
                                                            <td className={`${classes} text-right`}>
                                                                <Typography variant="small" color="blue-gray" className="font-bold">
                                                                    {formatCurrency(sale.total)}
                                                                </Typography>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                                    <ShoppingBagIcon className="h-12 w-12 text-gray-300" />
                                    <Typography color="blue-gray" className="font-medium text-lg">
                                        Sin movimientos
                                    </Typography>
                                    <Typography color="gray" className="font-normal text-sm max-w-md text-center">
                                        No se encontraron registros de ventas para las fechas seleccionadas.
                                    </Typography>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* MODAL DE ADVERTENCIA PARA RANGO DE FECHAS */}
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
