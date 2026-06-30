<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;


class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'company_id',
        'role',
        'password_changed',
        'accepted_terms_and_privacy',
        'legal_accepted_at',
        'legal_accepted_ip',


    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_changed'           => 'boolean',
            'accepted_terms_and_privacy' => 'boolean',
            'legal_accepted_at'          => 'datetime',
        ];
    }

   public function sendPasswordResetNotification($token): void
{
    // Le pasamos el $token directamente al constructor de la clase padre
    $this->notify(new class($token) extends ResetPassword {

        public function toMail($notifiable): MailMessage
        {
            // Accedemos al token usando $this->token directamente
            $url = url(route('password.reset', [
                'token' => $this->token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            $expire = config('auth.passwords.users.expire');

            return (new MailMessage)
                ->subject('Restablecer Contraseña - AquaRuta')
                ->greeting('¡Hola!')
                ->line('Recibiste este correo porque solicitaste restablecer la contraseña de tu cuenta en AquaRuta.')
                ->action('Restablecer Contraseña', $url)
                ->line('Este enlace de recuperación expirará en ' . $expire . ' minutos.')
                ->line('Si tú no realizaste esta solicitud, puedes ignorar este correo de forma segura.')
                ->salutation('Saludos, El equipo de AquaRuta.');
        }
    });
}

        /**
        * Relación: Un usuario pertenece a una empresa.
        */
   public function company()
{
    return $this->belongsTo(Company::class);
}
}
