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
    ChatBubbleBottomCenterTextIcon,
    CalendarIcon,
    XMarkIcon
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
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <DocumentCheckIcon className="h-6 w-6 text-indigo-500" />
                    Historial de Abonos y Cobranzas
                </Typography>
            }
        >
            <Head title="Historial de Abonos" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-3 sm:py-0 space-y-4 sm:space-y-6">

                {/* MÉTRICAS DE COBRANZA (RECAUDACIÓN DE CARTERA) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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
                <Card className="p-4 sm:p-5 shadow-sm border border-gray-200/80 rounded-2xl bg-white">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <div className="w-full sm:w-64">
                                <Input
                                    label="Buscar cliente, cobrador o ref."
                                    color="indigo"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                                    className="bg-white rounded-xl"
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select
                                    label="Método de Pago"
                                    color="indigo"
                                    value={paymentMethod}
                                    onChange={(val) => setPaymentMethod(val || '')}
                                    className="bg-white rounded-xl"
                                >
                                    <Option value="">Todos los métodos</Option>
                                    <Option value="cash">Efectivo</Option>
                                    <Option value="transfer">Transferencia</Option>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start sm:justify-end">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
                                <CalendarIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="font-medium text-slate-600">Desde:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange(e.target.value, endDate)}
                                    className="text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
                                <span className="font-medium text-slate-600">Hasta:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange(startDate, e.target.value)}
                                    className="text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer"
                                />
                            </div>

                            {(search || paymentMethod || startDate || endDate) && (
                                <Button
                                    variant="text"
                                    color="indigo"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-xs rounded-xl py-2 px-3 flex items-center gap-1"
                                >
                                    <XMarkIcon className="h-3.5 w-3.5" /> Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* TABLA / TARJETAS MÓVILES */}
                <Card className="shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
                    <CardBody className="px-0 py-0 bg-white">
                        {paymentsList.length > 0 ? (
                            <>
                                {/* VISTA MÓVIL */}
                                <div className="grid grid-cols-1 gap-3 p-3 md:hidden bg-slate-50/50">
                                    {paymentsList.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-3"
                                        >
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-800 block">
                                                        {new Date(payment.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 block font-medium">
                                                        {new Date(payment.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <Typography variant="h6" className="font-extrabold text-emerald-600 text-base">
                                                    +{formatCurrency(payment.amount)}
                                                </Typography>
                                            </div>

                                            <div className="flex flex-col text-xs gap-0.5">
                                                <span className="text-slate-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1">
                                                    <UserIcon className="h-3 w-3 text-slate-400" /> Cliente
                                                </span>
                                                <span className="font-bold text-slate-800 text-xs">
                                                    {payment.sale?.customer?.name || 'Cliente general'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <span className="text-indigo-600 font-bold">Venta #{payment.sale_id}</span>
                                                <span className="text-slate-600 text-[11px]">Cobró: <strong className="text-slate-800">{payment.shift?.user?.name || 'Admin/Sistema'}</strong></span>
                                            </div>

                                            {payment.notes && (
                                                <div className="text-[11px] text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-1.5">
                                                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                    <span className="font-medium">{payment.notes}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    color={payment.payment_method === 'cash' ? 'green' : 'purple'}
                                                    value={payment.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}
                                                    className="rounded-lg font-bold text-[10px]"
                                                />
                                                <span className="text-[11px] font-mono text-slate-500 font-medium">
                                                    {payment.reference_number ? `Ref: ${payment.reference_number}` : 'Sin ref.'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* VISTA ESCRITORIO */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left min-w-max table-auto">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((head) => (
                                                    <th key={head} className="p-4 bg-gray-50/70 border-b border-gray-100">
                                                        <Typography variant="small" className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                                                            {head}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {paymentsList.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="p-4">
                                                        <Typography className="font-bold text-gray-800 text-xs">
                                                            {new Date(payment.created_at).toLocaleDateString('es-EC')}
                                                        </Typography>
                                                        <Typography variant="small" className="text-gray-400 text-[11px]">
                                                            {new Date(payment.created_at).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-bold text-gray-800 text-xs">
                                                            {payment.sale?.customer?.name || 'Cliente general'}
                                                        </Typography>
                                                        <Typography variant="small" className="text-gray-400 text-[11px]">
                                                            {payment.sale?.customer?.identification || 'Sin CI/RUC'}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100">
                                                            Venta #{payment.sale_id}
                                                        </span>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-medium text-gray-700 text-xs">
                                                            {payment.shift?.user?.name || 'Sistema / Admin'}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            color={payment.payment_method === 'cash' ? 'green' : 'purple'}
                                                            value={payment.payment_method === 'cash' ? 'Efectivo' : 'Transferencia'}
                                                            className="rounded-lg w-max font-bold text-[10px]"
                                                        />
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-extrabold text-emerald-600 text-xs">
                                                            +{formatCurrency(payment.amount)}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="text-xs font-mono text-gray-700 font-semibold">
                                                            {payment.reference_number ? `Ref: ${payment.reference_number}` : 'Sin N° ref.'}
                                                        </Typography>
                                                        {payment.notes && (
                                                            <Typography variant="small" className="text-gray-500 text-[11px] italic truncate max-w-xs block mt-0.5">
                                                                "{payment.notes}"
                                                            </Typography>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No se encontraron registros de abonos para la búsqueda seleccionada.
                            </div>
                        )}

                        {/* PAGINACIÓN */}
                        {payments?.current_page && (
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-3 bg-white">
                                <Typography variant="small" color="gray" className="font-normal text-xs text-center sm:text-left">
                                    Página <strong className="text-gray-900">{payments.current_page}</strong> de{" "}
                                    <strong className="text-gray-900">{payments.last_page}</strong>
                                </Typography>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1 rounded-xl text-xs py-1.5 px-3"
                                        onClick={() => handlePageChange(payments.prev_page_url)}
                                        disabled={!payments.prev_page_url}
                                    >
                                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" />
                                        <span>Anterior</span>
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1 rounded-xl text-xs py-1.5 px-3"
                                        onClick={() => handlePageChange(payments.next_page_url)}
                                        disabled={!payments.next_page_url}
                                    >
                                        <span>Siguiente</span>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Rango de fechas no permitido
                    </h3>
                    <p className="text-xs text-gray-500 mb-6">
                        {modalError}
                    </p>
                    <div className="flex justify-center">
                        <Button
                            color="indigo"
                            size="sm"
                            onClick={() => setShowModal(false)}
                            className="rounded-xl px-5"
                        >
                            Entendido
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
