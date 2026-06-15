import { z } from 'zod';

export const createLaporanSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    category_id: z.coerce.number().int().min(1, 'Category ID is required'),
    chronology: z.string().min(1, 'Chronology is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    incident_date: z.coerce.date().min(new Date(), 'Incident date must be in the future'),
    is_anonymous: z.coerce.number().int().min(0).max(1),
});


