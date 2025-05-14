export default class BookmarkPresenter {
    #content;
    #model;
   
    constructor({ content, model }) {
      this.#content = content;
      this.#model = model;
    }

    async initialGalleryAndMap() {
        // this.#content.showReportsListLoading();
     
        try {
          const listOfReports = await this.#model.getAllReports();
        //   const reports = await Promise.all(listOfReports.map(reportMapper));
            // console.log(reports);
            
          const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
          this.#content.showMap(listOfReports);
          this.#content.populateBookmarkedReports(message, listOfReports);
        } catch (error) {
          console.error('initialGalleryAndMap: error:', error);
        //   this.#content.populateBookmarkedReportsError(error.message);
        } finally {
        //   this.#content.hideReportsListLoading();
        }
      }
}