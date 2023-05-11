import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridaService } from '../service/grida.service';

@Component({
  selector: 'app-agree',
  templateUrl: './agree.component.html',
  styleUrls: ['./agree.component.scss']
})
export class AgreeComponent implements OnInit {

  userRegistrationEvent = new EventEmitter<any>();

  agree = false;
  registering = false;

  sttRequest;
  userName;
  userPhone;
  userEmail;
  userOrganization;
  inflowRoute = 'Facebook';
  facebook = 'Facebook';
  instagram = 'Instagram';
  other = 'other';
  inflowRouteOther = '기타';


  form: FormGroup;
  nameReg: AbstractControl;
  phoneReg: AbstractControl;
  emailReg: AbstractControl;
  organizationReg: AbstractControl;

  constructor(
    private dialogRef: MatDialogRef<AgreeComponent>,
    private gridaService: GridaService,
    @Inject(MAT_DIALOG_DATA) public data,
    fb: FormBuilder
  ) {
    this.sttRequest = data;

    this.form = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\-]{0,16}$/)])],
      phoneReg: ['', Validators.compose([Validators.required, Validators.pattern(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)])],
      emailReg: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)])],
      organizationReg: ['', Validators.compose([Validators.required, Validators.pattern(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\-]{0,32}$/)])]
    });

    this.nameReg = this.form.controls.name;
    this.phoneReg = this.form.controls.phoneReg;
    this.emailReg = this.form.controls.emailReg;
    this.organizationReg = this.form.controls.organizationReg;
  }

  ngOnInit() {
    console.log(this.sttRequest);
  }

  public checkEvent(event) {
    this.agree = event;
  }

  public userRegistration() {
    if (this.form.status === 'INVALID') {
      alert('입력폼을 확인해주세요.');
      return;
    }

    if (this.agree) {
      this.registering = true;

      const registrationRequest = {
        userName: this.userName,
        userPhone: this.userPhone,
        userEmail: this.userEmail,
        userOrganization: this.userOrganization,
        prompt: this.sttRequest.sttText,
        translatedPrompt: this.sttRequest.translatedText,
        sns: this.inflowRoute,
      };

      if (this.inflowRoute === this.other) {
        registrationRequest.sns = this.inflowRouteOther;
      }

      this.registering = false;
      this.dialogRef.close(registrationRequest);
    } else {
      alert('개인정보 수집 및 이용에 동의가 필요합니다.');
    }
  }

  public close() {
    this.dialogRef.close(null);
  }

}
