import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Card, 
    Typography, 
    Button, 
    CardHeader, 
    CardBody,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input
} from "@material-tailwind/react";

export default function Index({ auth, categories }) {
    // 1. Estado para controlar si el modal está abierto o cerrado
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    // 2. Formulario de Inertia integrado aquí mismo
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employee-categories.store'), {
            onSuccess: () => {
                reset();
                handleOpen(); // Cierra el modal al terminar
            },
        });
    };

    const TABLE_HEAD = ["ID", "Nombre de Categoría", "Slug", "Estado"];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Categorías</h2>}
        >
            <Head title="Categorías de Empleados" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm">
                        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
                            <div className="flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Categorías de Empleados
                                    </Typography>
                                    <Typography color="gray" className="mt-1 font-normal text-sm">
                                        Lista de roles globales disponibles para todas las empresas.
                                    </Typography>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Button 
                                        className="flex items-center gap-3" 
                                        color="indigo" 
                                        size="sm"
                                        onClick={handleOpen}
                                    >
                                        + Nueva Categoría
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody className="overflow-scroll px-0 py-0">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
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
                                    {categories.length > 0 ? (
                                        categories.map(({ id, name, slug }, index) => {
                                            const isLast = index === categories.length - 1;
                                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={id} className="hover:bg-blue-gray-50/50 transition-colors">
                                                    <td className={classes}>
                                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                                            #{id}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                                            {name}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography variant="small" color="gray" className="font-normal font-mono text-xs">
                                                            {slug}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip variant="ghost" size="sm" value="Global" color="green" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center">
                                                <Typography color="gray" className="font-normal text-sm">
                                                    No hay categorías registradas.
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* MODAL DE CREACIÓN INTEGRADO */}
                    <Dialog open={open} handler={handleOpen} size="xs">
                        <form onSubmit={submit}>
                            <DialogHeader className="text-blue-gray-800">Crear Nueva Categoría</DialogHeader>
                            <DialogBody divider className="py-6">
                                <div className="w-full">
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
                            </DialogBody>
                            <DialogFooter className="space-x-2">
                                <Button variant="text" color="red" onClick={handleOpen}>
                                    Cancelar
                                </Button>
                                <Button color="indigo" type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Dialog>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}