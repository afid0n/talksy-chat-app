import { GiphyFetch } from '@giphy/js-fetch-api';

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "";

export const gf = new GiphyFetch(API_KEY);
