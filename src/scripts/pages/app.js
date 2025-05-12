import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { getAccessToken } from "../utils/auth";
import { isServiceWorkerAvailable } from "../utils";
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from "../utils/notification-helper";

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

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('content-subscribe');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (isSubscribed) {
      pushNotificationTools.innerHTML = `
        <button id="unsubscribe-button" class="btn-orange">Unsubscribe</button>`;

        document.getElementById('unsubscribe-button').addEventListener('click', () => {
          unsubscribe().finally(() => {
            this.#setupPushNotification();
          });
        });
      return;
    }
    pushNotificationTools.innerHTML = `
      <button id="subscribe-button" class="btn-orange">Subscribe</button>`;
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  #hashNav() {
    const header = document.getElementById("header");
    const footer = document.getElementById("footer");
  
    const isLogin = !!getAccessToken();
  
    if (isLogin) {
      header.style.display = "block";
      footer.style.display = "block";
    } else {
      header.style.display = "none";
      footer.style.display = "none";
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (typeof page === "function") {
      page = page();
    }

    const loadContent = async () => {
      this.#content.innerHTML = await page.render();

      if (typeof page.afterRender === "function") {
        await page.afterRender();
        this.#hashNav();
        if (isServiceWorkerAvailable()) {
          this.#setupPushNotification();
        }
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(loadContent);
    } else {
      await loadContent();
    }
  }
}

export default App;
