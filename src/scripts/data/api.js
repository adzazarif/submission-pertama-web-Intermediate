import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  DETAILSTORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  getAllStoriesGuest: `${CONFIG.BASE_URL}/stories/guest`,
};

export async function getData() {
  const fetchResponse = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
    headers: {
      Authorization: `Bearer`,
    },
  });

  return await fetchResponse.json();
}

export async function login(credentials) {
  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await fetchResponse.json();
}

export async function register(credentials) {
  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return await fetchResponse.json();
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