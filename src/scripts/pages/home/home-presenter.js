export default class HomePresenter {
    #content;
    #model;

    constructor({ content, model }) {
        this.#content = content;
        this.#model = model;
    }

    async loadData() {
        const stories = await this.#model.getData();
        console.log(stories.listStory);
        
        this.#content.showStories(stories.listStory);
        this.#content.showMap(stories.listStory);
    }
}