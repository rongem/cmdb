import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './display/search/search.component';
import { ResultListComponent } from './display/search/result-list/result-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    AdminComponent,
    HeaderComponent,
    SearchComponent,
    ResultListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
