import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Typography } from "@material-tailwind/react";
import { LockClosedIcon, BanknotesIcon, CreditCardIcon, ArchiveBoxIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function Close({ closureData }) {
    const { data, setData, post, processing, errors } = useForm({
        final_cash: '',
    });

    // Calcular diferencia en tiempo real
    const difference = data.final_cash !== ''
        ? parseFloat(data.final_cash) - closureData.expected_cash
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('repartidor.shifts.storeClosure'));
    };

    return (
        <AuthenticatedLayout
            header={
                <Typography variant="h5" className="flex items-center gap-2 text-gray-800">
                    <LockClosedIcon className="h-6 w-6 text-red-500" />
                    Corte de Caja Definitivo
                </Typography>
            }
        >
            <Head title="Corte de Caja" />

            <div className="max-w-4xl mx-auto p-4 space-y-6">

                {/* FILA SUPERIOR: Resumen de Dinero */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Tarjeta de Ventas Digitales */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2 border-b pb-2">
                            <CreditCardIcon className="h-5 w-5" /> Digital y Crédito
                        </h3>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600 font-medium">Transferencias:</span>
                            <span className="font-bold text-gray-800">${closureData.sales_summary.transfer.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Crédito (Por cobrar):</span>
                            <span className="font-bold text-gray-800">${closureData.sales_summary.credit.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                            (No incluido en el efectivo a entregar)
                        </p>
                    </div>

                    {/* Tarjeta de Efectivo (Lo que el chofer debe entregar) */}
                    <div className="bg-emerald-50 p-5 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="text-sm font-bold text-emerald-700 uppercase mb-4 flex items-center gap-2 border-b border-emerald-200 pb-2">
                            <BanknotesIcon className="h-5 w-5" /> Resumen de Efectivo
                        </h3>
                        <div className="flex justify-between mb-2">
                            <span className="text-emerald-800 font-medium">Efectivo Inicial (Base):</span>
                            <span className="font-bold text-emerald-900">${parseFloat(closureData.initial_cash).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-3 border-b border-emerald-200 border-dashed pb-3">
                            <span className="text-emerald-800 font-medium">Ventas en Efectivo:</span>
                            <span className="font-bold text-emerald-900">${closureData.sales_summary.cash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600 mb-2">
                            <span className="text-emerald-800 font-medium">Gasto de viaje:</span>
                            <span className="font-bold text-emerald-900">- ${parseFloat(closureData.expenses).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-end mt-2 bg-white/50 p-3 rounded-xl">
                            <span className="font-bold text-emerald-900">Total Esperado:</span>
                            <span className="text-3xl font-black text-emerald-700 leading-none">${closureData.expected_cash.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* FILA DEL MEDIO: Resumen de Inventario */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-indigo-500 uppercase mb-4 flex items-center gap-2 border-b pb-2">
                        <ArchiveBoxIcon className="h-5 w-5" /> Resumen de Inventario
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Productos Vendidos</p>
                            <ul className="space-y-1.5">
                                {closureData.inventory_summary.products_sold.map((product) => (
                                    <li key={product.product_id} className="flex justify-between text-sm bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <span className="font-medium text-gray-700">{product.name}</span>
                                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">x{product.quantity}</span>
                                    </li>
                                ))}
                                {closureData.inventory_summary.products_sold.length === 0 && (
                                    <li className="text-sm text-gray-400 bg-gray-50 p-3 rounded-lg text-center">No hay ventas registradas.</li>
                                )}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                            <span className="text-indigo-800 font-bold text-sm uppercase mb-2 text-center">Envases Recuperados</span>
                            <span className="text-5xl font-black text-indigo-600 drop-shadow-sm">
                                {closureData.inventory_summary.recovered_bottles}
                            </span>
                        </div>
                    </div>
                </div>

                {/* FILA INFERIOR: Formulario de Cierre */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
                    <label className="block text-center text-lg font-black text-gray-800 mb-4">
                        ¿Cuánto dinero físico vas a entregar?
                    </label>

                    <div className="relative mb-6 max-w-md mx-auto">

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            className="block w-full rounded-2xl border-2 border-gray-200 bg-white py-6 text-center text-5xl font-black text-gray-900 shadow focus:border-indigo-500 focus:ring-indigo-500 transition"
                            placeholder="0.00"
                            value={data.final_cash}
                            onChange={e => setData('final_cash', e.target.value)}
                        />

                        <div className="absolute top-2 left-4 text-gray-400 text-lg font-bold">
                            USD
                        </div>

                    </div>
                    {errors.final_cash && <span className="text-red-500 text-sm font-bold block text-center mb-4">{errors.final_cash}</span>}

                    {/* Alerta de Diferencia (Solo se muestra si ha escrito algo) */}
                    {data.final_cash !== '' && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center justify-center gap-3 border-2 transition-all ${difference === 0 ? 'bg-green-50 border-green-200 text-green-700'
                            : difference < 0 ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            }`}>
                            {difference === 0 && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                            {difference !== 0 && <ExclamationTriangleIcon className={`h-6 w-6 ${difference < 0 ? 'text-red-500' : 'text-yellow-500'}`} />}

                            <p className="font-black text-lg">
                                {difference === 0 && '¡Caja cuadrada a la perfección!'}
                                {difference < 0 && `Faltante de: $${Math.abs(difference).toFixed(2)}`}
                                {difference > 0 && `Sobrante de: $${difference.toFixed(2)}`}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || data.final_cash === ''}
                        className="w-full bg-red-600 text-white font-black py-4 px-4 rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors text-xl flex items-center justify-center gap-2 shadow-sm"
                    >
                        <LockClosedIcon className="h-6 w-6" />
                        {processing ? 'Procesando Cierre...' : 'Confirmar Cierre de Caja'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}