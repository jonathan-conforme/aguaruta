import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Eliminar Registro",
    itemName = "este elemento",
    processing = false
}) {
    return (
        <Dialog open={isOpen} handler={onClose} size="xs" className="p-2">
            <DialogHeader className="flex flex-col items-center justify-center gap-3 pt-6 pb-2">
                <div className="rounded-full bg-red-50 p-4 text-red-500">
                    <TrashIcon className="h-7 w-7" strokeWidth={2} />
                </div>
                <Typography variant="h5" color="blue-gray" className="text-center font-bold">
                    {title}
                </Typography>
            </DialogHeader>

            <DialogBody className="text-center pt-0 pb-6 px-6">
                <Typography color="blue-gray" className="text-base font-normal">
                    ¿Seguro que deseas eliminar <strong>{itemName}</strong>?
                </Typography>
                <Typography color="gray" className="text-sm mt-1">
                    Esta acción no se puede deshacer.
                </Typography>
            </DialogBody>

            <DialogFooter className="flex justify-center gap-3 border-t border-gray-100 pt-4 pb-4">
                <Button
                    variant="text"
                    color="gray"
                    onClick={onClose}
                    disabled={processing}
                    className="w-full sm:w-auto hover:bg-gray-50"
                >
                    Cancelar
                </Button>
                <Button
                    color="red"
                    onClick={onConfirm}
                    disabled={processing}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 shadow-none hover:shadow-md"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar'
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
