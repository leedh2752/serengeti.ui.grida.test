import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, timeout} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GridaService {

  private gridaEndPoint = environment.gridaEndPoint + 'post';
  private aiChatbotEndPoint = environment.gridaEndPoint + 'serengeti/chat';
  private aiPatingEndPoint = environment.gridaEndPoint + 'serengeti/image';

  constructor(
    private http: HttpClient
  ) {
  }

  public generateImageToVoice(audioFile: any, imageType: string): Observable<any> {
    const body = new FormData();
    body.append('text', imageType);
    body.append('voice', new File([audioFile], 'input.webm'));
    return this.http.post(this.aiPatingEndPoint, body);
  }

  public generateAnswer(chatType: string, content?: any, chatList?: any, requestFile?: any): Observable<any> {
    const body = new FormData();
    body.append('chatType', chatType);
    if (content) {
      body.append('content', content);
    }
    if (chatList) {
      body.append('chatList', JSON.stringify(chatList));
    }
    if (requestFile) {
      body.append('requestFile', requestFile);
    }
    return this.http.post(this.aiChatbotEndPoint, body).pipe(
      timeout(30000),
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  public imageRegistration(sttRequests, imageFile): Observable<any> {
    const url = this.gridaEndPoint;

    const param = new FormData();
    param.append('image', imageFile);
    param.append('userName', 'null');
    param.append('userEmail', 'null');
    param.append('userPhone', 'null');
    param.append('userOrganization', 'null');
    // param.append('userName', sttRequests.userName);
    // param.append('userEmail', sttRequests.userEmail);
    // param.append('userPhone', sttRequests.userPhone);
    // param.append('userOrganization', sttRequests.userOrganization);
    param.append('prompt', sttRequests.prompt);
    param.append('translatedPrompt', sttRequests.translatedPrompt);
    param.append('sns', sttRequests.sns);
    return this.http.post(url, param);
  }

  public updatePost(id: any, userRequest: any): Observable<any> {
    const url = this.gridaEndPoint;

    const param = new FormData();
    param.append('userName', userRequest.userName);
    param.append('userEmail', userRequest.userEmail);
    param.append('userPhone', userRequest.userPhone);
    param.append('userOrganization', userRequest.userOrganization);
    param.append('prompt', userRequest.prompt);
    param.append('translatedPrompt', userRequest.translatedPrompt);
    param.append('id', id);
    const body = {
      userName: userRequest.userName,
      userEmail: userRequest.userEmail,
      userPhone: userRequest.userPhone,
      userOrganization: userRequest.userOrganization,
      prompt: userRequest.prompt,
      translatedPrompt: userRequest.translatedPrompt,
      id: id
    };

    return this.http.put(url, body);
  }


  public getImageList(pageNumber): Observable<any> {
    const url = this.gridaEndPoint + '?page=' + pageNumber;

    return this.http.get(url);
  }

  public getPopularImageList(pageNumber): Observable<any> {
    const url = this.gridaEndPoint + '/like?page=' + pageNumber;

    return this.http.get(url);
  }

  public getDisApprovalImageList(pageNumber): Observable<any> {
    const url = this.gridaEndPoint + '/disapproval?page=' + pageNumber;

    return this.http.get(url);
  }

  public getRunCount(): Observable<any> {
    const url = this.gridaEndPoint + '/runCount';

    return this.http.get(url);
  }

  public addRunCount(): Observable<any> {
    const url = this.gridaEndPoint + '/addCount';

    return this.http.get(url);
  }

  public detail(imageId): Observable<any> {
    const url = this.gridaEndPoint + '/detail?id=' + imageId;

    return this.http.get(url);
  }

  public like(imageId): Observable<any> {
    const url = this.gridaEndPoint + '/like?id=' + imageId;

    return this.http.put(url, null);
  }

  public approval(imageId): Observable<any> {
    const url = this.gridaEndPoint + '/approval?id=' + imageId;

    return this.http.put(url, null);
  }

  public delete(imageId): Observable<any> {
    const url = this.gridaEndPoint + '?id=' + imageId;

    return this.http.delete(url);
  }

  getExcel(): Observable<any> {
    const url = this.gridaEndPoint + '/excel';
    return this.http.get(url, {responseType: 'blob'}
    ).pipe(map(res => res));
  }

  getGritalkCount(): Observable<any> {
    const url = this.gridaEndPoint + '/gritalkCount';
    return this.http.get(url);
  }

  addGritalkCount(): Observable<any> {
    const url = this.gridaEndPoint + '/addGritalkCount';
    return this.http.get(url);
  }


  createCoding(): Observable<any> {
    const url = this.gridaEndPoint;
    return null;
  }
}
