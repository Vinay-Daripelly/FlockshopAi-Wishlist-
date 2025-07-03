
import axios from "axios";

const BASE = "http://localhost:8090/api";

export const createWishlist = async (wishlist) => {
  const res = await axios.post(`${BASE}/wishlists`, wishlist);
  return res.data;
};

export const getWishlist = async (id) => {
  const res = await axios.get(`${BASE}/wishlists/${id}`);
  return res.data;
};

export const addItem = async (wishlistId, item) => {
  await axios.post(`${BASE}/wishlists/${wishlistId}/items`, item);
};

export const deleteItem = async (wishlistId, itemId) => {
  await axios.delete(`${BASE}/wishlists/${wishlistId}/items/${itemId}`);
};
export const getWishlistsByUser = async (email) => {
  const res = await axios.get(`${BASE}/wishlists/user/${email}`);
  return res.data;
};

export const addCollaborator = async (wishlistId, email, role) => {
  const res = await axios.post(`${BASE}/wishlists/${wishlistId}/collaborators`, {
    email,
    role,
  });
  return res.data;
};

export const updateCollaboratorRole = async (wishlistId, email, role) => {
  const res = await axios.put(`${BASE}/wishlists/${wishlistId}/collaborators`, {
    email,
    role,
  });
  return res.data;
};

export const removeCollaborator = async (wishlistId, email) => {
  const res = await axios.delete(`${BASE}/wishlists/${wishlistId}/collaborators/${email}`);
  return res.data;
};
