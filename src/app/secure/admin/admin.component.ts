import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { first, map, take, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/app/types/roles';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: Observable<User[]>;
  Roles = Roles;
  createUserForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  
  constructor(private userService: UserService, private formBuilder: FormBuilder) {
  }

  // Gets the form controls.
  get f() { return this.createUserForm.controls; }


  ngOnInit(): void {

    this.fillUsers();

    this.createUserForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  /**
   * Load users
   */
  private fillUsers() {
    this.users = this.userService.getUsers().pipe(map(users => users));
  }

  /**
   * Submitts the forms (calls create user).
   * @returns 
   */
  onSubmit() {
    this.submitted = true;

    // Cgeck if forms is invalid.
    if (this.createUserForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.createUser(new User(this.f.userName.value, this.f.password.value, Roles.User))
      .pipe(first(), tap(() => {
        this.fillUsers();
      }))
      .subscribe(
        createdUser => {
          console.log("User created: " + createdUser);
          this.loading = false;
          this.error = null;
          this.createUserForm.reset();
          this.submitted = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  /**
   * Deletes an user.
   * @param user the user to delete.
   */
  onDeleteUser(user: User) {
    this.userService.deleteUser(user.userName).pipe(tap(() => { this.fillUsers(); })).subscribe();
  }

}
