<?php

return [

    'basico' => [
        'name' => 'Básico Esencial',
        'price' => 14.99,
        'limits' => [
            'app_users' => 1,
            'employees' => 3,
            'clients' => 300,
            'routes_per_day' => 25,
            'products' => 10,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => false,
            'offline' => false,
        ],
    ],
     'basico_pro' => [
        'name' => 'Básico Pro',
        'price' => 19.99,
        'limits' => [
            'app_users' => 2,
            'employees' => 5,
            'clients' => 500,
            'routes_per_day' => 25,
            'products' => 10,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => false,
            'offline' => false,
        ],
    ],

    'premium' => [

         'name' => 'Premium',
         'price' => 29.99,
         'limits' => [

            'app_users' => 4,
            'employees' => 7,
            'clients' => 1500,
            'routes_per_day' => 50,
            'products' => 20,
            'offline' => false,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => false,
            'offline' => false,
        ],
    ],

    'empresarial' => [
        'name' => 'Empresarial',
         'price' => 49.99,
         'limits' => [
            'app_users' => 10, //agrado recientemeente para validar por usuarios logiado
            'employees' => 15,
            'clients' => 3000,
            'routes_per_day' => 999,
            'products' => 99999,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => true,
            'offline' => false,
        ],
    ],
    'vip' => [
        'name' => 'VIP / Corporativo',
         'price' => 99.99,
         'limits' => [
            'app_users' => 20, //agrado recientemeente para validar por usuarios logiado
            'employees' => 25,
            'clients' => 9999,
            'routes_per_day' => 9999,
            'products' => 99999,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => true,
            'offline' => false,
        ],
    ],

];
