import React, { useState, useRef, useEffect } from 'react';
import { useForm, Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
        total: 0,
        initial_payment: 0,
        payment_type: 'cash',
        products: trip.products.map(p => ({
            product_id: p.id,
            name: p.name,
            price: p.price,
            quantity: 0,
            returned_bottles: 0,
            requires_return: p.requires_return,
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
            quantity: 0,
            returned_bottles: 0,
        }));

        setData({
            ...data,
            total: 0,
            products: updatedProducts,
            customer_id: '',
            payment_method: 'cash',
            initial_payment: 0,
            payment_type: 'cash'
        });

        setSearchCustomer('');
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nueva venta" />

            {/* MODAL CENTRADO DE ÉXITO */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center transform transition-all scale-100">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 mb-4 sm:mb-6">
                            <span className="text-3xl sm:text-4xl">✅</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">¡Venta Exitosa!</h3>
                        <p className="text-sm text-gray-500 mb-6 sm:mb-8">
                            El cobro de <span className="font-bold text-indigo-600">${data.total.toFixed(2)}</span> ha sido registrado en el sistema.
                        </p>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                            >
                                Iniciar Nueva Venta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-[#f8f9fe] pb-48 sm:pb-40 lg:pb-24">


                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                    {/* VOLVER A RUTA & TITULO PRINCIPAL */}
                    <div>
                        <button
                            type="button"
                            onClick={() => router.visit(route('repartidor.trips.index'))}
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 mb-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver a mi ruta
                        </button>

                        <div className="flex flex-row items-center justify-between gap-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1e1b4b] tracking-tight">Nueva venta</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Todo listo para tu próxima entrega.</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm8 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0h5.1a2.5 2.5 0 014.9 0H19a1 1 0 001-1V9a1 1 0 00-.293-.707l-3-3A1 1 0 0016 5H3z" />
                                </svg>
                                Ruta #{trip.shift_id}
                            </span>
                        </div>
                    </div>

                    {/* ERRORES DE CAJA Y SISTEMA */}
                    {errors.shift && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm">
                            <p className="font-bold">Error de Caja</p>
                            <p>{errors.shift}</p>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm">
                            <p className="font-bold">Error del Sistema</p>
                            <p>{flash.error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* LAYOUT RESPONSIVO 2 COLUMNAS EN DESKTOP */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">

                            {/* COLUMNA IZQUIERDA (CLIENTE + PRODUCTOS) */}
                            <div className="lg:col-span-7 space-y-4 sm:space-y-6">

                                {/* 1. SECCIÓN CLIENTE */}
                                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100/80" ref={dropdownRef}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                                                1
                                            </span>
                                            <h2 className="font-bold text-[#1e1b4b] text-sm sm:text-base">Cliente</h2>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">¿A quién entregamos?</span>
                                    </div>

                                    <div className="relative">
                                        <div className="relative flex items-center">
                                            <svg className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                className={`w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${data.customer_id ? 'bg-indigo-50/50 font-medium text-indigo-900 border-indigo-200' : ''
                                                    }`}
                                                placeholder="Buscar por nombre o identificación"
                                                value={searchCustomer}
                                                onChange={(e) => {
                                                    setSearchCustomer(e.target.value);
                                                    setData('customer_id', '');
                                                    setIsDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsDropdownOpen(true)}
                                            />
                                            <svg className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>

                                            {data.customer_id && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData('customer_id', '');
                                                        setSearchCustomer('');
                                                    }}
                                                    className="absolute right-8 text-gray-400 hover:text-red-500 text-xs p-1"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>

                                        {isDropdownOpen && (
                                            <ul className="absolute z-30 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-gray-50">
                                                {filteredCustomers.length > 0 ? (
                                                    filteredCustomers.map(customer => (
                                                        <li
                                                            key={customer.id}
                                                            className="px-4 py-2.5 hover:bg-indigo-50/60 cursor-pointer transition-colors"
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
                                                            <span className="block text-sm font-semibold text-gray-800">{customer.name}</span>
                                                            <span className="block text-xs text-gray-400 mt-0.5">
                                                                C.I / RUC: {customer.identification}
                                                            </span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-3 text-gray-400 text-xs text-center">No se encontraron clientes.</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 mt-2.5">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Selecciona un cliente para registrar la venta.
                                    </p>

                                    {data.customer_id && (() => {
                                        const selectedCustomer = customers.find(c => c.id === data.customer_id);
                                        return selectedCustomer?.bottle_debt > 0 && (
                                            <div className="mt-2.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2">
                                                <span>⚠️</span>
                                                <span>El cliente debe <strong>{selectedCustomer.bottle_debt}</strong> botellón(es)</span>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* 2. SECCIÓN PRODUCTOS */}
                                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100/80">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                                                2
                                            </span>
                                            <h2 className="font-bold text-[#1e1b4b] text-sm sm:text-base">Productos</h2>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {data.products.length} disponibles
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase border-b border-gray-100 pb-2 mb-3 pt-1">
                                        <span>PRODUCTO</span>
                                        <span>CANTIDAD</span>
                                    </div>

                                    <div className="space-y-3.5">
                                        {data.products.map((item, index) => (
                                            <div key={item.product_id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-b-0 last:pb-0 gap-2">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* MINIATURA ICONO BOTELLÓN */}
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-50 border border-cyan-100/60 flex items-center justify-center shrink-0">
                                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2a2 2 0 00-2 2v1H8a1 1 0 00-1 1v2a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-2V4a2 2 0 00-2-2zm-5 7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2v-9a2 2 0 00-2-2H7z" />
                                                        </svg>
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-800 text-xs sm:text-sm leading-snug truncate">{item.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">
                                                            {getPresentationLabel(item.units_per_package)} · <span className="text-emerald-600 font-semibold">{parseInt(item.loaded_quantity) - parseInt(item.quantity || 0)} disp.</span>
                                                        </p>
                                                        <p className="text-xs font-bold text-indigo-600 mt-0.5">${Number(item.price).toFixed(2)}</p>
                                                    </div>
                                                </div>

                                                {/* CONTROLES DE CANTIDAD */}
                                                <div className="flex items-center border border-indigo-100 bg-indigo-50/30 rounded-xl px-1 py-0.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(index, -1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-indigo-600 font-medium text-base sm:text-lg hover:bg-indigo-100/50 rounded-lg active:scale-95 transition-transform"
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.quantity === 0 ? '0' : item.quantity}
                                                        onChange={(e) => handleDirectInput(index, e.target.value)}
                                                        className="w-7 sm:w-9 text-center text-xs sm:text-sm font-bold border-none focus:ring-0 p-0 text-gray-800 bg-transparent"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(index, 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-indigo-600 font-medium text-base sm:text-lg hover:bg-indigo-100/50 rounded-lg active:scale-95 transition-transform"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.products && <span className="text-red-500 text-xs mt-2 block">{errors.products}</span>}
                                </div>
                            </div>

                            {/* COLUMNA DERECHA (ENTREGA, PAGO Y MOTIVACIONAL) */}
                            <div className="lg:col-span-5 space-y-4 sm:space-y-6">

                                {/* 3. DETALLES DE LA ENTREGA & METODO DE PAGO */}
                                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100/80 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                                            3
                                        </span>
                                        <h2 className="font-bold text-[#1e1b4b] text-sm sm:text-base">Detalles de la entrega</h2>
                                    </div>

                                    {/* ENVASES DEVUELTOS */}
                                    <div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-2.5">
                                            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <span>Envases devueltos</span>
                                        </div>

                                        <div className="space-y-2">
                                            {data.products
                                                .filter(prod => prod.requires_return)
                                                .map((prod) => {
                                                    const originalIndex = data.products.findIndex(p => p.product_id === prod.product_id);

                                                    return (
                                                        <div key={prod.product_id} className="flex items-center justify-between text-xs py-1 gap-2">
                                                            <span className="text-gray-600 font-medium truncate">{prod.name}</span>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <div className="border border-gray-500 rounded-xl px-2 py-1 w-16 text-center font-bold text-gray-800 bg-white">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        className="w-full text-center font-bold border-none focus:ring-0 p-0 text-xs text-gray-800 bg-transparent"
                                                                        placeholder="0"
                                                                        value={prod.returned_bottles === 0 ? '0' : prod.returned_bottles}
                                                                        onChange={(e) => {
                                                                            const val = parseInt(e.target.value) || 0;
                                                                            const updatedProducts = [...data.products];
                                                                            updatedProducts[originalIndex].returned_bottles = val;
                                                                            setData('products', updatedProducts);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-gray-400 text-[11px]">vacíos</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            {data.products.filter(prod => prod.requires_return).length === 0 && (
                                                <p className="text-xs text-gray-400 italic">No hay productos retornables en este viaje.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* MÉTODO DE PAGO */}
                                    <div className="pt-3 border-t border-gray-100">
                                        <label className="block text-xs font-bold text-gray-800 mb-2.5">Método de pago</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                {
                                                    id: 'cash',
                                                    label: 'Efectivo',
                                                    activeClass: 'bg-green-600 text-white shadow-md shadow-green-200', // Verde para Efectivo
                                                    icon: (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    )
                                                },
                                                {
                                                    id: 'transfer',
                                                    label: 'Transf.',
                                                    activeClass: 'bg-cyan-600 text-white shadow-md shadow-cyan-200', // Cían/Azul para Transferencia
                                                    icon: (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                        </svg>
                                                    )
                                                },
                                                {
                                                    id: 'credit',
                                                    label: 'Crédito',
                                                    activeClass: 'bg-amber-500 text-white shadow-md shadow-amber-200', // Naranja/Ámbar para Crédito
                                                    icon: (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    )
                                                }
                                            ].map((method) => {
                                                const isActive = data.payment_method === method.id;
                                                return (
                                                    <button
                                                        key={method.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setData(prev => ({
                                                                ...prev,
                                                                payment_method: method.id,
                                                                initial_payment: method.id === 'credit' ? prev.initial_payment : 0
                                                            }));
                                                        }}
                                                        className={`py-2.5 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                                                            ? method.activeClass
                                                            : 'bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {method.icon}
                                                        <span className="truncate">{method.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* DETALLES DINÁMICOS AL SELECCIONAR CRÉDITO */}
                                        {data.payment_method === 'credit' && (
                                            <div className="mt-3.5 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <label className="text-xs font-bold text-indigo-950">Abono Inicial</label>
                                                    <div className="relative w-28">
                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            max={data.total}
                                                            value={data.initial_payment || ''}
                                                            onChange={(e) => {
                                                                const val = parseFloat(e.target.value) || 0;
                                                                setData('initial_payment', Math.min(data.total, Math.max(0, val)));
                                                            }}
                                                            placeholder="0.00"
                                                            className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-right bg-white border border-indigo-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                        />
                                                    </div>
                                                </div>

                                                {data.initial_payment > 0 && (
                                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-indigo-100/80">
                                                        <span className="text-gray-600 font-medium">Forma del abono:</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('payment_type', 'cash')}
                                                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${data.payment_type === 'cash'
                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                    : 'bg-white text-gray-600 border border-gray-200'
                                                                    }`}
                                                            >
                                                                Efectivo
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('payment_type', 'transfer')}
                                                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${data.payment_type === 'transfer'
                                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                                    : 'bg-white text-gray-600 border border-gray-200'
                                                                    }`}
                                                            >
                                                                Transf.
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center text-xs font-bold text-indigo-950 pt-1 border-t border-indigo-100/60">
                                                    <span>Saldo a Crédito:</span>
                                                    <span className="text-amber-600 font-black">
                                                        ${Math.max(0, data.total - (data.initial_payment || 0)).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-[11px] text-gray-400 mt-2">
                                            {data.payment_method === 'credit' ? 'Venta a crédito con abono opcional.' : 'Cobro al momento de la entrega.'}
                                        </p>
                                    </div>
                                </div>

                                {/* TARJETA MOTIVACIONAL Y CHECK */}
                                <div className="bg-indigo-50/70 border border-indigo-100/60 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm8 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0h5.1a2.5 2.5 0 014.9 0H19a1 1 0 001-1V9a1 1 0 00-.293-.707l-3-3A1 1 0 0016 5H3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-bold text-indigo-950">Una entrega más. Una ruta que avanza.</p>
                                            <p className="text-[11px] sm:text-xs text-indigo-600/80">Los detalles de tu venta, en un solo lugar.</p>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* BARRA ESTÁTICA DE TOTAL Y COBRO */}
                        <div className="w-full bg-[#0d0f36] text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-indigo-900/50 mt-6">
                            <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                                <div>
                                    <span className="block text-[10px] sm:text-xs text-gray-400 font-medium">
                                        {data.payment_method === 'credit' ? 'Total Venta' : 'Total a cobrar'}
                                    </span>
                                    <span className="text-xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                                        ${data.total.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.customer_id ||
                                        (data.total === 0 && data.products.reduce((acc, p) => acc + (p.returned_bottles || 0), 0) === 0)
                                    }
                                    className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-950 disabled:text-indigo-800 disabled:border disabled:border-indigo-900/50 disabled:cursor-not-allowed text-white text-xs sm:text-base font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0"
                                >
                                    <span>{processing ? 'Procesando...' : 'Registrar cobro'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
