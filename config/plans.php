<?php

return [

    'basico' => [
        'limits' => [
            'employees' => 2,
            'clients' => 50,
            'routes_per_day' => 1,
            'products' => 20,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => false,
            'payroll' => false,
        ],
    ],

    'premium' => [
        'limits' => [
            'employees' => 5,
            'clients' => 200,
            'routes_per_day' => 5,
            'products' => 100,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => false,
        ],
    ],

    'empresarial' => [
        'limits' => [
            'employees' => 99999,
            'clients' => 99999,
            'routes_per_day' => 999,
            'products' => 99999,
        ],
        'modules' => [
            'routes' => true,
            'inventory' => true,
            'cash_closing' => true,
            'purchases' => true,
            'payroll' => true,
        ],
    ],

];