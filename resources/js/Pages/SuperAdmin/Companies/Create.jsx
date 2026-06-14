import React from 'react';
import { useForm } from '@inertiajs/react';

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";


export default function Create({ open, onClose }) {
    // Solo los datos que tu CompanyService y tu validación necesitan
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        ruc_number: '',
        phone: '',
        whatsapp_number: '',
        email: '',
        address: '',
        plan: 'basico',
        subscription_ends_at: '',
        logo: null, // Listo para recibir el archivo
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('companies.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} handler={onClose} size="lg" className="overflow-scroll max-h-[90vh]">
            <DialogHeader className="flex flex-col items-start gap-1">
                <Typography variant="h4">Registrar Nueva Empresa</Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    El usuario administrador se creará automáticamente usando el RUC como contraseña.
                </Typography>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="col-span-1 md:col-span-2">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Datos de la Empresa
                        </Typography>
                    </div>

                    <div>
                        <Input 
                            label="Nombre de la Empresa" 
                            value={data.name} 
                            onChange={(e) => setData('name', e.target.value)} 
                            error={!!errors.name}
                        />
                        {errors.name && <Typography variant="small" color="red">{errors.name}</Typography>}
                    </div>

                    <div>
                        <Input 
                            label="Número de RUC" 
                            value={data.ruc_number} 
                            onChange={(e) => setData('ruc_number', e.target.value)} 
                            error={!!errors.ruc_number}
                        />
                        {errors.ruc_number && <Typography variant="small" color="red">{errors.ruc_number}</Typography>}
                    </div>

                    <div>
                        <Input 
                            label="Email de Contacto (Login del Admin)" 
                            type="email"
                            value={data.email} 
                            onChange={(e) => setData('email', e.target.value)} 
                            error={!!errors.email}
                        />
                        {errors.email && <Typography variant="small" color="red">{errors.email}</Typography>}
                    </div>

                    <div>
                        <Input 
                            label="Teléfono Fijo" 
                            value={data.phone} 
                            onChange={(e) => setData('phone', e.target.value)} 
                            error={!!errors.phone}
                        />
                        {errors.phone && <Typography variant="small" color="red">{errors.phone}</Typography>}
                    </div>

                    <div>
                        <Input 
                            label="WhatsApp" 
                            value={data.whatsapp_number} 
                            onChange={(e) => setData('whatsapp_number', e.target.value)} 
                        />
                    </div>

                    <div>
                        <Input 
                            label="Dirección" 
                            value={data.address} 
                            onChange={(e) => setData('address', e.target.value)} 
                        />
                    </div>

                    {/* LOGO */}
                    <div className="col-span-1 md:col-span-2">
                        <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                            Logo de la Empresa (PNG, JPG)
                        </Typography>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setData('logo', e.target.files[0])} 
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md"
                        />
                        {errors.logo && <Typography variant="small" color="red">{errors.logo}</Typography>}
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-2 border-t pt-4">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            Suscripción y Plan
                        </Typography>
                    </div>

                    <div>
                        <Select 
                            label="Plan Contratado" 
                            value={data.plan} 
                            onChange={(val) => setData('plan', val)}
                        >
                            <Option value="basico">Básico</Option>
                            <Option value="premium">Premium</Option>
                            <Option value="empresarial">Empresarial</Option>
                        </Select>
                        {errors.plan && <Typography variant="small" color="red">{errors.plan}</Typography>}
                    </div>

                    <div>
                        <Input 
                            type="date"
                            label="Fecha de Vencimiento" 
                            value={data.subscription_ends_at} 
                            onChange={(e) => setData('subscription_ends_at', e.target.value)} 
                            error={!!errors.subscription_ends_at}
                        />
                        {errors.subscription_ends_at && <Typography variant="small" color="red">{errors.subscription_ends_at}</Typography>}
                    </div>

                </DialogBody>

                <DialogFooter className="gap-2">
                    <Button variant="text" color="red" onClick={onClose} disabled={processing}>
                        Cancelar
                    </Button>
                    <Button type="submit" color="indigo" disabled={processing} className="flex items-center gap-2">
                        {processing ? 'Guardando...' : 'Registrar Empresa'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}