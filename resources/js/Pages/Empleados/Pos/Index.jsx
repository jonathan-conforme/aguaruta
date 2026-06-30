import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, CardHeader, CardBody, Chip } from "@material-tailwind/react";
import {
    BanknotesIcon,
    ArrowsRightLeftIcon,
    CreditCardIcon,
    QuestionMarkCircleIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

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

export default function Index({ auth, sales, totalEarned, salesByMethod, currentDateFilter, baseUrl }) {

    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';
    const [selectedDate, setSelectedDate] = useState(currentDateFilter);
    const [reportRange, setReportRange] = useState('day');

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);

        router.get(baseUrl, { date: newDate }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDownload = () => {
        const url = route('admin.reports.sales.download', {
            date: selectedDate,
            range: reportRange
        });
        window.open(url, '_blank');
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

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Panel Integrado: Controles de Filtro y Exportación */}
                    <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 gap-4">
                        <div>
                            <Typography variant="h6" color="blue-gray">Gestión de Ventas</Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                                Filtra la vista actual o exporta las liquidaciones.
                            </Typography>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white w-full sm:w-auto"
                            />

                            <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

                            <select
                                value={reportRange}
                                onChange={(e) => setReportRange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white cursor-pointer w-full sm:w-auto"
                            >
                                <option value="day">Reporte Diario</option>
                                <option value="week">Reporte Semanal</option>
                                <option value="fortnight">Reporte Quincenal</option>
                                <option value="month">Reporte Mensual</option>
                            </select>

                            <button
                                onClick={handleDownload}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm w-full sm:w-auto"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                Exportar
                            </button>
                        </div>
                    </div>

                    {/* Contenedor Principal */}
                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm mt-6">
                        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Detalle de Transacciones
                                    </Typography>
                                    <Typography color="gray" className="mt-1 font-normal text-sm">
                                        Mostrando <span className="font-medium text-blue-600">{sales.length}</span> ventas para la fecha seleccionada.
                                    </Typography>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="px-0 py-0">
                            {sales.length > 0 ? (
                                <>
                                    {/* 📱 VISTA MÓVIL: Tarjetas Apiladas (Se muestra en sm y se oculta en md) */}
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
                                                    {/* Fila superior: Hora y Total */}
                                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                                            {saleTime}
                                                        </span>
                                                        <Typography variant="h6" color="blue-gray" className="font-bold text-base">
                                                            {formatCurrency(sale.total)}
                                                        </Typography>
                                                    </div>

                                                    {/* Datos informativos */}
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

                                                    {/* Productos vendidos */}
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

                                                    {/* Fila Inferior: Insignia de Pago */}
                                                    <div className="flex justify-between items-center pt-1">
                                                        <span className="text-xs text-gray-400 font-medium">Método de pago</span>
                                                        <PaymentBadge method={sale.payment_method} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 💻 VISTA ESCRITORIO: Tabla tradicional (Oculta en móviles, se muestra en md) */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full table-auto text-left" role="table">
                                            <thead>
                                                <tr role="row">
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
                                                        <tr key={sale.id} className="hover:bg-blue-gray-50/50 transition-colors" role="row">
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
                                /* Estado Vacío Integrado Uniformemente */
                                <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                                    <span className="text-4xl">🧾</span>
                                    <Typography color="blue-gray" className="font-medium text-lg">
                                        Sin movimientos
                                    </Typography>
                                    <Typography color="gray" className="font-normal text-sm max-w-md text-center">
                                        No se encontraron registros de ventas para la fecha seleccionada ({selectedDate}).
                                    </Typography>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
