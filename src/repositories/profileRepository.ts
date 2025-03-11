import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/profile';

export const profileRepository = {
    create: (profileData: Partial<Profile>) =>
        supabase.from('profiles').insert(profileData).select('*').single(),

    getAll: () =>
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),

    getById: (id: string) =>
        supabase.from('profiles').select('*').eq('id', id).single(),

    update: (id: string, updates: Partial<Profile>) =>
        supabase.from('profiles').update(updates).eq('id', id).select('*').single(),

    delete: (id: string) =>
        supabase.from('profiles').delete().eq('id', id),

    uploadImage: async (filePath: string, file: File) =>
        supabase.storage.from('profiles').upload(filePath, file),

    getImageUrl: (filePath: string) =>
        supabase.storage.from('profiles').getPublicUrl(filePath).data.publicUrl
};
