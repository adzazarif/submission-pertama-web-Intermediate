export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function animatePageTransition(targetPage) {
  const container = document.querySelector('#main-content');
  container.classList.add('fade-out');
  setTimeout(() => {
    location.hash = targetPage;
  }, 400);
}