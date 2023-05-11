import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AppComponent } from 'src/app/app.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() signUpEvent = new EventEmitter<any>();

  adminId: string = environment.adminId;
  adminPw: string = environment.adminPassword;

  id: string = '';
  pw: string = '';

  gridaSession;

  form: FormGroup;
  idReg: AbstractControl;
  pwReg: AbstractControl;

  constructor(
    private dialogRef: MatDialogRef<AppComponent>,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      'id': ['', Validators.compose([Validators.required])],
      'pw': ['', Validators.compose([Validators.required])]
    });

    this.idReg = this.form.controls['id'];
    this.pwReg = this.form.controls['pw'];
  }

  ngOnInit() {
  }

  public login() {
    if (this.form.status === 'INVALID') {
      if (this.idReg.status === 'INVALID') {
        alert('아이디를 입력해 주세요.');
        return
      }

      if (this.pwReg.status === 'INVALID') {
        alert('비밀번호를 입력해 주세요.');
        return
      }
    }

    if (this.id !== this.adminId) {
      alert('아이디가 일치하지 않습니다.');
      return
    }

    if (this.pw !== this.adminPw) {
      alert('비밀번호가 일치하지 않습니다.');
      return
    }

    this.gridaSession = {
      loggedIn: true,
      loginId: this.id
    }
    const gridaSession = JSON.stringify(this.gridaSession);

    localStorage.setItem('gridaSession', gridaSession);
    this.dialogRef.close(localStorage.getItem('gridaSession'));
  }

  public signUp() {
    this.signUpEvent.emit('signUp');
  }

  public findPassword() {

  }

  public googleLogin() {

  }

  public naverLogin() {

  }

  public kakaoLogin() {

  }

  public facebookLogin() {

  }

}
