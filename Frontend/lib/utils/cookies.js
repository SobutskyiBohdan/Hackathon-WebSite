// lib/utils/cookies.js

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 */
export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') return;
  
  let cookieString = `${name}=${value}`;
  
  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }
  
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }
  
  if (options.secure) {
    cookieString += '; secure';
  }
  
  if (options.httpOnly) {
    cookieString += '; httpOnly';
  }
  
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options (path, domain)
 */
export function deleteCookie(name, options = {}) {
  setCookie(name, '', {
    ...options,
    expires: new Date(0)
  });
}

/**
 * Get authentication token from cookies
 * @returns {string|null} Auth token or null if not found
 */
export function getAuthToken() {
  return getCookie('authToken') || getCookie('auth_token') || getCookie('token');
}

/**
 * Set authentication token in cookies
 * @param {string} token - Authentication token
 * @param {Object} options - Cookie options
 */
export function setAuthToken(token, options = {}) {
  const defaultOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  setCookie('authToken', token, { ...defaultOptions, ...options });
}

/**
 * Remove authentication token from cookies
 */
export function removeAuthToken() {
  deleteCookie('authToken', { path: '/' });
  deleteCookie('auth_token', { path: '/' });
  deleteCookie('token', { path: '/' });
}

/**
 * Get user data from cookies
 * @returns {Object|null} User data object or null if not found
 */
export function getUserData() {
  const userData = getCookie('userData') || getCookie('user_data') || getCookie('user');
  
  if (!userData) return null;
  
  try {
    return JSON.parse(decodeURIComponent(userData));
  } catch (error) {
    console.error('Error parsing user data from cookies:', error);
    return null;
  }
}

/**
 * Set user data in cookies
 * @param {Object} userData - User data object
 * @param {Object} options - Cookie options
 */
export function setUserData(userData, options = {}) {
  const defaultOptions = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  const encodedData = encodeURIComponent(JSON.stringify(userData));
  setCookie('userData', encodedData, { ...defaultOptions, ...options });
}

/**
 * Remove user data from cookies
 */
export function removeUserData() {
  deleteCookie('userData', { path: '/' });
  deleteCookie('user_data', { path: '/' });
  deleteCookie('user', { path: '/' });
}

/**
 * Clear all authentication-related cookies
 */
export function clearAuthCookies() {
  removeAuthToken();
  removeUserData();
}

/**
 * Clear all authentication data (alias for clearAuthCookies)
 */
export function clearAuthData() {
  removeAuthToken();
  removeUserData();
}