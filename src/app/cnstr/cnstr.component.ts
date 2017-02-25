import { Component, ElementRef } from '@angular/core';
import { FileUploader } from "ng2-file-upload";


const BG_TRANSFER_KEY = "trollolo";

@Component({
  selector: 'bg-cnstr',
  templateUrl: './cnstr.component.html'
})
export class CnstrComponent {

  

  constructor ( private element: ElementRef ) {
    //init slides
    this.slides.push({"image": "https://pp.vk.me/c638728/v638728986/25099/0GpcH-SLNe4.jpg"});
    this.slides.push({"image": "https://pp.vk.me/c638728/v638728986/24e60/brNJnEETkVM.jpg"});
    this.slides.push({"image": "https://pp.vk.me/c836427/v836427986/26524/v7SqydWLHbU.jpg"});  
  }

  //-------------------------------------------------------------------------------------------------------------------
  //--Processing-Transfer----------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
  public awaitingResult = false;    
  process() {
    const request = {
      api_key: BG_TRANSFER_KEY,
      isPredefined: this.predefinedStyle,
      transferType: this.customTransferType
    }
    
    
    this.awaitingResult = true;
    //send request...
    
    //polling for result...
  }
  
  //-------------------------------------------------------------------------------------------------------------------
  //--Style-selecting--------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------
  
  public predefinedStyle: boolean = true;
  public customTransferType: string = "Patched";

  //slides  
  public slides: any[] = [];
  public activeSlideIndex: number;
  public noWrapSlides: boolean = false;
        
  
  
  
  //-------------------------------------------------------------------------------------------------------------------
  //--File-uploadings--------------------------------------------------------------------------------------------------  
  //-------------------------------------------------------------------------------------------------------------------
    
  public uploader: FileUploader = new FileUploader({url: "here url"});
  
  /**
   * Content file choose hanlder
   */
  contentImageChoosen(event) {
    const reader = new FileReader();
    const image = this.element.nativeElement.querySelector('#contentImage');

    reader.onload = function(e) {
      const src = reader.result;
      image.src = src;
    };

    reader.readAsDataURL(event.target.files[0]);
    
  }

  /**
   * Style file choose hanlder
   */
  styleImageChoosen(event) {
    const reader = new FileReader();
    const image = this.element.nativeElement.querySelector('#styleImage');

    reader.onload = function(e) {
      const src = reader.result;
      image.src = src;
    };

    reader.readAsDataURL(event.target.files[0]);
  }
  
  
}
