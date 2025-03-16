export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
    is_active: boolean;
}

export interface Meal {
    id: number;
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    menu: string;
    created_at: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    author?: {
        name: string;
        avatar?: string;
    };
    category: string;
    tags?: string[];
    read_time?: string;
}

export interface Weather {
    temperature: number;
    condition: string;
}