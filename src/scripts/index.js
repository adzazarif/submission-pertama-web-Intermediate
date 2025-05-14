// CSS imports
import "../styles/styles.css";
import App from "./pages/app";
import Camera from "./utils/camera";
import { getLogout } from "./utils/auth";

import { registerServiceWorker } from './utils';

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-to-content");

  skipLink.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah refresh halaman
    skipLink.blur(); // Menghilangkan fokus skip to content
    mainContent.focus(); // Fokus ke konten utama
    mainContent.scrollIntoView(); // Halaman scroll ke konten utama
  });
  await registerServiceWorker();
  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    // Stop all active media
    Camera.stopAllStreams();
  });

  window.addEventListener("hashchange", () => {
    if (location.hash === "#/logout") {
      const confirmLogout = confirm("Apakah kamu yakin ingin keluar?");

      if (confirmLogout) {
        getLogout();
        window.location.hash = "/login";
      } else {
        window.history.back();
      }
    }
  });

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");

    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});
