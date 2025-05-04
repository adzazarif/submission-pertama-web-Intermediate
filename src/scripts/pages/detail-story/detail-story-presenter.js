export default class DetailStoryPresenter {
    #content;
    #model;
    #storyId;
    constructor( storyId, content, model ) {
        this.#content = content;
        this.#model = model;
        this.#storyId = storyId;
    }

    async getDetailStory() {
        // this.#content.showSubmitButtonLoading();
        try {
            const response = await this.#model.getDetailStory(this.#storyId);
            console.log(response);
      
            if (!response.ok) {
              console.error('getDetailStory: response:', response);
              this.#content.detailStoryFailed(response.message);
              return;
            }
      
            this.#content.showDataStory(response.story);
            this.#content.setupMap(response.story);
          } catch (error) {
            console.log('getDetailStory: error:', error);
            // this.#content.detailStoryFailed(error.message);
          } finally {
            // this.#content.hideSubmitButtonLoading();
          }
    }
}