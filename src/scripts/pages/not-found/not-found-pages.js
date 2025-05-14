class NotFoundPage {
    async render() {
      return `
        <section class="not-found">
          <h2>404 - Halaman Tidak Ditemukan</h2>
          <p>Oops! Halaman yang kamu cari tidak tersedia.</p>
          <a href="#/">Kembali ke Beranda</a>
        </section>
      `;
    }
  
    async afterRender() {
      // Tidak ada logic tambahan
    }
  }
  
  export default NotFoundPage;
  