<?php

namespace App\Services;

use Automattic\WooCommerce\Client;
use Automattic\WooCommerce\HttpClient\HttpClientException;

class WooService
{
    protected Client $wc;

    public function __construct()
    {
        $this->wc = new Client(
            config('services.woo.url'),    // npr. https://mojashop.com (bez /wp-json)
            config('services.woo.key'),
            config('services.woo.secret'),
            [
                'version' => 'wc/v3',
                'verify_ssl' => true,      // po potrebi false ako koristiš self-signed SSL
                'timeout' => 30,
            ]
        );
    }

    /**
     * Kreiraj novi proizvod
     */
    public function createProduct(array $data): array
    {
        $res = $this->wc->post('products', $data);
        return json_decode(json_encode($res), true);
    }

    /**
     * Update postojećeg proizvoda
     */
    public function updateProduct(int $wcId, array $data): array
    {
        $res = $this->wc->put("products/{$wcId}", $data);
        return json_decode(json_encode($res), true);
    }

    /**
     * Nađi proizvod po SKU
     */
    public function findBySku(string $sku): ?array
    {
        $res = $this->wc->get('products', ['sku' => $sku]);
        $res = json_decode(json_encode($res), true);

        return $res && count($res) ? $res[0] : null;
    }

    /**
     * Nađi proizvod po ID
     */
    public function findById(int $wcId): ?array
    {
        try {
            $res = $this->wc->get("products/{$wcId}");
            return json_decode(json_encode($res), true);
        } catch (HttpClientException $e) {
            return null;
        }
    }
}
