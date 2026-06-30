import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, Link } from '@inertiajs/react';

// Componentes de Material Tailwind
import { Button, Input } from "@material-tailwind/react";

// Iconos de Material UI (Importación directa segura para Vite)
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <div className="w-full max-w-md mx-auto">
                {/* Cabecera del Formulario */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">AquaRuta</h2>
                    <p className="text-sm text-gray-600">¿Olvidaste tu contraseña?</p>
                    <p className="text-xs text-gray-500 mt-2 px-4">
                        No hay problema. Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restaurarla.
                    </p>
                </div>

                {/* Alerta de Éxito (Cuando Laravel envía el correo) */}
                {status && (
                    <div className="mb-6 p-4 text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Campo de Correo Electrónico */}
                    <div>
                        <Input
                            type="email"
                            label="Correo Electrónico"
                            size="lg"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={Boolean(errors.email)}
                            autoComplete="username"
                            icon={
                                <EmailOutlined className="text-gray-400 h-5 w-5" />
                            }
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Botón de Enviar Enlace */}
                    <Button
                        type="submit"
                        color="indigo"
                        fullWidth
                        size="lg"
                        disabled={processing}
                        className="flex justify-center items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Enviando...
                            </>
                        ) : (
                            "Enviar Enlace de Recuperación"
                        )}
                    </Button>

                    {/* Enlace para volver al Login */}
                    <div className="text-center mt-4">
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group"
                        >
                            <ArrowBack className="!w-4 !h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
