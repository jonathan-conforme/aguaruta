import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button,
    Chip,
} from "@material-tailwind/react";
import {
    MagnifyingGlassIcon,
    QuestionMarkCircleIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    BuildingOfficeIcon,
    TruckIcon,
    CubeIcon,
    BanknotesIcon,
    DocumentTextIcon,
    LockClosedIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

// CONTENIDO DOCUMENTADO SEGÚN ROLES Y MÓDULOS DEL LAYOUT
const HELP_SECTIONS = [
    {
        id: "admin-modulos",
        title: "Guía de Administración y Configuración",
        role: "admin",
        icon: BuildingOfficeIcon,
        colorBg: "bg-purple-50",
        colorText: "text-purple-600",
        items: [
            {
                q: "¿Cómo gestionar la estructura de la empresa y empleados?",
                a: "Desde el módulo 'Administración' puedes registrar categorías de empleados y dar de alta a tus repartidores y administradores. Asigna los roles adecuados para controlar el acceso a la plataforma."
            },
            {
                q: "¿Cómo crear clientes, categorías y proveedores?",
                a: "Dirígete a 'Directorio'. Allí puedes registrar clientes asignándolos a categorías específicas (ej. residenciales, comerciales) y guardar el registro de proveedores para gestionar tus compras."
            },
            {
                q: "¿Cómo emitir comprobantes y sincronizar con el SRI?",
                a: "Esta funcionalidad está planificada para el MVP 2 de la plataforma (próxima actualización). Por ahora, el sistema te permite llevar la gestión operativa completa de tus ventas, cobros y cierres de caja en tiempo real."
            }
        ]
    },
    {
        id: "admin-inventario",
        title: "Gestión de Inventario y Compras",
        role: "admin",
        icon: CubeIcon,
        colorBg: "bg-indigo-50",
        colorText: "text-indigo-600",
        items: [
            {
                q: "¿Cómo administrar productos y stock?",
                a: "En 'Inventario > Productos' añade o edita los artículos de tu catálogo. Utiliza 'Movimientos' para ajustar el stock manualmente (entradas/salidas) o registra 'Compras' a proveedores para sumar stock automáticamente."
            }
        ]
    },
    {
        id: "logistica",
        title: "Operación de Logística y Rutas",
        role: "both", // Disponible para admin y empleado
        icon: TruckIcon,
        colorBg: "bg-teal-50",
        colorText: "text-teal-600",
        items: [
            {
                q: "¿Cómo crear viajes y asignar rutas a los repartidores? (Admin)",
                a: "Como administrador, ve a 'Logística y Operación > Crear Viajes'. Selecciona la ruta predefinida, asigna la unidad/repartidor y especifica la carga inicial de productos para el recorrido."
            },
            {
                q: "¿Cómo iniciar y ver mis rutas asignadas? (Repartidor)",
                a: "Como repartidor, entra a 'Mis Rutas'. Verás el listado de viajes programados para tu día con la información detallada de los clientes a visitar."
            },
            {
                q: "¿Cómo registrar gastos de viaje durante la ruta? (Repartidor)",
                a: "Ve a 'Gastos de Viaje', selecciona la categoría del gasto (combustible, peajes, emergencias), ingresa el valor y sube el detalle para adjuntarlo al resumen de tu turno."
            }
        ]
    },
    {
        id: "finanzas",
        title: "Finanzas, Cobranzas y Cierre de Caja",
        role: "both",
        icon: BanknotesIcon,
        colorBg: "bg-green-50",
        colorText: "text-green-600",
        items: [
            {
                q: "¿Cómo realizar el cierre de caja al finalizar el día? (Repartidor)",
                a: "Al terminar tus entregas, dirígete a 'Cierre de Caja'. Declara el dinero cobrado en efectivo/transferencia, valida tus gastos reportados y confirma el stock restante para finalizar tu jornada."
            },
            {
                q: "¿Cómo consultar el historial de ventas y cobros adeudados?",
                a: "Usa el módulo 'Finanzas y Reportes'. Los administradores pueden auditar los cierres de caja y cuentas por cobrar globales, mientras que los repartidores pueden revisar sus cobros pendientes y registros individuales."
            }
        ]
    }
];

export default function IndexHelp() {
    const { auth } = usePage().props;
    const userRole = auth.user?.role || "empleado";

    const [searchTerm, setSearchTerm] = useState("");
    const [openAccordion, setOpenAccordion] = useState(null);

    const handleOpenAccordion = (value) => {
        setOpenAccordion(openAccordion === value ? null : value);
    };

    // Filtrar secciones según el rol del usuario logueado
    const filteredSections = HELP_SECTIONS.filter(
        (section) => section.role === "both" || section.role === userRole
    ).map((section) => {
        // Filtrar preguntas por el término de búsqueda
        const filteredItems = section.items.filter(
            (item) =>
                item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.a.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return { ...section, items: filteredItems };
    }).filter((section) => section.items.length > 0);

    const whatsappNumber = "593980659712";
    const supportMessage = encodeURIComponent(
        `Hola, necesito ayuda con AquaRutaTech. Mi usuario es: ${auth.user?.email}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${supportMessage}`;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-800">
                        Centro de Ayuda y Manual
                    </span>
                </div>
            }
        >
            <Head title="Centro de Ayuda" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* HERO BANNER DE BÚSQUEDA */}
                <Card className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-xl">
                    <CardBody className="p-6 sm:p-10 text-center space-y-4">
                        <Chip
                            value={`Vista: ${userRole === "admin" ? "Administrador" : "Repartidor"}`}
                            className="bg-white/20 text-white font-bold w-fit mx-auto capitalize backdrop-blur-sm"
                        />
                        <Typography variant="h3" className="font-bold tracking-tight text-2xl sm:text-4xl">
                            ¿En qué podemos ayudarte hoy?
                        </Typography>
                        <Typography className="text-indigo-100 text-sm sm:text-base max-w-2xl mx-auto font-normal">
                            Consulta la guía rápida del sistema AquaRutaTech para resolver dudas sobre tus rutas, ventas, inventario y cierres de caja.
                        </Typography>

                        {/* BARRA DE BÚSQUEDA */}
                        <div className="max-w-xl mx-auto pt-2">
                            <div className="relative flex items-center">
                                <Input
                                    type="text"
                                    placeholder="Buscar tema (ej. cierre de caja, rutas, ventas)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="!border-none bg-white text-gray-900 shadow-lg placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-300 rounded-xl pr-10"
                                    labelProps={{ className: "hidden" }}
                                    containerProps={{ className: "min-w-[100px]" }}
                                />
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* LISTADO DE SECCIONES CON ACCORDIONS */}
                <div className="space-y-4">
                    {filteredSections.length > 0 ? (
                        filteredSections.map((section) => {
                            const IconComponent = section.icon;

                            return (
                                <Card key={section.id} className="shadow-sm border border-gray-100 overflow-hidden">
                                    <CardBody className="p-4 sm:p-6">
                                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                                            <div className={`p-2.5 rounded-xl ${section.colorBg} ${section.colorText}`}>
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Typography variant="h6" className="font-bold text-gray-800">
                                                    {section.title}
                                                </Typography>
                                                <Typography className="text-xs text-gray-500">
                                                    {section.items.length} {section.items.length === 1 ? 'guía disponible' : 'guías disponibles'}
                                                </Typography>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {section.items.map((item, idx) => {
                                                const accordionId = `${section.id}-${idx}`;
                                                const isOpen = openAccordion === accordionId;

                                                return (
                                                    <Accordion
                                                        key={idx}
                                                        open={isOpen}
                                                        icon={
                                                            <ChevronDownIcon
                                                                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""
                                                                    }`}
                                                            />
                                                        }
                                                        className="border border-gray-100 rounded-lg px-3 py-1"
                                                    >
                                                        <AccordionHeader
                                                            onClick={() => handleOpenAccordion(accordionId)}
                                                            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 border-b-0 py-3"
                                                        >
                                                            {item.q}
                                                        </AccordionHeader>
                                                        <AccordionBody className="text-sm text-gray-600 pt-0 pb-3 leading-relaxed">
                                                            {item.a}
                                                        </AccordionBody>
                                                    </Accordion>
                                                );
                                            })}
                                        </div>
                                    </CardBody>
                                </Card>
                            );
                        })
                    ) : (
                        <Card className="p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                            <Typography className="font-medium">
                                No se encontraron guías o respuestas para "{searchTerm}".
                            </Typography>
                        </Card>
                    )}
                </div>

                {/* TARJETA DE SOPORTE DIRECTO POR WHATSAPP/TELEGRAM */}
                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardBody className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 hidden sm:block">
                                <ChatBubbleLeftRightIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <Typography variant="h6" className="font-bold text-gray-800">
                                    ¿Aún necesitas ayuda con un problema técnico?
                                </Typography>
                                <Typography className="text-xs text-gray-500 mt-0.5">
                                    Nuestro equipo de soporte está disponible para atender dudas operativas o reportes de fallos.
                                </Typography>
                            </div>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto shrink-0"
                        >
                            <Button
                                color="green"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl py-3 px-6 shadow-md normal-case text-sm font-bold"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                                Contactar Soporte
                            </Button>
                        </a>
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
