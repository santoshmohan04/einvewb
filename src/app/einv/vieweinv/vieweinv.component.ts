import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vieweinv',
  templateUrl: './vieweinv.component.html',
  styleUrls: ['./vieweinv.component.css']
})
export class VieweinvComponent implements OnInit {
  data: any = "";
  invData: any = "";
  fileUrl: any = "";
  irnStatus: any = "";
  fireId: any = "";
  isLoading = false;
  error: string = null;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    let doctyp = 'einvoices';
    this.uploadJson.getData(doctyp)
      .subscribe((responseData) => {
        this.data = Object.values(responseData);
        this.fireId = Object.keys(responseData);
    });
  }

  invDtls(i) {
    this.invData = this.data[i].irn_resp;
    console.log(this.invData);
  }

  onPrint(i) {
    let invPdf = {
      'irn':this.data[i].irn,
      'gstin':this.data[i].sel_gstin
    }
    let doctyp = 'einv';
      this.uploadJson.printDoc(invPdf, doctyp)
      .subscribe((response) => {
        this.fileUrl = URL.createObjectURL(response);
        window.open(this.fileUrl); 
    });
  }

  onDelete(i){
    let doctyp = 'einvoices';
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
