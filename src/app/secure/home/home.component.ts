import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationMessageService } from 'src/app/services/notification-message.service';
import { NotificationMessage } from 'src/app/types/notification-message';
import { UserWithToken } from 'src/app/types/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: UserWithToken;
  customMessages: Observable<NotificationMessage[]>;
  defaultMessages: Observable<NotificationMessage[]>;
  createNotificationMessageForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(private notificationMessageService: NotificationMessageService, private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  // convenience getter for easy access to form fields
  get f() { return this.createNotificationMessageForm.controls; }

  private fillDefaultMessages() {
    this.defaultMessages = this.notificationMessageService.getDefaultNotificationMessages();
  }

  private fillCustomMessages() {
    this.customMessages = this.notificationMessageService.getCustomNotificationMessages();
  }

  ngOnInit(): void {
    this.fillDefaultMessages();
    this.fillCustomMessages();

    this.createNotificationMessageForm = this.formBuilder.group({
      title: ['', Validators.required],
      messageBody: ['', Validators.required],
      deepLinkAction: ['', Validators.required],
      importanceLevel: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    // Cgeck if forms is invalid.
    if (this.createNotificationMessageForm.invalid) {
      return;
    }

    this.loading = true;
    this.notificationMessageService.createNotificationMessage({
      title: this.f.title.value,
      createBy: this.currentUser.userName,
      createDate: new Date(),
      messageBody: this.f.messageBody.value,
      deepLinkAction: this.f.deepLinkAction.value,
      importanceLevel: this.f.importanceLevel.value
    } as NotificationMessage)
      .pipe(first(), tap(() => {
        this.fillCustomMessages();
      }))
      .subscribe(
        createdMessage => {
          console.log("Message created: " + createdMessage);
          this.loading = false;
          this.error = null;
          this.createNotificationMessageForm.reset();
          this.submitted = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  onDeleteMessage(message: NotificationMessage) {
    this.notificationMessageService.deleteNotificationMessage(message.title).pipe(tap(() => { this.fillCustomMessages(); })).subscribe();
  }

}
