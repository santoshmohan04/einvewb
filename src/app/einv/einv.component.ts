import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-einv',
  templateUrl: './einv.component.html',
  styleUrls: ['./einv.component.css']
})
export class EinvComponent implements OnInit {
  sellerGstin = ['29AAFCD5862R000', '27AAFCD5862R013', '24AAFCD5862R005', '35AAFCD5862R010', '09AAFCD5862R006', '37AAFCD5862R011', '07AAFCD5862R007', '33AAFCD5862R009', '05AAFCD5862R012', '13AAFCD5862R008'];
  einvUplForm: FormGroup;
  file: File = null; // Variable to store file
  fileReader: any = new FileReader();
  invData: any = "";  
  irnStatus: any = "";
  fireBase: any = ""; 
  docNo: string = "";
  postData: any = "";
  gstin: any = "";
  irnPrint: any = "";
  irnData: any = "";
  // irnResp: any = "";
  fileUrl: any = "";
  req_firid: any = "";
  gstin_error: string;
  js_gstin: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.einvUplForm = new FormGroup({
      'fileToUpload': new FormControl(null, Validators.required),
      'gstin': new FormControl('')
    });
  }

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
    this.fileReader.readAsText(this.file, "UTF-8");
    console.log(this.file);
    this.fileReader.onload = () => {
      this.invData = JSON.parse(this.fileReader.result);
      console.log(this.invData);
      this.docNo= this.invData[0].transaction.DocDtls.No;
      let inp_gstin = this.einvUplForm.value.gstin;
      this.js_gstin = this.invData[0].transaction.SellerDtls.Gstin;
      if (inp_gstin !== this.js_gstin) {
        this.gstin_error = "The Selected Seller GSTIN and JSON File Seller GSTIN are different kindly check";
      }
    }
    this.fileReader.onerror = (error) => {
      console.log(error);
    }
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
      'inr_req': this.fileReader.result
    };
  
    this.http
      .post(
        'https://myeinvewb-default-rtdb.firebaseio.com/einvoices.json',
        irnData
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.fireBase = responseData;
        this.req_firid = this.fireBase.name;
        console.log(this.req_firid);
      });
  }

  genIrn() {
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/einv.php', {gstin: this.einvUplForm.value.gstin, fileToUpload: this.invData}
      )
      // .post(
      //   'http://santoshmohan04.pythonanywhere.com/genirn', { gstin: this.einvUplForm.value.gstin, fileToUpload: this.invData }
      // )
      // .post(
      //   'http://127.0.0.1:5000/upload', { gstin: this.einvUplForm.value.gstin, fileToUpload: this.invData }
      // )
      .subscribe((responseData) => {
        console.log(responseData);
        this.irnStatus = responseData;
        if (this.irnStatus[0].document_status === 'IRN_GENERATED') {
          let irnResp = {
            'irn_status': this.irnStatus[0].document_status,
            'irn': this.irnStatus[0].govt_response.Irn,
            'ack_dt': this.irnStatus[0].govt_response.AckDt,
            'ack_no': this.irnStatus[0].govt_response.AckNo,
            'irn_resp': this.irnStatus,
          };
          this.http
          .patch(
            'https://myeinvewb-default-rtdb.firebaseio.com/einvoices/' + this.fireBase.name + '.json',
            irnResp
          )
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        } else {
          let irnResp = {
            'irn_status': this.irnStatus[0].document_status,
            'irn_resp': this.irnStatus,
          };
          this.http
          .patch(
            'https://myeinvewb-default-rtdb.firebaseio.com/einvoices/' + this.fireBase.name + '.json',
            irnResp
          )
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
    console.log("I am in Print console");
			let data: any = this.irnStatus;
			let fileName: any = this.docNo + '_response.json';

			// Create a blob of the data
			let fileToSave = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			// Save the file
			saveAs(fileToSave, fileName);
			console.log("File Downloaded");
  }

  onirnPrint() {
      let invPdf = {
      'irn':this.irnStatus[0].govt_response.Irn,
      'gstin':this.irnStatus[0].transaction.SellerDtls.Gstin
      }
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/einvpdf.php', invPdf, {responseType:'blob'}
      )
      .subscribe((responseData) => {
        this.fileUrl = URL.createObjectURL(responseData);
        window.open(this.fileUrl); 
    });  
  }
}
