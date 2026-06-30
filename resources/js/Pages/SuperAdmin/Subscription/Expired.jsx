import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Card,
    Typography
} from "@material-tailwind/react";

export default function Expired() {
    const [openPrecios, setOpenPrecios] = useState(false);

    const handleOpenPrecios = () => setOpenPrecios(!openPrecios);

    // 📞 CONFIGURA AQUÍ TUS DATOS DE SOPORTE
    const WHATSAPP_SOPORTE = "593987654321"; // Reemplaza con tu número de Ecuador (sin el +)
    const mensajeWpp = encodeURIComponent("Hola, mi suscripción ha vencido y me gustaría renovar mi plan.");

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 text-center max-w-lg w-full">

                {/* Icono de Alerta */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Tu suscripción ha vencido
                </h1>

                <p className="text-gray-600 mb-8">
                    Para seguir gestionando tu planta purificadora y disfrutar de todas las herramientas, necesitas renovar tu plan.
                </p>

                {/* Botones de Acción Principal */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <Button
                        color="indigo"
                        size="lg"
                        className="flex-1"
                        onClick={handleOpenPrecios}
                    >
                        Ver Planes de Precios
                    </Button>

                    <Button
                        variant="outlined"
                        color="green"
                        size="lg"
                        className="flex-1 flex items-center justify-center gap-2"
                        onClick={() => window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWpp}`, '_blank')}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.301-.15-1.779-.877-2.053-.976-.275-.1-.475-.15-.675.15-.199.302-.775.976-.951 1.176-.174.2-.35.226-.651.076-.301-.15-1.268-.467-2.416-1.492-.893-.795-1.496-1.778-1.671-2.078-.175-.3-.018-.463.132-.612.135-.133.301-.352.451-.527.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.526-.075-.15-.675-1.625-.925-2.225-.244-.582-.493-.503-.675-.512-.174-.01-.374-.012-.574-.012s-.525.075-.8.375c-.275.3-1.05 1.026-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.115 3.228 5.124 4.532.715.311 1.273.497 1.708.635.72.228 1.374.196 1.892.119.577-.085 1.779-.726 2.029-1.426.25-.7.25-1.3.175-1.426-.076-.125-.276-.2-.576-.35z"/></svg>
                        WhatsApp Soporte
                    </Button>
                </div>

                {/* Enlace secundario */}
                <button
                    onClick={() => router.visit('/login')}
                    className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors underline"
                >
                    Volver al Inicio / Salir
                </button>
            </div>

            {/* 💰 MODAL DE PLANES Y PRECIOS */}
            <Dialog open={openPrecios} handler={handleOpenPrecios} size="md">
                <DialogHeader className="justify-center text-2xl font-bold text-gray-900">
                    Nuestros Planes
                </DialogHeader>
                <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Plan Básico */}
                    <Card className="p-6 border border-gray-200 shadow-none">
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Plan Básico
                        </Typography>
                        <Typography variant="h3" color="indigo" className="mb-4">
                            $25<span className="text-sm text-gray-600">/mes</span>
                        </Typography>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>✓ Hasta 5 Empleados</li>
                            <li>✓ Gestión de Clientes</li>
                            <li>✓ Soporte por Correo</li>
                        </ul>
                    </Card>

                    {/* Plan Pro */}
                    <Card className="p-6 border-2 border-indigo-500 shadow-none relative">
                        <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                            RECOMENDADO
                        </span>
                        <Typography variant="h5" color="blue-gray" className="mb-2">
                            Plan Pro
                        </Typography>
                        <Typography variant="h3" color="indigo" className="mb-4">
                            $45<span className="text-sm text-gray-600">/mes</span>
                        </Typography>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>✓ Empleados Ilimitados</li>
                            <li>✓ Facturación y Rutas</li>
                            <li>✓ Soporte Prioritario 24/7</li>
                        </ul>
                    </Card>

                </DialogBody>
                <DialogFooter className="justify-center gap-2">
                    <Button variant="outlined" color="red" onClick={handleOpenPrecios}>
                        Cerrar
                    </Button>
                    <Button color="green" onClick={() => window.open(`https://wa.me/${WHATSAPP_SOPORTE}?text=${mensajeWpp}`, '_blank')}>
                        Pagar Ahora
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
