<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ShiftsController as AdminShiftsController;
use App\Http\Controllers\Empleados\SaleController as EmpleadoSaleController;
use App\Http\Controllers\SuperAdmin\EmployeeCategoryController;
use App\Http\Controllers\Admin\InventoryMovementController;
use App\Http\Controllers\Admin\CustomerCategoryController;
use App\Http\Controllers\Admin\DeliveryRouteController;
use App\Http\Controllers\SuperAdmin\CompanyController;
use App\Http\Controllers\Empleados\DeliveryController;
use App\Http\Controllers\Empleados\ShiftsController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\ProductsController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\TripController;
use App\Http\Controllers\Empleados\ExpenseController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\SuperAdmin\DashboardController;
use App\Http\Controllers\Auth\PasswordChangeController;
use Inertia\Inertia;




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,

    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/change-password', [PasswordChangeController::class, 'show'])->name('password.change');
    Route::post('/change-password', [PasswordChangeController::class, 'update'])->name('password.change.update');
});

Route::middleware(['auth', 'check.password.changed'])->group(function () {

Route::get('/dashboard', function () {
    $role = auth()->user()->role;

    // Dependiendo del rol, Inertia renderiza un archivo React totalmente diferente
    if ($role === 'super_admin') {
     //   return Inertia::render('SuperAdmin/Dashboard'); // Vista global de tu negocio
        return app(\App\Http\Controllers\SuperAdmin\DashboardController::class)->index();

        } elseif ($role === 'admin') {
        return Inertia::render('Admin/Dashboard'); // Vista de la purificadora
    } else {
        return Inertia::render('Empleados/Dashboard'); // Vista móvil del chofer
    }
})->middleware(['auth', 'verified','check.company'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ==========================================
// 🏢 RUTAS EXCLUSIVAS DEL CLIENTE (Super Admin)
// ==========================================
Route::middleware(['auth', 'verified', 'role:super_admin'])->group(function () {

   Route::resource('companies', CompanyController::class);
   Route::resource('employee-categories', EmployeeCategoryController::class);
   Route::patch('companies/{company}/toggle', [CompanyController::class, 'toggleStatus'])
    ->name('companies.toggle');



});
Route::get('/suscripcion-vencida', function () {
    return Inertia::render('SuperAdmin/Subscription/Expired');
})->name('subscription.expired');

// ==========================================
// 🏢 RUTAS EXCLUSIVAS DEL CLIENTE (ADMIN)
// ==========================================

Route::middleware(['auth', 'verified', 'role:admin', 'check.company'])->group(function () {
    Route::resource('employees', EmployeeController::class);
     Route::patch('/employees/{employee}/toggle-status', [EmployeeController::class, 'toggleStatus'])
    ->name('employees.toggle-status');
    Route::resource('customer-categories', CustomerCategoryController::class);
    Route::resource('products', ProductsController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('inventory-movements', InventoryMovementController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchases', PurchaseController::class);
    Route::resource('trips', TripController::class);
    Route::resource('delivery-routes', DeliveryRouteController::class);
    Route::patch('/delivery-routes/{route}/toggle', [DeliveryRouteController::class, 'toggle'])->name('delivery-routes.toggle');
    Route::resource('shifts', AdminShiftsController::class);
    Route::get('/admin/sales', [EmpleadoSaleController::class, 'index'])->name('admin.sales.index');
      Route::get('/shifts', [AdminShiftsController::class, 'index'])
            ->name('admin.shifts.index');
            Route::get('/mi-plan', [\App\Http\Controllers\Admin\SubscriptionController::class, 'index'])
        ->name('subscription.index');
        Route::get('/admin/reports/sales/download', [ReportController::class, 'downloadSalesReport'])
        ->name('admin.reports.sales.download');
        Route::post('/employees/{employee}/reset-password', [EmployeeController::class, 'resetPassword'])
    ->name('employees.reset-password');



});


// ==========================================
// 🏢 RUTAS EXCLUSIVAS DEL CLIENTE (REPARTIDOR)
// ==========================================

Route::middleware(['auth', 'verified', 'role:empleado', 'check.company'])
    ->prefix('empleado') // Opcional: puedes cambiar el prefijo a empleado también
    ->name('repartidor.') // Si cambias este nombre, recuerda cambiarlo en tu botón de React
    ->group(function () {

    // 1. Gestión de su ruta/viaje del día (Usando DeliveryController)
    Route::get('/trips', [DeliveryController::class, 'index'])->name('trips.index');
    Route::post('/trips/{trip}/start', [DeliveryController::class, 'start'])->name('trips.start');
    Route::post('/trips/{trip}/complete', [DeliveryController::class, 'complete'])->name('trips.complete');

    // 2. El Punto de Venta (POS) (Usando SaleController de Empleados)
    Route::get('/trips/{trip}/sales/create', [EmpleadoSaleController::class, 'create'])->name('sales.create');
    Route::post('/sales', [EmpleadoSaleController::class, 'store'])->name('sales.store');

    // 3. RUTAS DE APERTURA DE CAJA (SHIFTS)
    Route::get('/shifts/create', [ShiftsController::class, 'create'])->name('shifts.create');
    Route::post('/shifts', [ShiftsController::class, 'store'])->name('shifts.store');
    Route::get('/sales', [EmpleadoSaleController::class, 'index'])->name('sales.index');

    // 4. RUTAS DE CIERRE DE CAJA
    Route::get('/shifts/close', [ShiftsController::class, 'showClosure'])->name('shifts.close');
    Route::post('/shifts/close', [ShiftsController::class, 'storeClosure'])->name('shifts.storeClosure');

    // 5. Historial de turnos del repartidor
    Route::get('/shifts', [ShiftsController::class, 'index'])->name('shifts.index');

    // 6. Rutas para gastos (ExpenseController)
    Route::get('/expenses/create/{trip}', [ExpenseController::class, 'create'])
        ->name('expenses.create');
    Route::post('/expenses', [ExpenseController::class, 'store'])
        ->name('expenses.store');
});

});
// Rutas Públicas Informativas
Route::inertia('/terminos', 'Legal/Terms')->name('legal.terms');
Route::inertia('/privacidad', 'Legal/Privacy')->name('legal.privacy');
require __DIR__.'/auth.php';
