import { apiClient } from '@/lib/api'

// Expondo no api client o getPage
// Extend api class slightly for clean SSR page fetches

export const getPageData = async (slug: string) => {
    try {
        const res = await apiClient.get(`/pages/${slug}`);
        return res.data?.data || null; // { title, description, sections }
    } catch {
        // Fallback default structure
        return { title: 'Bucaly', description: '', sections: {} };
    }
}
