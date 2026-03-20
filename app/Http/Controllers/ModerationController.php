<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class ModerationController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    public function approve($id)
    {
        $contribution = Contribution::findOrFail($id);
        $contribution->update(['status' => 'approved']);

        // Sync to Firebase for public visibility
        $this->syncToFirebase($contribution);

        return back()->with('success', 'Kontribusi berhasil disetujui dan dipublikasikan!');
    }

    public function reject($id)
    {
        $contribution = Contribution::findOrFail($id);
        $contribution->update(['status' => 'rejected']);

        return back()->with('success', 'Kontribusi telah ditolak.');
    }

    protected function syncToFirebase($contribution)
    {
        $type = $contribution->type;
        $data = $contribution->data;
        
        // Map types to Firebase nodes
        $nodes = [
            'kota' => 'cities',
            'budaya' => 'seni_budaya',
            'kuliner' => 'wisata_kuliner'
        ];

        $node = $nodes[$type] ?? 'misc';

        // Add metadata to the data
        $data['contributor'] = $contribution->user->name;
        $data['created_at'] = now()->toDateTimeString();

        // Map era to year for compatibility with existing frontend
        if ($type === 'budaya' && isset($data['era'])) {
            $data['year'] = $data['era'];
        }

        $this->database->getReference($node)->push($data);
    }
}
