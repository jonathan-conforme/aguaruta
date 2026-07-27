import React from "react";
import StatCard from "@/Components/UI/StatCard";
import {
    BanknotesIcon,
    ArrowUpIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function ShiftSummaryCards({
    totalVentas,
    totalGastos,
    totalNeto,
}) {
    const money = (value) =>
        new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        }).format(value);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                title="Efectivo a Recibir de todos los viajes "
                value={money(totalNeto)}
                icon={CurrencyDollarIcon}
                colorTheme="green"
                description="Ventas - Gastos"
            />

        </div>
        
    );
}
