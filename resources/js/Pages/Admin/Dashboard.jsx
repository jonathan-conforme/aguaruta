
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// ÍCONOS DE MATERIAL UI (Asegúrate de tenerlos instalados, o puedes cambiarlos por SVG)
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

export default function Dashboard(props) {
    // Función de prueba para que el botón no dé error
    const handleQuickAction = () => {
        alert("Esta es una acción de prueba. El módulo está en desarrollo.");
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Control</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* ⚠️ BANNER: PÁGINA EN DESARROLLO */}
                    <div className="relative overflow-hidden bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="absolute -right-10 -top-10 text-amber-100 pointer-events-none opacity-50">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 120 }} />
                        </div>
                        
                        <div className="flex items-start space-x-3.5 z-10">
                            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm mt-0.5 flex items-center justify-center">
                                <WarningAmberOutlinedIcon fontSize="small" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">Módulo en Fase de Desarrollo</h4>
                                <p className="text-sm text-slate-600 mt-0.5 max-w-xl">
                                    Estamos construyendo este apartado para ti. Si necesitas asistencia, reportar un inconveniente o requieres soporte técnico, comunícate directamente con el desarrollador del sistema.
                                </p>
                            </div>
                        </div>

                      <div className="z-10 flex sm:justify-end">
    <a 
        href="https://wa.me/593980659712?text=Hola%20Jonathan%20conforme,%20necesito%20asistencia%20con%20el%20sistema%20de%20gestión." 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
    >
        Contactar al Desarrollador
    </a>
</div>
                    </div>

                    {/* 📊 TARJETAS DE ESTADÍSTICAS (DATOS FICTICIOS) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        
                        {/* Tarjeta 1 */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades Registradas</span>
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">Total</div>
                            </div>
                            <div className="flex items-baseline space-x-2 mt-3">
                                <span className="text-2xl font-black text-slate-900">150</span>
                                <span className="text-xs text-slate-400">Vehículos activos</span>
                            </div>
                        </div>

                        {/* Tarjeta 2 */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes de Pago</span>
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold">Alertas</div>
                            </div>
                            <div className="flex items-baseline space-x-2 mt-3">
                                <span className="text-2xl font-black text-slate-900">12</span>
                                <span className="text-xs text-rose-600 font-medium">Requieren atención</span>
                            </div>
                        </div>

                        {/* Tarjeta 3 */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Balance Mensual</span>
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Finanzas</div>
                            </div>
                            <div className="flex items-baseline space-x-2 mt-3">
                                <span className="text-2xl font-black text-slate-900">$3,450.00</span>
                                <span className="text-xs text-slate-400">Corte actual</span>
                            </div>
                        </div>
                    </div>

                    {/* 📑 SECCIONES Y APARTADOS DEL DASHBOARD */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Apartado Izquierdo: Accesos Rápidos */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                                <h3 className="font-bold text-slate-900 text-base">Accesos Directos</h3>
                                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold uppercase tracking-widest px-2 py-0.5 rounded">Módulos</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4">
                                Atajos rápidos a las operaciones principales del sistema:
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button 
                                    onClick={handleQuickAction}
                                    className="flex items-center space-x-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
                                >
                                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                        <AddOutlinedIcon fontSize="small"/>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-800">Nueva Operación</span>
                                        <span className="text-[11px] text-slate-400">Registrar datos</span>
                                    </div>
                                </button>
                                
                                <div className="flex items-center space-x-3 p-3 rounded-xl border border-dashed border-slate-200 text-left opacity-60">
                                    <div className="p-2 bg-slate-300 text-white rounded-lg">
                                        <DescriptionOutlinedIcon fontSize="small"/>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-600">Reportes</span>
                                        <span className="text-[11px] text-slate-400">Próximamente...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apartado Derecho: Estado del Sistema */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                                    <h3 className="font-bold text-slate-900 text-base">Información de la Plataforma</h3>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-xs font-bold text-slate-500">Entorno local</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Este sistema utiliza una arquitectura SPA moderna basada en <strong>Inertia.js</strong>, <strong>React</strong> y un backend robusto en <strong>Laravel</strong>.
                                </p>
                            </div>
                            
                            <div className="text-xs text-slate-400 font-mono mt-6 pt-4 border-t border-slate-50 flex justify-between">
                                <span>Versión del Software: Beta 1.0.0</span>
                                <span>Año: {new Date().getFullYear()}</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}