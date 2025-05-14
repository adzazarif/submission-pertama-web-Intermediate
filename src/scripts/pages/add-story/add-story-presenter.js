import { simulatePush } from "../../utils/notification-helper";
import { isCurrentPushSubscriptionAvailable } from "../../utils/notification-helper";
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

      const isSubscribed = await isCurrentPushSubscriptionAvailable();
      if (isSubscribed) {
        console.log("isSubscribed");
        
        await this.notifyMe();
      };

      this.#content.addStorySuccessfully(response.message);
    } catch (error) {
      console.log("addStory: error:", error);
      this.#content.addStoryFailed(error.message);
    } finally {
      this.#content.hideSubmitButtonLoading();
    }
  }

    async notifyMe() {
      try {
        const response = await simulatePush("New Story", "Data baru telah ditambahkan");
      } catch (error) {
        console.error('notifyMe: error:', error);
      }
    }
}
