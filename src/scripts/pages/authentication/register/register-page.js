import { animatePageTransition } from "../../../utils";
export default class RegisterPage {
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

              <form action="/cek-login" method="POST" class="form">
                 <div class="form-group">
                  <label for="nama">Nama</label>
                  <input type="text" name="nama" id="nama" placeholder="Masukkan nama Anda" required />
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" name="email" id="email" placeholder="Masukkan email Anda" required />
                </div>

                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" name="password" id="password" placeholder="Masukkan password Anda" required />
                  <div class="checkbox-container">
                    <input type="checkbox" id="show-password" />
                    <label for="show-password">Tampilkan Password</label>
                  </div>
                </div>

                <button type="submit" class="btn-login">Register</button>

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
        this.#setupTransition();
    }

      #setupTransition() {
        document.querySelector('.switch-page').addEventListener('click', (event) => {
          event.preventDefault();
          // const container = document.querySelector('.login-section');
          animatePageTransition('/login');
        });
      }
}