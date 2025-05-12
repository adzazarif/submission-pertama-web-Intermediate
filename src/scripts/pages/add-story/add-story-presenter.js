export default class AddStoryPresenter {
  #content;
  #model;
  constructor(content, model) {
    this.#content = content;
    this.#model = model;
  }

  async addStory({ description, photo, lat, lng }) {
    this.#content.showSubmitButtonLoading();
    try {
      const response = await this.#model.addStory({
        description,
        photo,
        lat,
        lng,
      });
      console.log(response);

      if (!response.ok) {
        console.error("addStory: response:", response);
        this.#content.addStoryFailed(response.message);
        return;
      }

      this.#content.addStorySuccessfully(response.message);
    } catch (error) {
      console.log("addStory: error:", error);
      this.#content.addStoryFailed(error.message);
    } finally {
      this.#content.hideSubmitButtonLoading();
    }
  }
}
