import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Request, XSRFStrategy } from '@angular/http';

import { FileSelectDirective, FileDropDirective, FileUploader, FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { ButtonsModule } from 'ng2-bootstrap/buttons';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { CarouselModule } from 'ng2-bootstrap/carousel';

import { CnstrComponent } from './cnstr/cnstr.component';
import { AppComponent } from './app.component';
import { NgStyle } from '@angular/common';


export class NoXSRFStrategy {
  configureRequest(req: Request) {
    // Remove `x-xsrf-token` from request headers    
  }
}

@NgModule({
  declarations: [
    CnstrComponent,
    AppComponent        
  ],
  imports: [        
    BrowserModule,
    FormsModule,
    HttpModule, 
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    ButtonsModule.forRoot(),
    FileUploadModule
  ],
  providers: [{ provide: XSRFStrategy, useFactory: () => new NoXSRFStrategy() }],
  bootstrap: [AppComponent]
})
export class AppModule { }
