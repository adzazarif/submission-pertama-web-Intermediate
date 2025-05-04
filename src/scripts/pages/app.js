import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { setupSkipToContent, transitionHelper } from '../utils';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) return;
    const loadContent = async () => {
      this.#content.classList.remove('fade-out');
      this.#content.classList.remove('fade-in');

      // await new Promise((resolve) => setTimeout(resolve, 100));

      this.#content.innerHTML = await page.render();

      void this.#content.offsetWidth;
      this.#content.classList.add('fade-in');
      

    this.#content.innerHTML = await page.render();
    await page.afterRender();
    }

    if (document.startViewTransition) {
      document.startViewTransition(loadContent);
    } else {
      await loadContent();
    }
  }

}

export default App;
