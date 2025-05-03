export default class AddStoryPresenter {
    #content;
    #model;
    constructor({ content, model }) {
        this.#content = content;
        this.#model = model;
    }
}