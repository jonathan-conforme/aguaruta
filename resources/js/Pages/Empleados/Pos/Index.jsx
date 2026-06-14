import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, CardHeader, CardBody, Chip } from "@material-tailwind/react";
import { 
    BanknotesIcon, 
    ArrowsRightLeftIcon, 
    CreditCardIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"; // Puedes usar /solid si prefieres iconos rellenos
const PaymentBadge = ({ method }) => {
    // Definimos colores, textos e ICONOS para cada método
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

    // 1. Verificamos el rol directamente desde el objeto del usuario
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';

    const [selectedDate, setSelectedDate] = useState(currentDateFilter);

    // 2. Usamos el baseUrl dinámico que viene del controlador
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);

        router.get(baseUrl, { date: newDate }, {
            preserveState: true,
            replace: true
        });
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

                 {/* Controles de Filtro (Selector de Fecha) */}
                    <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div>
                            <Typography variant="h6" color="blue-gray">Filtro por Fecha</Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                                Selecciona un día para ver su resumen.
                            </Typography>
                        </div>
                        <div>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                            />
                        </div>
                    </div>
                   {/* Tabla Detallada */}
                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm mt-6">
                        
                        {/* AQUI ESTÁ EL ARREGLO DEL CARDHEADER */}
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

                        <CardBody className="overflow-x-auto px-0 py-0">
                            <table className="w-full table-auto text-left" role="table">
                                <thead>
                                    <tr role="row">
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Hora</th>
                                        
                                        {isAdmin && (
                                            <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                                Vendedor
                                            </th>
                                        )}
                                        
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Cliente</th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Viaje Ref.</th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Producto</th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">Método de Pago</th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.length > 0 ? (
                                        sales.map((sale, index) => {
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
                                                            #{sale.trip_id}
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
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <span className="text-4xl">🧾</span>
                                                    <Typography color="blue-gray" className="font-medium text-lg">
                                                        Sin movimientos
                                                    </Typography>
                                                    <Typography color="gray" className="font-normal text-sm max-w-md text-center">
                                                        No se encontraron registros de ventas para la fecha seleccionada ({selectedDate}).
                                                    </Typography>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}