import AddStoryPresenter from "./add-story-presenter"
import * as Data from "../../data/api";
import { convertBase64ToBlob } from "../../utils";
import Camera from "../../utils/camera";
export default class AddStoryPage {
    #presenter;
    #camera;
    #form;
    #takenPicture = false;
    async render() {
        return `
             <div class="page-container">
      <div class="page-header">
          <h1>Tambah Cerita</h1>
          <p>Tambah cerita seputar kehidupan sehari-hari</p>
      </div>
      <div class="page-content">
          <form id="add-story-form">

              <div class="form-group">
                  <label for="input-description">Deskripsi Cerita</label>
                  <textarea name="description" id="input-description" placeholder="Masukkan deskripsi cerita Anda"></textarea>
              </div>

              <div class="form-group">
                  <label>Ambil atau Pilih Gambar</label>
                  <small>Abadikan moment terindah Anda melalui cerita ini</small>
                  <div class="btn-cam">
                  <button id="upload-photo" class="btn-orange">Upload Gambar Dari Perangkat anda</button>
                  <input type="file" name="photo" id="input-photo" />
                  <button id="preview-cam" class="btn-light">Buka Kamera</button>
                  </div>

                  <div class="preview" id="preview">
                      <video id="video" autoplay playsinline></video>
                      <select id="options-camera" class="select-camera">
                         
                      </select>
                      <div class="video-controls">
                          <button id="button-capture" type="button" class="btn-orange">Ambil Gambar</button>
                          <button id="button-stop" class="btn-light">Stop</button>
                      </div>
                  
                  <canvas id="canvas"></canvas>
                  <img id="preview-image" alt="Preview Image" class="preview-image" />
                  <button id="remove-image" class="btn-light">Hapus Gambar</button>
              </div>
              </div>

              <div class="form-map">
                  <label for="location">Lokasi</label>
                  <div class="map-container">
                  <button id="get-location" class="btn-orange">Lokasi Saya</button>
                  <div id="info-map" class="info-map">
                  <p id="info-map-text"></p>
                  </div>
                  <div id="map" class="map-form"></div></div>
                  <div class="koordinat">
                      <div style="width: 50%">
                          <label for="latitude">Latitude</label>
                          <input type="text" name="latitude" id="latitude" readonly />
                      </div>
                      <div style="width: 50%">
                          <label for="longitude">Longitude</label>
                          <input type="text" name="longitude" id="longitude" readonly />
                      </div>
                  </div>
              </div>

              <button type="submit" id="btn-add-story" class="btn-orange">Tambah Cerita</button>
          </form>
      </div>
      </div>
        `
    }

    async afterRender() {
        // Do your job here
        this.#presenter = new AddStoryPresenter(this, Data);
        this.#takenPicture = [];

        this.#showUploadPhoto();
        this.#setupForm();
        this.#setupMap();
    }

    #setupForm() {
        this.#form = document.getElementById('add-story-form');
        this.#form.addEventListener('submit', (event) => {
          event.preventDefault();

          const data = {
            description: document.getElementById('input-description').value,
            photo: document.getElementById('input-photo').files[0],
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value,
            takenPicture: this.#takenPicture,
          }
        //   this.#presenter.addStory();
        });

        const preview = document.getElementById('preview');
        document.getElementById('preview-cam').addEventListener('click', async (event) => {
          event.preventDefault();
          preview.classList.add('active');
            this.#setupCamera();
            await this.#camera.launch();
            return
        });

        document.getElementById('button-stop').addEventListener('click', async (event) => {
          event.preventDefault();
          await this.#camera.stop();
          preview.classList.remove('active');
        });
      }

    #setupCamera() {
        if (!this.#camera) {
          this.#camera = new Camera({
            video: document.getElementById('video'),
            cameraSelect: document.getElementById('options-camera'),
            canvas: document.getElementById('canvas'),
          });
        }
    
        this.#camera.addCheeseButtonListener('#button-capture', async () => {
          const image = await this.#camera.takePicture();
          await this.#addTakenPicture(image);
          await this.#populateTakenPictures();
        });
      }
    
      async #addTakenPicture(image) {
        let blob = image;
        if (image instanceof String) {
          blob = await convertBase64ToBlob(image, 'image/png');
        }
    
        const newDocumentation = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          blob: blob,
        };
        this.#takenPicture = [...this.#takenPicture, newDocumentation];
      }

      #showPreview(imageURL) {
        const btnRemove = document.getElementById('remove-image');
        const preview = document.getElementById('preview-image');
        preview.src = imageURL;
        preview.style.display = 'block';
        btnRemove.style.display = 'block';
      }
    
      async #populateTakenPictures() {
        this.#takenPicture.reduce((accumulator, picture) => {
          const imageUrl = URL.createObjectURL(picture.blob);
          return this.#showPreview(imageUrl);
        }, '');
    
        
    
        document.querySelectorAll('button[data-deletepictureid]').forEach((button) =>
          button.addEventListener('click', (event) => {
            const pictureId = event.currentTarget.dataset.deletepictureid;
    
            const deleted = this.#removePicture(pictureId);
            if (!deleted) {
              console.log(`Picture with id ${pictureId} was not found`);
            }
    
            // Updating taken pictures
            this.#populateTakenPictures();
          }),
        );
      }
    
      #removePicture(id) {
        const selectedPicture = this.#takenPicture.find((picture) => {
          return picture.id == id;
        });
    
        // Check if founded selectedPicture is available
        if (!selectedPicture) {
          return null;
        }
    
        // Deleting selected selectedPicture from takenPictures
        this.#takenPicture = this.#takenPicture.filter((picture) => {
          return picture.id != selectedPicture.id;
        });
    
        return selectedPicture;
      }

      #showUploadPhoto() {
        const btnUploadPhoto = document.getElementById('upload-photo');
        const inputPhoto = document.getElementById('input-photo');

        btnUploadPhoto.addEventListener('click', () => {
          inputPhoto.click();
        });
      }

      #setupMap() {
        const map = L.map('map').setView([-6.175, 106.827], 12);
      
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
      
        const getLocationButton = document.getElementById('get-location');
        const latitudeInput = document.getElementById('latitude');
        const longitudeInput = document.getElementById('longitude');
      
        const mapInfo = document.getElementById('info-map');
        const mapText = document.getElementById('info-map-text');
        mapText.innerHTML = 'Silahkan klik tombol di atas ini untuk mendapatkan lokasi Anda.';
      
        let marker; 

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          latitudeInput.value = lat.toFixed(6);
          longitudeInput.value = lng.toFixed(6);
      
          if (marker) {
            marker.setLatLng(e.latlng);
          } else {
            marker = L.marker(e.latlng).addTo(map).bindPopup("Lokasi dipilih").openPopup();
          }
        });
      
        getLocationButton.addEventListener('click', async (e) => {
          e.preventDefault();
          mapText.innerHTML = '<span class="spinner"></span> Sedang mengambil lokasi...';
      
          if (!navigator.geolocation) {
            mapText.innerText = 'Geolocation tidak didukung di browser Anda.';
            return;
          }
      
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
      
              latitudeInput.value = latitude.toFixed(6);
              longitudeInput.value = longitude.toFixed(6);
      
              const latlng = L.latLng(latitude, longitude);
      
              if (marker) {
                marker.setLatLng(latlng);
              } else {
                marker = L.marker(latlng).addTo(map).bindPopup("Lokasi Saya").openPopup();
              }
      
              map.flyTo(latlng, 15);
              mapInfo.style.display = 'none';
            },
            (error) => {
              console.error(error);
              mapText.innerText = 'Tolong aktifkan permission lokasi terlebih dahulu.';
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      }
      
      
}