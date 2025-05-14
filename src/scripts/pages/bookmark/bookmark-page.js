import Database from "../../database";
import BookmarkPresenter from "./bookmark-presenter";
import { showFormattedDate } from "../../utils";
export default class BookmarkPage {
    #presenter;
  async render() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1>Bookmark</h1>
                <p>Ini adalah halaman Bookmark</p>
                 </div>
                <div id="show-stories" class="show-stories" style="margin-top: -100px">
                <div id="map" class="map"></div>
                <div id="stories-list" class="stories-list">
                
                </div>
                </div>
        </div>
        `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      content: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedReports(message, reports) {
    const storiesList = document.querySelector("#stories-list");
    storiesList.innerHTML = "";

    reports.forEach((report) => {
      const item = document.createElement("div");
      item.classList.add("story-item");
      item.innerHTML = `
        <div class="story-item__header">
          <img src="${report.photoUrl}" alt="foto ${report.name}">
        </div>
        <div class="story-item__body">
          <h2>${report.name}</h2>
          <p>${report.description}</p>
          <p><i class="fa-solid fa-calendar"></i> ${showFormattedDate(
            report.createdAt
          )}</p>
        </div>
        <div class="story-item__footer">
          <a href="#/detail-story/${report.id}" class="read-more-btn" data-id="${
        report.id
      }">Read More</a>
        </div>
      `;
      storiesList.appendChild(item);
    });
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
}
