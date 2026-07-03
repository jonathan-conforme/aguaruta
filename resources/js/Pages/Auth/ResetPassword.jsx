import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Componentes de Material Tailwind
import { Button, Input } from "@material-tailwind/react";

// Iconos de Material UI (Importación segura y optimizada)
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // Estados para controlar la visibilidad de los campos de contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reglas dinámicas de seguridad para la nueva contraseña
    const passwordRequirements = [
        { label: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
        { label: 'Una letra mayúscula', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Un número', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'Un carácter especial (@, $, !, etc.)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
    ];

    const metRequirements = passwordRequirements.filter(req => req.test(data.password)).length;
    const isPasswordValid = metRequirements === passwordRequirements.length;

    // 🔥 NUEVA VALIDACIÓN: ¿Las contraseñas coinciden?
    const passwordsMatch = data.password === data.password_confirmation;
    const hasTypedConfirmation = data.password_confirmation.length > 0;

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña" />

            <div className="w-full max-w-md mx-auto">
                {/* Cabecera */}
                <div className="text-center mb-8">
                      <ApplicationLogo className="mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">AquaRuta</h2>
                    <p className="text-sm text-gray-600">Restablecer Contraseña</p>
                    <p className="text-xs text-gray-500 mt-2">
                        Ingresa tu correo y define tu nueva contraseña segura para recuperar el acceso.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Campo: Correo Electrónico */}
                    <div>
                        <Input
                            type="email"
                            label="Correo Electrónico"
                            size="lg"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={Boolean(errors.email)}
                            autoComplete="username"
                            icon={<EmailOutlined className="text-gray-400 h-5 w-5" />}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Campo: Nueva Contraseña */}
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Nueva Contraseña"
                            size="lg"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
                            autoComplete="new-password"
                            icon={
                                <div
                                    className="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                                </div>
                            }
                        />
                        <InputError message={errors.password} className="mt-2" />

                        {/* Medidor visual de requerimientos de seguridad */}
                        {data.password && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Requisitos de la contraseña:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {passwordRequirements.map((req, idx) => {
                                        const isMet = req.test(data.password);
                                        return (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                {isMet ? (
                                                    <CheckCircle className="text-green-500 !w-4 !h-4" />
                                                ) : (
                                                    <Cancel className="text-gray-400 !w-4 !h-4" />
                                                )}
                                                <span className={`text-xs ${isMet ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Campo: Confirmar Contraseña */}
                    <div>
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            label="Confirmar Contraseña"
                            size="lg"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={Boolean(errors.password_confirmation) || (hasTypedConfirmation && !passwordsMatch)}
                            autoComplete="new-password"
                            icon={
                                <div
                                    className="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                                </div>
                            }
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />

                        {/* 🔥 TEXTO DE COINCIDENCIA EN TIEMPO REAL */}
                        {hasTypedConfirmation && (
                            <div className="mt-2 flex items-center gap-1.5 pl-1">
                                {passwordsMatch ? (
                                    <>
                                        <CheckCircle className="text-green-500 !w-4 !h-4" />
                                        <span className="text-xs text-green-700 font-medium">Las contraseñas coinciden</span>
                                    </>
                                ) : (
                                    <>
                                        <Cancel className="text-red-500 !w-4 !h-4" />
                                        <span className="text-xs text-red-600 font-medium">Las contraseñas no coinciden</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botón de Enviar (Ahora requiere que también coincidan) */}
                    <Button
                        type="submit"
                        color="indigo"
                        fullWidth
                        size="lg"
                        disabled={processing || !isPasswordValid || !passwordsMatch}
                        className="flex justify-center items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Restableciendo...
                            </>
                        ) : (
                            "Restablecer Contraseña"
                        )}
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
