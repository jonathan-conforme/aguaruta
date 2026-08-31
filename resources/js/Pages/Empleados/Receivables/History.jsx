import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import StatCard from '@/Components/UI/StatCard';

import {
    Card,
    Typography,
    Button,
    CardBody,
    Input,
    Select,
    Option,
    Chip,
} from "@material-tailwind/react";

import {
    BanknotesIcon,
    CurrencyDollarIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    DocumentCheckIcon,
    QrCodeIcon,
    FunnelIcon,
    ExclamationTriangleIcon,
    ArrowDownTrayIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/solid";

export default function History({ auth, payments, stats, filters }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';

    // ESTADOS PARA FILTROS
    const [search, setSearch] = useState(filters?.search || '');
    const [paymentMethod, setPaymentMethod] = useState(filters?.payment_method || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');

    // ESTADOS PARA MODAL DE VALIDADOR DE FECHAS
    const [modalError, setModalError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const isFirstRender = useRef(true);

    const checkIsInvalid = (start, end) => {
        if (!start || !end) return false;
        const startD = new Date(start);
        const endD = new Date(end);
        if (endD < startD) return true;

        const diffDays = Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24));
        return diffDays > 31;
    };

    const isInvalidRange = checkIsInvalid(startDate, endDate);

    const applyFilters = (customParams = {}) => {
        const historyRoute = isAdmin
            ? route('admin.receivables.history')
            : route('repartidor.receivables.history');

        const params = {
            search,
            payment_method: paymentMethod,
            start_date: startDate,
            end_date: endDate,
            ...customParams,
        };

        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === '') delete params[key];
        });

        router.get(historyRoute, params, { preserveState: true, replace: true });
    };

    // Debounce para búsqueda general y selector de método de pago
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            applyFilters({ search, payment_method: paymentMethod });
        }, 350);

        return () => clearTimeout(timer);
    }, [search, paymentMethod]);

    // Manejo seguro del rango de fechas
    const handleDateChange = (newStart, newEnd) => {
        setStartDate(newStart);
        setEndDate(newEnd);

        if ((newStart && !newEnd) || (!newStart && newEnd)) return;

        if (newStart && newEnd) {
            const startD = new Date(newStart);
            const endD = new Date(newEnd);

            if (endD < startD) {
                setModalError("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'.");
                setShowModal(true);
                return;
            }

            const diffDays = Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24));
            if (diffDays > 31) {
                setModalError("Solo puedes consultar rangos de hasta 31 días.");
                setShowModal(true);
                return;
            }
        }

        applyFilters({ start_date: newStart, end_date: newEnd });
    };

    const clearFilters = () => {
        setSearch('');
        setPaymentMethod('');
        setStartDate('');
        setEndDate('');

        const historyRoute = isAdmin
            ? route('admin.receivables.history')
            : route('repartidor.receivables.history');

        router.get(historyRoute);
    };

    const handlePageChange = (url) => {
        if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const formatCurrency = (val) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(val || 0);

    const TABLE_HEAD = ["Fecha / Hora", "Cliente", "Venta Original", "Cobrado Por", "Método", "Monto Abonado", "Notas / Ref."];
    const paymentsList = payments?.data || [];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2">
                    <DocumentCheckIcon className="h-6 w-6 text-indigo-500" />
                    Historial de Abonos y Cobranzas
                </Typography>
            }
        >
            <Head title="Historial de Abonos" />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

                {/* MÉTRICAS DE COBRANZA (RECAUDACIÓN DE CARTERA) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Recuperado"
                        value={formatCurrency(stats?.total_collected)}
                        icon={CurrencyDollarIcon}
                        colorTheme="green"
                        description="Cobros acumulados en el periodo"
                    />
                    <StatCard
                        title="Abonos en Efectivo"
                        value={formatCurrency(stats?.total_cash)}
                        icon={BanknotesIcon}
                        colorTheme="blue"
                        description="Ingresado a caja física"
                    />
                    <StatCard
                        title="Abonos en Transferencia"
                        value={formatCurrency(stats?.total_transfer)}
                        icon={QrCodeIcon}
                        colorTheme="purple"
                        description="Comprobantes de depósito"
                    />
                </div>

                {/* FILTROS Y CONTROLES */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="w-full sm:w-64">
                                <Input
                                    label="Buscar cliente, cobrador o ref."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select
                                    label="Método de Pago"
                                    value={paymentMethod}
                                    onChange={(val) => setPaymentMethod(val || '')}
                                >
                                    <Option value="">Todos los métodos</Option>
                                    <Option value="cash">Efectivo</Option>
                                    <Option value="transfer">Transferencia</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <FunnelIcon className="h-4 w-4 text-indigo-500 hidden sm:inline" />
                                <span>Desde:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e.target.value, endDate)}
                                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Hasta:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange(startDate, e.target.value)}
                                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {(search || paymentMethod || startDate || endDate) && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline whitespace-nowrap"
                                >
                                    Limpiar
                                </button>
                            )}

                            {/* DESCARGA PDF 
                            {isInvalidRange ? (
                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex items-center gap-2 rounded-lg bg-gray-300 px-3 py-2 text-xs font-medium text-gray-500 cursor-not-allowed"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    PDF
                                </button>
                            ) : (
                                <a
                                    href={route(
                                        isAdmin ? "admin.receivables.export.pdf" : "repartidor.receivables.export.pdf",
                                        {
                                            ...(search && { search }),
                                            ...(paymentMethod && { payment_method: paymentMethod }),
                                            ...(startDate && { start_date: startDate }),
                                            ...(endDate && { end_date: endDate }),
                                        }
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    PDF
                                </a>
                            )}*/}
                        </div>
                    </div>
                </div>

                {/* TABLA / TARJETAS MÓVILES */}
                <Card className="shadow-sm border border-gray-200">
                    <CardBody className="px-0 py-0">
                        {paymentsList.length > 0 ? (
                            <>
                                {/* VISTA MÓVIL */}
                                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                                    {paymentsList.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2.5"
                                        >
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-gray-800">
                                                        {new Date(payment.created_at).toLocaleDateString('es-EC')}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400 block">
                                                        {new Date(payment.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <Typography variant="h6" className="font-bold text-green-600">
                                                    +{formatCurrency(payment.amount)}
                                                </Typography>
                                            </div>

                                            <div className="flex flex-col text-xs gap-1">
                                                <span className="text-gray-400 font-medium flex items-center gap-1">
                                                    <UserIcon className="h-3 w-3 text-gray-400" /> Cliente:
                                                </span>
                                                <span className="font-semibold text-gray-800">
                                                    {payment.sale?.customer?.name || 'Cliente general'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-lg">
                                                <span className="text-indigo-600 font-semibold">Venta #{payment.sale_id}</span>
                                                <span className="text-gray-600">Cobró: <strong>{payment.shift?.user?.name || 'Admin/Sistema'}</strong></span>
                                            </div>

                                            {payment.notes && (
                                                <div className="text-[11px] text-gray-600 bg-amber-50/60 p-2 rounded border border-amber-100 flex items-start gap-1">
                                                    <ChatBubbleBottomCenterTextIcon className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                    <span>{payment.notes}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                                <Chip
                                                    size="sm"
                                                    color={payment.payment_method === 'cash' ? 'green' : 'purple'}
                                                    value={payment.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}
                                                    className="w-max"
                                                />
                                                <span className="text-[11px] font-mono text-gray-500">
                                                    Ref: {payment.reference_number || 'Sin ref.'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* VISTA ESCRITORIO */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((head) => (
                                                    <th key={head} className="p-4 bg-gray-50 border-b border-gray-200">
                                                        <Typography variant="small" className="font-bold text-gray-700">
                                                            {head}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paymentsList.map((payment, index) => {
                                                const isLast = index === paymentsList.length - 1;
                                                const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                                                return (
                                                    <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className={classes}>
                                                            <Typography className="font-medium text-gray-800 text-sm">
                                                                {new Date(payment.created_at).toLocaleDateString('es-EC')}
                                                            </Typography>
                                                            <Typography variant="small" className="text-gray-400 text-xs">
                                                                {new Date(payment.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography className="font-semibold text-gray-800 text-sm">
                                                                {payment.sale?.customer?.name || 'Cliente general'}
                                                            </Typography>
                                                            <Typography variant="small" className="text-gray-400 text-xs">
                                                                {payment.sale?.customer?.identification || 'Sin identificación'}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography className="font-semibold text-indigo-600 text-sm">
                                                                Venta #{payment.sale_id}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography className="font-medium text-gray-800 text-sm">
                                                                {payment.shift?.user?.name || 'Sistema / Admin'}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Chip
                                                                size="sm"
                                                                color={payment.payment_method === 'cash' ? 'green' : 'purple'}
                                                                value={payment.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}
                                                                className="w-max"
                                                            />
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography className="font-bold text-green-600 text-sm">
                                                                +{formatCurrency(payment.amount)}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography className="text-xs font-mono text-gray-700">
                                                                {payment.reference_number ? `Ref: ${payment.reference_number}` : 'Sin N° ref.'}
                                                            </Typography>
                                                            {payment.notes && (
                                                                <Typography variant="small" className="text-gray-500 text-xs italic truncate max-w-xs block">
                                                                    "{payment.notes}"
                                                                </Typography>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No se encontraron registros de abonos para la búsqueda seleccionada.
                            </div>
                        )}

                        {/* PAGINACIÓN */}
                        {payments?.current_page && (
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-4">
                                <Typography variant="small" color="gray" className="font-normal text-center sm:text-left">
                                    Página <strong className="text-gray-900">{payments.current_page}</strong> de{" "}
                                    <strong className="text-gray-900">{payments.last_page}</strong>
                                </Typography>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handlePageChange(payments.prev_page_url)}
                                        disabled={!payments.prev_page_url}
                                    >
                                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" />
                                        <span className="hidden sm:inline">Anterior</span>
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handlePageChange(payments.next_page_url)}
                                        disabled={!payments.next_page_url}
                                    >
                                        <span className="hidden sm:inline">Siguiente</span>
                                        <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* MODAL ADVERTENCIA RANGO DE FECHAS */}
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
                            className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}