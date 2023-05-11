import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import  { MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import { NavComponent } from './grida/nav/nav.component';
import { CreateComponent } from './grida/create/create.component';
import { ListComponent } from './grida/list/list.component';
import { DetailComponent } from './grida/detail/detail.component';
import { DescComponent } from './grida/desc/desc.component';
import { MaterialModule } from '../modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgreeComponent } from './grida/agree/agree.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './grida/login/login.component';
import { FooterComponent } from './grida/footer/footer.component';
import { ChatbotComponent } from './grida/chatbot/chatbot.component';
import { SignUpComponent } from './grida/sign-up/sign-up.component';
import { DialogComponent } from './grida/dialog/dialog.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import { ToastrModule } from 'ngx-toastr';
import { MarkdownModule } from 'ngx-markdown';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CreateComponent,
    ListComponent,
    DetailComponent,
    DescComponent,
    AgreeComponent,
    LoginComponent,
    FooterComponent,
    ChatbotComponent,
    SignUpComponent,
    DialogComponent,
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      MaterialModule,
      BrowserAnimationsModule,
      HttpClientModule,
      CodemirrorModule,
      ToastrModule.forRoot(),
      MarkdownModule.forRoot({
        loader: HttpClient,
      }),
      MatIconModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }
		}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AgreeComponent,
    LoginComponent,
    DialogComponent
  ]
})
export class AppModule {
  constructor () {}
}
