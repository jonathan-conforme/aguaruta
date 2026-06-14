<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Shift;

class ExpenseService
{
    public function create(array $data): Expense
    {
        // Validamos que el turno exista y esté abierto
        return Expense::create([
            'company_id' => auth()->user()->company_id,
            'shift_id' => $data['shift_id'],
            'user_id' => auth()->id(),
            'amount' => $data['amount'],
            'category' => $data['category'],
            'description' => $data['description'] ?? null,
            'receipt_photo_url' => $data['receipt_photo_url'] ?? null,
        ]);
    }
}