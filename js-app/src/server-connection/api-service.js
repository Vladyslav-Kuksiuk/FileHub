import {RequestService} from './request-service';

export class ApiService {
  #requestService;
  #userToken;

  /**
   * @param {RequestService} requestService
   */
  constructor(requestService) {
    this.#requestService = requestService;
  }

  /**
   * @param {UserData} data
   */
  async login(data) {
    return await this.#requestService.post('api/login', {
      username: data.login,
      password: data.password,
    }).then((response) => {
      if (response.status === 401) {
        throw new Error('Invalid login or password');
      }
      if (!response.ok) {
        throw new Error('An error occurred. Please try again.');
      }
      response.json().then((jsonData) => {
        this.#userToken = jsonData.token;
      });
    });
  }
}
