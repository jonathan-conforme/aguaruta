import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Typography, Button, CardBody, Chip } from "@material-tailwind/react";
import { PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

export default function Index({ purchases }) {
    const TABLE_HEAD = ["Fecha", "Proveedor", "Factura", "Estado", "Total"];

    return (
        <AuthenticatedLayout
            header={<Typography variant="h5" color="blue-gray" className="flex items-center gap-2"><ShoppingBagIcon className="h-6 w-6 text-indigo-500" /> Compras</Typography>}
        >
            <Head title="Compras" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <Card className="h-full w-full shadow-sm border border-gray-200">
                    <div className="rounded-none p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">Historial de Compras</Typography>
                        </div>
                        <Link href={route('purchases.create')}>
                            <Button className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700" size="sm">
                                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Registrar Compra
                            </Button>
                        </Link>
                    </div>
                    
                    <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70">{head}</Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.data.map(({ id, purchase_date, supplier, invoice_number, status, total_amount }, index) => {
                                    const classes = "p-4 border-b border-blue-gray-50";
                                    return (
                                        <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className={classes}><Typography variant="small" color="blue-gray">{purchase_date}</Typography></td>
                                            <td className={classes}><Typography variant="small" color="blue-gray" className="font-semibold">{supplier?.name}</Typography></td>
                                            <td className={classes}><Typography variant="small" color="blue-gray">{invoice_number || 'S/N'}</Typography></td>
                                            <td className={classes}>
                                                <Chip size="sm" variant="ghost" 
                                                    value={status === 'completed' ? 'Completado' : status === 'pending' ? 'Pendiente' : 'Cancelado'} 
                                                    color={status === 'completed' ? 'green' : status === 'pending' ? 'amber' : 'red'} 
                                                />
                                            </td>
                                            <td className={classes}><Typography variant="small" color="blue-gray" className="font-bold">${total_amount}</Typography></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}