import DetailStoryPresenter from "./detail-story-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as Data from "../../data/api";
import { showFormattedDate } from "../../utils";
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
                    </div>
                    <div id="map" class="detail-map"></div>
                </div>
            </div>
        </div>
        `;
    }
    async afterRender() {
        // Do your job here
        this.#presenter = new DetailStoryPresenter( parseActivePathname().id, this, Data);

        await this.#presenter.getDetailStory();

    }

    showDataStory(story) {
        document.querySelector('#story-photo').src = story.photoUrl;
        document.querySelector('#desc-text').innerHTML = story.description;
        document.querySelector('#desc-username').innerHTML = `<i class="fa-solid fa-user"></i> Nama:  ${story.name}`;
        document.querySelector('#desc-createdAt').innerHTML = `<i class="fa-solid fa-calendar"></i> Tanggal:  ${showFormattedDate(story.createdAt)}`;
        document.querySelector('#lat').innerHTML = `<i class="fa-solid fa-location-dot"></i> Latitude: ${story.lat}`;
        document.querySelector('#lon').innerHTML = `<i class="fa-solid fa-location-dot"></i> Latitude: ${story.lon}`;
    }

    setupMap(story) {
        const map = L.map('map').setView([story.lat, story.lon], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        L.marker([story.lat, story.lon]).addTo(map);
    }
}