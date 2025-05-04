import AddStoryPresenter from "./add-story-presenter"
import * as Data from "../../data/api";
import { convertBase64ToBlob } from "../../utils";
import Camera from "../../utils/camera";
import CONFIG from "../../config";
export default class AddStoryPage {
    #presenter;
    #camera;
    #form;
    #takenPicture;
    #lat;
    #lng;
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
                  <input type="file" name="photo" accept="image/*" id="input-photo" />
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
                  <button id="remove-image" type="button" class="btn-light">Hapus Gambar</button>
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
                          <label for="input-latitude">Latitude</label>
                          <input type="text" name="input-latitude" id="latitude" readonly />
                      </div>
                      <div style="width: 50%">
                          <label for="input-longitude">Longitude</label>
                          <input type="text" name="input-longitude" id="longitude" readonly />
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
            photo: this.#takenPicture[0].blob,
            lat: this.#lat,
            lng: this.#lng
          }
          this.#presenter.addStory(data);
        });

        const preview = document.getElementById('preview');
        document.getElementById('preview-cam').addEventListener('click', async (event) => {
          event.preventDefault();
          preview.classList.add('active');
        
          // Tampilkan elemen kamera
          this.#toggleCameraElements(true);
        
          this.#setupCamera();
          await this.#camera.launch();
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
          this.#takenPicture = [];
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

      #showPreview(imageURL, imageId) {
        const btnRemove = document.getElementById('remove-image');
        const previewImage = document.getElementById('preview-image');
        const preview = document.getElementById('preview');
        
        preview.classList.add('active');
        previewImage.src = imageURL;
        previewImage.style.display = 'block';
        btnRemove.style.display = 'block';
        
        btnRemove.dataset.deletepictureid = imageId;
      }
      
    
      async #populateTakenPictures() {
        const previewImg = document.getElementById('preview-image');
        const btnRemove = document.getElementById('remove-image');
      
        if (this.#takenPicture.length === 0) {
          previewImg.style.display = 'none';
          btnRemove.style.display = 'none';
          previewImg.src = '';
          return;
        }
        
        
        const picture = this.#takenPicture[0]; 
        const imageUrl = URL.createObjectURL(picture.blob);
        this.#showPreview(imageUrl, picture.id);
      
        btnRemove.onclick = () => {
          this.#removePicture(picture.id);
          this.#populateTakenPictures(); 
          document.getElementById('input-photo').value = ''; 
        };
      }
      
      #toggleCameraElements(show) {
        const display = show ? 'block' : 'none';
        document.getElementById('video').style.display = display;
        document.getElementById('options-camera').style.display = display;
        document.querySelector('.video-controls').style.display = show ? 'flex' : 'none';
      }      
      
    
      #removePicture(id) {
        const selectedPicture = this.#takenPicture.find(picture => picture.id === id);
        if (!selectedPicture) return null;
      
        this.#takenPicture = this.#takenPicture.filter(picture => picture.id !== id);
        return selectedPicture;
      }
      

      #showUploadPhoto() {
        const btnUploadPhoto = document.getElementById('upload-photo');
        const inputPhoto = document.getElementById('input-photo');
      
        btnUploadPhoto.addEventListener('click', (event) => {
          event.preventDefault();
          inputPhoto.click();
        });
      
        inputPhoto.addEventListener('change', async (event) => {
          const file = event.target.files[0];
          if (!file) return;
      
          // Kosongkan kamera
          this.#takenPicture = [];
      

          this.#toggleCameraElements(false);
      
          // Buat blob URL dari file
          const imageBlob = file instanceof Blob ? file : await convertBase64ToBlob(file, 'image/png');
      
          const newDocumentation = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            blob: imageBlob,
          };
      
          this.#takenPicture.push(newDocumentation);
          await this.#populateTakenPictures();
        });
      }
      

      #setupMap() {
        const map = L.map('map').setView([-6.175, 106.827], 12);
      
        // Layer OpenStreetMap
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });
      
        // Layer MapTiler
        const mapTilerLayer = L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=O1ZJB6XuHzgTSPNwgD5a', {
          attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; OpenStreetMap contributors',
        });
      
        // Tambahkan layer OSM sebagai default
        osmLayer.addTo(map);
      
        // Kontrol untuk memilih base layer
        const baseLayers = {
          "OpenStreetMap": osmLayer,
          "MapTiler": mapTilerLayer
        };
      
        L.control.layers(baseLayers).addTo(map);
      
        // Sisa kode map (lokasi, marker, dsb.)
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
          this.#lat = lat.toFixed(6);
          this.#lng = lng.toFixed(6);
      
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
              this.#lat = latitude.toFixed(6);
              this.#lng = longitude.toFixed(6);
      
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

      showSubmitButtonLoading() {
        const submitButton = document.getElementById('btn-add-story');
    
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = `<span class="spinner"></span>Loading...`;
        }
      }
      hideSubmitButtonLoading() {
        const submitButton = document.getElementById('btn-add-story');
    
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Tambah Cerita';
        }
      }
      
      addStorySuccessfully(message) {
        alert(message);

        // Redirect
        location.hash = '/';
      }

      addStoryFailed(message) {
        alert(message);
      }
      
      
}