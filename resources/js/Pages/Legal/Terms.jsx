import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Typography, Button } from "@material-tailwind/react";

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Términos y Condiciones - AquaRuta" />

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Encabezado */}
                <div className="border-b border-gray-100 pb-6 mb-6 text-center sm:text-left">
                    <Typography variant="h3" color="blue-gray" className="font-bold">
                        Términos y Condiciones de Uso
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                        Acuerdo de Licencia de Software (SaaS) · Última actualización: Junio 2026
                    </Typography>
                </div>

                {/* Cuerpo del Documento */}
                <div className="space-y-6 text-gray-700 leading-relaxed text-sm">

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            1. Objeto del Servicio
                        </Typography>
                        <p>
                            El presente documento regula el acceso y uso de **AquaRuta**, una plataforma de software como servicio (SaaS) diseñada para la gestión logística, optimización de rutas de distribución y control de puntos de venta (POS) para purificadoras de agua. Al activar una cuenta, su empresa acepta estos términos en su totalidad.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            2. Uso Correcto de la Plataforma y Cuentas
                        </Typography>
                        <p>
                            El cliente es responsable exclusivo de la veracidad de los datos ingresados y del uso confidencial de las credenciales de acceso asignadas a sus administradores y repartidores. Queda estrictamente prohibido el uso del sistema para fines ilícitos, ingeniería inversa del software o cualquier acción que comprometa la estabilidad de los servidores.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            3. Planes, Suscripciones y Pagos
                        </Typography>
                        <p>
                            AquaRuta opera bajo un modelo de suscripción periódica. El acceso a las funciones de administración, reportes y rutas del repartidor dependerá de mantener el plan comercial activo. El impago del servicio facultará a La Plataforma a redirigir el sistema a la vista de <span className="italic font-medium">suscripción vencida</span> y suspender temporalmente el uso de las aplicaciones móviles y de escritorio.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            4. Limitación de Responsabilidad Logística
                        </Typography>
                        <p>
                            AquaRuta provee herramientas tecnológicas para optimizar operaciones (cálculo de viajes, gastos y turnos), pero no se hace responsable por pérdidas económicas derivadas de malas prácticas de los empleados, fallos de conectividad celular de los transportistas en ruta, o decisiones comerciales tomadas con base en los reportes generados.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            5. Propiedad Intelectual y Modificaciones
                        </Typography>
                        <p>
                            Todos los derechos de propiedad intelectual sobre el código fuente, diseño de interfaces, logotipos y la marca AquaRuta pertenecen exclusivamente a sus creadores. Nos reservamos el derecho de actualizar las funciones del software y modificar estos términos para adaptarlos a mejoras técnicas o nuevas normativas legales en Ecuador, notificando previamente a los administradores del sistema.
                        </p>
                    </section>

                </div>

                {/* Botón de Retorno */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <Link href="/">
                        <Button color="indigo" size="md" variant="gradient">
                            Entendido, Volver
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
