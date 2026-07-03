<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenido a AquaRuta</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">

        <div style="text-align: center; margin-bottom: 20px;">
            <img src="{{ $message->embed(public_path('icons/icons-512x512.png')) }}"
                 alt="Logo AquaRuta"
                 style="width: 100px; height: 100px; border-radius: 50%; object-fit: contain; border: 3px solid #e0e7ff; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        </div>

        <h2 style="color: #4f46e5; margin-bottom: 20px; text-align: center;">¡Tu cuenta de AquaRuta está lista!</h2>

        <p>Hola, <strong>{{ $user->name }}</strong>.</p>
        <p>Te damos la bienvenida a AquaRuta. Se ha registrado tu empresa con éxito en nuestra plataforma. A continuación, tus credenciales de acceso temporal:</p>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <p style="margin: 5px 0;"><strong>Usuario (Correo):</strong> {{ $user->email }}</p>
            <p style="margin: 5px 0;"><strong>Contraseña Temporal:</strong> {{ $user->company->ruc_number }}</p>
        </div>

        <p style="color: #64748b; font-size: 13px;">
            * Por seguridad y cumplimiento de la Ley de Protección de Datos (LOPD) en Ecuador, el sistema te solicitará obligatoriamente cambiar esta contraseña por una privada en tu primer ingreso.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://aguaruta.congresoticunesum.com/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Ingresar a AquaRuta
            </a>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            Este es un correo automático, por favor no respondas a este mensaje.<br>
            © {{ date('Y') }} AquaRuta Ecuador. Sin contrato de permanencia.
        </p>
    </div>
</body>
</html>
