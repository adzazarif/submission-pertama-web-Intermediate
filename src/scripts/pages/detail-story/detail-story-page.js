import DetailStoryPresenter from "./detail-story-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as Data from "../../data/api";
import { showFormattedDate } from "../../utils";
import { isCurrentPushSubscriptionAvailable } from "../../utils/notification-helper";
import Database from '../../database';
export default class DetailStoryPage {
  #presenter;
  async render() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1>Detail Cerita</h1>
                <p>Ini adalah halaman detail cerita</p>
            </div>
            <div class="page-content">
                <img src="" alt="" class="detail-photo" id="story-photo">
                <div class="detail-desc">
                    <div class="desc">
                        <h2>Deskripsi</h2>
                        <p id="desc-text"></p>
                        <p id="desc-username"> </p>
                        <p id="desc-createdAt"> </p>
                        <p id="lat"></p>
                        <p id="lon"></p>
                       <div style="display: flex; justify-content: flex-end;gap: 10px">
                        <button id="report-detail-notify-me" type="button" class="btn-orange">Notify Me</button>
                        <div id="save-action-container"></div>
                       </div>
                    </div>
                    <div id="map" class="detail-map"></div>
                </div>
            </div>
        </div>
        `;
  }
  async afterRender() {
    // Do your job here
    this.#presenter = new DetailStoryPresenter(
      parseActivePathname().id,
      this,
      Data,
      Database
    );


    await this.disableNotifyMeButton();
    await this.#presenter.showSaveButton();
    await this.#presenter.getDetailStory();
  }

  async disableNotifyMeButton() {
    document.getElementById("report-detail-notify-me");
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    if (!isSubscribed) {
      console.log("disableNotifyMeButton");
      
      const button = document.getElementById("report-detail-notify-me");
      button.disabled = true;
      button.style.backgroundColor = "grey";
      button.style.cursor = "not-allowed";
    }
  }

  showDataStory(story) {
    document.querySelector("#story-photo").src = story.photoUrl;
    document.querySelector("#story-photo").alt = story.name;
    document.querySelector("#desc-text").innerHTML = story.description;
    document.querySelector(
      "#desc-username"
    ).innerHTML = `<i class="fa-solid fa-user"></i> Nama:  ${story.name}`;
    document.querySelector(
      "#desc-createdAt"
    ).innerHTML = `<i class="fa-solid fa-calendar"></i> Tanggal:  ${showFormattedDate(
      story.createdAt
    )}`;
    document.querySelector(
      "#lat"
    ).innerHTML = `<i class="fa-solid fa-location-dot"></i> Latitude: ${story.lat}`;
    document.querySelector(
      "#lon"
    ).innerHTML = `<i class="fa-solid fa-location-dot"></i> Latitude: ${story.lon}`;

    this.addNotifyMeEventListener();
  }

  setupMap(story) {
    const map = L.map("map").setView([story.lat, story.lon], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const marker = L.marker([story.lat, story.lon]);
    marker.addTo(map).bindPopup(`<p>${story.name}</p>`).openPopup();
  }

  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      this.#presenter.notifyMe();
    });
  }

  addSaveToBookmarkEventListener() {
    document.getElementById('save-action-container').innerHTML = `
      <button id="report-detail-save" type="button" class="btn-orange">Save to Bookmark</button>
    `;
    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  addRemoveToBookmarkEventListener() {
    document.getElementById('save-action-container').innerHTML = `
      <button id="report-detail-remove" type="button" class="btn-orange">Remove from Bookmark</button>
    `;
    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }
  saveToBookmarkFailed(message) {
    alert(message);
  }
  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  removeFromBookmarkFailed(message) {
    alert(message);
  }
}
