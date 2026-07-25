<?php

return [

    'basico' => [
        'price' => 14.99,
        'limits' => [
            'app_users' => 1,//agrado recientemeente para validar por usuarios logiado
            'employees' => 3,
            'clients' => 200,
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
         'price' => 29.99,
         'limits' => [

            'app_users' => 4, //agrado recientemeente para validar por usuarios logiado
            'employees' => 8,
            'clients' => 500,
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
         'price' => 49.99,
         'limits' => [
            'app_users' => 10, //agrado recientemeente para validar por usuarios logiado
            'employees' => 15,
            'clients' => 800,
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
         'price' => 99.99,
         'limits' => [
            'app_users' => 15, //agrado recientemeente para validar por usuarios logiado
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
