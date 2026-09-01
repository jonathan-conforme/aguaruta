import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

import {
    Card,
    Typography,
    Button,
    CardBody,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Textarea,
    Chip,
    IconButton
} from "@material-tailwind/react";

import {
    BanknotesIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    UserIcon,
    XMarkIcon
} from "@heroicons/react/24/solid";
import StatCard from '@/Components/UI/StatCard';

export default function Index({ auth, sales, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isFirstRender = useRef(true);
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        amount: '',
        payment_method: 'cash',
        reference_number: '',
        notes: '',
    });

    // 1. BUSCADOR CON DEBOUNCE
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            if (search.length > 0 && search.length < 2) return;

            const routeName = auth.user.role === 'admin'
                ? route('admin.receivables.index')
                : route('repartidor.receivables.index');

            router.get(
                routeName,
                { search: search || undefined },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const openModal = (sale) => {
        clearErrors();
        setSelectedSale(sale);
        setData({
            amount: sale.balance_amount,
            payment_method: 'cash',
            reference_number: '',
            notes: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSale(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = auth.user.role === 'admin'
            ? route('admin.receivables.payment', selectedSale.id)
            : route('repartidor.receivables.payment', selectedSale.id);

        post(routeName, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const formatCurrency = (val) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(val || 0);

    const TABLE_HEAD = ["Cliente", "Venta / Fecha", "Total Venta", "Abonado", "Saldo Pendiente", "Estado", "Acción"];

    const salesList = sales?.data || sales || [];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <BanknotesIcon className="h-6 w-6 text-indigo-500" />
                    Cuentas por Cobrar
                </Typography>
            }
        >
            <Head title="Cuentas por Cobrar" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-3 sm:py-0 space-y-4 sm:space-y-6">

                {/* TARJETAS ESTADÍSTICAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <StatCard
                        title="Total por Cobrar"
                        value={formatCurrency(stats?.total_debt)}
                        icon={CurrencyDollarIcon}
                        colorTheme="red"
                        description="Saldo acumulado pendiente"
                    />
                    <StatCard
                        title="Ventas Pendientes"
                        value={stats?.pending_count || 0}
                        icon={ExclamationTriangleIcon}
                        colorTheme="blue"
                        description="Sin ningún abono registrado"
                    />
                    <StatCard
                        title="Cobros Parciales"
                        value={stats?.partial_count || 0}
                        icon={ClockIcon}
                        colorTheme="purple"
                        description="Con abonos realizados"
                    />
                </div>

                {/* TABLA PRINCIPAL Y BÚSQUEDA */}
                <Card className="shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden bg-slate-50/50">

                    {/* Header y Filtro */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold text-lg sm:text-xl">
                                Listado de Saldos Pendientes
                            </Typography>
                            <Typography color="gray" className="mt-0.5 text-xs sm:text-sm font-normal">
                                Gestiona los abonos y cobranzas de tus clientes ({salesList.length} cuentas).
                            </Typography>
                        </div>

                        <div className="w-full sm:w-72">
                            <Input
                                label="Buscar cliente o CI/RUC..."
                                color="indigo"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                                className="bg-white rounded-xl"
                            />
                        </div>
                    </div>

                    <CardBody className="px-0 py-0 bg-white">
                        {salesList.length > 0 ? (
                            <>
                                {/* VISTA MÓVIL */}
                                <div className="grid grid-cols-1 gap-3 p-3 md:hidden bg-slate-50/50">
                                    {salesList.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col gap-3"
                                        >
                                            <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                                                <div>
                                                    <span className="font-bold text-slate-800 text-xs block">
                                                        {sale.customer?.name || 'Cliente sin nombre'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium block">
                                                        {sale.customer?.identification || 'Sin CI/RUC'}
                                                    </span>
                                                </div>
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    color={sale.status === 'partial' ? 'amber' : 'red'}
                                                    value={sale.status === 'partial' ? 'Parcial' : 'Pendiente'}
                                                    className="rounded-lg font-bold text-[10px]"
                                                />
                                            </div>

                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                                                    Venta #{sale.id}
                                                </span>
                                                <span className="text-slate-400 font-medium text-[11px]">
                                                    {new Date(sale.created_at).toLocaleDateString('es-EC')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Total</span>
                                                    <span className="text-xs font-semibold text-slate-700">{formatCurrency(sale.total)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Abonado</span>
                                                    <span className="text-xs font-semibold text-emerald-600">{formatCurrency(sale.paid_amount)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Saldo</span>
                                                    <span className="text-xs font-extrabold text-rose-600">{formatCurrency(sale.balance_amount)}</span>
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                color="emerald"
                                                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 shadow-md shadow-emerald-100"
                                                onClick={() => openModal(sale)}
                                            >
                                                <BanknotesIcon className="h-4 w-4" />
                                                Registrar Abono
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* VISTA ESCRITORIO */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left min-w-max table-auto">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((head, idx) => (
                                                    <th key={head} className={`p-4 bg-gray-50/70 border-b border-gray-100 ${idx === 6 ? 'text-right' : ''}`}>
                                                        <Typography variant="small" className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                                                            {head}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {salesList.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="p-4">
                                                        <Typography className="font-bold text-gray-800 text-xs">
                                                            {sale.customer?.name || 'Cliente sin nombre'}
                                                        </Typography>
                                                        <Typography variant="small" className="text-gray-400 text-[11px]">
                                                            {sale.customer?.identification || 'Sin CI/RUC'}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 mb-0.5">
                                                            Venta #{sale.id}
                                                        </span>
                                                        <Typography variant="small" className="text-gray-400 text-[11px] block">
                                                            {new Date(sale.created_at).toLocaleDateString('es-EC')}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-semibold text-gray-700 text-xs">
                                                            {formatCurrency(sale.total)}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-semibold text-emerald-600 text-xs">
                                                            {formatCurrency(sale.paid_amount)}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Typography className="font-extrabold text-rose-600 text-xs">
                                                            {formatCurrency(sale.balance_amount)}
                                                        </Typography>
                                                    </td>

                                                    <td className="p-4">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            color={sale.status === 'partial' ? 'amber' : 'red'}
                                                            value={sale.status === 'partial' ? 'Parcial' : 'Pendiente'}
                                                            className="rounded-lg w-max font-bold text-[10px]"
                                                        />
                                                    </td>

                                                    <td className="p-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            color="emerald"
                                                            className="inline-flex items-center gap-1.5 rounded-xl text-xs py-1.5 px-3 shadow-md shadow-emerald-100"
                                                            onClick={() => openModal(sale)}
                                                        >
                                                            <BanknotesIcon className="h-4 w-4" />
                                                            Abonar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No se encontraron cuentas por cobrar registradas.
                            </div>
                        )}

                        {/* BARRA DE PAGINACIÓN */}
                        {sales?.current_page && (
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-3 bg-white">
                                <Typography variant="small" color="gray" className="font-normal text-xs text-center sm:text-left">
                                    Página <strong className="text-gray-900">{sales.current_page}</strong> de{" "}
                                    <strong className="text-gray-900">{sales.last_page}</strong>
                                </Typography>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1 rounded-xl text-xs py-1.5 px-3"
                                        onClick={() => handlePageChange(sales.prev_page_url)}
                                        disabled={!sales.prev_page_url}
                                    >
                                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" />
                                        <span>Anterior</span>
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1 rounded-xl text-xs py-1.5 px-3"
                                        onClick={() => handlePageChange(sales.next_page_url)}
                                        disabled={!sales.next_page_url}
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

            {/* MODAL PARA REGISTRAR ABONO */}
            <Dialog
                open={isModalOpen}
                handler={closeModal}
                size="sm"
                className="w-[95%] sm:w-full max-w-md mx-auto rounded-2xl p-0 overflow-hidden shadow-2xl"
            >
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="border-b border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <Typography variant="h6" color="blue-gray" className="font-bold">
                                Registrar Abono
                            </Typography>
                            <Typography color="gray" className="font-normal text-xs mt-0.5">
                                Cliente: <strong className="text-slate-800">{selectedSale?.customer?.name}</strong>
                            </Typography>
                            <span className="inline-block bg-rose-50 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 border border-rose-100">
                                Saldo actual: {formatCurrency(selectedSale?.balance_amount)}
                            </span>
                        </div>
                        <IconButton variant="text" color="blue-gray" size="sm" onClick={closeModal} className="rounded-full">
                            <XMarkIcon className="w-5 h-5" />
                        </IconButton>
                    </DialogHeader>

                    <DialogBody className="p-5 space-y-4">
                        <div>
                            <Input
                                type="number"
                                step="0.01"
                                label="Monto a abonar ($) *"
                                color="indigo"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="bg-white rounded-xl"
                            />
                            {errors.amount && <Typography color="red" className="text-xs mt-1 font-medium">{errors.amount}</Typography>}
                        </div>

                        <div>
                            <Select
                                label="Método de Pago *"
                                color="indigo"
                                value={data.payment_method}
                                onChange={(val) => setData('payment_method', val)}
                                className="bg-white rounded-xl"
                            >
                                <Option value="cash">Efectivo</Option>
                                <Option value="transfer">Transferencia</Option>
                            </Select>
                            {errors.payment_method && <Typography color="red" className="text-xs mt-1 font-medium">{errors.payment_method}</Typography>}
                        </div>

                        {data.payment_method === 'transfer' && (
                            <div>
                                <Input
                                    label="Nº Referencia / Transferencia"
                                    color="indigo"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    className="bg-white rounded-xl"
                                />
                                {errors.reference_number && <Typography color="red" className="text-xs mt-1 font-medium">{errors.reference_number}</Typography>}
                            </div>
                        )}

                        <div>
                            <Textarea
                                label="Notas o detalles del cobro"
                                color="indigo"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="bg-white rounded-xl"
                            />
                            {errors.notes && <Typography color="red" className="text-xs mt-1 font-medium">{errors.notes}</Typography>}
                        </div>

                        {errors.shift && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <Typography color="red" className="text-xs font-bold">{errors.shift}</Typography>
                            </div>
                        )}
                    </DialogBody>

                    <DialogFooter className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 gap-2">
                        <Button variant="text" color="gray" onClick={closeModal} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button type="submit" color="emerald" disabled={processing} className="rounded-xl shadow-md shadow-emerald-100">
                            {processing ? 'Guardando...' : 'Registrar Abono'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
