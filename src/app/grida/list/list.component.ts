import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridaService } from '../service/grida.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  gridaSession;
  imageURL = environment.gridaEndPoint+"image/";

  imageRequests;

  sortValue: string = 'newest';
  newest: string = 'newest';
  popular: string = 'popular';
  disApproval: string = 'disApproval';

  defaultPage: number = 1;
  currentPage: number = 1;

  totalCount: number = 0; // 총 개수
  totalPage: number = 0; // 총 페이지 수

  dataCount: number = 12; // 한 페이지에 보여질 데이터 수

  pageCount: number = 5; // 보여질 페이지 수
  pageGroup: number = 0; // 보여질 페이지 그룹

  firstPage: number = 0; // 보여질 첫번째 페이지
  lastPage: number = 0; // 보여질 마지막 페이지

  nextPage: number = 0;
  prevPage: number = 0;

  pages = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gridaService: GridaService
  ) { }

  ngOnInit() {
    const sortParams = this.route.snapshot.paramMap.get('sort');
    const currentPage = this.route.snapshot.paramMap.get('currentPage');

    this.getSession();

    if (sortParams) {
      this.sortValue = sortParams;
    }

    if (currentPage) {
      this.currentPage = parseInt(currentPage);
      this.getList(this.sortValue, currentPage);
      return;
    }

    this.getList(this.sortValue, this.defaultPage);
  }

  public getSession() {
    localStorage.getItem('gridaSession');
    if (localStorage.getItem('gridaSession')) {
      this.gridaSession = localStorage.getItem('gridaSession');
    }
  }

  public getList(sort, pageNumber) {
    switch (sort) {
      case 'newest': {
        this.getImageList(pageNumber);
        return;
      }
      case 'popular': {
        this.getPopularImageList(pageNumber);
        return;
      }
      case 'disApproval': {
        this.getDisApprovalImageList(pageNumber);
        return;
      }
    }
  }

  public getImageList(pageNumber) {
    this.gridaService.getImageList(pageNumber).subscribe(res => {
      this.imageRequestsBinding(res);
    });
  }

  public getPopularImageList(pageNumber) {
    this.gridaService.getPopularImageList(pageNumber).subscribe(res => {
      this.imageRequestsBinding(res);
    });
  }

  public getDisApprovalImageList(pageNumber) {
    this.gridaService.getDisApprovalImageList(pageNumber).subscribe(res => {
      this.imageRequestsBinding(res);
    });
  }

  public imageRequestsBinding(res) {

    this.imageRequests = res;
    this.totalCount = res.count;
    this.totalPage = Math.ceil(res.count / this.dataCount);
    this.pageGroup = Math.ceil(this.currentPage / this.pageCount);

    this.lastPage = this.pageGroup * this.pageCount;
    if (this.lastPage > this.totalPage) {
      this.lastPage = this.totalPage;
    }
    this.firstPage = this.lastPage - (this.pageCount - 1) <= 0 ? 1 : this.lastPage - (this.pageCount - 1);

    const pages = [];
    if (this.lastPage % this.pageCount !== 0) {
      if (this.totalPage <= 5) {
        for (let i=1; i<=this.lastPage; i++) {
          pages.push(i);
        }
      } else {
        for (let i=(this.pageCount*this.pageGroup-(this.lastPage-this.firstPage)); i<=this.lastPage; i++) {
          pages.push(i);
        }
      }
    } else {
      for (let i=this.firstPage; i<=this.lastPage; i++) {
        pages.push(i);
      }
    }
    this.pages = pages;
  }

  public like(imageRequest) {
    this.gridaService.like(imageRequest.id).subscribe(res => {
      this.getList(this.sortValue, this.currentPage);
    });
  }

  public approval(imageRequest) {
    if (confirm('승인하시겠습니까?')) {
      this.gridaService.approval(imageRequest.id).subscribe(res => {
        this.getList(this.sortValue, this.currentPage);
      });
    }
  }

  public delete(imageRequest) {
    if (confirm('삭제하시겠습니까?')) {
      this.gridaService.delete(imageRequest.id).subscribe(res => {
        this.getList(this.sortValue, this.currentPage);
      });
    }
  }

  public pageInitialization() {
    this.currentPage = 1;
    this.imageRequests = undefined;
  }

  public pagingEvent(pageNumber) {
    if (this.currentPage === pageNumber) {
      return;
    }

    if (pageNumber > this.totalPage) {
      this.pageCount = pageNumber - 1;
      return;
    }
    if (pageNumber === 0) {
      this.currentPage = 1;
      return;
    }

    this.currentPage = pageNumber;
    this.getList(this.sortValue, pageNumber);
    window.scrollTo(0, 0);
  }

  public goDetail(imageRequest) {
    this.router.navigate(['detail/' + imageRequest.id, {sort: this.sortValue, currentPage: this.currentPage}]);
  }
}
