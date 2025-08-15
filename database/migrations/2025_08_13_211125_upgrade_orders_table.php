<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->after('status');
            $table->string('customer_email')->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_email');
            $table->string('company_name')->nullable()->after('customer_phone');
            $table->string('address')->nullable()->after('company_name');
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code', 20)->nullable()->after('city');
            $table->text('notes')->nullable()->after('postal_code');

            $table->decimal('subtotal', 10, 2)->default(0)->after('notes');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('total', 10, 2)->default(0)->after('discount_amount');

            $table->timestamp('order_date')->useCurrent()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_email',
                'customer_phone',
                'company_name',
                'address',
                'city',
                'postal_code',
                'notes',
                'subtotal',
                'discount_amount',
                'total',
            ]);
        });
    }
};
