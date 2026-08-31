import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { BellIcon, ArrowsRightLeftIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function NotificationMenu() {
    const { auth } = usePage().props;
    const notifications = auth.user?.unread_notifications || [];
    const [isOpen, setIsOpen] = useState(false);

    // Mapeo de íconos según lo que guardamos en la clase de Notificación
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'ArrowsRightLeftIcon':
                return <ArrowsRightLeftIcon className="h-5 w-5 text-indigo-500" />;
            case 'BanknotesIcon':
                return <BanknotesIcon className="h-5 w-5 text-emerald-500" />;
            default:
                return <BellIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    const handleNotificationClick = (notification) => {
        setIsOpen(false);
        // Marcar como leída y luego redirigir a la URL correspondiente
        router.post(route('notifications.read', notification.id), {}, {
            onSuccess: () => {
                if (notification.data.url) {
                    router.visit(notification.data.url);
                }
            }
        });
    };

    return (
        <div className="relative">
            {/* Botón de la Campanita */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
                <BellIcon className="h-6 w-6 text-gray-700" />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Menú Desplegable */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-xs uppercase tracking-wider text-gray-700">Notificaciones</span>
                        <span className="text-xs text-gray-500">{notifications.length} sin leer</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleNotificationClick(item)}
                                    className="p-3 hover:bg-indigo-50/50 cursor-pointer transition-colors flex gap-3 items-start"
                                >
                                    <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                                        {getIcon(item.data.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-800">{item.data.title}</p>
                                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{item.data.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-gray-400">
                                No tienes notificaciones pendientes.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
