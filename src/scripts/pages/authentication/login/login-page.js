import { animatePageTransition } from "../../../utils";
import LoginPresenter from "./login-presenter";
import * as auth from "../../../utils/auth";
import * as Data from "../../../data/api";
export default class LoginPage {
  #presenter = null;
  async render() {
    return `
      <section class="login-section">
        <div class="login">
          <div class="login-container">
            <!-- Left Content -->
            <div class="login-form">
              <h2 class="login-title">LOGIN!</h2>
              <p class="login-subtitle">Masukkan email dan password Anda dengan benar.</p>

              <!-- Pesan -->
              <div id="message-box"></div>

              <form id="login-form" class="form">
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

                <button type="submit" id="btn-login" class="btn-login">Login</button>

                <div class="login-register">
                  <p>Belum punya akun? <a href="#/register" class="switch-page">Register</a></p>
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
    const checkbox = document.getElementById("show-password");
    const passwordInput = document.getElementById("input-password");

    if (checkbox && passwordInput) {
      checkbox.addEventListener("change", function () {
        passwordInput.type = this.checked ? "text" : "password";
      });
    }

    this.#presenter = new LoginPresenter(this, Data, auth);

    this.#setupForm();
    this.#setupTransition();
  }

  #setupForm() {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('input-email').value,
        password: document.getElementById('input-password').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  #setupTransition() {
    document.querySelector('.switch-page').addEventListener('click', (event) => {
      event.preventDefault();
      // const container = document.querySelector('.login-section');
      animatePageTransition('/register');
    });
  }

  showSubmitButtonLoading() {
    const submitButton = document.getElementById('btn-login');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = `<span class="spinner"></span>Loading...`;
    }
  }

    loginSuccessfully() {
      alert("Login Berhasil");
    // Redirect
      location.hash = '/';
  }
  
  hideSubmitButtonLoading() {
    const submitButton = document.getElementById('btn-login');

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Login';
    }
  }

  loginFailed(message) {
    alert(message);
  }
}
