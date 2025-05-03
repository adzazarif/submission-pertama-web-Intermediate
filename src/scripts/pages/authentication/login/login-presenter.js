export default class LoginPresenter {
    #model
    #content
    #authModel
    constructor(content, model, authModel) {
        this.#content = content;
        this.#model = model;
        this.#authModel = authModel;
    }

    async getLogin({email, password}) {
        this.#content.showSubmitButtonLoading();
        try {
            const response = await this.#model.getLogin({ email, password });
            console.log(response);
      
            if (!response.ok) {
              console.error('getLogin: response:', response);
              this.#content.loginFailed(response.message);
              return;
            }
      
            this.#authModel.putAccessToken(response.loginResult.token);
      
            this.#content.loginSuccessfully(response.message, response.data);
          } catch (error) {
            console.log('getLogin: error:', error);
            this.#content.loginFailed(error.message);
          } finally {
            this.#content.hideSubmitButtonLoading();
          }
        
    }

}