import { animatePageTransition } from "../../../utils";
import RegisterPresenter from "./register-presenter";
import * as Data from "../../../data/api";
export default class RegisterPage {
  #presenter;
    async render() {
        return `
            <section class="login-section">
        <div class="login">
          <div class="login-container">
            <!-- Left Content -->
            <div class="login-form">
              <h2 class="login-title">Register!</h2>
              <p class="login-subtitle">Daftarkan akun anda sekarang!</p>

              <!-- Pesan -->
              <div id="message-box"></div>

              <form id="register-form" class="form">
                 <div class="form-group">
                  <label for="input-nama">Nama</label>
                  <input type="text" name="nama" id="input-nama" placeholder="Masukkan nama Anda" required />
                </div>

                <div class="form-group">
                  <label for="input-email">Email</label>
                  <input type="email" name="email" id="input-email" placeholder="Masukkan email Anda" required autofocus />
                </div>

                <div class="form-group">
                  <label for="input-password">Password</label>
                  <input type="password" name="password" id="input-password" placeholder="Masukkan password Anda" required />
                  <div class="checkbox-container">
                    <input type="checkbox" id="show-password" />
                    <label for="show-password">Tampilkan Password</label>
                  </div>
                </div>

                <button type="submit" id="btn-register" class="btn-login">Register</button>

                <div class="login-register">
                  <p>Sudah Punya Akun? <a href="#/login" class="switch-page">Login</a></p>
                </div>
              </form>
            </div>

            <!-- Right Content -->
            <div class="login-info">
              <h1 class="info-title">Mari Cerita</h1>
              <p class="info-text">
                Mari Cerita adalah sebuah website yang menyajikan cerita seputar kehidupan sehari-hari. Website ini dibuat untuk memenuhi tugas akhir dari mata kuliah Pemrograman Berbasis Web.
              </p>
            </div>
          </div>
        </div>
      </section>
        `;
    }

    async afterRender() {
        // Do your job here
        this.#presenter = new RegisterPresenter(this, Data);

        this.#setupForm();
        this.#setupTransition();
    }

    #setupForm() {
      document.getElementById('register-form').addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const data = {
          name: document.getElementById('input-nama').value,
          email: document.getElementById('input-email').value,
          password: document.getElementById('input-password').value,
        };
        await this.#presenter.getRegister(data);
      });
      }

      #setupTransition() {
        document.querySelector('.switch-page').addEventListener('click', (event) => {
          event.preventDefault();
          // const container = document.querySelector('.login-section');
          animatePageTransition('/login');
        });
      }

      registerFailed(message) {
        alert(message);
      }

      registerSuccessfully(message) {
        alert(message);

        // Redirect
        location.hash = '/login';
      }

      hideSubmitButtonLoading() {
        const submitButton = document.getElementById('btn-register');
    
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = 'Login';
        }
      }

      showSubmitButtonLoading() {
        const submitButton = document.getElementById('btn-register');
    
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = `<span class="spinner"></span>Loading...`;
        }
      }
}