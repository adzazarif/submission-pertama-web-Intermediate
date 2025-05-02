import CONFIG from '../config';

const ENDPOINTS = {
  login: `${CONFIG.BASE_URL}/login`,
  register: `${CONFIG.BASE_URL}/register`,
  stories: `${CONFIG.BASE_URL}/stories`,
  detailStory: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  getAllStoriesGuest: `${CONFIG.BASE_URL}/stories/guest`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}