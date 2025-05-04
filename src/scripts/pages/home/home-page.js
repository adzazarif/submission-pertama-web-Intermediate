import HomePresenter from "./home-presenter";
import * as Data from "../../data/api";
import { showFormattedDate } from "../../utils";
export default class HomePage {
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
    const homePresenter = new HomePresenter({
      content: this,
      model: Data,
    })

    await homePresenter.loadData();
  }

  showStories(stories) {
    const storiesList = document.querySelector('#stories-list');
  
    stories.forEach((story) => {
      const maxLength = 60; 
      const shortDesc = story.description.length > maxLength
        ? story.description.slice(0, maxLength) + '...'
        : story.description;
  
      storiesList.innerHTML += `
        <div class="story-item">
          <div class="story-item__header">
            <img src="${story.photoUrl}" alt="foto ${story.name}">
          </div>
          <div class="story-item__body">
            <h2>${story.name}</h2>
            <p>${shortDesc}</p>
            <p><i class="fa-solid fa-calendar"></i> ${showFormattedDate(story.createdAt)}</p>
          </div>
          <div class="story-item__footer">
            <a href="#/detail-story/${story.id}">Read More</a>
          </div>
        </div>
      `;
    });
  }
  

  showMap(stories) {
    const map = L.map('map').setView([-6.175, 106.827], 12);
  
    // Tambahkan tile layer terlebih dahulu
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    stories.forEach((story) => {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
  
      // Tambahkan popup
      marker.bindPopup(`
        <div class="popup-content">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p style="margin-bottom: 10px"><i class="fa-solid fa-calendar"></i> ${showFormattedDate(story.createdAt)}</p>
          <a href="#/detail-story/${story.id}" class="button-util">Read More</a>
        </div>
      `);
  
      // Tambahkan event click dengan efek flyTo
      marker.on('click', () => {
        map.flyTo([story.lat, story.lon], 15, {
          duration: 1.5, // durasi animasi dalam detik
        });
      });
    });
  }
  


}
