import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import CreateTrip from './Create';
import {
    Card, Typography, Button, CardBody, Chip,
    Dialog, DialogHeader, DialogBody, IconButton,
    Spinner, Tooltip
} from "@material-tailwind/react";
import {
    CheckCircleIcon,
    TruckIcon,
    ArchiveBoxIcon,
    PencilIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    UserIcon
} from "@heroicons/react/24/solid";

// --- HELPERS Y COMPONENTES AUXILIARES ---
const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const ProductsList = ({ products }) => {
    const [expanded, setExpanded] = useState(false);
    const MAX_VISIBLE = 2;
    const hasManyProducts = products?.length > MAX_VISIBLE;
    const visibleProducts = expanded ? products : products?.slice(0, MAX_VISIBLE);

    if (!products?.length) return <span className="text-gray-400 text-xs">—</span>;

    return (
        <div className="flex flex-col gap-1">
            {visibleProducts.map(p => (
                <div key={p.id} className="flex items-center bg-gray-50 border border-gray-200/80 rounded-lg px-2 py-0.5 gap-1.5 w-max">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">
                        {p.pivot.initial_quantity}/{p.pivot.quantity}
                    </span>
                    <Typography variant="small" color="blue-gray" className="text-xs font-medium truncate max-w-[130px]" title={p.name}>
                        {p.name}
                    </Typography>
                </div>
            ))}
            {hasManyProducts && (
                <button
                    type="button"
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 text-left mt-0.5"
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                    {expanded ? 'Ver menos' : `+${products.length - MAX_VISIBLE} más`}
                </button>
            )}
        </div>
    );
};

const EmployeeBadge = ({ user, role }) => {
    if (!user) return <span className="text-gray-400 text-xs">—</span>;

    return (
        <Tooltip content={`${role || 'Empleado'}: ${user.name}`}>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {getInitials(user.name)}
                </div>
                <Typography variant="small" color="blue-gray" className="font-medium text-xs truncate max-w-[130px]">
                    {user.name}
                </Typography>
            </div>
        </Tooltip>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        completed: {
            color: "green",
            icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
            label: "Completado"
        },
        active: {
            color: "indigo",
            icon: <TruckIcon className="h-3.5 w-3.5" />,
            label: "En Ruta"
        },
        pending: {
            color: "amber",
            icon: <ArchiveBoxIcon className="h-3.5 w-3.5" />,
            label: "En Bodega"
        }
    };

    const current = config[status] || config.pending;

    return (
        <Chip
            variant="ghost"
            color={current.color}
            size="sm"
            value={
                <span className="flex items-center gap-1 font-semibold text-[11px]">
                    {current.icon}
                    {current.label}
                </span>
            }
            className="rounded-lg w-max"
        />
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function Index({ auth, trips, users, products, routes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const allTrips = Array.isArray(trips) ? trips : (trips?.data || []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) setSelectedTrip(null);
    };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    const filteredTrips = allTrips.filter(trip => {
        const matchesSearch = searchTerm === '' ||
            trip.route?.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const TABLE_HEAD = ["Fecha", "Vendedor", "Estado", "Carga Inicial / Actual", "Ruta", "Acciones"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 font-bold">
                    <TruckIcon className="h-6 w-6 text-indigo-500" /> Despachos
                </Typography>
            }
        >
            <Head title="Historial de Despachos" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-3 sm:py-0">
                <Card className="h-full w-full shadow-sm border border-gray-200/80 rounded-2xl overflow-hidden bg-slate-50/50">

                    {/* Header Principal */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col gap-4 bg-white">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="font-bold text-lg sm:text-xl">
                                    Historial de Despachos
                                </Typography>
                                <Typography color="gray" className="mt-0.5 text-xs sm:text-sm font-normal">
                                    Control de rutas, vendedores y stock asignado ({filteredTrips.length} viajes).
                                </Typography>
                            </div>

                            <Button
                                onClick={toggleModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100"
                                size="sm"
                            >
                                <PlusIcon strokeWidth={2.5} className="h-4 w-4" /> Nuevo Viaje
                            </Button>
                        </div>

                        {/* Filtros */}
                        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-gray-100">
                            <div className="relative w-full sm:w-64">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por ruta o vendedor..."
                                    className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="w-full sm:w-48 px-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Todos los estados</option>
                                <option value="pending">En Bodega</option>
                                <option value="active">En Ruta</option>
                                <option value="completed">Completado</option>
                            </select>

                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="text"
                                    color="gray"
                                    size="sm"
                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                    className="text-xs rounded-xl py-1.5"
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* VISTA ESCRITORIO (Tabla) */}
                    <CardBody className="hidden md:block overflow-x-auto px-0 pt-0 pb-2 bg-white">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head, idx) => (
                                        <th key={head} className={`border-b border-gray-100 bg-gray-50/70 p-4 ${idx === 5 ? 'text-right' : ''}`}>
                                            <Typography variant="small" className="font-bold text-gray-600 text-xs uppercase tracking-wider">
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTrips.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500 text-sm">
                                            No se encontraron despachos registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTrips.map((trip) => (
                                        <tr key={trip.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="p-4">
                                                <Typography variant="small" color="blue-gray" className="font-bold text-xs">
                                                    {new Date(trip.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <EmployeeBadge user={trip.seller} role="Vendedor" />
                                            </td>
                                            <td className="p-4">
                                                <StatusBadge status={trip.status} />
                                            </td>
                                            <td className="p-4">
                                                <ProductsList products={trip.products} />
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-slate-700">
                                                    <MapPinIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    <Typography variant="small" className="font-medium text-xs truncate max-w-[140px]">
                                                        {trip.route?.route_name || '—'}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <IconButton
                                                    variant="text"
                                                    color="blue"
                                                    onClick={() => handleEdit(trip)}
                                                    className="rounded-lg hover:bg-blue-50"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardBody>

                    {/* VISTA MÓVIL (Tarjetas limpias y táctiles) */}
                    <div className="block md:hidden p-3 space-y-3">
                        {filteredTrips.map((trip) => (
                            <div
                                key={trip.id}
                                onClick={() => handleEdit(trip)}
                                className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 flex flex-col gap-3 cursor-pointer hover:border-blue-300 transition-all active:scale-[0.99]"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <TruckIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-xs block leading-tight">
                                                {new Date(trip.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                                <MapPinIcon className="h-3 w-3 text-slate-400" />
                                                {trip.route?.route_name || 'Sin Ruta'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <StatusBadge status={trip.status} />
                                        <IconButton
                                            variant="text"
                                            color="blue"
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(trip); }}
                                            className="rounded-full shrink-0"
                                        >
                                            <PencilIcon className="h-4 w-4 text-slate-400" />
                                        </IconButton>
                                    </div>
                                </div>

                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Vendedor</span>
                                        <EmployeeBadge user={trip.seller} role="Vendedor" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Carga</span>
                                        <ProductsList products={trip.products} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredTrips.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm bg-white rounded-2xl">
                                No se encontraron despachos.
                            </div>
                        )}
                    </div>

                    {/* PAGINACIÓN */}
                    {trips.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-4 gap-3 bg-white">
                            <Typography variant="small" color="gray" className="font-normal text-xs text-center sm:text-left">
                                Página <strong className="text-blue-gray-900">{trips.current_page}</strong> de{" "}
                                <strong className="text-blue-gray-900">{trips.last_page}</strong>
                            </Typography>

                            <div className="flex gap-1">
                                {trips.links?.slice(1, -1).map((link) => (
                                    <Button
                                        key={link.label}
                                        variant={link.active ? "filled" : "outlined"}
                                        size="sm"
                                        color={link.active ? "indigo" : "gray"}
                                        className="rounded-xl text-xs px-3 py-1.5"
                                        onClick={() => router.visit(link.url)}
                                    >
                                        {link.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* MODAL EDITAR / CREAR */}
            <Dialog
                open={isModalOpen}
                handler={toggleModal}
                size="lg"
                className="w-[95%] sm:w-full max-w-2xl mx-auto rounded-2xl p-0 overflow-hidden shadow-2xl"
            >
                <DialogHeader className="border-b border-gray-100 px-5 py-4 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                            {selectedTrip ? 'Editar Despacho' : 'Planificar Nuevo Despacho'}
                        </Typography>
                        <Typography color="gray" className="font-normal text-xs mt-0.5">
                            {selectedTrip ? 'Modifica la información del despacho' : 'Asigna vendedor, ruta y productos'}
                        </Typography>
                    </div>
                    <IconButton variant="text" color="blue-gray" size="sm" onClick={toggleModal} className="rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </DialogHeader>

                <DialogBody className="p-5 max-h-[75vh] overflow-y-auto">
                    <CreateTrip
                        users={users}
                        products={products}
                        routes={routes}
                        onClose={toggleModal}
                        initialData={selectedTrip}
                    />
                </DialogBody>
            </Dialog>
        </AuthenticatedLayout>
    );
}
