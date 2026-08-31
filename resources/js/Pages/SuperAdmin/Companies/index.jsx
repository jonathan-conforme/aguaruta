import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, Typography, Button, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import Create from './Create';
import Edit from './Edit';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import { PencilIcon, PlusIcon, ArrowRightIcon, ArrowLeftIcon, ClockIcon, ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Index({ auth, companies, availablePlans = [] }) {

    const toggle = (id) => {
        router.patch(route('companies.toggle', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const TABLE_HEAD = ["Id", "Empresa", "RUC", "Email", "Telefono", "Plan", "Fecha de expiración", "Estado", "Role", "Acciones"];

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleEditClick = (company) => {
        setSelectedCompany(company);
        setIsEditOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCompanyToDelete(null);
    };

    const handleDeleteClick = (company) => {
        setCompanyToDelete(company);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!companyToDelete) return;
        setProcessing(true);

        router.delete(route('companies.destroy', companyToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
                router.reload();
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveScroll: true });
        }
    };

    const renderExpirationUX = (dateString) => {
        if (!dateString) {
            return <span className="text-gray-400 text-xs font-semibold italic">Ilimitado</span>;
        }

        const expDate = new Date(dateString);
        const today = new Date();
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        const formattedDate = expDate.toLocaleDateString('es-EC');

        if (diffDays < 0) {
            return (
                <div className="flex items-center gap-1 text-red-600 font-bold text-xs">
                    <ExclamationTriangleIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
            );
        }

        if (diffDays <= 15) {
            return (
                <div className="flex items-center gap-1 text-orange-600 font-bold text-xs">
                    <ClockIcon className="h-3.5 w-3.5 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
            );
        }

        return <span className="text-gray-800 font-bold text-xs">{formattedDate}</span>;
    };

    const getPlanColor = (plan) => {
        switch (plan) {
            case "basico": return "pink";
            case "premium": return "cyan";
            case "vip": return "purple";
            case "empresarial": return "indigo";
            default: return "gray";
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Empresas</h2>}
        >
            <Head title="Empresas" />

            <div className="py-6 sm:py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ENCABEZADO RESPONSIVE */}
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

                    {/* MODALES EXTERNOS */}
                    <Create open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

                    <Edit
                        open={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        company={selectedCompany}
                        availablePlans={availablePlans}
                    />

                    {/* CONTENEDOR DE TARJETAS (MÓVIL) Y TABLA (ESCRITORIO) */}
                    <Card className="h-full w-full shadow-md border border-blue-gray-50 bg-white overflow-hidden p-3 sm:p-4">

                        {/* 📱 VISTA MÓVIL ESTILO TARJETAS (IGUAL A LA IMAGEN) */}
                        <div className="block md:hidden space-y-3">
                            {companies.data.map((company) => {
                                const { id, name, ruc_number, email, plan, subscription_ends_at, is_active, phone, users } = company;
                                const roleName = users?.length > 0 ? users[0].role : 'Sin rol';

                                return (
                                    <div
                                        key={id}
                                        className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 shadow-sm space-y-3"
                                    >
                                        {/* SECCIÓN SUPERIOR: NOMBRE Y BOTÓN PRINCIPAL */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-0.5">
                                                <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">
                                                    Empresa
                                                </span>
                                                <Typography variant="h6" color="blue-gray" className="font-bold leading-tight">
                                                    {name || "-"}
                                                </Typography>
                                            </div>

                                            {/* PLAN DESTACADO (ESTILO BOTÓN VIOLETA DE LA IMAGEN) */}
                                            <div className="w-max">
                                                <Chip
                                                    size="sm"
                                                    variant="gradient"
                                                    value={plan === 'basico' ? 'Básico' : plan || "Sin plan"}
                                                    color={getPlanColor(plan)}
                                                    className="capitalize font-semibold shadow-sm text-[11px]"
                                                />
                                            </div>
                                        </div>

                                        {/* GRID DE 4 COLUMNAS (INFORMACIÓN COMPACTA) */}
                                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200/60 text-left">
                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-medium">ID / RUC</span>
                                                <span className="text-xs font-bold text-gray-800 truncate block">#{id}</span>
                                                <span className="text-[11px] text-gray-600 block truncate">{ruc_number || "-"}</span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-medium">Contacto</span>
                                                <span className="text-xs font-bold text-gray-800 truncate block">{phone || "-"}</span>
                                                <span className="text-[10px] text-gray-500 truncate block">{email || "-"}</span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-medium">Estado</span>
                                                <button
                                                    onClick={() => toggle(company.id)}
                                                    className="inline-block"
                                                >
                                                    <span className={`text-xs font-bold ${is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                        {is_active ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </button>
                                                <span className="text-[10px] text-gray-500 capitalize block truncate">{roleName}</span>
                                            </div>

                                            <div>
                                                <span className="text-[10px] text-gray-400 block font-medium">Expiración</span>
                                                <div className="mt-0.5">
                                                    {renderExpirationUX(subscription_ends_at)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ACCIONES INFERIORES */}
                                        <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-200/60">
                                            <IconButton
                                                variant="text"
                                                color="indigo"
                                                size="sm"
                                                onClick={() => handleEditClick(company)}
                                                className="hover:bg-indigo-50 rounded-lg"
                                            >
                                                <PencilIcon className="h-4 w-4 text-indigo-600" />
                                            </IconButton>

                                            <IconButton
                                                variant="text"
                                                color="red"
                                                size="sm"
                                                onClick={() => handleDeleteClick(company)}
                                                className="hover:bg-red-50 rounded-lg"
                                            >
                                                <TrashIcon className="h-4 w-4 text-red-600" />
                                            </IconButton>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 💻 VISTA ESCRITORIO (TABLA TRADICIONAL) */}
                        <div className="hidden md:block overflow-x-auto">
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
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            size="md"
                                                            variant="gradient"
                                                            value={plan === 'basico' ? 'Básico' : plan || "Sin plan"}
                                                            color={getPlanColor(plan)}
                                                            className="capitalize font-semibold"
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    {renderExpirationUX(subscription_ends_at)}
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex flex-col items-start gap-1">
                                                        <Chip
                                                            size="sm"
                                                            variant="gradient"
                                                            value={is_active ? "Activo" : "Inactivo"}
                                                            color={is_active ? "green" : "red"}
                                                            className="font-semibold"
                                                        />
                                                        <button
                                                            onClick={() => toggle(company.id)}
                                                            className="text-xs text-blue-600 hover:underline font-medium"
                                                        >
                                                            {is_active ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal capitalize whitespace-nowrap">
                                                        {roleName || "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-1">
                                                        <Tooltip content="Editar Empresa y Plan">
                                                            <IconButton
                                                                variant="text"
                                                                color="indigo"
                                                                onClick={() => handleEditClick(company)}
                                                                className="hover:bg-indigo-50"
                                                            >
                                                                <PencilIcon className="h-4 w-4 text-indigo-600" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip content="Eliminar Empresa">
                                                            <IconButton
                                                                variant="text"
                                                                color="red"
                                                                onClick={() => handleDeleteClick(company)}
                                                                className="hover:bg-red-50"
                                                            >
                                                                <TrashIcon className="h-4 w-4 text-red-600" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* ESTADO VACÍO */}
                        {companies.data.length === 0 && (
                            <div className="p-6 text-center text-gray-500">
                                No hay empresas registradas todavía.
                            </div>
                        )}

                        {/* MODAL DE CONFIRMACIÓN */}
                        <DeleteConfirmModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            onConfirm={confirmDelete}
                            itemName={`la empresa ${companyToDelete?.name}`}
                            processing={processing}
                        />

                        {/* BARRA DE PAGINACIÓN */}
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-blue-gray-50 p-4 gap-4 mt-2">
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
                                    <ArrowLeftIcon strokeWidth={2} className="h-3 w-3" /> <span>Anterior</span>
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handlePageChange(companies.next_page_url)}
                                    disabled={!companies.next_page_url}
                                >
                                    <span>Siguiente</span> <ArrowRightIcon strokeWidth={2} className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
