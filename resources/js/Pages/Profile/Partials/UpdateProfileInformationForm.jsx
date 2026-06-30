import { useForm, usePage } from '@inertiajs/react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Fade,
    InputAdornment
} from '@mui/material';
//  ASÍ ES LO CORRECTO:
import { AccountCircle, Email as EmailIcon, Save as SaveIcon } from '@mui/icons-material';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <Box component="section" className={className} sx={{ mt: 2 }}>
            <header>
                <Typography variant="h6" component="h2" color="text.primary" gutterBottom>
                    Información del Perfil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Actualiza la información de tu cuenta y dirección de correo electrónico.
                </Typography>
            </header>

            <Box component="form" onSubmit={submit} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Campo de Nombre */}
                <TextField
                    id="name"
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    disabled
                    error={!!errors.name}
                    helperText={errors.name}
                    autoComplete="name"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Campo de Email */}
                <TextField
                    id="email"
                    label="Correo Electrónico"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    disabled
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="username"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Sección de verificación de correo */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <Box sx={{ mt: 1 }}>
                        <Alert severity="warning" variant="outlined">
                            Tu dirección de correo no está verificada.{' '}
                            <Button
                                href={route('verification.send')}
                                method="post"
                                component="a"
                                size="small"
                                sx={{ textTransform: 'none', verticalAlign: 'baseline' }}
                            >
                                Haz clic aquí para reenviar el enlace.
                            </Button>
                        </Alert>

                        {status === 'verification-link-sent' && (
                            <Alert severity="success" sx={{ mt: 1 }}>
                                Un nuevo enlace ha sido enviado a tu correo.
                            </Alert>
                        )}
                    </Box>
                )}

                {/* Botón de envío y feedback */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  

                    <Fade in={recentlySuccessful} timeout={300}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                            ¡Guardado con éxito!
                        </Typography>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
}
