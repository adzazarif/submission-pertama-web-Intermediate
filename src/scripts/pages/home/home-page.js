import HomePresenter from "./home-presenter";
import * as Data from "../../data/api";
import { showFormattedDate } from "../../utils";
export default class HomePage {
  #presenter;
  async render() {
    return `
          <div class="hero">
            <img src="./images/hero.png" alt="foto tampilan utama yang berisi cerita">
            <div class="desc">
              <h1 class="hero-title">Mari Cerita</h1>
            <p class="hero-subtitle">Kumpulan cerita seputar kehidupan sehari-hari. Buat kamu yang sedang mencari inspirasi cerita, mari cerita</p>
            <a href="#show-stories" class="hero-button">Mari Jelajahi</a>
            </div>
          </div>

    <div id="show-stories" class="show-stories">
    <h1>Latest Story</h1>
      <div id="map" class="map"></div>
      <div id="stories-list" class="stories-list">
      
      </div>
    </div>

      
    `;
  }

  async afterRender() {
    // Do your job here
    this.#presenter = new HomePresenter({
      content: this,
      model: Data,
    });

    await this.#presenter.loadData();
  }

  showStories(stories) {
    const storiesList = document.querySelector("#stories-list");

    stories.forEach((story) => {
      const maxLength = 60;
      const shortDesc =
        story.description.length > maxLength
          ? story.description.slice(0, maxLength) + "..."
          : story.description;

      const item = document.createElement("div");
      item.classList.add("story-item");
      item.innerHTML = `
        <div class="story-item__header">
          <img src="${story.photoUrl}" alt="foto ${story.name}">
        </div>
        <div class="story-item__body">
          <h2>${story.name}</h2>
          <p>${shortDesc}</p>
          <p><i class="fa-solid fa-calendar"></i> ${showFormattedDate(
            story.createdAt
          )}</p>
        </div>
        <div class="story-item__footer">
          <a href="#/detail-story/${story.id}" class="read-more-btn" data-id="${
        story.id
      }">Read More</a>
        </div>
      `;

      storiesList.appendChild(item);

      // Tambahkan animasi transisi
      const image = item.querySelector("img");
      const readMoreBtn = item.querySelector(".read-more-btn");
      readMoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = readMoreBtn.dataset.id;
        this.transitionToDetailPage(image, id);
      });
    });
  }

  transitionToDetailPage(image, id) {
    if (image.complete) {
      this.animateImageAndTransition(image, id);
    } else {
      image.onload = () => this.animateImageAndTransition(image, id);
    }
  }

  animateImageAndTransition(image, id) {
    const keyframes = [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.1)", opacity: 1 },
      { transform: "scale(0.9)", opacity: 0.7 },
    ];

    const options = {
      duration: 400,
      easing: "ease-in-out",
    };

    const animation = new Animation(
      new KeyframeEffect(image, keyframes, options)
    );
    animation.play();

    animation.onfinish = () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.hash = `#/detail-story/${id}`;
        });
      } else {
        window.location.hash = `#/detail-story/${id}`;
      }
    };
  }

  showMap(stories) {
    const map = L.map("map").setView([-6.175, 106.827], 5 );

    // Tambahkan tile layer terlebih dahulu
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (!story.lat || !story.lon) return;
      // Tambahkan marker
      const marker = L.marker([story.lat, story.lon]).addTo(map);

      // Tambahkan popup
      marker.bindPopup(`
        <div class="popup-content">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p style="margin-bottom: 10px"><i class="fa-solid fa-calendar"></i> ${showFormattedDate(
            story.createdAt
          )}</p>
          <a href="#/detail-story/${story.id}" class="button-util">Read More</a>
        </div>
      `);

      // Tambahkan event click dengan efek flyTo
      marker.on("click", () => {
        map.flyTo([story.lat, story.lon], 15, {
          duration: 1.5, // durasi animasi dalam detik
        });
      });
    });
  }

  showLoading() {
    const element = `
      <div id="loading" class="loading-overlay">
        <div class="spinr" role="status" aria-label="Loading..."></div>
      </div>
    `;

    const mainContent = document.querySelector("#main-content");

    mainContent.insertAdjacentHTML("afterbegin", element);

    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "flex";
  }

  hideLoading() {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "none";
  }
}
