import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Typography } from "@material-tailwind/react";
import { BanknotesIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";

export default function CreateShift() {
    const { data, setData, post, processing, errors, } = useForm({
        initial_cash: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('repartidor.shifts.store'));
    };

    // Botones de acceso rápido para evitar teclear en móvil
    const quickAmounts = [0, 20, 50, 100];

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2 text-gray-800">
                    <RocketLaunchIcon className="h-6 w-6 text-indigo-500" />
                    Apertura de Turno
                </Typography>
            }
        >
            <Head title="Abrir Caja" />

            <div className="py-8">
                <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6 border border-gray-100">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-50 mb-4">
                                <BanknotesIcon className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800">
                                ¿Con cuánto efectivo inicias?
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Ingresa la base para dar cambios hoy</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* BOTONES RÁPIDOS */}
                            <div className="grid grid-cols-4 gap-2">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => setData('initial_cash', amount)}
                                        className={`py-3 px-1 border-2 rounded-xl text-lg font-bold transition-all ${
                                            parseFloat(data.initial_cash) === amount
                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-sm' 
                                                : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            {/* INPUT MANUAL GIGANTE */}
                            <div>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-2xl font-bold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="block w-full pl-10 pr-4 py-4 rounded-xl border-gray-300 bg-gray-50 text-center text-4xl font-black text-gray-800 shadow-inner focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-300"
                                        placeholder="0.00"
                                        value={data.initial_cash}
                                        onChange={(e) => setData('initial_cash', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.initial_cash && <span className="text-red-500 text-sm font-medium mt-2 block text-center">{errors.initial_cash}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || data.initial_cash === ''}
                                className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors text-lg"
                            >
                                {processing ? 'Abriendo...' : 'Abrir Caja y Empezar Turno'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}