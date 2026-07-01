import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';

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
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    CreditCardIcon
} from "@heroicons/react/24/solid";

import {
    TruckIcon,
    CubeTransparentIcon,
    Bars3Icon,
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
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    BanknotesIcon,
    LockClosedIcon,
    SparklesIcon,
    RocketLaunchIcon,
    HomeIcon,
    ChartPieIcon
} from "@heroicons/react/24/outline";

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const { auth, flash } = page.props;
    const user = auth.user;

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

    const itemClasses = (pattern) =>
        `py-2.5 px-3 rounded-md transition-colors flex items-center gap-3 ${isActive(pattern) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'}`;

    // COMPONENTE TARJETA PARA EL MENÚ MÓVIL
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

    // --- MENÚ LATERAL (SOLO ESCRITORIO) ---
    const renderDesktopMenu = () => (
        <>
            {(auth.user.role === 'super_admin' || auth.user.role === 'admin') && (
                <>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 px-3 mb-2">
                            <BuildingOfficeIcon className="h-4 w-4 text-indigo-400" />
                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Administración</Typography>
                        </div>
                        <div className="flex flex-col font-medium gap-1 ml-2">
                            {auth.user.role === 'super_admin' && (
                                <>
                                    <Link href={route('dashboard')}><ListItem className={itemClasses('dashboard.*')}><BuildingStorefrontIcon className="h-4 w-4" /> Dashboard</ListItem></Link>
                                    <Link href={route('companies.index')}><ListItem className={itemClasses('companies.*')}><BuildingStorefrontIcon className="h-4 w-4" /> Empresas</ListItem></Link>
                                    <Link href={route('employee-categories.index')}><ListItem className={itemClasses('employee-categories.*')}><IdentificationIcon className="h-4 w-4" /> Cat. de Empleado</ListItem></Link>
                                </>
                            )}
                            {auth.user.role === 'admin' && (
                                <Link href={route('employees.index')}><ListItem className={itemClasses('employees.*')}><UserGroupIcon className="h-4 w-4" /> Empleados</ListItem></Link>
                            )}
                        </div>
                    </div>
                    {auth.user.role === 'admin' && (
                        <div className="flex flex-col mt-4">
                            <div className="flex items-center gap-2 px-3 mb-2">
                                <UsersIcon className="h-4 w-4 text-indigo-400" />
                                <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Directorio</Typography>
                            </div>
                            <div className="flex flex-col font-medium gap-1 ml-2">
                                <Link href={route('customers.index')}><ListItem className={itemClasses('customers.*')}><UserIcon className="h-4 w-4" /> Clientes</ListItem></Link>
                                <Link href={route('customer-categories.index')}><ListItem className={itemClasses('customer-categories.*')}><TagIcon className="h-4 w-4" /> Cat. de Clientes</ListItem></Link>
                                <Link href={route('suppliers.index')}><ListItem className={itemClasses('suppliers.*')}><BriefcaseIcon className="h-4 w-4" /> Proveedores</ListItem></Link>
                            </div>
                        </div>
                    )}
                    {auth.user.role === 'admin' && (
                        <div className="flex flex-col mt-4">
                            <div className="flex items-center gap-2 px-3 mb-2">
                                <CubeTransparentIcon className="h-4 w-4 text-indigo-400" />
                                <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Inventario</Typography>
                            </div>
                            <div className="flex flex-col font-medium gap-1 ml-2">
                                <Link href={route('products.index')}><ListItem className={itemClasses('products.*')}><CubeIcon className="h-4 w-4" /> Productos</ListItem></Link>
                                <Link href={route('inventory-movements.index')}><ListItem className={itemClasses('inventory-movements.*')}><ArrowsRightLeftIcon className="h-4 w-4" /> Movimientos</ListItem></Link>
                                <Link href={route('purchases.index')}><ListItem className={itemClasses('purchases.*')}><ShoppingCartIcon className="h-4 w-4" /> Compras</ListItem></Link>
                            </div>
                        </div>
                    )}
                    {auth.user.role === 'admin' && (
                        <div className="flex flex-col mt-4">
                            <div className="flex items-center gap-2 px-3 mb-2">
                                <TruckIcon className="h-4 w-4 text-indigo-400" />
                                <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Logística</Typography>
                            </div>
                            <div className="flex flex-col font-medium gap-1 ml-2">
                                <Link href={route('delivery-routes.index')}><ListItem className={itemClasses('delivery-routes.*')}><MapIcon className="h-4 w-4" /> Rutas</ListItem></Link>
                                <Link href={route('trips.index')}><ListItem className={itemClasses('trips.*')}><MapPinIcon className="h-4 w-4" />Crear Viajes</ListItem></Link>
                            </div>
                        </div>
                    )}
                                                    {/* 5. REPORTES */}
                                {auth.user.role === 'admin' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 px-3 mb-2">
                                            <ChartBarIcon className="h-4 w-4 text-indigo-400" />
                                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Reportes</Typography>
                                        </div>
                                        <div className="flex flex-col font-medium gap-1 ml-2">

                                            <Link href="/admin/sales"><ListItem className={itemClasses('admin.sales.*')} onClick={() => setIsSidebarOpen(false)}> <DocumentTextIcon className="h-4 w-4" /> Historial de Ventas</ListItem></Link>
                                            <Link href={route('admin.shifts.index')}><ListItem className={itemClasses('admin.shifts.*')} onClick={() => setIsSidebarOpen(false)}><ClockIcon className="h-4 w-4" /> Historial de Cierres</ListItem></Link>

                                        </div>
                                    </div>
                                )}
                    {auth.user.role === 'admin' && (
                        <div className="flex flex-col mt-4">
                            <div className="flex items-center gap-2 px-3 mb-2">
                                <CreditCardIcon className="h-4 w-4 text-indigo-400" />
                                <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Facturación</Typography>
                            </div>
                            <div className="flex flex-col font-medium gap-1 ml-2">
                                <Link href={route('subscription.index')}>
                                    <ListItem className={itemClasses('subscription.*')}>
                                        <CreditCardIcon className="h-4 w-4" /> Mi Suscripción
                                    </ListItem>
                                </Link>
                            </div>
                        </div>
                    )}
                </>
            )}

            {auth.user.role === 'empleado' && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 px-3 mb-2">
                        <ShoppingBagIcon className="h-4 w-4 text-indigo-400" />
                        <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Operación</Typography>
                    </div>
                    <div className="flex flex-col font-medium gap-1 ml-2">
                        <Link href={route('repartidor.sales.index')}><ListItem className={itemClasses('repartidor.sales.*')}><ClipboardDocumentListIcon className="h-4 w-4" /> Pedidos</ListItem></Link>
                        <Link href={route('repartidor.trips.index')}><ListItem className={itemClasses('repartidor.trips.*')}><MapIcon className="h-4 w-4" /> Mis Rutas</ListItem></Link>
                        <Link href={route('repartidor.shifts.index')}><ListItem className={itemClasses('repartidor.shifts.*')}><ClockIcon className="h-4 w-4" /> Historial Cierres</ListItem></Link>
                        <Link href={route('repartidor.sales.index')}><ListItem className={itemClasses('repartidor.sales.*')}><DocumentTextIcon className="h-4 w-4" /> Historial Ventas</ListItem></Link>
                        <Link href={route('repartidor.expenses.create', 1)}><ListItem className={itemClasses('repartidor.expenses.*')}><BanknotesIcon className="h-4 w-4" /> Gastos de Viaje</ListItem></Link>
                        <Link href={route('repartidor.shifts.close')}><ListItem className={itemClasses('repartidor.shifts.close')}><LockClosedIcon className="h-4 w-4" /> Cierre de Caja</ListItem></Link>
                    </div>
                </div>
            )}

            <hr className="my-4 border-gray-200" />

            <div className="space-y-1">
                <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <ListItemPrefix><InboxIcon className="h-5 w-5 text-indigo-400" /></ListItemPrefix>
                    <Typography className="mr-auto font-medium">Mensajes</Typography>
                    <ListItemSuffix><Chip value="14" size="sm" variant="ghost" color="indigo" className="rounded-full" /></ListItemSuffix>
                </ListItem>
                <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <ListItemPrefix><SparklesIcon className="h-5 w-5 text-indigo-400" /></ListItemPrefix>
                    <Typography className="mr-auto font-medium">Plan</Typography>
                    <ListItemSuffix><Chip value="3" size="sm" variant="ghost" color="indigo" className="rounded-full" /></ListItemSuffix>
                </ListItem>
                <Link href={route('profile.edit')} className="w-full">
                    <ListItem className={`p-3 rounded-lg ${isActive('profile.*') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <ListItemPrefix><UserCircleIcon className="h-5 w-5" /></ListItemPrefix>
                        <Typography className="font-medium">Mi Perfil</Typography>
                    </ListItem>
                </Link>
                <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                    <ListItemPrefix><Cog6ToothIcon className="h-5 w-5 text-gray-500" /></ListItemPrefix>
                    <Typography className="font-medium">Ajustes</Typography>
                </ListItem>
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
                            <TruckIcon className="h-7 w-7 text-indigo-500" /> AguaRuta
                        </Typography>
                    </div>
                    <List className="flex-1 overflow-y-auto px-2 space-y-4">
                        {renderDesktopMenu()}
                    </List>

                    {/* RESTAURADO: PLAN PREMIUM EN ESCRITORIO */}
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

            {/* --- MENÚ CENTRAL APP (BOTTOM SHEET ESTILO CUADRÍCULA PARA MÓVIL) --- */}
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

                        <div className="overflow-y-auto p-6 flex-1 space-y-8">

                            {/* VISTA DE EMPLEADO (REPARTIDOR) */}
                            {auth.user.role === 'empleado' && (
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <GridCard href={route('repartidor.sales.index')} onClick={() => setIsMobileMenuOpen(false)} icon={ClipboardDocumentListIcon} label="Pedidos" iconColor="text-pink-600" iconBg="bg-pink-50" />
                                        <GridCard href={route('repartidor.trips.index')} onClick={() => setIsMobileMenuOpen(false)} icon={MapIcon} label="Mis Rutas" iconColor="text-purple-600" iconBg="bg-purple-50" />
                                        <GridCard href={route('repartidor.shifts.index')} onClick={() => setIsMobileMenuOpen(false)} icon={ClockIcon} label="Historial Cierres" iconColor="text-blue-600" iconBg="bg-blue-50" />
                                        <GridCard href={route('repartidor.sales.index')} onClick={() => setIsMobileMenuOpen(false)} icon={DocumentTextIcon} label="Historial Ventas" iconColor="text-cyan-600" iconBg="bg-cyan-50" />
                                        <GridCard href={route('repartidor.expenses.create', 1)} onClick={() => setIsMobileMenuOpen(false)} icon={BanknotesIcon} label="Gastos de Viaje" iconColor="text-teal-600" iconBg="bg-teal-50" />
                                        <GridCard href={route('repartidor.shifts.close')} onClick={() => setIsMobileMenuOpen(false)} icon={LockClosedIcon} label="Cierre de Caja" iconColor="text-orange-600" iconBg="bg-orange-50" />
                                    </div>
                                </div>
                            )}

                            {/* VISTA DE ADMIN / SUPER_ADMIN */}
                            {(auth.user.role === 'admin' || auth.user.role === 'super_admin') && (
                                <>
                                    <div>
                                        <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">Administración:</Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            {auth.user.role === 'super_admin' && (
                                                <>
                                                    <GridCard href={route('dashboard')} onClick={() => setIsMobileMenuOpen(false)} icon={BuildingStorefrontIcon} label="Dashboard" iconColor="text-pink-600" iconBg="bg-pink-50" />
                                                    <GridCard href={route('companies.index')} onClick={() => setIsMobileMenuOpen(false)} icon={BuildingOfficeIcon} label="Empresas" iconColor="text-purple-600" iconBg="bg-purple-50" />
                                                    <GridCard href={route('employee-categories.index')} onClick={() => setIsMobileMenuOpen(false)} icon={IdentificationIcon} label="Categorías" iconColor="text-indigo-600" iconBg="bg-indigo-50" />
                                                </>
                                            )}
                                            {auth.user.role === 'admin' && (

                                                <GridCard href={route('employees.index')} onClick={() => setIsMobileMenuOpen(false)} icon={UserGroupIcon} label="Empleados" iconColor="text-blue-600" iconBg="bg-blue-50" />

                                            )}
                                        </div>
                                    </div>

                                    {auth.user.role === 'admin' && (
                                        <div>
                                            <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">Directorio:</Typography>
                                            <div className="grid grid-cols-2 gap-4">
                                                <GridCard href={route('customers.index')} onClick={() => setIsMobileMenuOpen(false)} icon={UserIcon} label="Clientes" iconColor="text-cyan-600" iconBg="bg-cyan-50" />
                                                <GridCard href={route('suppliers.index')} onClick={() => setIsMobileMenuOpen(false)} icon={BriefcaseIcon} label="Proveedores" iconColor="text-orange-600" iconBg="bg-orange-50" />
                                                <GridCard href={route('customer-categories.index')} onClick={() => setIsMobileMenuOpen(false)} icon={UserGroupIcon} label="Cat. Clientes" iconColor="text-lime-600" iconBg="bg-lime-50" />
                                            </div>
                                        </div>
                                    )}

                                     {auth.user.role === 'admin' && (
                                        <div>
                                            <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">Inventario:</Typography>
                                            <div className="grid grid-cols-2 gap-4">
                                                <GridCard href={route('products.index')} onClick={() => setIsMobileMenuOpen(false)} icon={CubeIcon} label="Productos" iconColor="text-indigo-600" iconBg="bg-indigo-50" />
                                                <GridCard href={route('inventory-movements.index')} onClick={() => setIsMobileMenuOpen(false)} icon={ArrowsRightLeftIcon} label="Movimientos" iconColor="text-blue-600" iconBg="bg-blue-50" />
                                                <GridCard href={route('purchases.index')} onClick={() => setIsMobileMenuOpen(false)} icon={ShoppingCartIcon} label="Compras" iconColor="text-pink-600" iconBg="bg-pink-50" />

                                            </div>
                                        </div>
                                    )}


                                    {auth.user.role === 'admin' && (
                                        <div>
                                            <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">Operaciones:</Typography>
                                            <div className="grid grid-cols-2 gap-4">
                                                <GridCard href={route('delivery-routes.index')} onClick={() => setIsMobileMenuOpen(false)} icon={MapIcon} label="Rutas" iconColor="text-teal-600" iconBg="bg-teal-50" />
                                                <GridCard href={route('trips.index')} onClick={() => setIsMobileMenuOpen(false)} icon={MapPinIcon} label="Crear Viajes" iconColor="text-emerald-600" iconBg="bg-emerald-50" />


                                            </div>
                                        </div>
                                    )}

                                    {auth.user.role === 'admin' && (
                                        <div>
                                            <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">Reportes:</Typography>
                                            <div className="grid grid-cols-2 gap-4">
                                               <GridCard href={route('admin.sales.index')}onClick={() => setIsMobileMenuOpen(false)} icon={DocumentTextIcon} label="Historial Ventas" iconColor="text-cyan-600" iconBg="bg-cyan-50"/>
                                                <GridCard href={route('admin.shifts.index')} onClick={() => setIsMobileMenuOpen(false)} icon={ClockIcon} label="Historial Cierres" iconColor="text-blue-600" iconBg="bg-blue-50" />

                                                       </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* BLOQUE GENERAL RESTAURADO COMPLETAMENTE */}
                            <div>
                                <Typography variant="small" className="text-gray-500 font-bold mb-3 ml-1">También puedes:</Typography>
                                <div className="grid grid-cols-2 gap-4">
                                    <GridCard href={route('profile.edit')} onClick={() => setIsMobileMenuOpen(false)} icon={UserCircleIcon} label="Mi Perfil" iconColor="text-gray-700" iconBg="bg-gray-100" />
                                    <GridCard href="#" onClick={() => setIsMobileMenuOpen(false)} icon={InboxIcon} label="Mensajes" iconColor="text-indigo-600" iconBg="bg-indigo-50" badge="14" />
                                    <GridCard href={route('subscription.index')} onClick={() => setIsMobileMenuOpen(false)} icon={CreditCardIcon} label="Suscripción" iconColor="text-green-600" iconBg="bg-green-50" />
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
                        <div className="flex items-center gap-3">
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
                        <Link
                            href="/admin/sales"
                            className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive("admin.sales.*")
                                    ? "text-pink-600"
                                    : "text-gray-500 hover:text-gray-900"
                                } transition-colors`}
                        >
                            <DocumentTextIcon
                                className="h-6 w-6"
                                strokeWidth={isActive("admin.sales.*") ? 2 : 1.5}
                            />
                            <span className="text-[10px] font-medium">
                                Ventas
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="#"
                            className="flex flex-col items-center justify-center gap-1 w-16 text-gray-500"
                        >
                            <ClipboardDocumentListIcon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">
                                Panel
                            </span>
                        </Link>
                    )}

                    {/* BOTÓN CENTRAL QUE ABRE LA CUADRÍCULA */}
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

                    <Link href="#" className="flex flex-col items-center justify-center gap-1 w-16 text-gray-500 hover:text-gray-900 transition-colors">
                        <ChartPieIcon className="h-6 w-6" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">Finanzas</span>
                    </Link>

                    <Link href={route('profile.edit')} className={`flex flex-col items-center justify-center gap-1 w-16 ${isActive('profile.*') ? 'text-pink-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}>
                        <UserCircleIcon className="h-6 w-6" strokeWidth={isActive('profile.*') ? 2 : 1.5} />
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </nav>
            </div>

            {/* MODAL DE ALERTAS ORIGINAL */}
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
