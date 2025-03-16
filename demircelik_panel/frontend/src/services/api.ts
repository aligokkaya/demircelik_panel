import axios from 'axios';
import { Announcement, Meal, Post, Weather } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Announcements
export const getAnnouncements = () => api.get<Announcement[]>('/announcements/');
export const getActiveAnnouncements = () => api.get<Announcement[]>('/announcements/active/');

// Meals
export const getMeals = (date: string) => api.get<Meal[]>(`/meals/?date=${date}`);
export const getTodayMeals = () => api.get<Meal[]>('/meals/today/');

// Posts
export const getPosts = (category: string) => api.get<Post[]>(`/posts/?category=${category}`);
export const getActivePosts = (category: string) => api.get<Post[]>(`/posts/active/?category=${category}`);

// Weather
export const getWeather = () => api.get<Weather>('/weather/current/');