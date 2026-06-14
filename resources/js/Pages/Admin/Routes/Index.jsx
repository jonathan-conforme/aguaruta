import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Card,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton
} from "@material-tailwind/react";
import {
    MapIcon,
    MapPinIcon,
    PlusIcon,
    PencilIcon
} from "@heroicons/react/24/outline";

export default function Index({ auth, routes, provinces }) {
    // Estados para los selects dependientes
    const [selectedProvinceId, setSelectedProvinceId] = useState('');
    const [availableCantons, setAvailableCantons] = useState([]);
    const [availableSectors, setAvailableSectors] = useState([]);

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);

    const { data, setData, post, put, processing, reset, clearErrors, errors } = useForm({
        route_name: '',
        canton_id: '',
        sector_id: ''
    });

    const handleOpenModal = () => setIsModalOpen(!isModalOpen);

    // Abrir modal para CREAR
    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditingRoute(null);
        setSelectedProvinceId('');
        setAvailableCantons([]);
        setAvailableSectors([]);
        handleOpenModal();
    };

    // Abrir modal para EDITAR
    const openEditModal = (routeItem) => {
        reset();
        clearErrors();
        setEditingRoute(routeItem);

        // Pre-cargar cascada de selects para la edición
        const provId = routeItem.canton?.province?.id;
        setSelectedProvinceId(String(provId || ''));

        const province = provinces.find(p => String(p.id) === String(provId));
        const cantons = province ? province.cantons : [];
        setAvailableCantons(cantons);

        const cantId = routeItem.canton_id;
        const canton = cantons.find(c => String(c.id) === String(cantId));
        setAvailableSectors(canton?.sectors || []);

        setData({
            route_name: routeItem.route_name || '',
            canton_id: String(routeItem.canton_id || ''),
            sector_id: String(routeItem.sector_id || '')
        });

        handleOpenModal();
    };

    // Manejo de cambios en selects
    const handleProvinceChange = (val) => {
        setSelectedProvinceId(val);
        setData('canton_id', '');
        setData('sector_id', '');

        const province = provinces.find(p => String(p.id) === String(val));
        setAvailableCantons(province ? province.cantons : []);
        setAvailableSectors([]);
    };

    const handleCantonChange = (val) => {
        setData('canton_id', val);
        setData('sector_id', '');

        const canton = availableCantons.find(c => String(c.id) === String(val));
        setAvailableSectors(canton?.sectors || []);
    };

    // Enviar el formulario (Crear o Actualizar)
    const submit = (e) => {
        e.preventDefault();

        if (editingRoute) {
            put(route('routes.update', editingRoute.id), {
                onSuccess: () => handleOpenModal(),
            });
        } else {
            post(route('routes.store'), {
                onSuccess: () => handleOpenModal(),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Typography variant="h5" className="flex items-center gap-2">
                        <MapIcon className="h-6 w-6 text-indigo-500" />
                        Gestión de Rutas
                    </Typography>

                </div>
            }
        >
            <Head title="Rutas" />

            <div className="p-6 space-y-6">
                {/* TABLA */}

                <Card className="p-6 shadow-sm border border-gray-200">
                    
                <div className="rounded-none p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <Typography variant="h5" color="blue-white">Historial de Rutas</Typography>
                    </div>
                    <Button
                        color="indigo"
                        className="flex items-rigth gap-2"
                        onClick={openCreateModal}
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nueva Ruta
                    </Button>
                </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-3 text-sm">Ruta</th>
                                    <th className="p-3 text-sm">Provincia</th>
                                    <th className="p-3 text-sm">Cantón</th>
                                    <th className="p-3 text-sm">Sector</th>
                                    <th className="p-3 text-sm text-center">Estado</th>
                                    <th className="p-3 text-sm text-center">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {routes.map(r => (
                                    <tr key={r.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold">{r.route_name}</td>
                                        <td className="p-3">{r.canton?.province?.name || '—'}</td>
                                        <td className="p-3">{r.canton?.name || '—'}</td>
                                        <td className="p-3">{r.sector?.name || '—'}</td>
                                        <td className="p-3 text-center">
                                            <Chip
                                                size="sm"
                                                value={r.is_active ? 'Activo' : 'Inactivo'}
                                                color={r.is_active ? 'green' : 'red'}
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <IconButton
                                                variant="text"
                                                color="indigo"
                                                onClick={() => openEditModal(r)}
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}

                                {routes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center p-6 text-gray-500">
                                            No hay rutas registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* MODAL FORMULARIO */}
            <Dialog open={isModalOpen} handler={handleOpenModal} size="md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        {editingRoute ? 'Editar Ruta' : 'Crear Nueva Ruta'}
                    </DialogHeader>

                    <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NOMBRE (Ocupa 2 columnas enteras) */}
                        <div className="md:col-span-2">
                            <Input
                                label="Nombre de la Ruta"
                                color="indigo"
                                icon={<MapPinIcon className="h-5 w-5" />}
                                value={data.route_name}
                                onChange={(e) => setData('route_name', e.target.value)}
                                error={!!errors.route_name}
                            />
                            {errors.route_name && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.route_name}
                                </Typography>
                            )}
                        </div>

                        {/* PROVINCIA */}
                        <div>
                            <Select
                                label="Provincia"
                                color="indigo"
                                value={selectedProvinceId || undefined}
                                onChange={handleProvinceChange}
                            >
                                {provinces.map(p => (
                                    <Option key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* CANTÓN */}
                        <div>
                            <Select
                                key={`canton-${selectedProvinceId}`}
                                label="Cantón"
                                color="indigo"
                                value={data.canton_id || undefined}
                                onChange={handleCantonChange}
                                disabled={!selectedProvinceId}
                                error={!!errors.canton_id}
                            >
                                {availableCantons.map(c => (
                                    <Option key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            {errors.canton_id && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.canton_id}
                                </Typography>
                            )}
                        </div>

                        {/* SECTOR (Ocupa 2 columnas enteras) */}
                        <div className="md:col-span-2">
                            <Select
                                key={`sector-${data.canton_id}`}
                                label="Sector (Opcional)"
                                color="indigo"
                                value={data.sector_id || undefined}
                                onChange={(val) => setData('sector_id', val)}
                                disabled={!data.canton_id}
                            >
                                {availableSectors.map(s => (
                                    <Option key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button
                            variant="text"
                            color="gray"
                            onClick={handleOpenModal}
                            className="mr-2"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="indigo"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            {processing ? 'Guardando...' : (editingRoute ? 'Actualizar' : 'Guardar')}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

        </AuthenticatedLayout>
    );
}