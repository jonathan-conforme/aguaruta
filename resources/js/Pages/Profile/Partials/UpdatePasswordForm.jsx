import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Fade,
    InputAdornment,
    IconButton
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';

export default function UpdatePasswordForm({ className = '' }) {
    // Estados para alternar ver/ocultar contraseñas
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }
                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <Box component="section" className={className} sx={{ mt: 2 }}>
            <header>
                <Typography variant="h6" component="h2" color="text.primary" gutterBottom>
                    Actualizar Contraseña
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Asegúrate de que tu cuenta utilice una contraseña larga y aleatoria para mantenerse segura.
                </Typography>
            </header>

            <Box component="form" onSubmit={updatePassword} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Contraseña Actual */}
                <TextField
                    id="current_password"
                    label="Contraseña Actual"
                    type={showCurrentPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    error={!!errors.current_password}
                    helperText={errors.current_password}
                    autoComplete="current-password"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                    >
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Nueva Contraseña */}
                <TextField
                    id="password"
                    label="Nueva Contraseña"
                    type={showNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    autoComplete="new-password"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <KeyIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Confirmar Contraseña */}
                <TextField
                    id="password_confirmation"
                    label="Confirmar Contraseña"
                    type={showNewPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation}
                    autoComplete="new-password"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <KeyIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Botón de guardado */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={processing}
                    >
                        Cambiar Contraseña
                    </Button>

                    <Fade in={recentlySuccessful} timeout={300}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                            ¡Contraseña cambiada!
                        </Typography>
                    </Fade>
                </Box>
            </Box>
        </Box>
    );
}
