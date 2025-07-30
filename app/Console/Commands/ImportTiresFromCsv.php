<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Tire;

class ImportTiresFromCsv extends Command
{
    protected $signature = 'import:tires';
    protected $description = 'Import tires from CSV file without headers';

    public function handle()
    {
        $path = storage_path('app/private/trangle.csv'); // CSV bez header reda

        if (!file_exists($path)) {
            $this->error("CSV fajl nije pronađen: $path");
            return;
        }

        $file = fopen($path, 'r');

        // Ovo je tačan redosled kolona u CSV-u, preveden u nazive polja iz migracije/modela
        $columns = [
            'grupa', 'podgrupa', 'sifra', 'tip', 'dobavjac', 'naziv_dobavljaca',
            'bar_kod', 'naziv', 'katalosski_brojevi', 'katalosski_broj_2', 'katalosski_broj_3',
            'brend', 'erp', 'pdv_tarifa', 'jm', 'tezzina', 'ukupno_narucccivanje',
            'koristi_za_cjenovnik', 'dimenzije', 'komercijalni_naziv_dezena', 'fabricccki_kod_dezena',
            'napomena_2', 'e_sound', 'e_mark', 'pr', 'load_speedindex', 'dot', 'pmsf', 'm_s',
            'qty_utovar', 'ssirina', 'visina', 'precccnik', 'rr', 'wet', 'noise', 'xl', 'rim',
            'eprel_code', 'pritisak_duvanja', 'dubina_gaznog_sloja', 'ssirina_gaznog_sloja'
        ];

        $inserted = 0;
        $skipped = 0;

        while (($row = fgetcsv($file, 0, ',')) !== false) {
            // Ako je red kraći — popuni nullovima
            if (count($row) < count($columns)) {
                $row = array_pad($row, count($columns), null);
            }

            // Ako je red duži — skrati ga (npr. ako CSV ima višak zareza)
            if (count($row) > count($columns)) {
                $row = array_slice($row, 0, count($columns));
            }

            $data = array_combine($columns, $row);

            if (!$data) {
                $this->warn("Preskočen red (neuspio combine): " . json_encode($row));
                $skipped++;
                continue;
            }

            $data = array_map(fn($v) => is_string($v) ? trim($v) : $v, $data);
            $data['is_active'] = true;

            Tire::create($data);
            $inserted++;
        }


        fclose($file);

        $this->info("Import završen: $inserted redova ubačeno, $skipped redova preskočeno.");
    }
}
