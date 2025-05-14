import { simulatePush } from "../../utils/notification-helper";
export default class DetailStoryPresenter {
  #content;
  #model;
  #storyId;
  #response;
  #dbModel;
  constructor(storyId, content, model, dbModel) {
    this.#content = content;
    this.#model = model;
    this.#storyId = storyId;
    this.#dbModel = dbModel;
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

  async #isReportSaved() {
    return !!(await this.#dbModel.getReportById(this.#storyId));
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#content.addRemoveToBookmarkEventListener();
      return;
    }
    this.#content.addSaveToBookmarkEventListener();
  }



  async notifyMe() {
    try {
      const response = await simulatePush(this.#response.story.name, this.#response.story.description);
    } catch (error) {
      console.error('notifyMe: error:', error);
    }
  }

  async saveReport() {
    try {
      const report = await this.#model.getDetailStory(this.#storyId);
      await this.#dbModel.putReport(report.story);
      this.#content.saveToBookmarkSuccessfully('Success to save to bookmark');
    } catch (error) {
      console.error('saveReport: error:', error);
      this.#content.saveToBookmarkFailed(error.message);
    }
  }

  async removeReport() {
    try {
      await this.#dbModel.removeReport(this.#storyId);
      this.#content.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#content.removeFromBookmarkFailed(error.message);
    }
  }
}
