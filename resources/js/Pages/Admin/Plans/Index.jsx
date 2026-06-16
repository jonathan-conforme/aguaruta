import React from 'react';
import { Card, Typography, Chip } from "@material-tailwind/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PlansIndex({ auth, plans }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Planes Disponibles</h2>}>
            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(plans).map(([name, details]) => (
                    <Card key={name} className="p-6 border border-blue-gray-100 shadow-none">
                        <Typography variant="h4" className="capitalize mb-2 text-indigo-600">{name}</Typography>

                        <div className="mb-4">
                            <Typography variant="small" className="font-bold uppercase text-gray-500 mb-2">Límites</Typography>
                            {Object.entries(details.limits).map(([limit, value]) => (
                                <div key={limit} className="flex justify-between py-1 border-b border-gray-50">
                                    <span className="capitalize">{limit.replace('_', ' ')}</span>
                                    <span className="font-semibold">{value === 99999 ? 'Ilimitado' : value}</span>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Typography variant="small" className="font-bold uppercase text-gray-500 mb-2">Módulos</Typography>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(details.modules).map(([module, enabled]) => (
                                    <Chip
                                        key={module}
                                        size="sm"
                                        variant="ghost"
                                        color={enabled ? "green" : "blue-gray"}
                                        value={module.replace('_', ' ')}
                                    />
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
