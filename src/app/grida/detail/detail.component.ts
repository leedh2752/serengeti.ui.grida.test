import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridaService } from '../service/grida.service';
import {environment} from "../../../environments/environment";

declare let Kakao: any;


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  imageId;
  imageURL = environment.gridaEndPoint+"image/";
  imageRequest;
  getImageDetailEvent: boolean = false;
  sortValue;
  currentPage;

  gridaSession;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gridaService: GridaService
  ) { }

  ngOnInit() {
    this.imageId = this.route.snapshot.params.id;
    this.sortValue = this.route.snapshot.paramMap.get('sort');
    this.currentPage = this.route.snapshot.paramMap.get('currentPage');

    this.getSession();
    this.getImageDetail(this.imageId);

    if (!Kakao.isInitialized()) {
      Kakao.init('19dd64ba69e8fe649f26f300d67fcaff');
    }
  }

  public getSession() {
    localStorage.getItem('gridaSession');
    if (localStorage.getItem('gridaSession')) {
      this.gridaSession = localStorage.getItem('gridaSession');
    }
  }

  public getImageDetail(imageId) {
    this.gridaService.detail(imageId).subscribe(res => {
      // console.log(res);
      if (res) {
        this.getImageDetailEvent = true;
      }
      this.imageRequest = res.data;
    });
  }

  public like() {
    this.gridaService.like(this.imageId).subscribe(res => {
      // console.log(res);
      this.getImageDetail(this.imageId);
    });
  }

  public deleteImage() {
    if (confirm('삭제하시겠습니까?')) {
      this.gridaService.delete(this.imageId).subscribe(res => {
        // console.log(res);
        this.backEvent();
      });
    }
  }

  public backEvent() {
    // this.router.navigateByUrl('list', { state: { test: 'test' } });
    this.router.navigate(['list', {sort: this.sortValue, currentPage: this.currentPage}]);
  }

  public kakaoShare() {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: this.imageRequest.prompt,
        imageUrl: this.imageURL+this.imageRequest.imageUrl,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      }
    });
  }
}
