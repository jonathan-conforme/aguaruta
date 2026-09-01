import React, { useState } from 'react';
import { useForm, Head, router } from '@inertiajs/react';
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
    IconButton,
    Switch
} from "@material-tailwind/react";
import {
    MapIcon,
    MapPinIcon,
    PlusIcon,
    PencilIcon,
    XMarkIcon
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
        clearErrors();
        setEditingRoute(routeItem);

        const provId = routeItem.canton?.province?.id || routeItem.canton?.province_id;
        const provIdStr = provId ? String(provId) : '';
        setSelectedProvinceId(provIdStr);

        const province = provinces.find(p => String(p.id) === provIdStr);
        const cantons = province ? province.cantons : [];
        setAvailableCantons(cantons);

        const cantIdStr = routeItem.canton_id ? String(routeItem.canton_id) : '';
        const canton = cantons.find(c => String(c.id) === cantIdStr);
        setAvailableSectors(canton?.sectors || []);

        setData({
            route_name: routeItem.route_name || '',
            canton_id: cantIdStr,
            sector_id: routeItem.sector_id ? String(routeItem.sector_id) : ''
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

    // Cambiar estado vía toggle() del backend
    const handleToggleStatus = (e, routeItem) => {
        e.stopPropagation();

        router.patch(route('delivery-routes.toggle', routeItem.id), {}, {
            preserveScroll: true,
            preserveState: false
        });
    };

    // Enviar el formulario (Crear o Actualizar)
    const submit = (e) => {
        e.preventDefault();

        if (editingRoute) {
            put(route('delivery-routes.update', editingRoute.id), {
                preserveScroll: true,
                onSuccess: () => {
                    handleOpenModal();
                    reset();
                },
            });
        } else {
            post(route('delivery-routes.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    handleOpenModal();
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <Typography variant="h5" color="blue-gray" className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                        <MapIcon className="h-6 w-6 text-indigo-500" />
                        Gestión de Rutas
                    </Typography>
                </div>
            }
        >
            <Head title="Rutas" />

            <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                <Card className="shadow-sm border border-gray-200 overflow-hidden">
                    {/* CARD HEADER RESPONSIVE */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="text-lg sm:text-xl font-bold">
                                Historial de Rutas
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal">
                                Administra las rutas de entrega registradas.
                            </Typography>
                        </div>
                        <Button
                            color="indigo"
                            size="md"
                            className="flex items-center justify-center gap-2 w-full sm:w-auto shadow-indigo-100 hover:shadow-indigo-200 transition-all"
                            onClick={openCreateModal}
                        >
                            <PlusIcon className="h-5 w-5 stroke-2" />
                            <span>Nueva Ruta</span>
                        </Button>
                    </div>

                    {/* VISTA MÓVIL: CARDS */}
                    <div className="block md:hidden divide-y divide-gray-200">
                        {routes.map((r) => (
                            <div
                                key={r.id}
                                className={`p-4 space-y-3 bg-white transition-colors ${!r.is_active ? 'bg-gray-50/50 opacity-75' : 'hover:bg-gray-50/50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className={`h-5 w-5 ${r.is_active ? 'text-indigo-500' : 'text-gray-400'}`} />
                                        <Typography variant="h6" color={r.is_active ? "blue-gray" : "gray"} className="font-semibold text-base">
                                            {r.route_name}
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id={`toggle-mobile-${r.id}`}
                                            color="indigo"
                                            checked={Boolean(r.is_active)}
                                            onChange={(e) => handleToggleStatus(e, r)}
                                            ripple={false}
                                            containerProps={{ className: "p-0" }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <span className="font-semibold text-gray-400 block uppercase text-[10px]">Provincia</span>
                                        <span className="text-gray-800 font-medium">{r.canton?.province?.name || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-400 block uppercase text-[10px]">Cantón</span>
                                        <span className="text-gray-800 font-medium">{r.canton?.name || '—'}</span>
                                    </div>
                                    <div className="col-span-2 pt-1 border-t border-gray-200/60 flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold text-gray-400 block uppercase text-[10px]">Sector</span>
                                            <span className="text-gray-800 font-medium">{r.sector?.name || '—'}</span>
                                        </div>
                                        <Chip
                                            size="sm"
                                            variant="ghost"
                                            value={r.is_active ? 'Activo' : 'Inactivo'}
                                            color={r.is_active ? 'green' : 'red'}
                                            className="rounded-full capitalize font-medium text-[10px] px-2 py-0.5"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                  {/*  <Button
                                        size="sm"
                                        variant="text"
                                        color="indigo"
                                        className="flex items-center gap-1.5 px-3 py-1.5"
                                        onClick={() => openEditModal(r)}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        <span>Editar</span>
                                    </Button>*/}
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* VISTA DESKTOP: TABLA */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Ruta</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Provincia</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Cantón</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Sector</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Estado</th>
                                    {/*<th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Acciones</th>*/}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {routes.map(r => (
                                    <tr
                                        key={r.id}
                                        className={`transition-colors ${!r.is_active ? 'bg-gray-50/40 text-gray-400' : 'hover:bg-gray-50/60 text-gray-900'}`}
                                    >
                                        <td className="p-4 font-semibold">{r.route_name}</td>
                                        <td className="p-4">{r.canton?.province?.name || '—'}</td>
                                        <td className="p-4">{r.canton?.name || '—'}</td>
                                        <td className="p-4">{r.sector?.name || '—'}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-6">
                                                <Switch
                                                    id={`toggle-desktop-${r.id}`}
                                                    color="indigo"
                                                    checked={Boolean(r.is_active)}
                                                    onChange={(e) => handleToggleStatus(e, r)}
                                                    ripple={false}
                                                />
                                                <Chip
                                                    size="sm"
                                                    variant="ghost"
                                                    value={r.is_active ? 'Activo' : 'Inactivo'}
                                                    color={r.is_active ? 'green' : 'red'}
                                                    className="rounded-full inline-block font-medium min-w-[70px] text-center"
                                                />
                                            </div>
                                        </td>
                                          {/*<td className="p-4 text-center">
                                            <IconButton
                                                variant="text"
                                                color="indigo"
                                                className="rounded-full"
                                                onClick={() => openEditModal(r)}
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </IconButton>
                                        </td>*/}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* EMPTY STATE */}
                    {routes.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                            <div className="bg-indigo-50 p-3 rounded-full text-indigo-500">
                                <MapIcon className="h-8 w-8" />
                            </div>
                            <Typography variant="h6" color="blue-gray" className="font-medium">
                                No hay rutas registradas
                            </Typography>
                            <Typography variant="small" color="gray">
                                Comienza agregando una nueva ruta para visualizarla en este panel.
                            </Typography>
                        </div>
                    )}
                </Card>
            </div>

            {/* MODAL FORMULARIO */}
            <Dialog
                open={isModalOpen}
                handler={handleOpenModal}
                size="xs"
                className="p-2 sm:p-0"
            >
                <form onSubmit={submit}>
                    <DialogHeader className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <Typography variant="h5" color="blue-gray" className="text-lg font-bold">
                            {editingRoute ? 'Editar Ruta' : 'Crear Nueva Ruta'}
                        </Typography>
                        <IconButton
                            color="blue-gray"
                            size="sm"
                            variant="text"
                            onClick={handleOpenModal}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </IconButton>
                    </DialogHeader>

                    <DialogBody className="space-y-4 pt-4 pb-2">
                        {/* NOMBRE */}
                        <div className="w-full">
                            <Input
                                label="Nombre de la Ruta"
                                color="indigo"
                                icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                                value={data.route_name}
                                onChange={(e) => setData('route_name', e.target.value)}
                                error={!!errors.route_name}
                                containerProps={{ className: "min-w-[0]" }}
                            />
                            {errors.route_name && (
                                <Typography variant="small" color="red" className="mt-1 text-xs font-medium flex items-center gap-1">
                                    {errors.route_name}
                                </Typography>
                            )}
                        </div>

                        {/* PROVINCIA */}
                        <div className="w-full">
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
                        <div className="w-full">
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
                                <Typography variant="small" color="red" className="mt-1 text-xs font-medium flex items-center gap-1">
                                    {errors.canton_id}
                                </Typography>
                            )}
                        </div>

                        {/* SECTOR */}
                        <div className="w-full">
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

                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-gray-100">
                        <Button
                            variant="outlined"
                            color="gray"
                            onClick={handleOpenModal}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="indigo"
                            disabled={processing}
                            className="w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            {processing ? 'Guardando...' : (editingRoute ? 'Actualizar' : 'Guardar')}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
