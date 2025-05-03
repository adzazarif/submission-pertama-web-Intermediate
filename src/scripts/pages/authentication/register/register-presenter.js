export default class RegisterPresenter {
    #content
    #model
    constructor( content, model ) {
        this.#content = content;
        this.#model = model;
    }

    async getRegister({name, email, password}) {
        this.#content.showSubmitButtonLoading();
        try {
            const response = await this.#model.register({ name, email, password });
            console.log(response);
      
            if (!response.ok) {
              console.error('getRegister: response:', response);
              this.#content.registerFailed(response.message);
              return;
            }
      
            this.#content.registerSuccessfully(response.message);
          } catch (error) {
            console.log('getRegister: error:', error);
            this.#content.registerFailed(error.message);
          } finally {
            this.#content.hideSubmitButtonLoading();
          }
    }
}