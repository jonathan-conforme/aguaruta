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
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Index({ auth, employees, categories, flash }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
        if (!open) reset(); // Resetea el formulario al abrir/cerrar
    };

    const toggleStatus = (id) => {
        router.patch(route('employees.toggle-status', id), {}, {
            preserveScroll: true,
        });
    };

    const resetPasswordToCedula = (id, name) => {
        if (window.confirm(`¿Estás seguro de que deseas restablecer la contraseña de ${name}? Volverá a ser su número de cédula.`)) {
            router.post(route('employees.reset-password', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const [errorModalOpen, setErrorModalOpen] = useState(false);

    useEffect(() => {
        if (flash?.error) {
            setErrorModalOpen(true);
        }
    }, [flash?.error]);

    // 🌟 Añadido 'create_user_account' al formulario
    const { data, setData, post, processing, errors, reset } = useForm({
        identification: '',
        first_name: '',
        last_name: '',
        employee_category_id: '',
        email: '',
        phone: '',
        create_user_account: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const TABLE_HEAD = ["Cédula", "Nombre Completo", "Categoría", "Contacto", "Estado", "Acciones"];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Empleados</h2>}
        >
            <Head title="Empleados" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Alerta de Error de Límites de Plan */}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm flex justify-between items-center">
                            <span className="text-sm font-medium">{flash.error}</span>
                            <button onClick={() => router.page.props.flash.error = null} className="text-red-500 font-bold">✕</button>
                        </div>
                    )}

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
                                   {employees.map(({ id, identification, first_name, last_name, category, email, phone, is_active, user }, index) => {
    const isLast = index === employees.length - 1;
    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

    return (
        <tr key={id} className="hover:bg-blue-gray-50/50 transition-colors">
            <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-mono text-sm">
                    {identification || 'Sin cédula/RUC'}
                </Typography>
            </td>

            {/* COLUMNA NOMBRE: Aquí añadimos el indicador de acceso */}
            <td className={classes}>
                <div className="flex flex-col gap-1">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                        {first_name} {last_name}
                    </Typography>
                    {user ? (
                        <div className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-1.5 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                                Acceso App de Campo
                            </span>
                        </div>
                    ) : (
                        <span className="text-[10px] font-medium text-gray-400 italic">
                            Solo Ficha Interna
                        </span>
                    )}
                </div>
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
                    <Switch
                        id={`toggle-${id}`}
                        ripple={false}
                        color="green"
                        checked={Boolean(is_active)}
                        onChange={() => toggleStatus(id)}
                        className="checked:bg-green-500"
                        containerProps={{
                            className: "p-0 cursor-pointer",
                        }}
                    />
                    <Chip
                        variant="ghost"
                        size="sm"
                        value={is_active ? "Activo" : "Inactivo"}
                        color={is_active ? "green" : "red"}
                        className="rounded-full"
                    />
                </div>
            </td>

            {/* COLUMNA ACCIONES: Corregida para validar el objeto 'user' */}
            <td className={classes}>
                <div className="flex items-center gap-2">
                    {user ? (
                        <Button
                            size="sm"
                            color="amber"
                            variant="text"
                            className="flex items-center gap-1 normal-case px-2 py-1"
                            onClick={() => resetPasswordToCedula(id, `${first_name} ${last_name}`)}
                            title="Restablecer clave a su Cédula"
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            <span className="hidden sm:inline text-xs font-semibold">Reset Clave</span>
                        </Button>
                    ) : (
                        <span className="text-xs text-gray-400 italic px-2">Sin acciones</span>
                    )}
                </div>
            </td>
        </tr>
    );

                                        <tr>
                                            <td colSpan={5} className="p-4 text-center">
                                                <Typography color="gray" className="font-normal text-sm">
                                                    Aún no has registrado empleados en tu empresa.
                                                </Typography>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>


                    {/* MODAL DE CREACIÓN DE EMPLEADO */}
                    <Dialog open={open} handler={handleOpen} size="md">
                        <form onSubmit={submit}>
                            <DialogHeader className="text-blue-gray-800">Registrar Nuevo Empleado</DialogHeader>
                            <DialogBody divider className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">

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

                                {/* Correo Electrónico (Ficha / MVP 2 Roles de Pago) */}
                                <div>
                                    <Input
                                        label="Correo Electrónico (Opcional)"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={!!errors.email}
                                        color="indigo"
                                    />
                                    <span className="text-gray-550 text-[10px] mt-0.5 block leading-tight">Útil para envío de roles de pago.</span>
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

                                <hr className="md:col-span-2 my-2 border-blue-gray-50" />

                                {/* INTERRUPTOR PARA CREAR LA CUENTA DE ACCESO */}
                                <div className="md:col-span-2 flex items-center justify-between bg-indigo-50/40 p-4 rounded-lg border border-indigo-100">
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="font-bold">
                                            ¿Dar acceso a la App de campo?
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal text-xs mt-0.5">
                                            Permite al empleado iniciar sesión en la calle usando su identificación.
                                        </Typography>
                                    </div>
                                    <Switch
                                        id="create_user_account"
                                        color="indigo"
                                        checked={data.create_user_account}
                                        onChange={(e) => setData('create_user_account', e.target.checked)}
                                    />
                                </div>

                                {/* CUADRO INFORMATIVO DE ACCESO REPARTIDOR */}
                                {data.create_user_account && (
                                    <div className="md:col-span-2 bg-blue-gray-50/60 p-3 rounded-lg border border-blue-gray-100 space-y-1 animate-fade-in">
                                        <Typography variant="small" className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                                            Credenciales asignadas para la App de campo:
                                        </Typography>
                                        <div className="text-xs text-gray-700 pl-4 space-y-0.5">
                                            <p>• <strong>Usuario de ingreso:</strong> Cédula/RUC (<span className="font-mono text-indigo-600 font-medium">{data.identification || 'Ej: 0953832805'}</span>)</p>
                                            <p>• <strong>Contraseña inicial:</strong> La misma Cédula/RUC</p>
                                        </div>
                                    </div>
                                )}

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

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
