import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Chip } from "@material-tailwind/react";
import { BanknotesIcon, CheckCircleIcon, LockClosedIcon, TruckIcon } from "@heroicons/react/24/solid";

export default function ShiftCard({ shift, isAdmin = false }) {
    const totalRecaudado = shift.trips?.reduce(
        (total, trip) => total + Number(trip.cash_sales_sum_total || 0),
        0
    ) || 0;

    const isClosed = shift.status === 'closed';

    return (
        <Card className="w-full border border-blue-gray-100 shadow-md">
            {/* HEADER */}
            <CardHeader
                floated={false}
                shadow={false}
                className={`m-0 p-5 border-b flex justify-between items-center ${
                    isClosed ? 'bg-gray-100' : 'bg-indigo-50/50'
                }`}
            >
                <div>
                    <Typography variant="small" className="font-bold uppercase tracking-wider">
                        Caja del {new Date(shift.opened_at).toLocaleDateString()}
                    </Typography>

                    {isAdmin && shift.user && (
                        <Typography variant="small" className="text-blue-500 font-medium">
                            Usuario: {shift.user.name}
                        </Typography>
                    )}

                    <Typography variant="small" className="flex items-center gap-1 mt-1 text-gray-600">
                        {isClosed ? (
                            <>
                                <LockClosedIcon className="h-4 w-4 text-gray-505" />
                                Cerrada
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                Activa
                            </>
                        )}
                    </Typography>
                </div>

                <Chip
                    variant={isClosed ? "filled" : "gradient"}
                    color={isClosed ? "blue-gray" : "green"}
                    value={isClosed ? "Cerrada" : "En Progreso"}
                />
            </CardHeader>

            {/* BODY */}
            <CardBody className="p-0">
                <ul className="divide-y">
                    {shift.trips?.length > 0 ? (
                        shift.trips.map((trip, index) => (
                            <li key={trip.id} className="flex justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <Typography className="text-sm font-bold flex items-center gap-2 text-gray-800">
                                            <TruckIcon className="h-4 w-4 text-gray-400" />
                                            {trip.route?.route_name || `Viaje #${trip.id}`}
                                        </Typography>
                                        <Typography className="text-xs text-gray-500">
                                            {new Date(trip.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </Typography>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Typography className="font-bold text-gray-900">
                                        ${Number(trip.cash_sales_sum_total || 0).toFixed(2)}
                                    </Typography>
                                    <Chip size="sm" value="Cobrado" color="green" variant="ghost" />
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-6 text-center text-gray-400 italic text-sm">
                            Sin viajes completados en este turno
                        </li>
                    )}
                </ul>
            </CardBody>
           
            {/* FOOTER */}
            <CardFooter className="p-5 bg-indigo-600 text-white rounded-b-xl">
                <div className="flex justify-between items-center">
                    <Typography className="uppercase text-sm font-bold tracking-wide text-indigo-100">
                        Resumen del turno
                    </Typography>

                    <div className="text-right">
                        <Typography className="text-indigo-200 text-xs">
                            Inicial: ${Number(shift.initial_cash || 0).toFixed(2)}
                        </Typography>
                        <Typography className="text-indigo-100 text-xs font-medium">
                            Ventas Efectivo: ${totalRecaudado.toFixed(2)}
                        </Typography>
                        <Typography className="text-red-200 text-xs">
                            Gastos de viaje: -${Number(shift.expenses_sum_amount || 0).toFixed(2)}
                        </Typography>

                        <div className="flex items-center justify-end gap-2 mt-1 pt-1 border-t border-indigo-500">
                            <BanknotesIcon className="h-5 w-5 text-green-300" />
                            <Typography className="text-xl font-black text-white">
                                ${(
                                    Number(shift.initial_cash || 0) +
                                    totalRecaudado -
                                    Number(shift.expenses_sum_amount || 0)
                                ).toFixed(2)}
                            </Typography>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}