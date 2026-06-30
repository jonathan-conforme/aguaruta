import React from 'react';
import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Chip
} from "@material-tailwind/react";
import {
    TruckIcon,
    MapPinIcon,
    PlayIcon,
    CheckCircleIcon,
    StopIcon
} from "@heroicons/react/24/solid";

export default function PosIndex({ auth, trips = [] }) {
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const { post, processing } = useForm();

    // 1. MOVIDA AQUÍ ADENTRO PARA QUE TENGA ACCESO A LOS ESTADOS
    const completeTrip = () => {
        if (!selectedTrip) return;

        router.post(
            route('repartidor.trips.complete', selectedTrip.id),
            {},
            {
                onSuccess: () => {
                    setShowCompleteModal(false);
                    setSelectedTrip(null);
                }
            }
        );
    };

    const handleActivateRoute = (tripId) => {
        post(route('repartidor.trips.start', tripId));
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2 text-gray-800">
                    <TruckIcon className="h-6 w-6 text-indigo-500" />
                    Mi Ruta de Hoy
                </Typography>
            }
        >
            <Head title="Mi Ruta" />

            <div className="p-4 sm:p-6 max-w-md mx-auto space-y-4">

                {trips.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <MapPinIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <Typography variant="h6" color="blue-gray">
                            Sin rutas asignadas
                        </Typography>
                        <Typography color="gray" className="font-normal mt-1 text-sm">
                            No tienes viajes pendientes o activos para hoy.
                        </Typography>
                    </div>
                ) : (
                    trips.map((trip) => (
                        <Card key={trip.id} className={`w-full border shadow-sm ${trip.status === 'completed' ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200'}`}>

                            <CardBody className="pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <Typography variant="h5" color="blue-gray" className={`mb-1 ${trip.status === 'completed' ? 'text-gray-500' : ''}`}>
                                            {trip.route?.route_name || 'Ruta Desconocida'}
                                        </Typography>

                                        <Typography color="gray" className="text-sm font-medium">
                                            Fecha: {trip.date}
                                        </Typography>
                                    </div>

                                    <Chip
                                        value={
                                            trip.status === 'pending' ? 'Pendiente' :
                                                trip.status === 'active' ? 'Activo' : 'Completado'
                                        }
                                        color={
                                            trip.status === 'pending' ? 'amber' :
                                                trip.status === 'active' ? 'green' : 'blue-gray'
                                        }
                                        size="sm"
                                    />
                                </div>

                                <div className={`p-3 rounded-lg border ${trip.status === 'completed' ? 'bg-gray-100/50 border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <Typography variant="small" className={`font-semibold mb-2 ${trip.status === 'completed' ? 'text-gray-500' : ''}`}>
                                        Carga del camión:
                                    </Typography>

                                    <ul className="space-y-1">
                                        {trip.products?.map((product) => (
                                            <li key={product.id} className={`flex justify-between text-sm ${trip.status === 'completed' ? 'text-gray-500' : ''}`}>
                                                <span>{product.name}</span>
                                                <span className="font-bold">
                                                    {product.pivot?.quantity || 0} unid.
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardBody>

                            <CardFooter className="pt-0">
                                {trip.status === 'pending' && (
                                    <Button
                                        size="lg"
                                        color="indigo"
                                        fullWidth
                                        onClick={() => handleActivateRoute(trip.id)}
                                        disabled={processing}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <PlayIcon className="h-5 w-5" />
                                        {processing ? 'Iniciando...' : 'Iniciar Ruta'}
                                    </Button>
                                )}

                                {trip.status === 'active' && (
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            size="lg"
                                            color="green"
                                            fullWidth
                                            onClick={() => router.visit(route('repartidor.sales.create', trip.id))}
                                            className="flex items-center justify-center gap-2"
                                        >
                                            Ir a Vender
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="text"
                                            color="red"
                                            fullWidth
                                            onClick={() => {
                                                setSelectedTrip(trip);
                                                setShowCompleteModal(true);
                                            }}
                                        >
                                            Finalizar este Viaje
                                        </Button>
                                    </div>
                                )}

                                {trip.status === 'completed' && (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 py-2 bg-gray-100 rounded-lg">
                                        <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                                        <Typography className="font-medium text-sm">Viaje Finalizado</Typography>
                                    </div>
                                )}
                            </CardFooter>

                        </Card>
                    ))
                )}

            </div>

            <Modal
                show={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <div className="items-center text-center gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Finalizar Ruta
                            </h2>
                            <p className="text-sm text-gray-500">
                                Esta acción cerrará el viaje actual.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border mb-4">
                        <p className="font-semibold">
                            {selectedTrip?.route?.route_name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Viaje #{selectedTrip?.id}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-indigo-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Pedidos</p>
                            <p className="text-xl font-bold text-indigo-600">
                                {selectedTrip?.sales_count || 0}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Ventas</p>
                            <p className="text-xl font-bold text-green-600">
                                ${Number(selectedTrip?.sales_sum_total || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Clientes</p>
                            <p className="text-xl font-bold text-amber-600">
                                {selectedTrip?.clientes_visitados || 0}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                        <div>✓ No podrás registrar más ventas.</div>
                        <div>✓ El viaje quedará marcado como completado.</div>
                        <div>✓ Podrás continuar con el cierre de caja.</div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="outlined"
                            onClick={() => setShowCompleteModal(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            color="red"
                            onClick={completeTrip}
                        >
                            Finalizar Viaje
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
