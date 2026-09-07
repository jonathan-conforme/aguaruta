import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Card, Typography, Button, Chip,
    Alert, IconButton, Tooltip, Dialog, DialogHeader, DialogBody, DialogFooter
} from "@material-tailwind/react";
import {
    TruckIcon, DocumentTextIcon, KeyIcon, ArrowPathIcon,
    WrenchScrewdriverIcon, DocumentArrowDownIcon, EyeIcon,
    CheckCircleIcon, XCircleIcon, ClockIcon,
    BuildingOfficeIcon, PhotoIcon, PlusIcon,
    DocumentMinusIcon, DocumentPlusIcon, ShieldCheckIcon,
    ShoppingBagIcon, SparklesIcon, EnvelopeIcon, PaperClipIcon,
    CheckBadgeIcon, PhoneIcon, EnvelopeIcon as MailIcon, MapPinIcon
} from "@heroicons/react/24/outline";

const MOCK_GUIAS = [
    {
        id: 1,
        secuencial: "001-001-000000104",
        trip_code: "VIAJE-2026-089",
        fecha_emision: "2026-09-06",
        fecha_inicio_traslado: "2026-09-06",
        fecha_fin_traslado: "2026-09-06",
        placa: "ABC-1234",
        chofer: "Carlos Mendoza",
        ruc_chofer: "0928374651001",
        motivo: "Venta de Agua Purificada / Distribución",
        ruta: "Ruta Norte - Sector El Batán",
        estado_sri: "AUTORIZADO",
        clave_acceso: "0609202606092837465100120010010000001041234567812",
        items_count: 45,
        monto_estimado: "$ 380.00"
    },
    {
        id: 2,
        secuencial: "001-001-000000105",
        trip_code: "VIAJE-2026-090",
        fecha_emision: "2026-09-06",
        fecha_inicio_traslado: "2026-09-06",
        fecha_fin_traslado: "2026-09-07",
        placa: "PBA-9876",
        chofer: "Luis Paredes",
        ruc_chofer: "1719283745001",
        motivo: "Venta de Agua Purificada / Distribución",
        ruta: "Ruta Sur - Quitumbe",
        estado_sri: "PENDIENTE",
        clave_acceso: "0609202606171928374500120010010000001051234567819",
        items_count: 60,
        monto_estimado: "$ 520.00"
    }
];

export default function SriIndex({ auth, company: companyProp, guias: guiasProp }) {
    const [activeTab, setActiveTab] = useState("company");
    const [selectedGuia, setSelectedGuia] = useState(null);
    const [openModalPreview, setOpenModalPreview] = useState(false);
    const [openDevModal, setOpenDevModal] = useState(false);
    const [devModuleName, setDevModuleName] = useState('');

    const company = companyProp || auth?.user?.company || {
        name: "AquaRutaTech Cía. Ltda.",
        ruc_number: "1792384756001",
        email: "admin@aquaruta.com",
        phone: "022548963",
        whatsapp_number: "0998765432",
        address: "Av. Amazonas N34-12 y República, Quito",
        plan: "empresarial",
        subscription_ends_at: "2026-12-31",
        logo: null
    };

    const guias = (guiasProp && guiasProp.length > 0) ? guiasProp : MOCK_GUIAS;

    const triggerDevModal = (moduleName) => {
        setDevModuleName(moduleName);
        setOpenDevModal(true);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (["facturas", "notas_credito", "notas_debito", "retenciones", "liquidaciones"].includes(tabId)) {
            triggerDevModal(modulesList.find(m => m.id === tabId)?.label || 'Módulo Fiscal');
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 'AUTORIZADO':
                return <Chip value="AUTORIZADO" color="green" size="sm" icon={<CheckCircleIcon className="h-3 w-3" />} className="rounded-full font-bold text-[10px]" />;
            case 'PENDIENTE':
                return <Chip value="EN COLA SRI" color="amber" size="sm" icon={<ClockIcon className="h-3 w-3" />} className="rounded-full font-bold text-[10px]" />;
            case 'RECHAZADO':
                return <Chip value="RECHAZADO" color="red" size="sm" icon={<XCircleIcon className="h-3 w-3" />} className="rounded-full font-bold text-[10px]" />;
            default:
                return null;
        }
    };

    const modulesList = [
        { id: "company", label: "Perfil Empresa", icon: BuildingOfficeIcon },
        { id: "facturas", label: "Facturas", icon: DocumentTextIcon },
        { id: "notas_credito", label: "Notas de Crédito", icon: DocumentMinusIcon },
        { id: "notas_debito", label: "Notas de Débito", icon: DocumentPlusIcon },
        { id: "retenciones", label: "Retenciones", icon: ShieldCheckIcon },
        { id: "guias", label: "Guías Remisión", icon: TruckIcon },
        { id: "liquidaciones", label: "Liquidaciones", icon: ShoppingBagIcon },
    ];

    return (
        <AuthenticatedLayout header="SRI — Facturación Electrónica y Comprobantes">
            <Head title="SRI - Facturación Electrónica" />

            <div className="space-y-6 max-w-7xl mx-auto pb-12">

                {/* BANNER PRINCIPAL */}
                <Alert
                    icon={<WrenchScrewdriverIcon className="h-6 w-6 text-indigo-800" />}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-2xl p-4 shadow-sm"
                >
                    <div className="ml-2">
                        <Typography variant="h6" className="font-bold text-indigo-900 text-sm">
                            Módulo Fiscal SRI — Facturación y Documentos Electrónicos
                        </Typography>
                        <Typography variant="small" className="text-indigo-800 text-xs mt-0.5">
                            Consulta la información de tu empresa (MVP1) y gestiona la emisión de comprobantes electrónicos para tus despachos.
                        </Typography>
                    </div>
                </Alert>

                {/* TAB BAR */}
                <div className="overflow-x-auto pb-2">
                    <div className="bg-slate-200/70 p-1.5 rounded-2xl min-w-[760px] flex gap-1">
                        {modulesList.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleTabChange(id)}
                                className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                                    activeTab === id
                                        ? 'bg-white text-indigo-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <Icon className="h-4 w-4" /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PESTAÑA 1: PERFIL DE EMPRESA (DATOS MVP1) */}
                {activeTab === "company" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* TARJETA DATOS PRINCIPALES MVP1 */}
                        <Card className="lg:col-span-2 p-6 border border-slate-200/80 shadow-sm rounded-2xl bg-white space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                        <BuildingOfficeIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <Typography variant="h6" color="blue-gray" className="font-bold text-base">
                                            {company.name}
                                        </Typography>
                                        <Typography variant="small" className="text-slate-500 text-xs flex items-center gap-1">
                                            <CheckBadgeIcon className="h-4 w-4 text-emerald-500" /> Empresa Registrada en Plataforma
                                        </Typography>
                                    </div>
                                </div>
                                <Chip
                                    value={`PLAN ${company.plan?.toUpperCase() || 'BÁSICO'}`}
                                    color="indigo"
                                    className="rounded-full font-bold text-[10px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                                    <Typography variant="small" className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                                        Número de RUC
                                    </Typography>
                                    <Typography variant="small" className="font-bold text-slate-800 text-sm">
                                        {company.ruc_number || 'Sin RUC registrado'}
                                    </Typography>
                                </div>

                                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                                    <Typography variant="small" className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                                        Correo Electrónico Administrador
                                    </Typography>
                                    <Typography variant="small" className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        <MailIcon className="h-4 w-4 text-indigo-500" /> {company.email || 'N/A'}
                                    </Typography>
                                </div>

                                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                                    <Typography variant="small" className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                                        Teléfono / WhatsApp
                                    </Typography>
                                    <Typography variant="small" className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        <PhoneIcon className="h-4 w-4 text-emerald-500" /> {company.phone || company.whatsapp_number || 'N/A'}
                                    </Typography>
                                </div>

                                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
                                   <Typography variant="small" className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                                        Dirección Matriz
                                    </Typography>
                                    <Typography variant="small" className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        <MapPinIcon className="h-4 w-4 text-amber-500" /> {company.address || 'Sin dirección registrada'}
                                    </Typography>
                                </div>
                            </div>
                        </Card>

                        {/* SECCIÓN CONFIGURACIÓN FISCAL DIFERIDA A MVP2 */}
                        <div className="space-y-6">
                            <Card className="p-5 border border-amber-200/80 shadow-sm rounded-2xl bg-amber-50/30 space-y-4">
                                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <KeyIcon className="h-5 w-5 text-amber-700" />
                                        <Typography variant="h6" className="font-bold text-amber-900 text-sm">
                                            Firma Digital y SRI (MVP2)
                                        </Typography>
                                    </div>
                                    <Chip value="FASE 2" color="amber" size="sm" className="rounded-full text-[9px]" />
                                </div>

                                <Typography variant="small" className="text-slate-600 text-xs leading-relaxed">
                                    La carga de certificados digitales (<b>.p12</b>), puntos de emisión y ambiente de producción del SRI estarán habilitados en la siguiente fase de actualización.
                                </Typography>

                                <div
                                    onClick={() => triggerDevModal("Firma Digital y Configuración SRI (.p12)")}
                                    className="border-2 border-dashed border-amber-300 bg-white rounded-xl p-4 text-center cursor-pointer hover:bg-amber-50/50 transition-colors"
                                >
                                    <KeyIcon className="h-7 w-7 text-amber-500 mx-auto mb-1" />
                                    <Typography variant="small" className="font-bold text-amber-900 text-xs">
                                        Configurar Firma Digital (.p12)
                                    </Typography>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">BCE, Security Data, ANF, UANATACA</span>
                                </div>
                            </Card>

                            <Card className="p-5 border border-slate-200/80 shadow-sm rounded-2xl bg-white space-y-3">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <PhotoIcon className="h-5 w-5 text-indigo-600" />
                                    <Typography variant="h6" color="blue-gray" className="font-bold text-sm">
                                        Logo para Comprobantes
                                    </Typography>
                                </div>
                                {company.logo ? (
                                    <div className="p-2 border rounded-xl flex items-center justify-center bg-slate-50">
                                        <img src={company.logo} alt="Logo Empresa" className="max-h-20 object-contain" />
                                    </div>
                                ) : (
                                    <Typography variant="small" className="text-slate-500 text-xs text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        Logo asignado por Super Admin en MVP1
                                    </Typography>
                                )}
                            </Card>
                        </div>
                    </div>
                )}

                {/* PESTAÑA 2: FACTURAS */}
                {activeTab === "facturas" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    Módulo de Emisión y Ventas (Facturas Electrónicas)
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Emisión directa de facturas con autorización en tiempo real con el SRI.
                                </Typography>
                            </div>
                            <Button color="indigo" onClick={() => triggerDevModal("Nueva Factura Electrónica")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Nueva Factura
                            </Button>
                        </div>
                        <div
                            onClick={() => triggerDevModal("Facturación Electrónica (Emisión y Ventas)")}
                            className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
                        >
                            <DocumentTextIcon className="h-10 w-10 text-indigo-400 mx-auto mb-2" />
                            <Typography variant="h6" className="text-slate-700 font-bold text-sm">
                                Módulo de Facturación en Construcción
                            </Typography>
                            <Typography className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                Haz clic aquí para consultar los avances de emisión de facturas electrónicas.
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* PESTAÑA 3: NOTAS DE CRÉDITO */}
                {activeTab === "notas_credito" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    Módulo de Notas de Crédito
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Anulación de comprobantes, devoluciones de envases/producto o descuentos posteriores.
                                </Typography>
                            </div>
                            <Button color="indigo" onClick={() => triggerDevModal("Emitir Nota de Crédito")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Emitir Nota de Crédito
                            </Button>
                        </div>
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <DocumentMinusIcon className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                            <Typography variant="h6" className="text-slate-700 font-bold text-sm">
                                Sin Notas de Crédito Registradas
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* PESTAÑA 4: NOTAS DE DÉBITO */}
                {activeTab === "notas_debito" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    Módulo de Notas de Débito
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Cobro de valores adicionales o intereses de mora sobre facturas emitidas.
                                </Typography>
                            </div>
                            <Button color="indigo" onClick={() => triggerDevModal("Emitir Nota de Débito")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Emitir Nota de Débito
                            </Button>
                        </div>
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <DocumentPlusIcon className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                            <Typography variant="h6" className="text-slate-700 font-bold text-sm">
                                Sin Notas de Débito Emitidas
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* PESTAÑA 5: RETENCIONES */}
                {activeTab === "retenciones" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    Módulo de Comprobantes de Retención
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Gestión y emisión de retenciones en la fuente e IVA a proveedores.
                                </Typography>
                            </div>
                            <Button color="indigo" onClick={() => triggerDevModal("Emitir Comprobante de Retención")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Emitir Retención
                            </Button>
                        </div>
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <ShieldCheckIcon className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                            <Typography variant="h6" className="text-slate-700 font-bold text-sm">
                                Historial de Retenciones Vacío
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* PESTAÑA 6: GUÍAS DE REMISIÓN */}
                {activeTab === "guias" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold text-base">
                                    Guías de Remisión Emitidas
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Documentos de transporte vinculados a tus despachos
                                </Typography>
                            </div>
                            <Button color="indigo" size="sm" onClick={() => triggerDevModal("Nueva Guía de Remisión Manual")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Nueva Guía
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-200/60">
                                        <th className="p-4">Secuencial / Despacho</th>
                                        <th className="p-4">Transportista & Vehículo</th>
                                        <th className="p-4">Ruta / Motivo</th>
                                        <th className="p-4">Fecha Traslado</th>
                                        <th className="p-4 text-center">Estado SRI</th>
                                        <th className="p-4 text-right">Acciones Cortina</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {guias.map((guia) => (
                                        <tr key={guia.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="p-4">
                                                <Typography variant="small" className="font-bold text-slate-800 text-xs">
                                                    {guia.secuencial}
                                                </Typography>
                                                <span className="text-[10px] text-indigo-600 font-mono font-semibold block mt-0.5">
                                                    {guia.trip_code}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-semibold text-slate-800 text-xs">
                                                    {guia.chofer}
                                                </Typography>
                                                <span className="text-[11px] text-slate-500 block">
                                                    Placa: {guia.placa}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-medium text-slate-700 text-xs">
                                                    {guia.ruta}
                                                </Typography>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {guia.fecha_inicio_traslado}
                                            </td>
                                            <td className="p-4 text-center">
                                                {getStatusChip(guia.estado_sri)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip content="Ver Vista Cortina (RIDE)">
                                                        <IconButton variant="text" color="indigo" size="sm" onClick={() => { setSelectedGuia(guia); setOpenModalPreview(true); }}>
                                                            <EyeIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip content="Descargar XML">
                                                        <IconButton variant="text" color="blue-gray" size="sm" onClick={() => triggerDevModal("Descarga de XML Autorizado")}>
                                                            <DocumentArrowDownIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* PESTAÑA 7: LIQUIDACIONES DE COMPRA */}
                {activeTab === "liquidaciones" && (
                    <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    Módulo de Liquidaciones de Compra
                                </Typography>
                                <Typography variant="small" className="text-slate-500 text-xs">
                                    Adquisiciones a personas naturales sin RUC u operaciones especiales.
                                </Typography>
                            </div>
                            <Button color="indigo" onClick={() => triggerDevModal("Emitir Liquidación de Compra")} className="rounded-xl flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" /> Nueva Liquidación
                            </Button>
                        </div>
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <ShoppingBagIcon className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                            <Typography variant="h6" className="text-slate-700 font-bold text-sm">
                                Sin Liquidaciones Emitidas
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* MODAL CORTINA: PREVISUALIZACIÓN RIDE SRI */}
                <Dialog open={openModalPreview} handler={() => setOpenModalPreview(false)} size="lg" className="rounded-2xl p-2">
                    <DialogHeader className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div>
                            <Typography variant="h6" className="font-bold text-slate-800">
                                Previsualización Cortina — Guía de Remisión SRI
                            </Typography>
                            <Typography variant="small" className="text-slate-500 text-xs">
                                Documento impreso RIDE y datos de sincronización
                            </Typography>
                        </div>
                        {selectedGuia && getStatusChip(selectedGuia.estado_sri)}
                    </DialogHeader>

                    {selectedGuia && (
                        <DialogBody className="space-y-4 text-slate-800 max-h-[65vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="space-y-1">
                                    <Typography variant="h6" className="text-indigo-900 font-bold text-sm uppercase">
                                        {company.name}
                                    </Typography>
                                    <Typography className="text-xs text-slate-600">RUC: {company.ruc_number}</Typography>
                                    <Typography className="text-xs text-slate-600">Matriz: {company.address}</Typography>
                                </div>
                                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                                    <Typography className="text-xs font-bold text-slate-900">
                                        GUÍA DE REMISIÓN No. {selectedGuia.secuencial}
                                    </Typography>
                                    <Typography className="text-[10px] text-slate-500 font-mono break-all mt-1">
                                        <strong>CLAVE DE ACCESO:</strong><br />
                                        {selectedGuia.clave_acceso}
                                    </Typography>
                                </div>
                            </div>

                            <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl space-y-3">
                                <Typography variant="small" className="font-bold text-indigo-950 text-xs">
                                    Acciones de Cortina disponibles para este comprobante:
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" color="indigo" onClick={() => triggerDevModal("Descarga de RIDE en PDF")} className="rounded-xl flex items-center gap-1.5 text-[11px]">
                                        <DocumentArrowDownIcon className="h-4 w-4" /> Descargar PDF (RIDE)
                                    </Button>
                                    <Button size="sm" variant="outlined" color="indigo" onClick={() => triggerDevModal("Descarga de XML Autorizado")} className="rounded-xl flex items-center gap-1.5 text-[11px]">
                                        <PaperClipIcon className="h-4 w-4" /> Descargar XML
                                    </Button>
                                    <Button size="sm" variant="outlined" color="blue-gray" onClick={() => triggerDevModal("Envío de RIDE por Correo")} className="rounded-xl flex items-center gap-1.5 text-[11px]">
                                        <EnvelopeIcon className="h-4 w-4" /> Enviar por Email
                                    </Button>
                                    <Button size="sm" variant="outlined" color="amber" onClick={() => triggerDevModal("Re-sincronización con SRI")} className="rounded-xl flex items-center gap-1.5 text-[11px]">
                                        <ArrowPathIcon className="h-4 w-4" /> Forzar Re-envió SRI
                                    </Button>
                                </div>
                            </div>
                        </DialogBody>
                    )}

                    <DialogFooter className="border-t border-slate-100 pt-3">
                        <Button variant="text" color="gray" onClick={() => setOpenModalPreview(false)} className="rounded-xl">
                            Cerrar Cortina
                        </Button>
                    </DialogFooter>
                </Dialog>

                {/* MODAL MÓDULO EN DESARROLLO */}
                <Dialog open={openDevModal} handler={() => setOpenDevModal(false)} size="xs" className="rounded-2xl p-2 z-[9999]">
                    <DialogHeader className="flex flex-col items-center justify-center pt-6 text-center">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2">
                            <SparklesIcon className="h-6 w-6" />
                        </div>
                        <Typography variant="h6" className="font-extrabold text-slate-800">
                            Módulo en Desarrollo
                        </Typography>
                    </DialogHeader>

                    <DialogBody className="text-center px-4 py-2">
                        <Typography className="text-xs text-slate-600 leading-relaxed">
                            La funcionalidad <strong className="text-indigo-900">{devModuleName}</strong> para el sistema de Facturación Electrónica del SRI se encuentra programada para el <strong>MVP2</strong>.
                        </Typography>
                    </DialogBody>

                    <DialogFooter className="justify-center pt-4">
                        <Button color="indigo" onClick={() => setOpenDevModal(false)} className="rounded-xl w-full">
                            Entendido
                        </Button>
                    </DialogFooter>
                </Dialog>

            </div>
        </AuthenticatedLayout>
    );
}
