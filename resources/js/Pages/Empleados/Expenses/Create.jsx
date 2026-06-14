import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import {
    CurrencyDollarIcon,
    TruckIcon,
    FireIcon,
    WrenchScrewdriverIcon,
    CakeIcon,
    EllipsisHorizontalCircleIcon,
    ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/solid";

export default function Create({ shift }) {

    const { data, setData, post, processing, errors } = useForm({
        shift_id: shift.id,
        amount: '',
        category: 'fuel',
        description: ''
    });

    const categories = [
        { value: 'fuel', label: 'Combustible', icon: FireIcon, color: 'text-red-500' },
        { value: 'toll', label: 'Peaje', icon: TruckIcon, color: 'text-blue-500' },
        { value: 'repair', label: 'Reparación', icon: WrenchScrewdriverIcon, color: 'text-yellow-600' },
        { value: 'food', label: 'Comida', icon: CakeIcon, color: 'text-green-500' },
        { value: 'other', label: 'Otro', icon: EllipsisHorizontalCircleIcon, color: 'text-gray-500' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('repartidor.expenses.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Registrar Gasto" />

            <div className="max-w-lg mx-auto p-6">

                {/* HEADER */}
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-2">
                        <CurrencyDollarIcon className="h-7 w-7 text-indigo-600" />
                        Registrar Gasto
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Caja #{shift.id}
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5 bg-white p-5 rounded-2xl shadow-sm border">

                    {/* MONTO */}
                    <div>
                        <label className="text-sm font-bold text-gray-600">Monto</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="$0.00"
                            value={data.amount}
                            onChange={e => setData('amount', e.target.value)}
                            className="w-full mt-1 border rounded-xl p-3 text-lg font-bold focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                    </div>

                    {/* CATEGORÍAS VISUALES */}
                    <div>
                        <label className="text-sm font-bold text-gray-600 mb-2 block">
                            Categoría
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                const active = data.category === cat.value;

                                return (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setData('category', cat.value)}
                                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all
                                            ${active 
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                                                : 'bg-white hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 ${cat.color}`} />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div>
                        <label className="text-sm font-bold text-gray-600">
                            Descripción (opcional)
                        </label>

                        <div className="relative mt-1">
                            <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                            <textarea
                                placeholder="Ej: gasolina en la estación..."
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full pl-10 border rounded-xl p-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* BOTÓN */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <CurrencyDollarIcon className="h-5 w-5" />
                        {processing ? 'Guardando...' : 'Guardar Gasto'}
                    </button>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}