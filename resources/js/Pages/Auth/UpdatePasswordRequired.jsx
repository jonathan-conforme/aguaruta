import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Button, Input, Typography } from "@material-tailwind/react";



// Iconos de Material UI (Importaciones directas seguras para Vite)
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlined from '@mui/icons-material/LockOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';

export default function UpdatePasswordRequired() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
        accepted_terms: false,    // Requerido para auditoría LOPD
        accepted_privacy: false,  // Requerido para auditoría LOPD
    });


    // Estados para visibilidad de contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reglas dinámicas de seguridad para la contraseña
    const passwordRequirements = [
        { label: 'Mínimo 8 caracteres', test: (pwd) => pwd.length >= 8 },
        { label: 'Una letra mayúscula', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'Un número', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'Un carácter especial (@, $, !, etc.)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
    ];

    const metRequirements = passwordRequirements.filter(req => req.test(data.password)).length;
    const isPasswordValid = metRequirements === passwordRequirements.length;

    const isFormValid = isPasswordValid && data.accepted_terms && data.accepted_privacy;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.change.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Actualizar Contraseña" />

            <div className="w-full max-w-md mx-auto">
                {/* Cabecera */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">AquaRuta</h2>
                    <p className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 inline-block">
                        Actualización obligatoria de seguridad
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Por favor, cambia tu contraseña temporal para poder activar tu cuenta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campo: Nueva Contraseña */}
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Nueva Contraseña"
                            size="lg"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
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

                        {/* Medidor visual de seguridad en tiempo real */}
                        {data.password && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200 animate-fadeIn">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Requisitos de seguridad:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {passwordRequirements.map((req, idx) => {
                                        const isMet = req.test(data.password);
                                        return (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                {isMet ? (
                                                    // Cambiado de CheckCircleOutline a CheckCircle
                                                    <CheckCircle className="text-green-500 !w-4 !h-4" />
                                                ) : (
                                                    // CAMBIADO AQUÍ: De HighlightOff a Cancel (Esto quitará el error)
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
                            error={Boolean(errors.password_confirmation)}
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
                    </div>

                    {/* ⚖️ NUEVA SECCIÓN: Consentimiento Obligatorio LOPD Ecuador */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        <Typography variant="small" color="blue-gray" className="font-bold border-b border-gray-200 pb-1.5">
                            Acuerdos Legales Obligatorios
                        </Typography>

                        <div className="flex flex-col gap-3">
                            {/* Checkbox de Términos */}
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    required
                                    checked={data.accepted_terms}
                                    onChange={(e) => setData('accepted_terms', e.target.checked)}
                                    className="w-4 h-4 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <Typography variant="small" color="gray" className="font-normal text-xs leading-tight">
                                    He leído y acepto voluntariamente los <a href="/terminos" target="_blank" className="text-indigo-600 underline font-semibold hover:text-indigo-800">Términos y Condiciones de Uso</a> del ecosistema AquaRuta.
                                </Typography>
                            </label>
                            <InputError message={errors.accepted_terms} />

                            {/* Checkbox de Privacidad */}
                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    required
                                    checked={data.accepted_privacy}
                                    onChange={(e) => setData('accepted_privacy', e.target.checked)}
                                    className="w-4 h-4 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                />
                                <Typography variant="small" color="gray" className="font-normal text-xs leading-tight">
                                    Autorizo explícitamente el tratamiento de mis datos comerciales y personales bajo la <a href="/privacidad" target="_blank" className="text-indigo-600 underline font-semibold hover:text-indigo-800">Política de Privacidad</a> (Cumplimiento LOPD Ecuador).
                                </Typography>
                            </label>
                            <InputError message={errors.accepted_privacy} />
                        </div>
                    </div>

                    {/* Botón con Spinner */}
                    <Button
                        type="submit"
                        color="indigo"
                        fullWidth
                        size="lg"
                        disabled={processing || !isPasswordValid}
                        className="flex justify-center items-center gap-2"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Procesando...
                            </>
                        ) : (
                            "Activar Cuenta"
                        )}
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
