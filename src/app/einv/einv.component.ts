import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../shared/upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-einv',
  templateUrl: './einv.component.html',
  styleUrls: ['./einv.component.css']
})


export class EinvComponent implements OnInit {
  sellerGstin = ['29AAFCD5862R000', '27AAFCD5862R013', '24AAFCD5862R005', '35AAFCD5862R010', '09AAFCD5862R006', '37AAFCD5862R011', '07AAFCD5862R007', '33AAFCD5862R009', '05AAFCD5862R012', '13AAFCD5862R008'];
  einvUplForm: FormGroup;
  invData: any;  
  irnStatus: any = "";
  fireBase: any = ""; 
  docNo: string = "";
  postData: any = "";
  gstin: string;
  irnPrint: any = "";
  irnData: any = "";
  fileUrl: any = "";
  req_firid: any = "";
  gstin_error: string;
  js_gstin: string;
  subscription: Subscription;

  constructor(private uploadJson: UploadService) { }

  ngOnInit() {
    this.einvUplForm = new FormGroup({
      'fileToUpload': new FormControl(null, Validators.required),
      'gstin': new FormControl('')
    });
  }

  onChange($event) : void { 
    this.uploadJson.readThis($event.target)
    .subscribe((response: any): void => {
      this.invData = JSON.parse(response);
      this.docNo= this.invData[0].transaction.DocDtls.No;
      let inp_gstin = this.einvUplForm.value.gstin;
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
    } else if(newVal && !this.einvUplForm.value.fileToUpload) {
      this.gstin_error = null;
    } else {  
      this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
    }
  }

  onSubmit() {
    let irnData = {
      'docno': this.invData[0].transaction.DocDtls.No,
      'docdt': this.invData[0].transaction.DocDtls.Dt,
      'doctyp': this.invData[0].transaction.DocDtls.Typ,
      'supp_typ': this.invData[0].transaction.TranDtls.SupTyp,
      'sel_gstin': this.invData[0].transaction.SellerDtls.Gstin,
      'buyer_gstin': this.invData[0].transaction.BuyerDtls.Gstin,
      'buyer_nm': this.invData[0].transaction.BuyerDtls.LglNm,
      'irn_status': 'Not Generated',
      'total_val': this.invData[0].transaction.ValDtls.TotInvVal,
      'inr_req': this.invData
    };

    let doctyp = 'einvoices';
  
    this.uploadJson.saveData(irnData, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.fireBase = responseData;
        this.req_firid = this.fireBase.name;
        console.log(this.req_firid);
      });
  }

  genIrn() {
    let gendata = { gstin: this.einvUplForm.value.gstin, fileToUpload: this.invData };
    let doctyp = 'einv';
    this.uploadJson.generate(gendata, doctyp)
      .subscribe((responseData) => {
        console.log(responseData);
        this.irnStatus = responseData;
        let doctyp = 'einvoices';
        let fbid = this.fireBase.name; 
        if (this.irnStatus[0].document_status === 'IRN_GENERATED') {
          let irnResp = {
            'irn_status': this.irnStatus[0].document_status,
            'irn': this.irnStatus[0].govt_response.Irn,
            'ack_dt': this.irnStatus[0].govt_response.AckDt,
            'ack_no': this.irnStatus[0].govt_response.AckNo,
            'irn_resp': this.irnStatus,
          };

          this.uploadJson.updateData(irnResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        } else {
          let irnResp = {
            'irn_status': this.irnStatus[0].document_status,
            'irn_resp': this.irnStatus,
          };

          this.uploadJson.updateData(irnResp, doctyp, fbid)
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        }
      });
  }

  resetFrom() {
    this.einvUplForm.reset();
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
      let invPdf = {
      'irn':this.irnStatus[0].govt_response.Irn,
      'gstin':this.irnStatus[0].transaction.SellerDtls.Gstin
      }
      let doctyp = 'einv';
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
