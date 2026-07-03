export default function ApplicationLogo({ className = "", ...props }) {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            {/* Anillo exterior con degradado suave y sombra */}
            <div className="p-1.5 bg-gradient-to-tr from-blue-100 to-indigo-200 rounded-full shadow-md ring-1 ring-blue-300/50">
                {/* Anillo interior blanco que genera separación */}
                <div className="p-1 bg-white rounded-full border border-blue-200 shadow-inner">
                    {/* Contenedor de la imagen */}
                    <div className="w-28 h-28 flex items-center justify-center bg-white rounded-full overflow-hidden p-2">
                        <img
                            {...props}
                            src="/icons/icons-512x512.png"
                            alt="Logo del Sistema"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
