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
} from "@material-tailwind/react";

import {
    BanknotesIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
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

    // 1. BUSCADOR CON DEBOUNCE (MISMA LÓGICA UX/UI)
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
                <Typography variant="h5" className="flex items-center gap-2">
                    <BanknotesIcon className="h-6 w-6 text-indigo-500" />
                    Cuentas por Cobrar
                </Typography>
            }
        >
            <Head title="Cuentas por Cobrar" />

            {/* TARJETAS ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
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

            {/* FILTRO DE BÚSQUEDA */}
            <div className="p-6 border-b">
                <div className="max-w-md">
                    <Input
                        label="Buscar por nombre de cliente o identificación"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                    />
                </div>
            </div>

            {/* TABLA DE DEUDAS */}
            <div className="max-w-7xl mx-auto p-6">
                <Card className="shadow-sm border border-gray-200">
                    <div className="p-6 border-b flex justify-between items-center">
                        <div>
                            <Typography variant="h5">Listado de Saldos Pendientes</Typography>
                            <Typography className="text-sm text-gray-500">
                                Gestiona los abonos y cobranzas de tus clientes
                            </Typography>
                        </div>
                    </div>

                    <CardBody className="px-0 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="p-4 bg-gray-50">
                                            <Typography variant="small" className="font-bold text-gray-700">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {salesList.map((sale, index) => {
                                    const isLast = index === salesList.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-gray-100";

                                    return (
                                        <tr key={sale.id} className="hover:bg-gray-50">
                                            <td className={classes}>
                                                <Typography className="font-semibold text-gray-800">
                                                    {sale.customer?.name || 'Cliente sin nombre'}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-500">
                                                    {sale.customer?.identification || 'Sin CI/RUC'}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                <Typography className="font-medium text-gray-800">
                                                    Venta #{sale.id}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-500">
                                                    {new Date(sale.created_at).toLocaleDateString('es-EC')}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                <Typography className="font-medium">
                                                    {formatCurrency(sale.total)}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                <Typography className="font-medium text-green-600">
                                                    {formatCurrency(sale.paid_amount)}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                <Typography className="font-bold text-red-600">
                                                    {formatCurrency(sale.balance_amount)}
                                                </Typography>
                                            </td>

                                            <td className={classes}>
                                                <Chip
                                                    size="sm"
                                                    color={sale.status === 'partial' ? 'amber' : 'red'}
                                                    value={sale.status === 'partial' ? 'Parcial' : 'Pendiente'}
                                                    className="w-max"
                                                />
                                            </td>

                                            <td className={classes}>
                                                <Button
                                                    size="sm"
                                                    color="green"
                                                    className="flex items-center gap-1"
                                                    onClick={() => openModal(sale)}
                                                >
                                                    <BanknotesIcon className="h-4 w-4" />
                                                    Abonar
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* BARRA DE PAGINACIÓN */}
                        {sales?.current_page && (
                            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
                                <Typography variant="small" color="gray" className="font-normal text-center sm:text-left">
                                    Página <strong className="text-blue-gray-900">{sales.current_page}</strong> de{" "}
                                    <strong className="text-blue-gray-900">{sales.last_page}</strong>
                                </Typography>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handlePageChange(sales.prev_page_url)}
                                        disabled={!sales.prev_page_url}
                                    >
                                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" /> <span className="hidden sm:inline">Anterior</span>
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handlePageChange(sales.next_page_url)}
                                        disabled={!sales.next_page_url}
                                    >
                                        <span className="hidden sm:inline">Siguiente</span> <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* MODAL PARA REGISTRAR ABONO */}
            <Dialog open={isModalOpen} handler={closeModal} size="sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="flex flex-col items-start gap-1">
                        <Typography variant="h5">Registrar Abono</Typography>
                        <Typography className="text-xs text-gray-500 font-normal">
                            Cliente: {selectedSale?.customer?.name} (Saldo actual: {formatCurrency(selectedSale?.balance_amount)})
                        </Typography>
                    </DialogHeader>

                    <DialogBody className="grid gap-4">
                        <div>
                            <Input
                                type="number"
                                step="0.01"
                                label="Monto a abonar ($) *"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                            />
                            {errors.amount && <Typography color="red" className="text-xs mt-1">{errors.amount}</Typography>}
                        </div>

                        <div>
                            <Select
                                label="Método de Pago *"
                                value={data.payment_method}
                                onChange={(val) => setData('payment_method', val)}
                            >
                                <Option value="cash">Efectivo</Option>
                                <Option value="transfer">Transferencia</Option>
                            </Select>
                            {errors.payment_method && <Typography color="red" className="text-xs mt-1">{errors.payment_method}</Typography>}
                        </div>

                        {data.payment_method === 'transfer' && (
                            <div>
                                <Input
                                    label="Nº Referencia / Transferencia"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                />
                                {errors.reference_number && <Typography color="red" className="text-xs mt-1">{errors.reference_number}</Typography>}
                            </div>
                        )}

                        <div>
                            <Textarea
                                label="Notas o detalles del cobro"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && <Typography color="red" className="text-xs mt-1">{errors.notes}</Typography>}
                        </div>

                        {errors.shift && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <Typography color="red" className="text-xs font-bold">{errors.shift}</Typography>
                            </div>
                        )}
                    </DialogBody>

                    <DialogFooter className="gap-2">
                        <Button variant="text" color="gray" onClick={closeModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="green" disabled={processing}>
                            {processing ? 'Guardando...' : 'Registrar Abono'}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
