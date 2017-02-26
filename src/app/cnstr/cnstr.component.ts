import { Component, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from "@angular/http";
import { FileItem } from 'ng2-file-upload';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import { resolve } from 'url';


const BG_TRANSFER_SERVICE_URL = "http://localhost:5000";
const BG_TRANSFER_KEY = "trollolo";

@Component({
  selector: 'bg-cnstr',
  templateUrl: './cnstr.component.html'  
})
export class CnstrComponent {

  public status = "IDLE";  // "IDLE" | "TRANSFER" | "HANDLE"
  
  constructor ( 
    private element: ElementRef,
    private http: Http 
  ) {
     
  }

  //-------------------------------------------------------------------------------------------------------------------
  //--Processing-Transfer----------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
  
  private reponseToken: string; 
          
  
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  
  
  //-------------------------------------------------------------------------------------------------------------------
  //--IDLE-STATE-------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
    
  
  //--Configure-Content------------------------------------------------------------------------------------------------

  
  public contentDefined: boolean = false;
  
  public contentUploader: FileUploader = new FileUploader({url: BG_TRANSFER_SERVICE_URL + "/sendfile"});
    
  contentImageChoosen(event) {
    
    const reader = new FileReader();
    const element = this.element;
    const uploader = this.contentUploader;    
    const file = event.target.files[0];
    this.contentDefined = true;
        
    reader.onload = function(e) {
      const image = element.nativeElement.querySelector('#contentImage');      
      const src = reader.result;
      image.src = src;              
    };

    reader.readAsDataURL(file);                    
  }
  
  resetContent(event) {
    this.contentUploader.cancelAll();
    this.contentUploader.clearQueue();
    this.contentDefined = false;
  }

    
  //--Configure-Style--------------------------------------------------------------------------------------------------
  
  public styleDefined: boolean = false;
  
  public styleConfProgress: number = 0;
  public styleType: string; // Gallery | Custom
  public gradientType: string = "Patched"; // Gradient | Patched
  public galleryItem: number = 0;
  public galleryItems: string[] = [
     "https://pp.vk.me/c836427/v836427986/26524/v7SqydWLHbU.jpg",
     "https://pp.vk.me/c638728/v638728986/24e60/brNJnEETkVM.jpg",
     "https://pp.vk.me/c638728/v638728986/25099/0GpcH-SLNe4.jpg"      
  ];
  
  public styleUploader: FileUploader = new FileUploader({url: BG_TRANSFER_SERVICE_URL + "/sendfile"});
    
  
  styleConfProgress01() { this.styleConfProgress = 1;  }  
  
  styleConfProgress12() { this.styleConfProgress = 2;  }
  
  styleConfProgress23() {
    const uploader = this.styleUploader;
    var promise: Promise<void> = null;  
    
    if ( this.styleType == 'Gallery' ) {
      promise = new Promise( (resolve, reject) => {
        console.log('inside promise');
        var request = new XMLHttpRequest();
        request.open('GET', this.galleryItems[this.galleryItem], true);
        request.responseType = 'blob';
        request.onload = function() {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = f => {
              let file: File = reader.result;
              uploader.addToQueue([file], uploader.options);
              console.log('style file enqueued into styleUploader');
              resolve(void "");
            }
        };
        request.onerror = e => {
          console.error('failed to load gallery image'); 
          reject(e); 
        }
        request.send();
      } );      
    }
    if ( this.styleType == 'Custom' ) {
      promise = Promise.resolve();
    }
    
    const self = this;
    promise.then( () => {      
      console.log('Ready to transfer');      
    });    
                       
    this.styleConfProgress = 3;
  }   
  
  /**
   * Style file choose hanlder
   */
  styleImageChoosen(event) {    
    const reader = new FileReader();
    const self = this;
    
    reader.onload = function(e) {
      const image = self.element.nativeElement.querySelector('#styleImage');
      const src = reader.result;
      image.src = src;
      
      self.styleDefined = true;
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  
  resetStyle() {  
    this.styleConfProgress = 0;
    this.styleUploader.cancelAll();
    this.styleUploader.clearQueue();
    this.styleDefined = false;     
  }
  
  //-------------------------------------------------------------------------------------------------------------------
  //--TRANSFER-STATE---------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
    
  public transferStatus: any; 
  public resultTransferUrl: string;  
    
  startTransfer() {
    const http = this.http; 
    const self = this;
    
    this.status = 'TRANSFER';    
    
    Promise.all([
       this.uploadItem(this.contentUploader),
      this.uploadItem(this.styleUploader)
    ]).then( res => {
      // {'content': r_c, 'style': r_s}
      let request = {
        "content": res[0],
        "style": res[1]
      };           
      
      
      
      let opts: RequestOptionsArgs = new RequestOptions({ 
        headers: new Headers( {
          'Content-Type': 'application/json',
          'Accept': 'application/json'          
        } ),
        withCredentials: false 
      });
      
      http
        .post(
            BG_TRANSFER_SERVICE_URL + "/ST", 
            JSON.stringify(request), 
            opts ) 
        .subscribe( response => {
          let statusUrl = response.json().location;
          console.log("location: " + statusUrl);
                    
//          {
//              'current': 10, 
//              'status': 'PROGRESS', | PENDING PROGRESS FAILURE SUCCESS
//              'state': 'PROGRESS', 
//              'total': 30, 
//              'result': 'd982c08f-01e8-4c81-9299-675d78abb248.png'
//          }

          let timer: Observable<number> = TimerObservable.create(1000, 1000);
          let subscription = timer.subscribe( t => {
              http
                .get(BG_TRANSFER_SERVICE_URL + statusUrl)
                .subscribe( response => {
                  let json = response.json();
                  self.transferStatus = json;
                  
                  console.log("progress:" + json.current + ", result: " + json.result);
                                    
                  if ( json.result != null ) {
                    self.resultTransferUrl = BG_TRANSFER_SERVICE_URL + "/transfered/" + json.result;
                  }
                                    
                  if ( json.state == 'SUCCESS' || json.state == 'FAILURE' ) {
                    subscription.unsubscribe();
                  }
                  
                }); //status get
          
          }); // timer
          
          
        });
      
    }); //file uploadings
    
    
    
  }
    
  uploadItem(uploader: FileUploader): Promise<string> {
    let file: FileItem = uploader.queue[0];
    file.withCredentials = false;
    file.headers = [{"name": "Accept", "value": "application/json"}];    
    console.log('upload file: ' + file.file.name);
        
    let promise = new Promise<string>( (resolve, reject) => {      
      file.onComplete = (response, r, headers) => {
        let qq = JSON.parse(response);
        console.log(response);
        if(qq.filename)
          resolve(qq['filename']);
        else
          reject("filename was not returned from server");
      }
    });    
    
    uploader.uploadAll();
    
    return promise;
  }

  //-------------------------------------------------------------------------------------------------------------------
  //--HANDLE-STATE-----------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
    
  
}
