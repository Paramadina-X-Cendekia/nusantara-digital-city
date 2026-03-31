<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
        'name',
        'email',
        'password',
        'role',
        'profession',
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
        ];
    }

    public function contributions()
    {
        return $this->hasMany(Contribution::class);
    }

    public function getBadgeAttribute()
    {
        return $this->badge_info['title'];
    }

    public function getBadgeInfoAttribute()
    {
        $count = isset($this->attributes['contributions_count']) 
            ? $this->attributes['contributions_count'] 
            : $this->contributions()->where('status', 'approved')->count();
        if ($count >= 21) {
            return [
                'title' => 'Maestro of the Digital City',
                'level' => 'Maestro',
                'icon' => 'military_tech',
                'color' => '#8B5CF6',
                'next' => null
            ];
        } elseif ($count >= 11) {
            return [
                'title' => 'Heritage Guardian',
                'level' => 'Guardian',
                'icon' => 'shield',
                'color' => '#10B981',
                'next' => 21
            ];
        } elseif ($count >= 4) {
            return [
                'title' => 'Cultural Chronicler',
                'level' => 'Chronicler',
                'icon' => 'history_edu',
                'color' => '#3B82F6', // Blue
                'next' => 11
            ];
        } else {
            return [
                'title' => 'Nusantara Pioneer',
                'level' => 'Pioneer',
                'icon' => 'explore',
                'color' => '#F59E0B',
                'next' => 4
            ];
        }
    }

    public function getPointsAttribute()
    {
        $count = isset($this->attributes['contributions_count']) 
            ? $this->attributes['contributions_count'] 
            : $this->contributions()->where('status', 'approved')->count();
        return $count * 10;
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
