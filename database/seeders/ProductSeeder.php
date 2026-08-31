<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\CustomerCategory;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = 2;

        // 1. Crear o recuperar las categorías para la empresa 2
        $categoryNames = ['Bar', 'Mayorista', 'Tienda'];
        $categories = [];

        foreach ($categoryNames as $name) {
            $categories[$name] = CustomerCategory::firstOrCreate([
                'company_id' => $companyId,
                'name' => $name,
            ]);
        }

        // 2. Datos de los 5 productos de prueba
        $productsData = [
            [
                'name'              => 'Botellón 20L (Retornable)',
                'units_per_package' => 1,
                'price'             => 3.00,
                'current_stock'     => 150,
                'empty_stock'       => 40,
                'requires_return'   => true,
                'category_prices'   => [
                    'Bar'       => 2.80,
                    'Mayorista' => 2.20,
                    'Tienda'    => 2.50,
                ],
            ],
            [
                'name'              => 'Paca Agua 500ml x24',
                'units_per_package' => 24,
                'price'             => 6.50,
                'current_stock'     => 80,
                'empty_stock'       => 0,
                'requires_return'   => false,
                'category_prices'   => [
                    'Bar'       => 6.00,
                    'Mayorista' => 5.20,
                    'Tienda'    => 5.80,
                ],
            ],
            [
                'name'              => 'Paca Agua 1L x12',
                'units_per_package' => 12,
                'price'             => 5.00,
                'current_stock'     => 60,
                'empty_stock'       => 0,
                'requires_return'   => false,
                'category_prices'   => [
                    'Bar'       => 4.50,
                    'Mayorista' => 4.00,
                    'Tienda'    => 4.30,
                ],
            ],
            [
                'name'              => 'Botellón 10L Descartable',
                'units_per_package' => 1,
                'price'             => 2.50,
                'current_stock'     => 100,
                'empty_stock'       => 0,
                'requires_return'   => false,
                'category_prices'   => [
                    'Bar'       => 2.20,
                    'Mayorista' => 1.80,
                    'Tienda'    => 2.00,
                ],
            ],
            [
                'name'              => 'Hielo en Bolsa 5kg',
                'units_per_package' => 1,
                'price'             => 1.50,
                'current_stock'     => 200,
                'empty_stock'       => 0,
                'requires_return'   => false,
                'category_prices'   => [
                    'Bar'       => 1.20,
                    'Mayorista' => 0.90,
                    'Tienda'    => 1.10,
                ],
            ],
        ];

        // 3. Insertar productos y relacionar sus precios por categoría
        DB::transaction(function () use ($companyId, $productsData, $categories) {
            foreach ($productsData as $data) {
                $product = Product::create([
                    'company_id'        => $companyId,
                    'name'              => $data['name'],
                    'units_per_package' => $data['units_per_package'],
                    'price'             => $data['price'],
                    'current_stock'     => $data['current_stock'],
                    'empty_stock'       => $data['empty_stock'],
                    'requires_return'   => $data['requires_return'],
                    'is_active'         => true,
                ]);

                // Asignar los precios pivot e incluir company_id
                $syncData = [];
                foreach ($data['category_prices'] as $catName => $specialPrice) {
                    if (isset($categories[$catName])) {
                        $syncData[$categories[$catName]->id] = [
                            'price'      => $specialPrice,
                            'company_id' => $companyId, // <--- Corrección agregada
                        ];
                    }
                }

                $product->customerCategories()->sync($syncData);
            }
        });
    }
}