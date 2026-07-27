import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    colorTheme = "gray",
    description,
}) {
    const themes = {
        green: { title: "text-green-700", iconBg: "bg-green-50", iconColor: "text-green-600" },
        blue: { title: "text-blue-700", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
        purple: { title: "text-purple-700", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
        red: { title: "text-red-700", iconBg: "bg-red-50", iconColor: "text-red-600" },
        gray: { title: "text-slate-500", iconBg: "bg-slate-50", iconColor: "text-slate-600" }
    };


    const currentTheme = themes[colorTheme] || themes.gray;

        return (
            <Card className="p-5 bg-white border border-gray-200/80 shadow-none rounded-2xl flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <Typography className={`text-[11px] font-bold ${currentTheme.title} uppercase tracking-wider`}>
                        {title}
                    </Typography>
                    <Typography variant="h3" className="text-2xl font-black text-gray-900 tracking-tight">
                        {value}
                    </Typography>
                    <Typography className="text-[11px] text-gray-500 font-medium">
                        {description}
                    </Typography>
                </div>
                <div className={`p-3 rounded-xl ${currentTheme.iconBg} ${currentTheme.iconColor} shrink-0`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                </div>
            </Card>
        );
}
