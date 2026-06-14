import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('superadmin.employee-categories.store'));
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nueva Categoría</h2>}
        >
            <Head title="Crear Categoría" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <Card className="border border-blue-gray-50 shadow-sm">
                        <CardBody className="p-6">
                            <div className="mb-6">
                                <Typography variant="h5" color="blue-gray">
                                    Crear Categoría Global
                                </Typography>
                                <Typography color="gray" className="font-normal text-sm mt-1">
                                    Los empleados que crees con este rol se sincronizarán para todas las empresas.
                                </Typography>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Input
                                        label="Nombre de la categoría"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={!!errors.name}
                                        color="indigo"
                                    />
                                    {errors.name && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link 
                                        href={route('superadmin.employee-categories.index')}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Cancelar
                                    </Link>
                                    <Button color="indigo" type="submit" disabled={processing}>
                                        {processing ? 'Guardando...' : 'Guardar'}
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}