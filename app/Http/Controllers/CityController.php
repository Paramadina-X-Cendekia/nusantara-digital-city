<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

class CityController extends Controller
{
    public function index()
    {
        try {
            $database = $this->getFirebaseDatabase();
            
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $cities = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cities[] = array_merge(['id' => $key], $value);
                }
            }
            
            return Inertia::render('Home', [
                'name' => 'Nusantara Digital City',
                'cities' => $cities
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Home', [
                'name' => 'Nusantara Digital City',
                'cities' => [
                    ['id' => '1', 'name' => 'Jakarta (Dummy Data)', 'description' => 'Ibukota Indonesia'],
                    ['id' => '2', 'name' => 'Bandung (Dummy Data)', 'description' => 'Kota Kembang']
                ],
                'firebaseError' => 'Firebase error: ' . $e->getMessage()
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cityName' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'contactName' => 'required|string|max:255',
            'contactEmail' => 'required|email|max:255',
            'contactPhone' => 'required|string|max:20',
            'description' => 'required|string',
            'category' => 'required|string',
            'population' => 'nullable|string',
            'website' => 'nullable|url',
        ]);

        try {
            $database = $this->getFirebaseDatabase();
            $database->getReference('city_registrations')->push($validated);

            return back()->with('success', 'Pendaftaran kota Anda telah kami terima dan akan segera diproses.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengirim pendaftaran: ' . $e->getMessage()]);
        }
    }

    public function adminIndex()
    {
        try {
            $database = $this->getFirebaseDatabase();
            $reference = $database->getReference('city_registrations');
            $snapshot = $reference->getSnapshot();
            
            $registrations = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $registrations[] = array_merge(['id' => $key], $value);
                }
            }
            
            return Inertia::render('AdminDashboard', [
                'registrations' => $registrations
            ]);
        } catch (\Exception $e) {
            return Inertia::render('AdminDashboard', [
                'registrations' => [],
                'error' => 'Gagal mengambil data: ' . $e->getMessage()
            ]);
        }
    }

    public function approve($id)
    {
        try {
            $database = $this->getFirebaseDatabase();
            $regRef = $database->getReference('city_registrations/' . $id);
            $regData = $regRef->getSnapshot()->getValue();

            if (!$regData) {
                return back()->withErrors(['error' => 'Data tidak ditemukan.']);
            }

            // Move to cities node
            $database->getReference('cities')->push([
                'name' => $regData['cityName'],
                'province' => $regData['province'],
                'description' => $regData['description'],
                'population' => $regData['population'] ?? '-',
                'category' => $regData['category'],
                'website' => $regData['website'] ?? null,
                'status' => 'approved',
                'approved_at' => now()->toDateTimeString(),
            ]);

            // Remove from registrations
            $regRef->remove();

            return redirect()->route('admin.registrations')->with('success', 'Kota telah berhasil disetujui dan ditayangkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyetujui: ' . $e->getMessage()]);
        }
    }

    public function deleteRegistration($id)
    {
        try {
            $database = $this->getFirebaseDatabase();
            $database->getReference('city_registrations/' . $id)->remove();

            return back()->with('success', 'Pendaftaran telah dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus: ' . $e->getMessage()]);
        }
    }

    /**
     * Show warung registration form with verified cities.
     */
    public function showDaftarkanWarung()
    {
        try {
            $database = $this->getFirebaseDatabase();
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $cities = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cities[] = [
                        'id' => $key,
                        'name' => $value['name'] ?? 'Unknown',
                        'province' => $value['province'] ?? '-'
                    ];
                }
            }
            
            return Inertia::render('DaftarkanWarung', [
                'cities' => $cities
            ]);
        } catch (\Exception $e) {
            return Inertia::render('DaftarkanWarung', [
                'cities' => []
            ]);
        }
    }
}
