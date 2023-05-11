import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Configurations {
  
  public static serviceLoginCoreEndPoint = 'https://serengeti.aifrica.co.kr/api.login/auth/v1/handle/';

  getLoginEndPoint: () => string;

  public static getServiceLoginEndPoint(config: Configurations) {
    if (config && config.getLoginEndPoint) {
      return config.getLoginEndPoint();
    } else {
      return Configurations.serviceLoginCoreEndPoint;
    }
  }

  constructor() {
  }
}
