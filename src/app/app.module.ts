import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ButtonsModule } from 'ng2-bootstrap/buttons';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import { FileSelectDirective } from 'ng2-file-upload';

import { CnstrComponent } from './cnstr/cnstr.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
//    FileSelectDirective,     
    CnstrComponent,
    AppComponent
  ],
  imports: [    
    BrowserModule,
    FormsModule,
    HttpModule, 
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
