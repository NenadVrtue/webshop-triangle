<?php

namespace App\Console\Commands;

use App\Models\Tire;
use Automattic\WooCommerce\Client;
use Illuminate\Console\Command;

class SyncTireImagesFromWoo extends Command
{
    protected $signature = 'sync:tire-images {--limit=50 : Number of tires to process per run}';

    protected $description = 'Sync tire images from WooCommerce by matching SKU';

    public function handle()
    {
        try {
            $woocommerce = new Client(
                env('WOOCOMMERCE_URL'),
                env('WOOCOMMERCE_CONSUMER_KEY'),
                env('WOOCOMMERCE_CONSUMER_SECRET'),
                [
                    'version' => 'wc/v3',
                    'timeout' => 30,
                    'verify_ssl' => false, // Disable SSL verification for local development
                ]
            );

            $limit = $this->option('limit');

            // Get tires without images
            $tires = Tire::whereNull('image_url')
                ->orWhere('image_url', '')
                ->limit($limit)
                ->get();

            if ($tires->isEmpty()) {
                $this->info('✅ All tires already have images!');

                return 0;
            }

            $this->info("🔄 Processing {$tires->count()} tires...");
            $bar = $this->output->createProgressBar($tires->count());
            $bar->start();

            $updated = 0;
            $notFound = 0;
            $errors = 0;

            foreach ($tires as $tire) {
                try {
                    // Search WooCommerce products by SKU
                    $products = $woocommerce->get('products', [
                        'sku' => $tire->sifra,
                        'per_page' => 1,
                    ]);

                    if (! empty($products) && isset($products[0]->images[0]->src)) {
                        $tire->image_url = $products[0]->images[0]->src;
                        $tire->save();
                        $updated++;
                    } else {
                        $notFound++;
                    }

                    // Rate limiting - WooCommerce allows ~10 requests/second
                    usleep(100000); // 0.1 second delay

                } catch (\Exception $e) {
                    $this->error("\n❌ Error for SKU {$tire->sifra}: ".$e->getMessage());
                    $errors++;
                }

                $bar->advance();
            }

            $bar->finish();
            $this->newLine(2);

            $this->info('✅ Sync completed!');
            $this->table(
                ['Status', 'Count'],
                [
                    ['Updated', $updated],
                    ['Not Found', $notFound],
                    ['Errors', $errors],
                ]
            );

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Failed to connect to WooCommerce: '.$e->getMessage());

            return 1;
        }
    }
}
