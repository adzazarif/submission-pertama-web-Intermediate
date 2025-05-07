// CSS imports
import '../styles/styles.css';
import { getActiveRoute } from './routes/url-parser';
import App from './pages/app';
import Camera from './utils/camera';
import { getLogout } from './utils/auth';
function hashNav() {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const activeRoute = getActiveRoute();
  console.log(activeRoute);
  if (activeRoute === '/login' || activeRoute === '/register') {    
    header.style.display = 'none';
    footer.style.display = 'none';
  } else {
    header.style.display = 'block';
    footer.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-to-content');

  skipLink.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    skipLink.blur(); // Menghilangkan fokus skip to content
    mainContent.focus(); // Fokus ke konten utama
    mainContent.scrollIntoView(); // Halaman scroll ke konten utama
  });
  hashNav();
  await app.renderPage();
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    console.log("berubah");
    
    if (location.hash === '#/logout') {
      const confirmLogout = confirm('Apakah kamu yakin ingin keluar?');

      if (confirmLogout) {
        getLogout();
        window.location.hash = '/login';
        hashNav();
      } else {
        window.history.back();
      }
    }

  hashNav();
    // Stop all active media
    Camera.stopAllStreams();
  });

    window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


 
});


