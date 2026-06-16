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
    RocketLaunchIcon
} from "@heroicons/react/24/outline";

export default function AuthenticatedLayout({ header, children }) {
    const page = usePage();
    const { auth, flash } = page.props;
    const user = auth.user;

    // --- ESTADO UNIFICADO PARA MODALES DE ALERTA ---
    const [alertData, setAlertData] = useState({ show: false, type: 'info', message: '' });
    const [openAlert, setOpenAlert] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash.success) {
            setAlertData({ show: true, type: 'success', message: flash.success });
        } else if (flash.error) {
            setAlertData({ show: true, type: 'error', message: flash.error });
        } else if (flash.info) {
            setAlertData({ show: true, type: 'info', message: flash.info });
        }
    }, [flash]);

    const closeAlert = () => setAlertData({ ...alertData, show: false });

    // Configuración visual dinámica según el tipo de alerta
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
        }
    };
    const currentAlert = alertConfig[alertData.type] || alertConfig.info;

    // Función para resaltar el menú activo visualmente
    const isActive = (pattern) => {
        if (typeof route === 'undefined') return false;
        try {
            return route().current(pattern);
        } catch (e) {
            return false;
        }
    };

    // Clases base para los items del menú (con Flexbox para alinear iconos y texto)
    const itemClasses = (pattern) =>
        `py-2.5 px-3 rounded-md transition-colors flex items-center gap-3 ${isActive(pattern) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-900'}`;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
            >
                <Card className="h-full w-full p-4 shadow-none rounded-none border-r border-gray-200 flex flex-col">
                    <div className="mb-4 p-4 flex items-center justify-between">
                        <Typography variant="h5" color="indigo" className="font-bold tracking-tight flex items-center gap-2">
                            <TruckIcon className="h-7 w-7 text-indigo-500" />
                            AguaRuta
                        </Typography>
                        <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
                        </IconButton>
                    </div>

                    <List className="flex-1 overflow-y-auto px-2 space-y-4">

                        {/* 0. DASHBOARD */}
                        <Link href={route('dashboard')} onClick={() => setIsSidebarOpen(false)}>
                            <ListItem className={`p-3 rounded-lg font-medium transition-colors ${isActive('dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-indigo-50'}`}>
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className={`h-5 w-5 ${isActive('dashboard') ? 'text-indigo-700' : 'text-gray-500'}`} />
                                </ListItemPrefix>
                                <Typography className="mr-auto font-medium text-gray-700">Dashboard</Typography>
                            </ListItem>
                        </Link>

                        {/* --- BLOQUE: SUPER ADMIN / ADMIN --- */}
                        {(auth.user.role === 'super_admin' || auth.user.role === 'admin') && (
                            <>
                                {/* 1. ADMINISTRACIÓN */}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 px-3 mb-2">
                                        <BuildingOfficeIcon className="h-4 w-4 text-indigo-400" />
                                        <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Administración</Typography>
                                    </div>
                                    <div className="flex flex-col font-medium gap-1 ml-2">
                                        {auth.user.role === 'super_admin' && (
                                            <>
                                                <Link href={route('companies.index')}><ListItem className={itemClasses('companies.*')} onClick={() => setIsSidebarOpen(false)}><BuildingStorefrontIcon className="h-4 w-4" /> Empresas</ListItem></Link>
                                                <Link href={route('employee-categories.index')}><ListItem className={itemClasses('employee-categories.*')} onClick={() => setIsSidebarOpen(false)}><IdentificationIcon className="h-4 w-4" /> Cat. de Empleado</ListItem></Link>
                                                <Link href={route('companies.index')}><ListItem className={itemClasses('companies.*')} onClick={() => setIsSidebarOpen(false)}><RocketLaunchIcon className="h-4 w-4" />Usuarios </ListItem></Link>
                                            </>
                                        )}
                                        {auth.user.role === 'admin' && (
                                            <Link href={route('employees.index')}><ListItem className={itemClasses('employees.*')} onClick={() => setIsSidebarOpen(false)}><UserGroupIcon className="h-4 w-4" /> Empleados</ListItem></Link>
                                        )}
                                    </div>
                                </div>

                                {/* 2. DIRECTORIO */}
                                {auth.user.role === 'admin' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 px-3 mb-2">
                                            <UsersIcon className="h-4 w-4 text-indigo-400" />
                                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Directorio</Typography>
                                        </div>
                                        <div className="flex flex-col font-medium gap-1 ml-2">
                                            <Link href={route('customers.index')}><ListItem className={itemClasses('customers.*')} onClick={() => setIsSidebarOpen(false)}><UserIcon className="h-4 w-4" /> Clientes</ListItem></Link>
                                            <Link href={route('customer-categories.index')}><ListItem className={itemClasses('customer-categories.*')} onClick={() => setIsSidebarOpen(false)}><TagIcon className="h-4 w-4" /> Cat. de Clientes</ListItem></Link>
                                            <Link href={route('suppliers.index')}><ListItem className={itemClasses('suppliers.*')} onClick={() => setIsSidebarOpen(false)}><BriefcaseIcon className="h-4 w-4" /> Proveedores</ListItem></Link>
                                        </div>
                                    </div>
                                )}

                                {/* 3. INVENTARIO */}
                                {auth.user.role === 'admin' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 px-3 mb-2">
                                            <CubeTransparentIcon className="h-4 w-4 text-indigo-400" />
                                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Inventario</Typography>
                                        </div>
                                        <div className="flex flex-col font-medium gap-1 ml-2">
                                            <Link href={route('products.index')}><ListItem className={itemClasses('products.*')} onClick={() => setIsSidebarOpen(false)}><CubeIcon className="h-4 w-4" /> Productos</ListItem></Link>
                                            <Link href={route('inventory-movements.index')}><ListItem className={itemClasses('inventory-movements.*')} onClick={() => setIsSidebarOpen(false)}><ArrowsRightLeftIcon className="h-4 w-4" /> Movimientos</ListItem></Link>
                                            <Link href={route('purchases.index')}><ListItem className={itemClasses('purchases.*')} onClick={() => setIsSidebarOpen(false)}><ShoppingCartIcon className="h-4 w-4" /> Compras</ListItem></Link>
                                        </div>
                                    </div>
                                )}

                                {/* 4. LOGÍSTICA */}
                                {auth.user.role === 'admin' && (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 px-3 mb-2">
                                            <TruckIcon className="h-4 w-4 text-indigo-400" />
                                            <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Logística</Typography>
                                        </div>
                                        <div className="flex flex-col font-medium gap-1 ml-2">
                                            <Link href={route('routes.index')}><ListItem className={itemClasses('routes.*')} onClick={() => setIsSidebarOpen(false)}><MapIcon className="h-4 w-4" /> Rutas</ListItem></Link>
                                            <Link href={route('trips.index')}><ListItem className={itemClasses('trips.*')} onClick={() => setIsSidebarOpen(false)}><MapPinIcon className="h-4 w-4" />Crear Viajes</ListItem></Link>
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
                            </>
                        )}

                        {/* 🌟 6. SISTEMA / SUSCRIPCIÓN */}
                        {auth.user.role === 'admin' && (
                            <div className="flex flex-col mt-4"> {/* mt-4 para darle separación del bloque de arriba */}
                                <div className="flex items-center gap-2 px-3 mb-2">
                                    <CreditCardIcon className="h-4 w-4 text-indigo-400" />
                                    <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Facturación</Typography>
                                </div>
                                <div className="flex flex-col font-medium gap-1 ml-2">
                                    <Link href={route('subscription.index')}>
                                        <ListItem
                                            className={itemClasses('subscription.*')}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <CreditCardIcon className="h-4 w-4" /> Mi Suscripción
                                        </ListItem>
                                    </Link>
                                </div>
                            </div>
                        )}


                        {/* --- BLOQUE: EMPLEADO --- */}
                        {auth.user.role === 'empleado' && (
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 px-3 mb-2">
                                    <ShoppingBagIcon className="h-4 w-4 text-indigo-400" />
                                    <Typography variant="small" className="uppercase tracking-wider text-blue-gray-800 text-xs font-bold">Operación</Typography>
                                </div>
                                <div className="flex flex-col font-medium gap-1 ml-2">
                                    <Link href={route('repartidor.sales.index')}>
                                        <ListItem className={itemClasses('repartidor.sales.*')} onClick={() => setIsSidebarOpen(false)}>
                                            <ClipboardDocumentListIcon className="h-4 w-4" /> Pedidos
                                        </ListItem>
                                    </Link>
                                    <Link href={route('repartidor.trips.index')}>
                                        <ListItem className={itemClasses('repartidor.trips.*')} onClick={() => setIsSidebarOpen(false)}>
                                            <MapIcon className="h-4 w-4" /> Mis Rutas
                                        </ListItem>
                                    </Link>

                                    {/* 🔑 LINK OPTIMIZADO PARA EL REPARTIDOR */}
                                    <Link href={route('repartidor.shifts.index')}>
                                        <ListItem className={itemClasses('repartidor.shifts.*')} onClick={() => setIsSidebarOpen(false)}>
                                            <ClockIcon className="h-4 w-4" /> Historial Cierres
                                        </ListItem>
                                    </Link>
                                    <Link href={route('repartidor.sales.index')}>
                                        <ListItem
                                            className={itemClasses('repartidor.sales.*')}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <DocumentTextIcon className="h-4 w-4" />
                                            Historial Ventas
                                        </ListItem>
                                    </Link>

                                    <Link href={route('repartidor.expenses.create', 1)}>
                                        <ListItem className={itemClasses('repartidor.expenses.*')} onClick={() => setIsSidebarOpen(false)}>
                                            <BanknotesIcon className="h-4 w-4" /> Gastos de Viaje
                                        </ListItem>
                                    </Link>
                                    <Link href={route('repartidor.shifts.close')}>
                                        <ListItem className={itemClasses('repartidor.shifts.close')} onClick={() => setIsSidebarOpen(false)}>
                                            <LockClosedIcon className="h-4 w-4" /> Cierre de Caja
                                        </ListItem>
                                    </Link>
                                </div>
                            </div>
                        )}
                        <hr className="my-4 border-gray-200" />

                        {/* --- OPCIONES GENERALES --- */}
                        <div className="space-y-1">
                            <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>
                                <ListItemPrefix><InboxIcon className="h-5 w-5 text-indigo-400" /></ListItemPrefix>
                                <Typography className="mr-auto font-medium">Mensajes</Typography>
                                <ListItemSuffix><Chip value="14" size="sm" variant="ghost" color="indigo" className="rounded-full" /></ListItemSuffix>
                            </ListItem>

                            <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>
                                <ListItemPrefix><SparklesIcon className="h-5 w-5 text-indigo-400" /></ListItemPrefix>
                                <Typography className="mr-auto font-medium">Plan</Typography>
                                <ListItemSuffix><Chip value="3" size="sm" variant="ghost" color="indigo" className="rounded-full" /></ListItemSuffix>
                            </ListItem>

                            <Link href={route('profile.edit')} className="w-full">
                                <ListItem className={`p-3 rounded-lg ${isActive('profile.*') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setIsSidebarOpen(false)}>
                                    <ListItemPrefix><UserCircleIcon className={`h-5 w-5 ${isActive('profile.*') ? 'text-indigo-700' : 'text-gray-500'}`} /></ListItemPrefix>
                                    <Typography className="font-medium">Mi Perfil</Typography>
                                </ListItem>
                            </Link>

                            <ListItem className="p-3 rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setIsSidebarOpen(false)}>
                                <ListItemPrefix><Cog6ToothIcon className="h-5 w-5 text-gray-500" /></ListItemPrefix>
                                <Typography className="font-medium">Ajustes</Typography>
                            </ListItem>

                            <Link href={route('logout')} method="post" as="button" className="w-full mt-4">
                                <ListItem className="p-3 rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 active:bg-red-100">
                                    <ListItemPrefix><PowerIcon className="h-5 w-5 text-red-500" /></ListItemPrefix>
                                    <Typography className="font-medium">Cerrar Sesión</Typography>
                                </ListItem>
                            </Link>
                        </div>
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

            <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-gray-50/50">
                <header className="bg-white shadow-sm border-b border-gray-200 z-10 shrink-0">
                    <div className="px-4 py-4 flex justify-between items-center lg:px-8">
                        <div className="flex items-center gap-4">
                            <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                                <Bars3Icon className="h-6 w-6" strokeWidth={2} />
                            </IconButton>
                            <div className="hidden sm:block">{header}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-gray-800">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-500 capitalize font-medium mt-0.5">{user.role.replace('_', ' ')}</div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* MODAL UNIFICADO */}
            <Modal show={alertData.show} onClose={closeAlert} maxWidth="sm">
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-5 border ${currentAlert.iconBg}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-8 h-8 ${currentAlert.iconText}`}>
                                {currentAlert.iconPath}
                            </svg>
                        </div>
                        <Typography variant="h4" color="blue-gray" className="mb-2 font-bold">
                            {currentAlert.title}
                        </Typography>
                        {alertData.message && (
                            <Typography color="gray" className="font-normal mb-6 text-md">
                                {alertData.message}
                            </Typography>
                        )}
                        <Button color={currentAlert.btnColor} onClick={closeAlert} className="w-auto px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                            {currentAlert.btnText}
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
