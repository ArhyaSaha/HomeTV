import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkService = {
  // Get all links
  getLinks: async () => {
    const response = await api.get('/links');
    return response.data;
  },

  // Get favourite links
  getFavouriteLinks: async () => {
    const response = await api.get('/links/favourites');
    return response.data;
  },

  // Create a new link
  createLink: async (linkData) => {
    const response = await api.post('/links', linkData);
    return response.data;
  },

  // Update a link
  updateLink: async (id, linkData) => {
    const response = await api.put(`/links/${id}`, linkData);
    return response.data;
  },

  // Delete a link
  deleteLink: async (id) => {
    const response = await api.delete(`/links/${id}`);
    return response.data;
  },

  // Add to favourites
  addToFavourites: async (id) => {
    const response = await api.patch(`/links/${id}/favourite`, { isFavourite: true });
    return response.data;
  },

  // Remove from favourites
  removeFromFavourites: async (id) => {
    const response = await api.patch(`/links/${id}/favourite`, { isFavourite: false });
    return response.data;
  },
};