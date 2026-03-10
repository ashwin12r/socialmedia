import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Clubs ───
export const fetchClubs = () => api.get('/clubs').then(r => r.data.data);
export const fetchClub = (slug: string) => api.get(`/clubs/${slug}`).then(r => r.data.data);

// ─── Members ───
export const fetchMembers = (clubId?: string) =>
  api.get('/members', { params: clubId ? { club_id: clubId } : {} }).then(r => r.data.data);

// ─── Announcements ───
export const fetchAnnouncements = (params?: { tag?: string; limit?: number }) =>
  api.get('/announcements', { params }).then(r => r.data.data);

// ─── Achievements ───
export const fetchAchievements = (params?: { club_id?: string; category?: string; featured?: boolean; limit?: number }) =>
  api.get('/achievements', { params: { ...params, featured: params?.featured ? '1' : undefined } }).then(r => r.data.data);

// ─── Gallery ───
export const fetchGallery = (params?: { club_id?: string; category?: string; event_name?: string; year?: number; limit?: number }) =>
  api.get('/gallery', { params }).then(r => r.data.data);
export const fetchGalleryFilters = () => api.get('/gallery/filters').then(r => r.data.data);

// ─── Activities ───
export const fetchActivities = (params?: { type?: string; club_id?: string; limit?: number }) =>
  api.get('/activities', { params }).then(r => r.data.data);

// ─── Social Posts ───
export const fetchSocialPosts = (params?: { club_id?: string; platform?: string; limit?: number }) =>
  api.get('/social-posts', { params }).then(r => r.data.data);

// ─── Stats ───
export const fetchStats = () => api.get('/stats').then(r => r.data.data);

// ─── Department ───
export const fetchDepartment = () => api.get('/department').then(r => r.data.data);

// ─── Submit Achievement ───
export const submitAchievement = (data: {
  name: string;
  club_id?: string;
  club_name?: string;
  title: string;
  description?: string;
  proof_url?: string;
  proof_image_url?: string;
}) => api.post('/submissions', data).then(r => r.data);

export default api;
