<?php

namespace App\Jobs;

use App\Services\WooService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class SyncTiresToWoo implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    public $counter = 0;
    public $tries = 3;
    public $backoff = [60, 300]; // seconds: prvi retry nakon 60s, drugi nakon 300s

    public function handle(WooService $woo)
    {
        // chunkiraj po 100 da ne trošiš memoriju
        DB::table('tires')->orderBy('id')->chunk(100, function ($tires) use ($woo) {
            foreach ($tires as $tire) {
                // Napravi payload mapiran iz tvoje tabele
                $payload = [
                    'sku' => $tire->sifra,
                    'regular_price' => $tire->mp_cijena !== null ? (string) $tire->mp_cijena : null,
                    'manage_stock' => true,
                    'stock_quantity' => (int) $tire->kolicina_na_stanju,
                    'meta_data' => [
                        ['key' => 'vp_cijena', 'value' => $tire->vp_cijena],
                        ['key' => 'sirina', 'value' => $tire->sirina],
                        ['key' => 'visina', 'value' => $tire->visina],
                        ['key' => 'sezona', 'value' => $tire->sezona],
                        ['key' => 'eprel_code', 'value' => $tire->eprel_code],
                    ],
                ];

                try {
                    $existing = $woo->findBySku($tire->sifra);

                    if ($existing) {
                        $woo->updateProduct((int)$existing['id'], $payload);
                        $status = 'updated';
                        $this->counter++;
#                        echo $this->counter . $status . "\n";
                    } else {
                        $woo->createProduct($payload);
                        $status = 'created';
                        $this->counter++;
                        echo $this->counter . $status . "\n";
                    }

//                    // Ažuriraj praćenje (ako imaš kolonu)
//                    DB::table('tires')
//                        ->where('id', $tire->id)
//                        ->update([
//                            'wc_last_synced_at' => now(),
//                            'wc_last_sync_status' => $status,
//                            'updated_at' => now()
//                        ]);
                } catch (HttpClientException $e) {
                    // client exception sadrži response -> možeš parse-ovati body za više info
                    Log::error("Woo Http error for SKU {$tire->sifra}: ".$e->getMessage());
                    echo "\n66" . $e->getMessage();
//                    DB::table('tires')->where('id', $tire->id)->update([
//                        'wc_last_sync_status' => 'error',
//                    ]);
                } catch (Throwable $e) {
                    Log::error("Woo sync failed for SKU {$tire->sifra}: ".$e->getMessage());
                    echo "\n72" . $e->getMessage();
//                    DB::table('tires')->where('id', $tire->id)->update([
//                        'wc_last_sync_status' => 'error',
//                    ]);
                }
            }
        });
    }

    public function failed(Throwable $exception)
    {
        Log::error('SyncTiresToWoo job failed: '.$exception->getMessage());
        // ovdje možeš poslati notify (email/slack) po potrebi
    }
}
