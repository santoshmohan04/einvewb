import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ewb',
  templateUrl: './ewb.component.html',
  styleUrls: ['./ewb.component.css']
})
export class EwbComponent implements OnInit {

  sellerGstin = ['29AAFCD5862R000', '27AAFCD5862R013', '24AAFCD5862R005', '35AAFCD5862R010', '09AAFCD5862R006', '37AAFCD5862R011', '07AAFCD5862R007', '33AAFCD5862R009', '05AAFCD5862R012', '13AAFCD5862R008'];
  ewbUplForm: FormGroup;
  invData: any = "";  
  ewbStatus: any = "";
  fireBase: any = ""; 
  docNo: string = "";
  gstin: any = "";
  ewbPrint: any = "";
  fileUrl: any = "";
  req_firid: any = "";
  gstin_error: string;
  js_gstin: string;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    this.ewbUplForm = new FormGroup({
      'fileToUpload': new FormControl(null, Validators.required),
      'gstin': new FormControl('')
    });
  }

  // On file Select
  onChange($event) : void { 
    this.uploadJson.readThis($event.target)
    .subscribe((response: any): void => {
      this.invData = JSON.parse(response);
      this.docNo= this.invData.DocumentNumber;
      let inp_gstin = this.ewbUplForm.value.gstin;
      this.js_gstin = this.invData.SellerDtls.Gstin;
      if (inp_gstin !== this.js_gstin) {
        this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
      }
    });
  }

  onGstin(event) {
    const newVal = event.target.value;
    if (newVal == this.js_gstin) {
      this.gstin_error = null;
    } else if(newVal && !this.ewbUplForm.value.fileToUpload) {
      this.gstin_error = null;
    } else {  
      this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
    }
  }

  onSubmit() {
    let ewbData = {
      'docno': this.invData.DocumentNumber,
      'docdt': this.invData.DocumentDate,
      'doctyp': this.invData.DocumentType,
      'supp_typ': this.invData.SupplyType,
      'sel_gstin': this.invData.SellerDtls.Gstin,
      'buyer_gstin': this.invData.BuyerDtls.Gstin,
      'buyer_nm': this.invData.BuyerDtls.LglNm,
      'ewb_status': 'Not Generated',
      'total_val': this.invData.TotalInvoiceAmount,
      'ewb_req': this.invData
    };

    let doctyp = 'ewaybills';

    this.uploadJson.saveData(ewbData, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.fireBase = responseData;
        this.req_firid = this.fireBase.name;
        console.log(this.req_firid);
    });
  }

  genEwb() {
    let gendata = {gstin: this.ewbUplForm.value.gstin, fileToUpload: this.invData};
    let doctyp = 'ewb';
    this.uploadJson.generate(gendata, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.ewbStatus = responseData;
        let doctyp = 'ewb';
        let fbid = this.fireBase.name; 
        if (this.ewbStatus.ewb_status === 'GENERATED') {
          let ewbResp = {
            'ewb_status': this.ewbStatus.ewb_status,
            'ewbno': this.ewbStatus.govt_response.EwbNo,
            'ewbdt': this.ewbStatus.govt_response.EwbDt,
            'ewbvalidity': this.ewbStatus.govt_response.EwbValidTill,
            'ewb_resp': this.ewbStatus,
          };
          this.uploadJson.updateData(ewbResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        } else {
          let ewbResp = {
            'ewb_status': this.ewbStatus.ewb_status,
            'ewb_resp': this.ewbStatus,
          };
          this.uploadJson.updateData(ewbResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        }
      });
  }

  resetFrom() {
    this.ewbUplForm.reset();
    this.invData = false;
    this.fireBase = false;
    this.ewbStatus = false;
    this.gstin_error = null;
  }

  downloadJson() {
    this.uploadJson.respDownload(this.ewbStatus, this.docNo)
    .subscribe((response: any): void => {
      response
    });
  }

  onewbPrint() {
    let invPdf = {
      'ewb': this.ewbStatus.govt_response.EwbNo,
      'gstin': this.ewbStatus.ewb_request.SellerDtls.Gstin,
      'prnttyp': 'DETAILED'
    }
    let doctyp = 'ewb';
    this.uploadJson.printDoc(invPdf, doctyp)
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
