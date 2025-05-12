import { simulatePush } from "../../utils/notification-helper";
export default class DetailStoryPresenter {
  #content;
  #model;
  #storyId;
  #response;
  constructor(storyId, content, model) {
    this.#content = content;
    this.#model = model;
    this.#storyId = storyId;
  }

  async getDetailStory() {
    // this.#content.showSubmitButtonLoading();
    try {
      this.#response = await this.#model.getDetailStory(this.#storyId);

      if (!this.#response.ok) {
        console.error("getDetailStory: response:", this.#response);
        this.#content.detailStoryFailed(this.#response.message);
        return;
      }

      this.#content.showDataStory(this.#response.story);
      this.#content.setupMap(this.#response.story);
    } catch (error) {
      console.log("getDetailStory: error:", error);
      // this.#content.detailStoryFailed(error.message);
    } finally {
      // this.#content.hideSubmitButtonLoading();
    }
  }

  async notifyMe() {
    try {
      const response = await simulatePush(this.#response.story.name, this.#response.story.description);
      console.log('notifyMe:', response.message);
    } catch (error) {
      console.error('notifyMe: error:', error);
    }
  }
}
