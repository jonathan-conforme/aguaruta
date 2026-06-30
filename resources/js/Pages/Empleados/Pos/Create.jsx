import React, { useState, useRef, useEffect } from 'react';
import { useForm, Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Typography, Button } from "@material-tailwind/react";
import { TruckIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function CreateSale({ trip, customers }) {
    const { flash } = usePage().props;

    // 1. ESTADO PARA EL MODAL
    const [showModal, setShowModal] = useState(false);

    // 2. ESTADOS PARA EL BUSCADOR DE CLIENTES
    const [searchCustomer, setSearchCustomer] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        trip_id: trip.id,
        customer_id: '',
        payment_method: 'cash',
        returned_bottles: 0,
        total: 0,
        products: trip.products.map(p => ({
            product_id: p.id,
            name: p.name,
            price: p.price,
            quantity: 0,
            units_per_package: p.units_per_package,
            loaded_quantity: p.pivot?.quantity || 0,
        }))
    });

    const getPresentationLabel = (units) => {
        if (units <= 1) return 'Unidad';
        return `Paca x${units}`;
    };

    // Filtro de clientes basado en búsqueda (Nombre o Identificación)
    const filteredCustomers = customers.filter(customer => {
        const searchTerm = searchCustomer.toLowerCase();
        const matchName = customer.name.toLowerCase().includes(searchTerm);
        const matchIdentification = customer.identification ? String(customer.identification).includes(searchTerm) : false;
        return matchName || matchIdentification;
    });

    // Cerrar el dropdown si se hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleQuantityChange = (index, increment) => {
        const newProducts = [...data.products];
        const currentQty = newProducts[index].quantity;
        const newQty = Math.max(0, currentQty + increment);

        newProducts[index].quantity = newQty;
        const newTotal = newProducts.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        setData({ ...data, products: newProducts, total: newTotal });
    };

    const handleDirectInput = (index, value) => {
        const parsed = parseInt(value);
        const newQty = isNaN(parsed) ? 0 : Math.max(0, parsed);
        const newProducts = [...data.products];
        newProducts[index].quantity = newQty;

        const newTotal = newProducts.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        setData({ ...data, products: newProducts, total: newTotal });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('repartidor.sales.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.error) return;
                if (page.props.errors && Object.keys(page.props.errors).length > 0) return;
                setShowModal(true);
            }
        });
    };

    const handleReset = () => {
        const updatedProducts = data.products.map(p => ({
            ...p,
            loaded_quantity: Number(p.loaded_quantity) - Number(p.quantity),
            quantity: 0
        }));

        setData({
            ...data,
            returned_bottles: 0,
            total: 0,
            products: updatedProducts,
            customer_id: '',
            payment_method: 'cash'
        });

        setSearchCustomer('');
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <Typography variant="h5" className="flex items-center gap-2 text-gray-800">
                        <TruckIcon className="h-6 w-6 text-indigo-500" />
                        Sistema de ventas
                    </Typography>
                    <Button
                        variant="text"
                        color="blue-gray"
                        className="flex items-center gap-2"
                        onClick={() => router.visit(route('repartidor.trips.index'))}
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Volver a Rutas
                    </Button>
                </div>
            }
        >
            <Head title="Registrar Venta" />

            {/* MODAL CENTRADO DE ÉXITO */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">¡Venta Exitosa!</h3>
                        <p className="text-gray-500 mb-8">El cobro de <span className="font-bold text-indigo-600">${data.total.toFixed(2)}</span> ha sido registrado en el sistema.</p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Iniciar Nueva Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto p-4">
                <div className="flex items-center justify-between w-full mb-4">
                    <Typography variant="h5" className="flex items-center gap-2 text-gray-800">
                        <TruckIcon className="h-6 w-6 text-indigo-500" />
                        Nueva Venta - Ruta #{trip.shift_id}
                    </Typography>
                </div>

                {errors.shift && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm">
                        <p className="font-bold">Error de Caja</p>
                        <p>{errors.shift}</p>
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm">
                        <p className="font-bold">Error del Sistema</p>
                        <p>{flash.error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative">

                    {/* 1. BUSCAR CLIENTE */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100" ref={dropdownRef}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">1. Buscar Cliente</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className={`block w-full pl-10 pr-10 py-2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${data.customer_id ? 'bg-indigo-50 font-semibold text-indigo-700' : ''}`}
                                placeholder="Escribe el nombre del cliente..."
                                value={searchCustomer}
                                onChange={(e) => {
                                    setSearchCustomer(e.target.value);
                                    setData('customer_id', '');
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                            />

                            {data.customer_id && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('customer_id', '');
                                        setSearchCustomer('');
                                    }}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <span className="bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white rounded-full p-1 text-xs font-bold w-6 h-6 flex items-center justify-center transition-colors">
                                        ✕
                                    </span>
                                </button>
                            )}

                            {isDropdownOpen && (
                                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map(customer => (
                                            <li
                                                key={customer.id}
                                                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0"
                                                onClick={() => {
                                                    setData('customer_id', customer.id);
                                                    setSearchCustomer(`${customer.name} - ${customer.identification}`);
                                                    setIsDropdownOpen(false);

                                                    // ACTUALIZAR PRECIOS SEGÚN CATEGORÍA
                                                    const updatedProducts = data.products.map(prod => {
                                                        const tripProduct = trip.products.find(p => p.id === prod.product_id);
                                                        let newPrice = tripProduct.price;

                                                        if (tripProduct.customer_categories && customer.customer_category_id) {
                                                            const categoryPrice = tripProduct.customer_categories.find(
                                                                c => c.id === customer.customer_category_id
                                                            );
                                                            if (categoryPrice) {
                                                                newPrice = categoryPrice.pivot.price;
                                                            }
                                                        }

                                                        return { ...prod, price: newPrice };
                                                    });

                                                    const newTotal = updatedProducts.reduce((sum, item) => sum + (item.quantity * item.price), 0);

                                                    setData(prev => ({
                                                        ...prev,
                                                        products: updatedProducts,
                                                        total: newTotal
                                                    }));
                                                }}
                                            >
                                                <span className="block font-medium text-gray-800">{customer.name}</span>
                                                <span className="block text-xs text-gray-500 font-mono mt-0.5">
                                                    C.I / RUC: {customer.identification}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-3 text-gray-500 text-sm">No se encontraron clientes.</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {data.customer_id && (() => {
                            const selectedCustomer = customers.find(c => c.id === data.customer_id);
                            return selectedCustomer?.bottle_debt > 0 && (
                                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
                                    <p className="font-bold">⚠️ El cliente debe {selectedCustomer.bottle_debt} botellón(es)</p>
                                </div>
                            );
                        })()}
                    </div> {/* <-- CORREGIDO: Aquí se cierra correctamente la sección de clientes */}

                    {/* 2. PRODUCTOS */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">2. Productos a entregar</label>
                        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {data.products.map((item, index) => (
                                <div key={item.product_id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 leading-tight">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
                                                {getPresentationLabel(item.units_per_package)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-600 font-semibold">
                                            ✅ Disponible: {parseInt(item.loaded_quantity) - parseInt(item.quantity || 0)}
                                        </p>
                                        <p className="text-sm text-indigo-600 font-medium mt-1">${item.price}</p>
                                    </div>

                                    <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className="bg-red-50 hover:bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl select-none active:scale-95 transition-transform"
                                        >-</button>

                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity === 0 ? '' : item.quantity}
                                            placeholder="0"
                                            onChange={(e) => handleDirectInput(index, e.target.value)}
                                            className="w-14 text-center text-xl font-black border-none focus:ring-0 p-0 text-gray-800 bg-transparent"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className="bg-green-50 hover:bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl select-none active:scale-95 transition-transform"
                                        >+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.products && <span className="text-red-500 text-sm mt-2 block">{errors.products}</span>}
                    </div>

                    {/* 3. ENVASES Y MÉTODO DE PAGO */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">3. Detalles de facturación</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-red-500 uppercase mb-2">Envases Devueltos</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="block w-full rounded-lg border-gray-200 bg-gray-100 text-xl font-bold text-center shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3"
                                    value={data.returned_bottles === 0 ? '' : data.returned_bottles}
                                    placeholder="0"
                                    onChange={e => setData('returned_bottles', parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Método de Pago</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'cash', label: 'Efect.', color: 'bg-green-50 text-green-700 border-green-500' },
                                        { id: 'transfer', label: 'Transf.', color: 'bg-blue-50 text-blue-700 border-blue-500' },
                                        { id: 'credit', label: 'Crédit.', color: 'bg-yellow-50 text-yellow-700 border-yellow-500' }
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setData('payment_method', method.id)}
                                            className={`py-3 px-1 border-2 rounded-xl text-sm font-bold transition-all ${data.payment_method === method.id
                                                ? method.color + ' shadow-sm'
                                                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. TOTAL Y BOTÓN DE ENVÍO */}
                    <div className="sticky bottom-4 z-10 bg-gray-900 p-5 rounded-2xl shadow-2xl mt-8">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-gray-300 font-medium">Total a Cobrar:</span>
                            <span className="text-4xl font-black text-white">${data.total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.customer_id || (data.total === 0 && data.returned_bottles === 0)}
                            className="w-full bg-indigo-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all text-xl"
                        >
                            {processing ? 'Procesando...' : 'Registrar Cobro'}
                        </button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}
