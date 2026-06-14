import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import Create from './Create';
import Edit from './Edit';
import { useEffect } from 'react';
import { PencilIcon, PlusIcon, ArrowRightIcon, ArrowLeftIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function Index({ auth, companies }) {
    
    const toggle = (id) => {
            router.patch(route('companies.toggle', id), {}, {
                preserveScroll: true,
                onSuccess: () => {
            router.reload(); // recarga
        }
            });
        };
    const TABLE_HEAD = ["Id", "Empresa", "RUC", "Email", "Telefono", "Plan", "Fecha de expiración", "Estado", "Role", "Acciones"];
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Estado para edición
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const handleEditClick = (company) => {
        setSelectedCompany(company);
        setIsEditOpen(true);
    };

    // PAGINACIÓN (Inertia)
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveScroll: true });
        }
    };
    //FECHAS DE EXPIRACIÓN
    const renderExpirationUX = (dateString) => {
        if (!dateString) {
            return (
                <span className="text-gray-400 text-sm italic whitespace-nowrap">Ilimitado</span>
            );
        }
        

        const expDate = new Date(dateString);
        const today = new Date();
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

        const formattedDate = expDate.toLocaleDateString();

        // 🚨 Ya expiró (Días negativos)
        if (diffDays < 0) {
            return (
                <Tooltip content={`Expiró hace ${Math.abs(diffDays)} días`}>
                    <div className="flex items-center gap-1.5 w-max px-2.5 py-1 rounded-md bg-red-50 text-red-700 cursor-help border border-red-100 transition-colors hover:bg-red-100">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <Typography variant="small" className="font-bold">
                            {formattedDate}
                        </Typography>
                    </div>
                </Tooltip>
            );
        }

        // ⚠️ Vence pronto (15 días o menos)
        if (diffDays <= 15) {
            return (
                <Tooltip content={`Vence en ${diffDays} días`}>
                    <div className="flex items-center gap-1.5 w-max px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 cursor-help border border-orange-100 transition-colors hover:bg-orange-100">
                        <ClockIcon className="h-4 w-4" />
                        <Typography variant="small" className="font-bold">
                            {formattedDate}
                        </Typography>
                    </div>
                </Tooltip>
            );
        }

        // ✅ Todo en orden (Más de 15 días)
        return (
            <div className="flex items-center w-max px-2.5 py-1">
                <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                    {formattedDate}
                </Typography>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Empresas</h2>}
        >
            <Head title="Empresas" />

            {/* Ajuste de padding para pantallas muy pequeñas */}
            <div className="py-8 sm:py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ENCABEZADO RESPONSIVE: Pasa de columna en móviles a fila en pantallas grandes */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <Typography variant="h4" color="blue-gray" className="font-bold">
                                Empresas Registradas
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal mt-1">
                                Administra las purificadoras y clientes del sistema.
                            </Typography>
                        </div>

                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            color="indigo"
                            size="md"
                            className="flex items-center gap-2 shadow-indigo-100 hover:shadow-indigo-200 transition-all w-full sm:w-auto justify-center"
                        >
                            <PlusIcon className="h-5 w-5 stroke-2" />
                            Nueva Empresa
                        </Button>
                    </div>

                    <Create open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
                    <Edit open={isEditOpen} onClose={() => setIsEditOpen(false)} company={selectedCompany} />

                    {/* TABLA DENTRO DE CARD */}
                    <Card className="h-full w-full shadow-md border border-blue-gray-50 bg-white overflow-hidden">

                        {/* 🛑 EL SECRETO DEL RESPONSIVE ESTÁ AQUÍ: overflow-x-auto */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                                <Typography variant="small" color="blue-gray" className="font-bold leading-none opacity-70 whitespace-nowrap">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.data.map((company, index) => {
                                        const { id, name, ruc_number, email, plan, subscription_ends_at, is_active, phone, users } = company;
                                        const isLast = index === companies.data.length - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                                        const roleName = users?.length > 0 ? users[0].role : 'Sin rol';

                                        return (
                                            <tr key={id} className="hover:bg-blue-gray-50/50 transition-colors">
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {id || "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                                        {name || "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {ruc_number || "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {email || "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                                                        {phone || "-"}
                                                    </Typography>
                                                </td>

                                                {/* CHIPS DE PLAN */}
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            size="sm"
                                                            variant="ghost"
                                                            value={plan || "Sin plan"}
                                                            color={
                                                                plan === "basico" ? "cyan" :
                                                                    plan === "premium" ? "purple" :
                                                                        plan === "empresarial" ? "indigo" :
                                                                            "gray"
                                                            }
                                                            className="capitalize font-semibold"
                                                        />
                                                    </div>
                                                </td>

                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal whitespace-nowrap">
                                                        {subscription_ends_at ? new Date(subscription_ends_at).toLocaleDateString() : "N/A"}
                                                    </Typography>
                                                </td>
                                                {/* COLUMNA DE FECHA DE EXPIRACIÓN CON UX */}
                                                <td className={classes}>
                                                    {renderExpirationUX(subscription_ends_at) || "Falta"}
                                                </td>
                                                {/* CHIPS DE ESTADO */}
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            size="sm"
                                                            variant="gradient"
                                                            value={is_active ? "Activo" : "Inactivo"}
                                                            color={is_active ? "green" : "red"}
                                                            className="font-semibold"
                                                        />
                                                        <button
                                                            onClick={() => toggle(company.id)}
                                                            className="text-sm text-blue-600 hover:underline"
                                                        >
                                                            {company.is_active ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal capitalize whitespace-nowrap">
                                                        {roleName || "-"}
                                                    </Typography>
                                                </td>

                                                {/* ACCIONES */}
                                                <td className={classes}>
                                                    <Tooltip content="Editar Empresa">
                                                        <IconButton
                                                            variant="text"
                                                            color="indigo"
                                                            onClick={() => handleEditClick(company)}
                                                            className="hover:bg-indigo-50"
                                                        >
                                                            <PencilIcon className="h-4 w-4 text-indigo-600" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {companies.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No hay empresas registradas todavía.
                            </div>
                        )}

                        {/* 🌟 BARRA DE PAGINACIÓN */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4">
                            <Typography variant="small" color="gray" className="font-normal text-center sm:text-left">
                                Página <strong className="text-blue-gray-900">{companies.current_page}</strong> de{" "}
                                <strong className="text-blue-gray-900">{companies.last_page}</strong>
                            </Typography>

                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(companies.prev_page_url)}
                                    disabled={!companies.prev_page_url}
                                >
                                    <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" /> <span className="hidden sm:inline">Anterior</span>
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(companies.next_page_url)}
                                    disabled={!companies.next_page_url}
                                >
                                    <span className="hidden sm:inline">Siguiente</span> <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}