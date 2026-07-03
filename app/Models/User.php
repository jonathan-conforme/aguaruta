<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\ResetPasswordNotification;


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

        $this->notify(new ResetPasswordNotification($token));
    }

        /**
        * Relación: Un usuario pertenece a una empresa.
        */
   public function company()
{
    return $this->belongsTo(Company::class);
}
}
