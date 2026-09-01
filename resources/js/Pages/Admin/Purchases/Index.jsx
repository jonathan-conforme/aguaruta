import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    PlusIcon,
    ShoppingBagIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowsUpDownIcon,
    CalendarIcon,
    MagnifyingGlassIcon,
    BanknotesIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    HashtagIcon
} from "@heroicons/react/24/outline";

export default function Index({ purchases, auth }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value || 0);
    };

    // MÉTRICAS PARA LAS 2 CARDS SUPERIORES
    const metrics = useMemo(() => {
        const rawData = purchases?.data || [];
        const totalAmount = rawData.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
        const pendingCount = rawData.filter(item => item.status === 'pending').length;

        return {
            totalAmount,
            pendingCount
        };
    }, [purchases]);

    // FILTRADO + ORDENAMIENTO DENTRO DEL HOOK
    const filteredAndSortedData = useMemo(() => {
        let data = purchases?.data || [];

        // Filtro por Búsqueda (Proveedor o Factura)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                (item.supplier?.name || '').toLowerCase().includes(query) ||
                (item.invoice_number || '').toLowerCase().includes(query)
            );
        }

        // Filtro por Estado
        if (statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        // Ordenamiento
        if (sortConfig.key) {
            data = [...data].sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'supplier') {
                    aValue = a.supplier?.name || '';
                    bValue = b.supplier?.name || '';
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [purchases, sortConfig, searchQuery, statusFilter]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const TABLE_HEAD = [
        { label: "Fecha Registro", key: "purchase_date", sortable: true },
        { label: "Proveedor", key: "supplier", sortable: true },
        { label: "N° Comprobante", key: "invoice_number", sortable: true },
        { label: "Estado Pago", key: "status", sortable: true },
        { label: "Monto Total", key: "total_amount", sortable: true },
        { label: "Acciones", key: null, sortable: false },
    ];

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={<span className="text-lg font-bold text-slate-800 tracking-tight">Módulo de Compras</span>}
        >
            <Head title="Compras" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 pb-8">

                {/* 1. HERO HEADER */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                            <ShoppingBagIcon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Historial de Compras</h1>
                            <p className="text-xs text-slate-400 font-medium">
                                Registro centralizado de facturación de proveedores e insumos.
                            </p>
                        </div>
                    </div>

                    <Link href={route('purchases.create')} className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs py-3 px-5 rounded-2xl transition-all shadow-md shadow-indigo-200">
                            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                            <span>Nueva Compra</span>
                        </button>
                    </Link>
                </div>

                {/* 2. KPIS FINANCIEROS (ÚNICAMENTE 2 CARDS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card 1: Total Acumulado */}
                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-indigo-950/10 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 transform translate-x-4 translate-y-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                        <div>
                            <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider block mb-1">Total en Pantalla</span>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                {formatCurrency(metrics.totalAmount)}
                            </h3>
                            <span className="text-[11px] text-indigo-300 font-medium mt-1 block">Suma de ordenes filtradas</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shrink-0">
                            <BanknotesIcon className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Card 2: Pendientes */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between hover:border-amber-200 transition-all">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Facturas Pendientes</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                    {metrics.pendingCount}
                                </h3>
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Por Liquidar</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 block">Requieren gestión de pago</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* 3. BARRA DE HERRAMIENTAS DE TABLA */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Buscador de Alta Fidelidad */}
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar proveedor o N° de factura..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        {/* Filtros Pills */}
                        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'completed', label: 'Completados' },
                                { id: 'pending', label: 'Pendientes' },
                                { id: 'canceled', label: 'Cancelados' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                        statusFilter === tab.id
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. REDISEÑO TOTAL DE LA TABLA (DESKTOP) */}
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80">
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head.label}
                                            className={`py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider ${
                                                head.sortable ? 'cursor-pointer select-none hover:text-slate-700' : ''
                                            }`}
                                            onClick={() => head.sortable && handleSort(head.key)}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span>{head.label}</span>
                                                {head.sortable && (
                                                    <span>
                                                        {sortConfig.key === head.key ? (
                                                            sortConfig.direction === 'asc' ? (
                                                                <ChevronUpIcon className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                                                            ) : (
                                                                <ChevronDownIcon className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
                                                            )
                                                        ) : (
                                                            <ArrowsUpDownIcon className="w-3 h-3 text-slate-300" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredAndSortedData.length > 0 ? (
                                    filteredAndSortedData.map(({ id, purchase_date, supplier, invoice_number, status, total_amount }) => (
                                        <tr key={id} className="hover:bg-slate-50/80 transition-all group">
                                            {/* Fecha */}
                                            <td className="py-4 px-5 text-slate-500 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                                                    <span className="font-semibold text-slate-600">{purchase_date}</span>
                                                </div>
                                            </td>

                                            {/* Proveedor con Badge tipográfico */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-xs shrink-0 border border-indigo-100/60">
                                                        {(supplier?.name || 'P').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-800 block truncate max-w-[220px]">
                                                        {supplier?.name || 'Proveedor sin asignar'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Factura Monospaciada */}
                                            <td className="py-4 px-5">
                                                {invoice_number ? (
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border border-slate-200/50">
                                                        <HashtagIcon className="w-3 h-3 text-slate-400" />
                                                        {invoice_number}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 font-mono italic">S/N</span>
                                                )}
                                            </td>

                                            {/* Estado con Indicador de Puntos y Colores Soft */}
                                            <td className="py-4 px-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                                                    status === 'completed'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                        : status === 'pending'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                }`}>
                                                    {status === 'completed' && <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />}
                                                    {status === 'pending' && <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-500" />}
                                                    {status === 'canceled' && <XCircleIcon className="w-3.5 h-3.5 text-rose-500" />}

                                                    {status === 'completed' ? 'Completado' : status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                                </span>
                                            </td>

                                            {/* Monto Prominente */}
                                            <td className="py-4 px-5">
                                                <span className="font-black text-slate-900 text-sm block">
                                                    {formatCurrency(total_amount)}
                                                </span>
                                            </td>

                                            {/* Botón de Acción Directa */}
                                            <td className="py-4 px-5">
                                                <Link
                                                    href={route('purchases.show', id)}
                                                    className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                    title="Ver detalles"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </table>

                        {/* TABLE FOOTER RESUMEN */}
                        {filteredAndSortedData.length > 0 && (
                            <div className="bg-slate-50/70 border-t border-slate-100 px-5 py-3 flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-500">
                                    Mostrando {filteredAndSortedData.length} registros en esta vista
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 font-medium">Subtotal filtrado:</span>
                                    <span className="font-black text-slate-900">{formatCurrency(metrics.totalAmount)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5. VISTA MÓVIL (CARDS DE ALTO CONTRASTE) */}
                    <div className="block md:hidden space-y-3">
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map(({ id, purchase_date, supplier, invoice_number, status, total_amount }) => (
                                <div key={id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                            status === 'completed'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : status === 'pending'
                                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                : 'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                status === 'completed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}></span>
                                            {status === 'completed' ? 'Completado' : status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                        </span>

                                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            {purchase_date}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-xs border border-indigo-100 shrink-0">
                                                {(supplier?.name || 'P').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">
                                                    {supplier?.name || 'Proveedor sin asignar'}
                                                </h4>
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {invoice_number ? `#${invoice_number}` : 'Sin Factura'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-sm font-black text-slate-900 block">
                                                {formatCurrency(total_amount)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-1">
                                        <Link
                                            href={route('purchases.show', id)}
                                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white active:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 shadow-sm transition-colors"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5" />
                                            <span>Ver detalle de la compra</span>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : null}
                    </div>

                    {/* EMPTY STATE */}
                    {filteredAndSortedData.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                    <DocumentTextIcon className="w-6 h-6" />
                                </div>
                                <span className="text-slate-800 font-bold text-sm">No se encontraron resultados</span>
                                <p className="text-slate-400 text-xs max-w-xs px-4">
                                    Intenta cambiando el filtro de estado o el término de búsqueda.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* PAGINACIÓN */}
                    {purchases?.links && purchases.links.length > 3 && (
                        <div className="pt-2 px-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                            <span className="text-xs text-slate-400 text-center sm:text-left">
                                Página <span className="font-bold text-slate-700">{purchases.current_page}</span> de <span className="font-bold text-slate-700">{purchases.last_page}</span>
                            </span>
                            <div className="flex items-center gap-1">
                                {purchases.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition ${
                                                    !link.url ? 'opacity-40 cursor-not-allowed border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <ChevronLeftIcon className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-xl border text-xs flex items-center justify-center transition ${
                                                    !link.url ? 'opacity-40 cursor-not-allowed border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
