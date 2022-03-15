import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-btoc',
  templateUrl: './btoc.component.html',
  styleUrls: ['./btoc.component.css']
})
export class BtocComponent implements OnInit {
  sellerGstin = ['29AAFCD5862R000', '27AAFCD5862R013', '24AAFCD5862R005', '35AAFCD5862R010', '09AAFCD5862R006', '37AAFCD5862R011', '07AAFCD5862R007', '33AAFCD5862R009', '05AAFCD5862R012', '13AAFCD5862R008'];
  btocUplForm: FormGroup;
  invData: any = "";  
  irnStatus: any = "";
  fireBase: any = ""; 
  docNo: string = "";
  postData: any = "";
  gstin: any = "";
  irnPrint: any = "";
  fileUrl: any = "";
  req_firid: any = "";
  gstin_error: string;
  js_gstin: string;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    this.btocUplForm = new FormGroup({
      'fileToUpload': new FormControl(null, Validators.required),
      'gstin': new FormControl('')
    });
  }


  // On file Select
  onChange($event) {
    this.uploadJson.readThis($event.target)
    .subscribe((response: any): void => {
      this.invData = JSON.parse(response);
      this.docNo= this.invData[0].transaction.DocDtls.No;
      let inp_gstin = this.btocUplForm.value.gstin;
      this.js_gstin = this.invData[0].transaction.SellerDtls.Gstin;
      if (inp_gstin !== this.js_gstin) {
        this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
      }
    });
  }

  onGstin(event) {
    const newVal = event.target.value;
    if (newVal == this.js_gstin) {
      this.gstin_error = null;
    } else if(newVal && !this.btocUplForm.value.fileToUpload) {
      this.gstin_error = null;
    } else {  
      this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
    }
  }

  onSubmit() {
    let b2cData = {
      'docno': this.invData[0].transaction.DocDtls.No,
      'docdt': this.invData[0].transaction.DocDtls.Dt,
      'doctyp': this.invData[0].transaction.DocDtls.Typ,
      'supp_typ': this.invData[0].transaction.TranDtls.SupTyp,
      'sel_gstin': this.invData[0].transaction.SellerDtls.Gstin,
      'buyer_gstin': this.invData[0].transaction.BuyerDtls.Gstin,
      'buyer_nm': this.invData[0].transaction.BuyerDtls.LglNm,
      'inv_status': 'Not Generated',
      'total_val': this.invData[0].transaction.ValDtls.TotInvVal,
      'inv_req': this.invData
    };

    let doctyp = 'b2cqr';

    this.uploadJson.saveData(b2cData, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.fireBase = responseData;
        this.req_firid = this.fireBase.name;
        console.log(this.req_firid);
      });
  }

  genB2c() {
    let gendata = {gstin: this.btocUplForm.value.gstin, fileToUpload: this.invData};
    let doctyp = 'b2c';
    this.uploadJson.generate(gendata, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.irnStatus = responseData;
        let doctyp = 'b2cqr';
        let fbid = this.fireBase.name; 
        if (!this.irnStatus.qr_code) {
          let b2cResp = {
            'inv_status': "QR Code Not Generated",
            'error_code': this.irnStatus.error.errors.error_code,
            'error_message': this.irnStatus.error.errors.error_message,
            'error_source': this.irnStatus.error.errors.error_source,
            'inv_resp': this.irnStatus,
          };
          this.uploadJson.updateData(b2cResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        } else {
          let b2cResp = {
            'inv_status': "QR Code Generated",
            'trns_id': this.irnStatus.transaction_id,
            'inv_resp': this.irnStatus,
          };
          this.uploadJson.updateData(b2cResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        }  
      });
  }

  resetFrom() {
    this.btocUplForm.reset();
    this.invData = false;
    this.fireBase = false;
    this.irnStatus = false;
    this.gstin_error = null;
  }

  downloadJson() {
    this.uploadJson.respDownload(this.irnStatus, this.docNo)
    .subscribe((response: any): void => {
      response
    });
  }

  onirnPrint() {
    let invpdf = {
      'id': this.irnStatus.transaction_id,
      'gstin': this.irnStatus.gstin
    }
    let doctyp = 'b2c';
    this.uploadJson.printDoc(invpdf, doctyp)
      .subscribe((response) => {
        this.fileUrl = URL.createObjectURL(response);
        window.open(this.fileUrl); 
    });  
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
