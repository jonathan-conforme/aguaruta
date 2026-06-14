import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input } from "@material-tailwind/react"; // 👈 Aprovechamos Material Tailwind

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="w-full max-w-md mx-auto">
                {/* Header del Login */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">AguaRuta</h2>
                    <p className="text-sm text-gray-600">Ingresa tus credenciales para acceder al panel.</p>
                </div>

                {/* Mensaje de estado (como el de cuenta inactiva) */}
                {status && (
                    <div className="mb-6 p-4 text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Campo de Correo / Cédula */}
                    <div>
                        <Input
                            type="text"
                            label="Correo Electrónico o Cédula"
                            size="lg"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={Boolean(errors.email)}
                            autoComplete="username"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <Input
                            type="password"
                            label="Contraseña"
                            size="lg"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={Boolean(errors.password)}
                            autoComplete="current-password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Fila de Recordarme y Olvidé mi clave */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Recordarme
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    {/* Botón de Acción Principal con Spinner */}
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
                                Cargando...
                            </>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}