import React, { useState, useEffect } from "react";
import { Link, usePage, router } from '@inertiajs/react';

import Modal from '@/Components/Modal';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Alert,
    IconButton,
    Button,
} from "@material-tailwind/react";

import {

    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    CreditCardIcon
} from "@heroicons/react/24/solid";

import {
    BellIcon,
    TruckIcon,
    CubeTransparentIcon,
    XMarkIcon,
    BuildingOfficeIcon,
    UsersIcon,
    CubeIcon,
    ChartBarIcon,
    BuildingStorefrontIcon,
    IdentificationIcon,
    UserGroupIcon,
    UserIcon,
    TagIcon,
    BriefcaseIcon,
    ArrowsRightLeftIcon,
    ShoppingCartIcon,
    MapIcon,
    MapPinIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    BanknotesIcon,
    LockClosedIcon,
    SparklesIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";

// ESTRUCTURA DE MENÚ CENTRALIZADA CON PATRONES DE RUTA PRECISOS
const MENU_CATEGORIES = [
    {
        title: "Administración",
        icon: BuildingOfficeIcon,
        roles: ['super_admin', 'admin'],
        items: [
            { label: "Dashboard", routeName: "dashboard", pattern: "dashboard", icon: BuildingStorefrontIcon, roles: ['super_admin', 'admin'], colorBg: "bg-pink-50", colorText: "text-pink-600" },
            { label: "Empresas", routeName: "companies.index", pattern: "companies.*", icon: BuildingOfficeIcon, roles: ['super_admin'], colorBg: "bg-purple-50", colorText: "text-purple-600" },
            { label: "Cat. de Empleado", routeName: "employee-categories.index", pattern: "employee-categories.*", icon: IdentificationIcon, roles: ['super_admin'], colorBg: "bg-indigo-50", colorText: "text-indigo-600" },
            { label: "Empleados", routeName: "employees.index", pattern: "employees.*", icon: UserGroupIcon, roles: ['admin'], colorBg: "bg-blue-50", colorText: "text-blue-600" },
        ]
    },
    {
        title: "Directorio",
        icon: UsersIcon,
        roles: ['admin'],
        items: [
            { label: "Clientes", routeName: "customers.index", pattern: "customers.*", icon: UserIcon, roles: ['admin'], colorBg: "bg-cyan-50", colorText: "text-cyan-600" },
            { label: "Cat. de Clientes", routeName: "customer-categories.index", pattern: "customer-categories.*", icon: TagIcon, roles: ['admin'], colorBg: "bg-lime-50", colorText: "text-lime-600" },
            { label: "Proveedores", routeName: "suppliers.index", pattern: "suppliers.*", icon: BriefcaseIcon, roles: ['admin'], colorBg: "bg-orange-50", colorText: "text-orange-600" },
        ]
    },
    {
        title: "Inventario",
        icon: CubeTransparentIcon,
        roles: ['admin'],
        items: [
            { label: "Productos", routeName: "products.index", pattern: "products.*", icon: CubeIcon, roles: ['admin'], colorBg: "bg-indigo-50", colorText: "text-indigo-600" },
            { label: "Movimientos", routeName: "inventory-movements.index", pattern: "inventory-movements.*", icon: ArrowsRightLeftIcon, roles: ['admin'], colorBg: "bg-blue-50", colorText: "text-blue-600" },
            { label: "Compras", routeName: "purchases.index", pattern: "purchases.*", icon: ShoppingCartIcon, roles: ['admin'], colorBg: "bg-pink-50", colorText: "text-pink-600" },
        ]
    },
    {
        title: "Logística y Operación",
        icon: TruckIcon,
        roles: ['admin', 'empleado'],
        items: [
            { label: "Dashboard", routeName: "dashboard", pattern: "dashboard", icon: HomeIcon, roles: ['empleado'], colorBg: "bg-blue-50", colorText: "text-blue-600" },
            { label: "Rutas", routeName: "delivery-routes.index", pattern: "delivery-routes.*", icon: MapIcon, roles: ['admin'], colorBg: "bg-teal-50", colorText: "text-teal-600" },
            { label: "Crear Viajes", routeName: "trips.index", pattern: "trips.*", icon: MapPinIcon, roles: ['admin'], colorBg: "bg-emerald-50", colorText: "text-emerald-600" },
            { label: "Mis Rutas", routeName: "repartidor.trips.index", pattern: "repartidor.trips.*", icon: MapIcon, roles: ['empleado'], colorBg: "bg-purple-50", colorText: "text-purple-600" },
            { label: "Gastos de Viaje", routeName: "repartidor.expenses.create", param: 1, pattern: "repartidor.expenses.*", icon: BanknotesIcon, roles: ['empleado'], colorBg: "bg-teal-50", colorText: "text-teal-600" },
            { label: "Cierre de Caja", routeName: "repartidor.shifts.close", pattern: "repartidor.shifts.close", icon: LockClosedIcon, roles: ['empleado'], colorBg: "bg-orange-50", colorText: "text-orange-600" },
        ]
    },
    {
        title: "Finanzas y Reportes",
        icon: ChartBarIcon,
        roles: ['admin', 'empleado'],
        items: [
            { label: "Historial Ventas", routeName: "admin.sales.index", pattern: "admin.sales.*", icon: DocumentTextIcon, roles: ['admin'], colorBg: "bg-cyan-50", colorText: "text-cyan-600" },
             { label: "Historial Ventas", routeName: "repartidor.sales.index", pattern: "repartidor.sales.*", icon: ClipboardDocumentListIcon, roles: ['empleado'], colorBg: "bg-pink-50", colorText: "text-pink-600" },

            { label: "Historial Cierres", routeName: "admin.shifts.index", pattern: "admin.shifts.*", icon: ClockIcon, roles: ['admin'], colorBg: "bg-blue-50", colorText: "text-blue-600" },
            { label: "Cuentas por Cobrar", routeName: "admin.receivables.index", pattern: "admin.receivables.index", icon: BanknotesIcon, roles: ['admin'], colorBg: "bg-emerald-50", colorText: "text-emerald-600" },
            { label: "Auditoría Cobros", routeName: "admin.receivables.history", pattern: "admin.receivables.history", icon: BanknotesIcon, roles: ['admin'], colorBg: "bg-purple-50", colorText: "text-purple-600" },
            { label: "Historial Cierres", routeName: "repartidor.shifts.index", pattern: "repartidor.shifts.index", icon: ClockIcon, roles: ['empleado'], colorBg: "bg-blue-50", colorText: "text-blue-600" },
            { label: "Por Cobrar", routeName: "repartidor.receivables.index", pattern: "repartidor.receivables.index", icon: BanknotesIcon, roles: ['empleado'], colorBg: "bg-emerald-50", colorText: "text-emerald-600" },
            { label: "Historial Cobros", routeName: "repartidor.receivables.history", pattern: "repartidor.receivables.history", icon: ClockIcon, roles: ['empleado'], colorBg: "bg-indigo-50", colorText: "text-indigo-600" },
        ]
    },
    {
        title: "Facturación",
        icon: CreditCardIcon,
        roles: ['admin'],
        items: [
            { label: "Mi Suscripción", routeName: "subscription.index", pattern: "subscription.*", icon: CreditCardIcon, roles: ['admin'], colorBg: "bg-green-50", colorText: "text-green-600" }
        ]
    }
];

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const { auth, flash } = page.props;
    const user = auth.user;
    const notifications = user?.unread_notifications || [];
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const handleNotificationClick = (notification) => {
        setIsNotifOpen(false);
        router.post(route('notifications.read', notification.id), {}, {
            onSuccess: () => {
                if (notification.data?.url) {
                    router.visit(notification.data.url);
                }
            }
        });
    };
    const [alertData, setAlertData] = useState({ show: false, type: 'info', message: '' });
    const [openAlert, setOpenAlert] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setAlertData({ show: true, type: 'success', message: flash.success });
        } else if (flash.error) {
            setAlertData({ show: true, type: 'error', message: flash.error });
        } else if (flash.info) {
            setAlertData({ show: true, type: 'info', message: flash.info });
        } else if (flash.warning) {
            setAlertData({ show: true, type: 'warning', message: flash.warning });
        }
    }, [flash]);

    const closeAlert = () => setAlertData({ ...alertData, show: false });

    const alertConfig = {
        success: {
            title: '¡Operación Exitosa!',
            btnColor: 'indigo',
            iconBg: 'bg-green-50 border-green-100',
            iconText: 'text-green-500',
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />,
            btnText: 'Continuar'
        },
        error: {
            title: '¡Aviso Importante!',
            btnColor: 'red',
            iconBg: 'bg-red-50 border-red-100',
            iconText: 'text-red-500',
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
            btnText: 'Entendido'
        },
        info: {
            title: 'Aviso',
            btnColor: 'blue',
            iconBg: 'bg-blue-50 border-blue-100',
            iconText: 'text-blue-500',
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />,
            btnText: 'Entendido'
        },
        warning: {
            title: 'Precaución',
            btnColor: 'yellow',
            iconBg: 'bg-yellow-50 border-yellow-100',
            iconText: 'text-yellow-500',
            iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />,
            btnText: 'Entendido'
        }
    };
    const currentAlert = alertConfig[alertData.type] || alertConfig.info;

    const isActive = (pattern) => {
        if (typeof route === 'undefined') return false;
        try { return route().current(pattern); } catch (e) { return false; }
    };

    const getRouteUrl = (routeName, param) => {
        if (typeof route === 'undefined') return '#';
        try { return param ? route(routeName, param) : route(routeName); } catch (e) { return '#'; }
    };

    const itemClasses = (pattern) =>
        `py-2.5 px-3 rounded-md transition-colors flex items-center gap-3 ${isActive(pattern) ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'}`;

    // TARJETA MÓVIL
    const GridCard = ({ href, icon: Icon, label, iconColor, iconBg, onClick, badge }) => (
        <Link href={href} onClick={onClick} className="relative flex flex-col items-center justify-center p-5 bg-white rounded-2xl gap-3 hover:bg-gray-50 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-95">
            {badge && (
                <span className="absolute top-2 right-2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
                <Icon className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-semibold text-gray-700 text-center leading-tight">{label}</span>
        </Link>
    );

    // MENÚ ESCRITORIO
    const renderDesktopMenu = () => (
        <>
            {MENU_CATEGORIES.filter(cat => cat.roles.includes(user.role)).map((category, idx) => {
                const categoryItems = category.items.filter(item => item.roles.includes(user.role));
                if (categoryItems.length === 0) return null;

                const CategoryIcon = category.icon;
                return (
                    <div key={idx} className="flex flex-col mb-4">
                        <div className="flex items-center gap-2 px-3 mb-2">
                            <CategoryIcon className="h-4 w-4 text-indigo-400" />
                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">
                                {category.title}
                            </Typography>
                        </div>
                        <div className="flex flex-col font-medium gap-1 ml-2">
                            {categoryItems.map((item, itemIdx) => {
                                const ItemIcon = item.icon;
                                const url = getRouteUrl(item.routeName, item.param);
                                return (
                                    <Link key={itemIdx} href={url}>
                                        <ListItem className={itemClasses(item.pattern || item.routeName)}>
                                            <ItemIcon className="h-4 w-4" /> {item.label}
                                        </ListItem>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <hr className="my-4 border-gray-200" />

            <div className="space-y-1">

                <Link href={route('profile.edit')} className="w-full">
                    <ListItem className={`p-3 rounded-lg ${isActive('profile.*') ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <ListItemPrefix><UserCircleIcon className="h-5 w-5" /></ListItemPrefix>
                        <Typography className="font-medium">Mi Perfil</Typography>
                    </ListItem>
                </Link>

                <Link href={route('logout')} method="post" as="button" className="w-full mt-4">
                    <ListItem className="p-3 rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50">
                        <ListItemPrefix><PowerIcon className="h-5 w-5 text-red-500" /></ListItemPrefix>
                        <Typography className="font-medium">Cerrar Sesión</Typography>
                    </ListItem>
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">

            {/* SIDEBAR ESCRITORIO */}
            <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
                <Card className="h-full w-full p-4 shadow-none rounded-none border-r border-gray-200 flex flex-col">
                    <div className="mb-4 p-4 flex items-center justify-between">
                        <Typography variant="h5" color="indigo" className="font-bold tracking-tight flex items-center gap-2">
                            <TruckIcon className="h-7 w-7 text-indigo-500" />
                            <span className="text-black block text-xl font-bold text-slate-900 tracking-tight dark:text-white">
                                Aqua<span className="text-blue-500">RutaTech</span>
                            </span>
                        </Typography>
                    </div>
                    <List className="flex-1 overflow-y-auto px-2 space-y-2">
                        {renderDesktopMenu()}
                    </List>

                    <Alert open={openAlert} className="mt-4 bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md flex-shrink-0" onClose={() => setOpenAlert(false)}>
                        <CubeTransparentIcon className="mb-4 h-10 w-10 text-white/80" />
                        <Typography variant="h6" className="mb-1 text-white">Plan Premium</Typography>
                        <Typography variant="small" className="font-normal opacity-90 text-white">
                            Sube a premium para manejar inventarios complejos y múltiples sucursales.
                        </Typography>
                        <div className="mt-4 flex gap-3">
                            <Typography as="button" variant="small" className="font-medium opacity-80 text-white hover:opacity-100 transition-opacity" onClick={() => setOpenAlert(false)}>Ignorar</Typography>
                            <Typography as="a" href="#" variant="small" className="font-medium text-white underline hover:no-underline transition-all">Mejorar Ahora</Typography>
                        </div>
                    </Alert>
                </Card>
            </aside>

            {/* MODAL MÓVIL */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm lg:hidden transition-opacity">
                    <div className="absolute inset-0" onClick={() => setIsMobileMenuOpen(false)}></div>

                    <div className="relative w-full bg-white rounded-t-[2rem] shadow-2xl flex flex-col max-h-[90vh] animate-slide-up pb-6">
                        <div className="p-6 pb-2 flex justify-between items-center">
                            <Typography variant="h5" className="font-bold text-gray-800">
                                ¿Qué quisieras hacer?
                            </Typography>
                            <IconButton variant="text" color="blue-gray" className="rounded-full bg-gray-50 hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                                <XMarkIcon className="h-6 w-6" strokeWidth={2} />
                            </IconButton>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1 space-y-6">
                            {MENU_CATEGORIES.filter(cat => cat.roles.includes(user.role)).map((category, idx) => {
                                const categoryItems = category.items.filter(item => item.roles.includes(user.role));
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={idx}>
                                        <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">
                                            {category.title}:
                                        </Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            {categoryItems.map((item, itemIdx) => (
                                                <GridCard
                                                    key={itemIdx}
                                                    href={getRouteUrl(item.routeName, item.param)}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    icon={item.icon}
                                                    label={item.label}
                                                    iconColor={item.colorText}
                                                    iconBg={item.colorBg}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            <div>
                                <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">
                                    Ajustes y Cuenta:
                                </Typography>
                                <div className="grid grid-cols-2 gap-4">
                                    <GridCard href={route('profile.edit')} onClick={() => setIsMobileMenuOpen(false)} icon={UserCircleIcon} label="Mi Perfil" iconColor="text-gray-700" iconBg="bg-gray-100" />
                                    <GridCard href="#" onClick={() => setIsMobileMenuOpen(false)} icon={InboxIcon} label="Mensajes" iconColor="text-indigo-600" iconBg="bg-indigo-50" badge="14" />
                                    <GridCard href="#" onClick={() => setIsMobileMenuOpen(false)} icon={Cog6ToothIcon} label="Ajustes" iconColor="text-slate-600" iconBg="bg-slate-100" />

                                    <Link href={route('logout')} method="post" as="button" className="col-span-2 flex items-center justify-center p-4 bg-white rounded-2xl gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-red-100 active:scale-95">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 text-red-500">
                                            <PowerIcon className="w-5 h-5" strokeWidth={2} />
                                        </div>
                                        <span className="text-[14px] font-bold text-red-500">Cerrar Sesión</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-gray-50/50">
                <header className="bg-white shadow-sm border-b border-gray-200 z-10 shrink-0">
        <div className="px-4 py-4 flex justify-between items-center lg:px-8">
            <div className="flex items-center gap-4">
                <div className="font-bold text-gray-800">{header}</div>
            </div>

            <div className="flex items-center gap-4">
                {/* 🔔 BOTÓN Y DROPDOWN DE NOTIFICACIONES */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                        <BellIcon className="h-6 w-6 text-gray-700" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* MENÚ DESPLEGABLE */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <div className="p-3.5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <span className="font-bold text-xs uppercase tracking-wider text-gray-700">Notificaciones</span>
                                <span className="text-xs text-indigo-600 font-bold">{notifications.length} sin leer</span>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                                {notifications.length > 0 ? (
                                    notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleNotificationClick(item)}
                                            className="p-3.5 hover:bg-indigo-50/50 cursor-pointer transition-colors flex gap-3 items-start text-left"
                                        >
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5">
                                                <ArrowsRightLeftIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-gray-800">{item.data.title}</p>
                                                <p className="text-xs text-gray-600 mt-0.5 leading-snug">{item.data.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-gray-400">
                                        No tienes notificaciones pendientes.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pb-28 lg:p-8 lg:pb-8">
                    {children}
                </main>

                {/* BOTTOM NAVIGATION BAR */}
                <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-t-3xl pt-2 pb-6 px-4 z-40 flex justify-between items-end">
                    <Link href={route('dashboard')} className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive('dashboard') ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                        <HomeIcon className="h-6 w-6" strokeWidth={isActive('dashboard') ? 2 : 1.5} />
                        <span className="text-[10px] font-medium">Resumen</span>
                    </Link>

                    {auth.user.role === "admin" ? (
                        <Link href={getRouteUrl("admin.sales.index")} className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive("admin.sales.*") ? "text-pink-600" : "text-gray-500 hover:text-gray-900"} transition-colors`}>
                            <DocumentTextIcon className="h-6 w-6" strokeWidth={isActive("admin.sales.*") ? 2 : 1.5} />
                            <span className="text-[10px] font-medium">Ventas</span>
                        </Link>
                    ) : (
                        <Link href={getRouteUrl("repartidor.shifts.index")} className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive('repartidor.shifts.*') ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                            <LockClosedIcon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">Cajas</span>
                        </Link>
                    )}

                    <div className="relative -top-5 flex flex-col items-center justify-center w-16">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40 text-white ring-4 ring-white focus:outline-none transition-transform active:scale-95"
                        >
                            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </button>
                        <span className="text-[10px] font-medium text-gray-800 mt-1 h-1">Menú</span>
                    </div>

                    <Link
                        href={auth.user.role === 'admin' ? getRouteUrl('admin.receivables.index') : getRouteUrl('repartidor.receivables.index')}
                        className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive('*.receivables.*') ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                    >
                        <BanknotesIcon className="h-6 w-6" strokeWidth={isActive('*.receivables.*') ? 2 : 1.5} />
                        <span className="text-[10px] font-medium">Cobranzas</span>
                    </Link>

                    <Link href={route('profile.edit')} className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive('profile.*') ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                        <UserCircleIcon className="h-6 w-6" strokeWidth={isActive('profile.*') ? 2 : 1.5} />
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </nav>
            </div>

            {/* MODAL DE ALERTAS */}
            <Modal show={alertData.show} onClose={closeAlert} maxWidth="sm">
                <div className="p-6 text-center">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-5 border ${currentAlert.iconBg}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-8 h-8 ${currentAlert.iconText}`}>
                            {currentAlert.iconPath}
                        </svg>
                    </div>
                    <Typography variant="h4" color="blue-gray" className="mb-2 font-bold">{currentAlert.title}</Typography>
                    {alertData.message && <Typography color="gray" className="font-normal mb-6 text-md">{alertData.message}</Typography>}
                    <Button color={currentAlert.btnColor} onClick={closeAlert} className="w-auto px-8 py-3 rounded-lg shadow-md">{currentAlert.btnText}</Button>
                </div>
            </Modal>
        </div>
    );
}
