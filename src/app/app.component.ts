import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { LoginComponent } from './grida/login/login.component';
import {GridaService} from './grida/service/grida.service';
import * as fileSaver from 'file-saver';
import { filter } from 'rxjs/operators';
import { DialogComponent } from './grida/dialog/dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'grida';
  top: boolean = false;

  previousUrl: string = '';

  gridaSession;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private gridaService: GridaService
  ) {
    router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.previousUrl = event.url;
    })
  }



  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.viewTopButton();
    });

    this.getSession();
  }

  public getSession() {
    localStorage.getItem('gridaSession');
    if (localStorage.getItem('gridaSession')) {
      this.gridaSession = localStorage.getItem('gridaSession');
    }
  }

  public adminLogin() {
    const dialog = this.dialog.open(DialogComponent, {
      disableClose: true
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.gridaSession = res;

        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate([location.pathname]);
        });
      }
    });
  }

  public adminLogout() {
    localStorage.removeItem('gridaSession');
    this.gridaSession = localStorage.getItem('gridaSession');

    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([location.pathname]);
    });
  }

  public fileDownload() {
    this.gridaService.getExcel().subscribe(res => {
      {
        const blob: any = new Blob([res], {type : 'text/json; charset=utf-8'});
        fileSaver.saveAs(blob, 'grida_user_data.xlsx');
      }
    });

  }

  public viewTopButton() {
    const dm = document.documentElement;
    const scrollToTop = dm.scrollTop;
    const documentHeight = dm.scrollHeight;

    if (documentHeight != 0) {
      const actionHeight = documentHeight / 10;

      if (scrollToTop > actionHeight) {
        this.top = true;
      } else {
        this.top = false;
      }
    }
  }

  public scrollUp() {
    const dm = document.documentElement;

    const upper = setInterval(function() {
      if (dm.scrollTop != 0) {
        window.scrollBy(0, -1000);
      } else {
        clearInterval(upper);
      }
    }, 10);
  }

}
