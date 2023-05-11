import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EmailValidator } from 'src/email.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @Output() goBackEvent = new EventEmitter<any>();

  id: string = '';
  name: string = '';
  nickName: string = '';
  phoneNumber: string = '';
  team: string = '';
  pw: string = '';
  repeatPw: string = '';

  form: FormGroup;
  idReg: AbstractControl;
  nameReg: AbstractControl;
  nickNameReg: AbstractControl;
  phoneNumberReg: AbstractControl;
  teamReg: AbstractControl;
  passwords: FormGroup;
  pwReg: AbstractControl;
  repeatPwReg: AbstractControl;

  constructor(
    fb: FormBuilder
  ) { 
    this.form = fb.group({
      'id': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'nameReg': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      'nickNameReg': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      'phoneNumberReg': ['', Validators.compose([Validators.required])],
      'teamReg': ['', Validators.compose([Validators.required])],
      'passwords': fb.group({
        'pwReg': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(64),
          Validators.pattern("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&\\*\\(\\)])[A-Za-z\\d!@#$%^&\\*\\(\\)]{8,}$")])],
        'repeatPwReg': ['', [Validators.required, this.matchValues('pwReg')]]
      })
    });

    this.idReg = this.form.controls['id'];
    this.nameReg = this.form.controls['nameReg'];
    this.nickNameReg = this.form.controls['nickNameReg'];
    this.phoneNumberReg = this.form.controls['phoneNumberReg'];
    this.teamReg = this.form.controls['teamReg'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.pwReg = this.passwords.controls['pwReg'];
    this.repeatPwReg = this.passwords.controls['repeatPwReg'];
  }

  ngOnInit() {
  }

  public doSignUp() {

  }

  public goBack() {
    this.goBackEvent.emit('login');
  }

  public matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

}
