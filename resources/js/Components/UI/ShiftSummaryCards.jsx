import React from "react";
import StatCard from "@/Components/UI/StatCard";
import {
    BanknotesIcon,
    ArrowUpIcon,
    CurrencyDollarIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function ShiftSummaryCards({
    totalVentas = 0,
    totalGastos = 0,
    totalEsperado = 0,
    totalEntregado = 0,
    diferenciaTotal = 0,
}) {
    const money = (value) =>
        new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        }).format(value || 0);

    const isMissing = diferenciaTotal < -0.01;
    const isSurplus = diferenciaTotal > 0.01;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Ventas"
                value={money(totalVentas)}
                icon={BanknotesIcon}
                colorTheme="blue"
                description="Ventas en efectivo"
            />

            <StatCard
                title="Total Gastos"
                value={money(totalGastos)}
                icon={ArrowUpIcon}
                colorTheme="red"
                description="Gastos registrados"
            />

            <StatCard
                title="Efectivo Esperado"
                value={money(totalEsperado)}
                icon={CurrencyDollarIcon}
                colorTheme="green"
                description="Base + Ventas - Gastos"
            />

            <StatCard
                title="Efectivo Recibido"
                value={money(totalEntregado)}
                icon={isMissing ? ExclamationTriangleIcon : CheckBadgeIcon}
                colorTheme={isMissing ? "red" : isSurplus ? "purple" : "green"}
                description={
                    isMissing
                        ? `Faltante: ${money(diferenciaTotal)}`
                        : isSurplus
                        ? `Sobrante: +${money(diferenciaTotal)}`
                        : "Cajas 100% cuadradas"
                }
            />
        </div>
    );
}
