import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
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
    Input,
    Select,
    Option,
    Switch
} from "@material-tailwind/react";


export default function Index({ auth, employees, categories, flash }) {
    // 1. Estado para controlar el Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const toggleStatus = (id) => {
        router.patch(route('employees.toggle-status', id), {}, {
            preserveScroll: true,
        });
    };
    const [errorModalOpen, setErrorModalOpen] = useState(false);

    // Este efecto se activa CADA VEZ que flash.error cambia
    useEffect(() => {
        if (flash?.error) {
            setErrorModalOpen(true);
        }
    }, [flash?.error]);
    // 2. Formulario de Inertia con todos los campos necesarios
    const { data, setData, post, processing, errors, reset } = useForm({
        identification: '',
        first_name: '',
        last_name: '',
        employee_category_id: '',
        email: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => {
                reset();
                handleOpen(); // Cierra el modal al guardar con éxito
            },
        });
    };

    const TABLE_HEAD = ["Cédula", "Nombre Completo", "Categoría", "Contacto", "Estado"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Empleados</h2>}
        >
            <Head title="Empleados" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <Card className="h-full w-full border border-blue-gray-50 shadow-sm">
                        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
                            <div className="flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Personal de la Empresa
                                    </Typography>
                                    <Typography color="gray" className="mt-1 font-normal text-sm">
                                        Lista de los trabajadores registrados en tu planta purificadora.
                                    </Typography>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Button
                                        className="flex items-center gap-3"
                                        color="indigo"
                                        size="sm"
                                        onClick={handleOpen}
                                    >
                                        + Registrar Empleado
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
                                    {employees.length > 0 ? (
                                        employees.map(({ id, identification, first_name, last_name, category, email, phone, is_active }, index) => {
                                            const isLast = index === employees.length - 1;
                                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={id} className="hover:bg-blue-gray-50/50 transition-colors">
                                                    <td className={classes}>
                                                        <Typography variant="small" color="blue-gray" className="font-mono text-sm">
                                                            {identification || 'Sin cédula/RUC'}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                                            {first_name} {last_name}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={category?.name || 'Sin categoría'}
                                                            color="blue-gray"
                                                        />
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                                                                {email || 'Sin correo'}
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal text-xs">
                                                                {phone || 'Sin teléfono'}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            {/* Interruptor tipo Toggle */}
                                                            <Switch
                                                                id={`toggle-${id}`}
                                                                ripple={false}
                                                                color="green"
                                                                checked={Boolean(is_active)} // Fuerza que sea un booleano puro
                                                                onChange={() => toggleStatus(id)} // Llama a la función que dispara Inertia
                                                                className="checked:bg-green-500"
                                                                containerProps={{
                                                                    className: "p-0 cursor-pointer",
                                                                }}
                                                            />

                                                            {/* Chip para dar un feedback visual de texto */}
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={is_active ? "Activo" : "Inactivo"}
                                                                color={is_active ? "green" : "red"}
                                                                className="rounded-full"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center">
                                                <Typography color="gray" className="font-normal text-sm">
                                                    Aún no has registrado empleados en tu empresa.
                                                </Typography>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>

                    {/* MODAL DE CREACIÓN DE EMPLEADO */}
                    <Dialog open={open} handler={handleOpen} size="md">
                        <form onSubmit={submit}>
                            <DialogHeader className="text-blue-gray-800">Registrar Nuevo Empleado</DialogHeader>
                            <DialogBody divider className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Cédula/RUC */}
                                <div className="md:col-span-2">
                                    <Input
                                        label="Número de Cédula o RUC (Ecuador)"
                                        value={data.identification}
                                        onChange={(e) => setData('identification', e.target.value)}
                                        error={!!errors.identification}
                                        color="indigo"
                                    />
                                    {errors.identification && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.identification}</span>
                                    )}
                                </div>

                                {/* Nombres */}
                                <div>
                                    <Input
                                        label="Nombres"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        error={!!errors.first_name}
                                        color="indigo"
                                    />
                                    {errors.first_name && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.first_name}</span>
                                    )}
                                </div>

                                {/* Apellidos */}
                                <div>
                                    <Input
                                        label="Apellidos"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        error={!!errors.last_name}
                                        color="indigo"
                                    />
                                    {errors.last_name && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.last_name}</span>
                                    )}
                                </div>

                                {/* Cargo/Categoría */}
                                <div className="md:col-span-2">
                                    <Select
                                        label="Selecciona la Categoría"
                                        value={data.employee_category_id}
                                        onChange={(val) => setData('employee_category_id', val)}
                                        error={!!errors.employee_category_id}
                                        color="indigo"
                                    >
                                        {categories.map((category) => (
                                            <Option key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
                                    {errors.employee_category_id && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.employee_category_id}</span>
                                    )}
                                </div>

                                {/* Correo */}
                                <div>
                                    <Input
                                        label="Correo electrónico (Opcional)"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={!!errors.email}
                                        color="indigo"
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                                    )}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <Input
                                        label="Teléfono (Opcional)"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        error={!!errors.phone}
                                        color="indigo"
                                    />
                                    {errors.phone && (
                                        <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>
                                    )}
                                </div>

                            </DialogBody>
                            <DialogFooter className="space-x-2">
                                <Button variant="text" color="red" onClick={handleOpen}>
                                    Cancelar
                                </Button>
                                <Button color="indigo" type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Registrar Empleado'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Dialog>
{/* 🚨 MODAL DE ADVERTENCIA PARA LÍMITE DE PLAN 🚨 */}
<Dialog open={errorModalOpen} handler={() => setErrorModalOpen(false)} size="xs" className="text-center">
    <DialogBody className="p-6">
        {/* Icono de Alerta Redondo */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Límite alcanzado!
        </h3>
        
        <p className="text-sm text-gray-600">
            {flash?.error}
        </p>
    </DialogBody>
    <DialogFooter className="justify-center pt-0 pb-6 gap-2">
        <Button 
            variant="text" 
            color="gray" 
            onClick={() => setErrorModalOpen(false)}
        >
            Cerrar
        </Button>
        <Button 
            color="indigo" 
            onClick={() => {
                setErrorModalOpen(false);
                // Opcional: Aquí podrías redirigirlo a la pantalla de renovar 
                // router.visit('/ruta-de-precios');
            }}
        >
            Mejorar Plan
        </Button>
    </DialogFooter>
</Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}