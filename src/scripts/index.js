// CSS imports
import '../styles/styles.css';
import { getActiveRoute } from './routes/url-parser';
import App from './pages/app';

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

  await app.renderPage();
  hashNav();
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
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


