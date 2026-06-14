import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import CreateTrip from './Create';
import {
    Card, Typography, Button, CardHeader, CardBody, Chip,
    Dialog, DialogHeader, DialogBody, IconButton,
    Alert, Spinner, Tooltip, Menu, MenuHandler, MenuList, MenuItem
} from "@material-tailwind/react";
import { 
    CheckCircleIcon, 
    TruckIcon, 
    ArchiveBoxIcon,
     
} from "@heroicons/react/24/outline";

// --- FUNCIONES AUXILIARES ---
const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Componente de acciones mejorado con tooltips
const ActionMenu = ({ tripId, onEdit, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.')) {
            setIsDeleting(true);
            try {
                await router.delete(`/trips/${tripId}`);
                // Mostrar feedback de éxito (implementar con toast/alert)
            } catch (error) {
                console.error('Error deleting trip:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Tooltip content="Ver detalles">
                <IconButton 
                    variant="text" 
                    size="sm" 
                    color="blue" 
                    onClick={() => router.visit(`/trips/${tripId}`)}
                    aria-label="Ver detalles del viaje"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </IconButton>
            </Tooltip>
            
            <Tooltip content="Editar viaje">
                <IconButton 
                    variant="text" 
                    size="sm" 
                    color="amber" 
                    onClick={() => onEdit(tripId)}
                    aria-label="Editar viaje"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </IconButton>
            </Tooltip>
            
            <Tooltip content="Eliminar viaje">
                <IconButton 
                    variant="text" 
                    size="sm" 
                    color="red" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Eliminar viaje"
                >
                    {isDeleting ? (
                        <Spinner className="w-4 h-4" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                </IconButton>
            </Tooltip>
        </div>
    );
};

// Componente de productos mejorado con límite y expandir
const ProductsList = ({ products }) => {
    const [expanded, setExpanded] = useState(false);
    const MAX_VISIBLE = 2;
    const hasManyProducts = products?.length > MAX_VISIBLE;
    const visibleProducts = expanded ? products : products?.slice(0, MAX_VISIBLE);

    if (!products?.length) return <span className="text-gray-400 text-sm">—</span>;

    return (
        <div className="flex flex-col gap-1.5">
            {visibleProducts.map(p => (
                <div key={p.id} className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 gap-1.5 w-max">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 rounded-sm">
                         {p.pivot.initial_quantity}/{p.pivot.quantity} 
                    </span>
                    <Typography variant="small" color="gray" className="text-xs font-medium truncate max-w-[120px]" title={p.name}>
                        {p.name}
                    </Typography>
                </div>
            ))}
            {hasManyProducts && (
                <Button 
                    variant="text" 
                    size="sm" 
                    className="text-xs w-max"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Ver menos' : `Ver ${products.length - MAX_VISIBLE} más productos`}
                </Button>
            )}
        </div>
    );
};

// Componente de empleado mejorado con tooltip
const EmployeeBadge = ({ user, color = "blue", role }) => {
    if (!user) return <span className="text-gray-400 text-sm">—</span>;
    
    const colorClasses = {
        blue: "bg-blue-50 text-blue-900 border-blue-100",
        purple: "bg-purple-50 text-purple-900 border-purple-100",
        teal: "bg-teal-50 text-teal-900 border-teal-100",
        green: "bg-green-50 text-green-900 border-green-100",
    };

    return (
        <Tooltip content={`${role || 'Empleado'}: ${user.name}`}>
            <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${colorClasses[color]}`}>
                    {getInitials(user.name)}
                </div>
                <Typography variant="small" color="blue-gray" className="font-normal truncate max-w-[120px]" title={user.name}>
                    {user.name}
                </Typography>
            </div>
        </Tooltip>
    );
};

// Componente de estado con iconos
// Componente de estado con Heroicons ANIMADOS
const StatusBadge = ({ status }) => {
    
    // 🚚 El camión trabajando (Vibración)
    const truckIcon = (
        <TruckIcon 
            className={`h-4 w-4 ${status === 'active' ? 'animate-motor' : ''}`} 
        />
    );

    // ✨ El latido de éxito (Escala)
    const checkIcon = (
        <CheckCircleIcon 
            className={`h-4 w-4 ${status === 'completed' ? 'animate-exito' : ''}`} 
        />
    );

    // 📦 La cajita esperando (Flote) - Usa 'animate-flotar', 'animate-tictac' o 'animate-pulse'
    const boxIcon = (
        <ArchiveBoxIcon 
            className={`h-4 w-4 ${status === 'pending' ? 'animate-flotar' : ''}`} 
        />
    );

    const config = {
        completed: { 
            color: "green", 
            icon: checkIcon, 
            label: "Completado" 
        },
        active: { 
            color: "blue", 
            icon: truckIcon, 
            label: "En Ruta" 
        },
        pending: { 
            color: "amber", 
            icon: boxIcon, // <-- Usamos el icono con la animación de espera
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
                <span className="flex items-center gap-1.5 font-medium">
                    {current.icon}
                    {current.label}
                </span>
            } 
            className="rounded-full w-max" 
        />
    );
};
    
    

// --- COMPONENTE PRINCIPAL ---
export default function Index({ auth, trips, users, products, routes }) { 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) setSelectedTrip(null);
    };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    // Filtrar viajes
    const filteredTrips = trips.filter(trip => {
        const matchesSearch = searchTerm === '' || 
            trip.route?.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const TABLE_HEAD = ["Fecha", "Vendedor", "Estado", "Carga Inicial / Carga Actual", "Ruta", "Acciones"];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Despachos</h2>}>
            <Head title="Historial de Viajes" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Feedback de carga */}
                    {isLoading && (
                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                            <Card className="p-6 flex items-center gap-3">
                                <Spinner className="h-8 w-8" />
                                <Typography>Cargando viajes...</Typography>
                            </Card>
                        </div>
                    )}

                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm">
                        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <Typography variant="h5" color="blue-gray">Historial de Despachos</Typography>
                                    <Typography color="gray" className="mt-1 font-normal text-sm">
                                        Control de rutas, choferes y cargas. 
                                        <span className="font-medium text-blue-600"> {filteredTrips.length}</span> viajes encontrados
                                    </Typography>
                                </div>

                                {/* Barra de herramientas */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Buscar por ruta o chofer..."
                                            className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            aria-label="Buscar viajes"
                                        />
                                    </div>
                                    
                                    <select
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        aria-label="Filtrar por estado"
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="pending">En Bodega</option>
                                        <option value="active">En Ruta</option>
                                        <option value="completed">Completado</option>
                                    </select>

                                    <Button className="flex items-center gap-2" color="indigo" size="sm" onClick={toggleModal} aria-label="Crear nuevo viaje">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nuevo Viaje
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="overflow-x-auto px-0 py-0">
                            <div className="min-w-[800px] lg:min-w-full">
                                <table className="w-full table-auto text-left" role="table">
                                    <thead>
                                        <tr role="row">
                                            {TABLE_HEAD.map((head) => (
                                                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                                    <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTrips.length > 0 ? (
                                            filteredTrips.map((trip, index) => {
                                                const classes = index === filteredTrips.length - 1 ? "p-4" : "p-4 border-b border-blue-gray-50 tex-center";
                                                return (
                                                    <tr key={trip.id} className="hover:bg-blue-gray-50/50 transition-colors group" role="row">
                                                        <td className={classes}>
                                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                                {new Date(trip.date).toLocaleDateString('es-ES', { 
                                                                    day: '2-digit', 
                                                                    month: 'short', 
                                                                    year: 'numeric' 
                                                                })}
                                                            </Typography>
                                                        </td>

                                                        {/* Chofer 
                                                        <td className={classes}>
                                                            <EmployeeBadge user={trip.driver} color="blue" role="Chofer" />
                                                        </td>

                                                        */}
                                                        <td className={classes}>
                                                            <EmployeeBadge user={trip.seller} color="purple" role="Vendedor" />
                                                        </td>


                                                         {/* ayudantes 
                                                        <td className={classes}>
                                                            <div className="flex flex-col gap-1.5">
                                                                {trip.helper1 && <EmployeeBadge user={trip.helper1} color="teal" role="Ayudante" />}
                                                                {trip.helper2 && <EmployeeBadge user={trip.helper2} color="green" role="Ayudante" />}
                                                                {!trip.helper1 && !trip.helper2 && <span className="text-gray-400 text-sm">Ninguno</span>}
                                                            </div>
                                                        </td>*/}
                                                        <td className={classes}>
                                                            <StatusBadge status={trip.status} />
                                                        </td>
                                                        <td className={classes }>
                                                            
                                                            <ProductsList products={trip.products} />
                                                          
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <Typography variant="small" color="blue-gray" className="font-medium truncate max-w-[150px]" title={trip.route?.route_name}>
                                                                    {trip.route?.route_name || <span className="text-gray-400">—</span>}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <ActionMenu tripId={trip.id} trip={trip} onEdit={() => handleEdit(trip)} />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        <Typography color="blue-gray" className="font-medium text-lg">
                                                            {searchTerm || statusFilter !== 'all' ? 'No se encontraron viajes' : 'Sin despachos'}
                                                        </Typography>
                                                        <Typography color="gray" className="font-normal text-sm max-w-md text-center">
                                                            {searchTerm || statusFilter !== 'all' 
                                                                ? 'No hay viajes que coincidan con los filtros seleccionados. Prueba con otros criterios.'
                                                                : 'Aún no se han registrado viajes. Haz clic en "Nuevo Viaje" para empezar.'}
                                                        </Typography>
                                                        {(searchTerm || statusFilter !== 'all') && (
                                                            <Button variant="outlined" size="sm" onClick={() => {
                                                                setSearchTerm('');
                                                                setStatusFilter('all');
                                                            }}>
                                                                Limpiar filtros
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>

                    {/* MODAL MEJORADO */}
                    <Dialog open={isModalOpen} handler={toggleModal} size="lg" className="p-4" aria-label="Formulario de viaje">
                        <DialogHeader className="flex flex-col items-start pb-0">
                            <Typography variant="h5" color="blue-gray">
                                {selectedTrip ? 'Editar Viaje' : 'Planificar Nuevo Viaje'}
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal text-sm">
                                {selectedTrip 
                                    ? 'Modifica los datos del viaje seleccionado'
                                    : 'Asigna el equipo de trabajo y la carga para el nuevo despacho'}
                            </Typography>
                        </DialogHeader>

                        <DialogBody className="max-h-[75vh] overflow-y-auto">
                            <CreateTrip
                                users={users}
                                products={products}
                                routes={routes}
                                onClose={toggleModal}
                                initialData={selectedTrip}
                            />
                        </DialogBody>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}