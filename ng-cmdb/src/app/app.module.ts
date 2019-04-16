import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule, MatMenuModule, MatIconModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './display/search/search.component';
import { ResultListComponent } from './display/search/result-list/result-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetaDataService } from './shared/meta-data.service';
import { WinAuthInterceptor } from './shared/win-auth.interceptor';

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
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [MetaDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WinAuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
