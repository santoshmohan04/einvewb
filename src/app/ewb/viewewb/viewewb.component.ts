import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewewb',
  templateUrl: './viewewb.component.html',
  styleUrls: ['./viewewb.component.css']
})
export class ViewewbComponent implements OnInit {
  data: any = "";
  invData: any = "";
  fileUrl: any = "";
  isLoading = false;
  fireId: any = "";
  error: string = null;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    let doctyp = 'ewaybills';
    this.uploadJson.getData(doctyp)
      .subscribe((responseData) => {
        this.data = Object.values(responseData);
        this.fireId = Object.keys(responseData);
    });
  }

  invDtls(i) {
    this.invData = this.data[i].ewb_resp;
    // console.log(this.data[i].ewb_resp.ewb_request.SellerDtls.Gstin);
  }

  onPrint(i) {
      let invPdf = {
        'ewb': this.data[i].ewbno,
        'gstin': this.data[i].sel_gstin,
        'prnttyp': 'DETAILED'
      }
      let doctyp = 'ewb';
      this.uploadJson.printDoc(invPdf, doctyp)
      .subscribe((response) => {
        this.fileUrl = URL.createObjectURL(response);
        window.open(this.fileUrl); 
      });
  }

  onDelete(i){
    let doctyp = 'ewaybills';
    let fbid = this.fireId[i];
    this.uploadJson.deleteData(doctyp, fbid)
    .subscribe((responseData) => {
      console.log(responseData);
      if (responseData == null) {
        this.data.splice(i, 1);
        alert('Document Deleted');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

