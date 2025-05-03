import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  DETAILSTORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  getAllStoriesGuest: `${CONFIG.BASE_URL}/stories/guest`,
};

export async function getData() {
  const accessToken = getAccessToken();
  const fetchResponse = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await fetchResponse.json();
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function register({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function addStory(credentials) {
  const fetchResponse = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credentials.token}`,
    },
    body: JSON.stringify(credentials),
  });
  return await fetchResponse.json();
}

export async function getDetailStory(id) {
  const fetchResponse = await fetch(ENDPOINTS.DETAILSTORY(id));
  return await fetchResponse.json();
}