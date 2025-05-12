export default class HomePresenter {
  #content;
  #model;

  constructor({ content, model }) {
    this.#content = content;
    this.#model = model;
  }

  async loadData() {
    this.#content.showLoading();
    try {
      const response = await this.#model.getData();

      if (!response.ok) {
        console.error("getStories: response:", response);
        return;
      }

      this.#content.showStories(response.listStory);
      this.#content.showMap(response.listStory);
    } catch (error) {
      console.log("getStories: error:", error);
    } finally {
      this.#content.hideLoading();
    }
  }
}
