<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user()->load('profile');
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'relationship' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'mood_status' => 'nullable|string|max:255',
        ]);

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        if ($request->hasFile('profile_pic')) {
            $path = $request->file('profile_pic')->store('profiles', 'public');
            $profile->update(['profile_pic_path' => $path]);
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('profile')
        ]);
    }
}
