<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Auth;

class CustomerService
{
    public function getAllCustomers(?string $search = null)
{
    return Customer::with(['category', 'deliveryRoute'])
        ->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('identification', 'like', "%{$search}%");
            });
        })
        ->orderBy('name', 'asc')
        ->paginate(15)
        ->withQueryString();
}

    public function createCustomer(array $data)
    {
        $data['company_id'] = Auth::user()->company_id;
        $data['name'] = ucwords(strtolower(trim($data['name'])));
        $data['bottle_debt'] = $data['bottle_debt'] ?? 0;
        $data['identification'] = $data['identification']
    ? strtoupper(trim($data['identification']))
    : null;

        return Customer::create($data);
    }

    public function updateCustomer(Customer $customer, array $data)
{
    $data['name'] = ucwords(strtolower(trim($data['name'])));
    $data['bottle_debt'] = $data['bottle_debt'] ?? 0;

    $customer->update($data);

    return $customer;
}

    public function deleteCustomer(Customer $customer)
    {
        $customer->delete();
    }
}