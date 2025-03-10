// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 API 키를 가져옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export type Profile = {
    id: string;
    name: string;
    features: string; // 콤마로 구분된 문자열
    bio: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Comment = {
    id: string;
    profile_id: string;
    author_name: string;
    content: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
    replies?: Comment[];
};

// 유틸리티 함수: 특징 문자열을 배열로 변환
export const featuresStringToArray = (featuresString: string): string[] => {
    return featuresString.split(',').slice(0, 5).map(feature => feature.trim());
};

// 유틸리티 함수: 특징 배열을 문자열로 변환
export const featuresArrayToString = (featuresArray: string[]): string => {
    return featuresArray.slice(0, 5).join(',');
};
