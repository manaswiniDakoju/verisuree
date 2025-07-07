// frontend/src/utils/auth.js
// Utility functions for handling user authentication

const API_BASE_URL = ''; // Proxy will handle '/api' prefix in development

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Store user info in session storage or local storage
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      return { success: true, ...data };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Auth utility: Login error:', error);
    return { success: false, error: 'Network error or server unavailable.' };
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
    });
    if (response.ok) {
      sessionStorage.removeItem('currentUser');
      return { success: true, message: 'Logged out successfully.' };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || 'Logout failed.' };
    }
  } catch (error) {
    console.error('Auth utility: Logout error:', error);
    return { success: false, error: 'Network error or server unavailable.' };
  }
};

export const getUser = async () => {
  // First, check session storage (or local storage)
  const storedUser = sessionStorage.getItem('currentUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Error parsing stored user:", e);
      sessionStorage.removeItem('currentUser'); // Clear invalid data
    }
  }

  // If not in storage, try to fetch from backend's current user session
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/current`);
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem('currentUser', JSON.stringify(data)); // Store if fetched
      return data;
    } else {
      // No user currently logged in on backend, clear local storage
      sessionStorage.removeItem('currentUser');
      return null;
    }
  } catch (error) {
    console.error('Auth utility: Failed to get current user from backend:', error);
    sessionStorage.removeItem('currentUser'); // Assume no user if fetch fails
    return null;
  }
};