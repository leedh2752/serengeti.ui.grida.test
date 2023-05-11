import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  status: string = 'login';

  constructor() { }

  ngOnInit() {
  }

  public signUpEvent(event) {
    console.log(event);
    this.status = event;
  }
  
  public goBackEvent(event) {
    console.log(event);
    this.status = event;
  }

}
