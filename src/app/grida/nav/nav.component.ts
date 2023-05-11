import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() previousUrl;

  public selectIndex = 0;
  public navList = ['POOM GPT', '설명서'];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    switch (this.previousUrl) {
      case '/chatbot': {
        this.selectIndex = 0;
        break;
      }
      case '/desc': {
        this.selectIndex = 1;
        break;
      }
    }
  }

  public goPage(index: any) {
    this.selectIndex = index;
    switch (this.selectIndex) {
      case 0: {
        this.router.navigate(['chatbot']);
        break;
      }
      case 1: {
        this.router.navigate(['desc']);
        break;
      }
    }
  }

  public goChatbot() {
    this.selectIndex = 0;
    this.router.navigate(['chatbot']);
  }

  public goDesc() {
    this.selectIndex = 1;
    this.router.navigate(['desc']);
  }

}
