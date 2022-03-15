import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewb2c',
  templateUrl: './viewb2c.component.html',
  styleUrls: ['./viewb2c.component.css']
})
export class Viewb2cComponent implements OnInit {
  data: any = "";
  invData: any = "";
  fileUrl: any = "";
  status: string = "";
  fireId: any = "";
  isLoading = false;
  error: string = null;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    let doctyp = 'b2cqr';
    this.uploadJson.getData(doctyp)
      .subscribe((responseData) => {
        this.data = Object.values(responseData);
        this.fireId = Object.keys(responseData);
    });
  }

  invDtls(i) {
    this.invData = JSON.parse(this.data[i].inv_req);
    this.status = this.data[i].inv_status;
    // console.log(this.data[i].trns_id);
  }

  onPrint(i) {
    let invPdf = {'id': this.data[i].trns_id,
                  'gstin': this.data[i].sel_gstin};
    let doctyp = 'b2c';
    this.uploadJson.printDoc(invPdf, doctyp)
    .subscribe((response) => {
      this.fileUrl = URL.createObjectURL(response);
      window.open(this.fileUrl); 
    });
  }

  onDelete(i){
    let doctyp = 'b2cqr';
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
