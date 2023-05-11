import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './grida/create/create.component';
import { DetailComponent } from './grida/detail/detail.component';
import { ListComponent } from './grida/list/list.component';
import { DescComponent } from './grida/desc/desc.component';
import { AgreeComponent } from './grida/agree/agree.component';
import { ChatbotComponent } from './grida/chatbot/chatbot.component';
import { LoginComponent } from './grida/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'chatbot', pathMatch: 'full' },
  { path: 'create', component: CreateComponent },
  { path: 'list', component: ListComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'desc', component: DescComponent },
  { path: 'agree', component: AgreeComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
