import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-desc',
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.scss']
})
export class DescComponent implements OnInit {

  moreText: boolean = true;
  imageURL = environment.gridaEndPoint+"image/";
  imageList = [
    { id:0, url:this.imageURL + 'desc3.png',},
    { id:1, url:this.imageURL + 'desc4.png',},
    { id:2, url:this.imageURL + 'desc5.png',},
    { id:3, url:this.imageURL + 'desc6.png',}
  ];
  currentImage: number = 0;
  interval;

  constructor() { }

  ngOnInit() {
    this.slideBanner();
  }

  public slideBanner() {
    this.interval = setInterval(() => {
      this.currentImage++;

      if (this.currentImage === 4) {
        this.currentImage = 0;
      }
    }, 5000);
  }

  public slideButton(event) {
    clearInterval(this.interval);

    const lastIndex = this.imageList[this.imageList.length - 1].id;
    if (event === 'prev') {
      if (this.currentImage === 0) {
        this.currentImage = lastIndex;
      } else {
        this.currentImage--;
      }
    } else {
      if (this.currentImage === lastIndex) {
        this.currentImage = 0;
      } else {
        this.currentImage++;
      }
    }
    this.slideBanner();
  }

}
