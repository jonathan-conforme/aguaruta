import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Typography, Button } from "@material-tailwind/react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Política de Privacidad - AquaRuta" />

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Encabezado */}
                <div className="border-b border-gray-100 pb-6 mb-6 text-center sm:text-left">
                    <Typography variant="h3" color="blue-gray" className="font-bold">
                        Política de Privacidad y Protección de Datos
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                        Cumplimiento LOPD Ecuador · Última actualización: Junio 2026
                    </Typography>
                </div>

                {/* Cuerpo del Documento */}
                <div className="space-y-6 text-gray-700 leading-relaxed text-sm">

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            1. Responsable del Tratamiento
                        </Typography>
                        <p>
                            El ecosistema digital **AquaRuta** (en adelante, "La Plataforma"), es responsable del tratamiento de los datos personales recopilados, garantizando su correcta custodia de acuerdo con la **Ley Orgánica de Protección de Datos Personales (LOPD) de Ecuador**. Para cualquier consulta legal, puede contactarnos en <span className="text-indigo-600 font-medium">soporte@aquaruta.com</span>.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            2. Recopilación Justa y Finalidad de los Datos
                        </Typography>
                        <p>
                            AquaRuta recopila y procesa únicamente la información estrictamente necesaria para la correcta prestación del servicio de gestión logística: nombres de empleados, datos de facturación, geolocalización de clientes para la optimización de rutas, catálogos de productos e historial de cierres de caja. La finalidad exclusiva es la ejecución del servicio de software contratado.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            3. Privacidad Absoluta de Datos Comerciales
                        </Typography>
                        <p>
                            Reconocemos el valor estratégico de su cartera de clientes y métricas de venta. **AquaRuta no vende, no arrienda, ni comparte bajo ningún concepto la información comercial de su negocio con terceros**, salvo por requerimiento expreso de una autoridad judicial competente en el marco de la ley ecuatoriana. Toda la información almacenada es propiedad exclusiva de su empresa.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            4. Evidencia Digital de Consentimiento e Integridad
                        </Typography>
                        <p>
                            Para garantizar la transparencia y validez jurídica ante la Superintendencia de Protección de Datos, AquaRuta registra de forma inalterable el momento de la aceptación de estos términos. Este registro actúa como firma electrónica simplificada, asociando la confirmación con la fecha, hora exacta e IP del dispositivo del usuario.
                        </p>
                    </section>

                    <section>
                        <Typography variant="h5" color="blue-gray" className="font-semibold mb-2">
                            5. Derechos del Titular (ARCO+) y Conservación
                        </Typography>
                        <p>
                            Como titular de los datos, usted y sus usuarios pueden ejercer en cualquier momento sus derechos de **Acceso, Rectificación, Eliminación y Oposición** enviando una solicitud formal a nuestro correo de soporte. Los datos de su negocio se conservarán mientras se mantenga vigente la relación comercial o durante los plazos exigidos por las normativas fiscales de Ecuador (SRI).
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
