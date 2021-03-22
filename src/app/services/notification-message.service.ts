import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NotificationMessage } from '../types/notification-message';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class NotificationMessageService {

  constructor(private http: HttpClient) { }

  getDefaultNotificationMessages(): Observable<NotificationMessage[]> {
    return this.http.get<any>(`${environment.externalAPI}`).
      pipe(map((data => this.mapDefaultMessage(data.Content.MessageDetails))))
  }

  private mapDefaultMessage(data: any[]): NotificationMessage[] {
    let result: NotificationMessage[] = [];

    data.forEach(element => {
      result.push(
        {
          title: element.Title,
          messageBody: element.MessageBody,
          createBy: element.CreateBy,
          deepLinkAction: element.DeepLinkAction,
          importanceLevel: element.ImportanceLevel
        } as NotificationMessage
      )
    });

    return result;

  }

  getCustomNotificationMessages(): Observable<NotificationMessage[]> {
    return this.http.get<any[]>(`${environment.apiUrl}Messages`)
      .pipe(map(messages => this.mapCustomMessage(messages)));
  }

  private mapCustomMessage(data: any[]): NotificationMessage[] {
    let result: NotificationMessage[] = [];

    data.forEach(element => {
      result.push(
        {
          title: element.title,
          messageBody: element.messageBody,
          createDate: new Date(element.createDate),
          createBy: element.createBy,
          deepLinkAction: element.deepLinkAction,
          importanceLevel: element.importanceLevel
        } as NotificationMessage
      )
    });

    return result;
  }

  deleteNotificationMessage(title: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}Messages/${title}`);
  }

  createNotificationMessage(notificationMessage: NotificationMessage): Observable<NotificationMessage> {
    return this.http.post<NotificationMessage>(`${environment.apiUrl}Messages`, notificationMessage);
  }


}
