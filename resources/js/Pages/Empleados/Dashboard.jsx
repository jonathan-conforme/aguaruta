import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Alert, Typography } from "@material-tailwind/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
    const { auth } = usePage().props;

    // 🌟 Si password_changed es false (0), significa que NO la ha cambiado y se muestra la alerta
    const mostrarAlerta = !auth.user.password_changed;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard Repartidor
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* LA ALERTA SÓLO APARECE SI NO HA CAMBIADO LA CONTRASEÑA */}
                {mostrarAlerta && (
                    <Alert
                        color="blue"
                        variant="gradient"
                        icon={<ShieldCheckIcon className="h-6 w-6 text-white" />}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md w-full"
                    >
                        <div className="flex flex-col">
                            <Typography variant="h6" className="text-white font-bold mb-0.5">
                                ¡Aviso de Seguridad!
                            </Typography>
                            <Typography variant="small" className="text-white/90 font-normal">
                                Si es tu primera vez en el sistema, te recomendamos cambiar tu contraseña por defecto . Puedes hacerlo desde el menú lateral en la sección de <strong>"Mi Perfil"</strong>.
                            </Typography>
                        </div>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* El resto de tus componentes del dashboard */}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
