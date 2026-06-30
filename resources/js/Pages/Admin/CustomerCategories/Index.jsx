import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Typography, Button, Input, IconButton } from "@material-tailwind/react";

export default function Index({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer-categories.store'), {
            onSuccess: () => reset('name'),
        });
    };

    const handleToggleStatus = (category) => {
        const nuevoEstado = !category.is_active;
        const accion = nuevoEstado ? 'activar' : 'desactivar';

        if (confirm(`¿Estás seguro de que deseas ${accion} esta categoría?`)) {
            router.put(route('customer-categories.update', category.id), {
                name: category.name,
                is_active: nuevoEstado
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Categorías</h2>}>
            <Head title="Categorías de Clientes" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* ENCABEZADO DE LA PÁGINA */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Typography variant="h4" color="blue-gray">
                            Categorías de Clientes
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Gestiona los tipos de clientes para asignarles precios personalizados.
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* FORMULARIO PARA CREAR NUEVA CATEGORÍA */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-gray-50 h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                            </div>
                            <Typography variant="h6" color="blue-gray">Nueva Categoría</Typography>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <Input
                                    label="Nombre (Ej: Tienda, Residencial)"
                                    color="indigo"
                                    size="lg"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={!!errors.name}
                                    className="bg-gray-50/50"
                                />
                                {errors.name && <Typography variant="small" color="red" className="mt-2 flex items-center gap-1 font-normal">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                    </svg>
                                    {errors.name}
                                </Typography>}
                            </div>

                            <Button
                                type="submit"
                                color="indigo"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : 'Crear Categoría'}
                            </Button>
                        </form>
                    </div>

                    {/* LISTADO DE CATEGORÍAS */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-blue-gray-50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nombre de la Categoría
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Estado / Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                                    </svg>
                                                    <Typography variant="h6" color="blue-gray">Sin categorías</Typography>
                                                    <Typography variant="small" className="font-normal mt-1">Crea tu primera categoría usando el formulario de la izquierda.</Typography>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id} className={`hover:bg-blue-gray-50/30 transition-colors ${!category.is_active ? 'bg-gray-50/50' : ''}`}>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`h-2.5 w-2.5 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />

                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={`font-medium ${!category.is_active ? 'text-gray-400 line-through' : ''}`}
                                                        >
                                                            {category.name}
                                                        </Typography>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                                                    <IconButton
                                                        variant="text"
                                                        color={category.is_active ? "red" : "green"}
                                                        onClick={() => handleToggleStatus(category)}
                                                        title={category.is_active ? "Desactivar categoría" : "Activar categoría"}
                                                        className={category.is_active ? "hover:bg-red-50" : "hover:bg-green-50"}
                                                    >
                                                        {category.is_active ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </IconButton>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
