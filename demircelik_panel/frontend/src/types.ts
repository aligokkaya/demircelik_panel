export interface Meal {
    id: number;
    date: Date;
    meals: {
        breakfast: {
            menu: string;
            time: string;
        };
        lunch: {
            menu: string;
            time: string;
        };
        dinner: {
            menu: string;
            time: string;
        };
    };
}

export type Post = {
    id: number;
    title: string;
    content: string;
    image?: string;
    created_at: string;
    author?: {
        name: string;
        avatar: string;
    };
    category: string;
    tags?: string[];
    read_time?: string;
};

export type Weather = {
    temperature: number;
    condition: string;
    icon: string;
    time: string;
};

export type Announcement = {
    id: number;
    title: string;
    content: string;
    date: string;
    type: string;
}; 