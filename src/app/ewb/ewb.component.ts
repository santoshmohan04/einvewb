import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ewb',
  templateUrl: './ewb.component.html',
  styleUrls: ['./ewb.component.css']
})
export class EwbComponent implements OnInit {

  sellerGstin = ['29AAFCD5862R000', '27AAFCD5862R013', '24AAFCD5862R005', '35AAFCD5862R010', '09AAFCD5862R006', '37AAFCD5862R011', '07AAFCD5862R007', '33AAFCD5862R009', '05AAFCD5862R012', '13AAFCD5862R008'];
  ewbUplForm: FormGroup;
  file: File = null; // Variable to store file
  fileReader: any = new FileReader();
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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.ewbUplForm = new FormGroup({
      'fileToUpload': new FormControl(null, Validators.required),
      'gstin': new FormControl('')
    });
  }

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
    this.fileReader.readAsText(this.file, "UTF-8");
    this.fileReader.onload = () => {
      this.invData = JSON.parse(this.fileReader.result);
      this.docNo= this.invData.DocumentNumber;
      let inp_gstin = this.ewbUplForm.value.gstin;
      this.js_gstin = this.invData.SellerDtls.Gstin;
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
      'ewb_req': this.fileReader.result
    };

    this.http
      .post(
        'https://myeinvewb-default-rtdb.firebaseio.com/ewaybills.json',
        ewbData
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.fireBase = responseData;
        this.req_firid = this.fireBase.name;
        console.log(this.req_firid);
      });
  }

  genEwb() {
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/ewb.php', {gstin: this.ewbUplForm.value.gstin, fileToUpload: this.invData}
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.ewbStatus = responseData;
        // this.irnData.emit(this.irnStatus);
        if (this.ewbStatus.ewb_status === 'GENERATED') {
          let ewbResp = {
            'ewb_status': this.ewbStatus.ewb_status,
            'ewbno': this.ewbStatus.govt_response.EwbNo,
            'ewbdt': this.ewbStatus.govt_response.EwbDt,
            'ewbvalidity': this.ewbStatus.govt_response.EwbValidTill,
            'ewb_resp': this.ewbStatus,
          };
          this.http
          .patch(
            'https://myeinvewb-default-rtdb.firebaseio.com/ewaybills/' + this.fireBase.name + '.json',
            ewbResp
          )
          .subscribe((responseData) => {
            console.log("Response Data Saved:" + responseData);
          });
        } else {
          let ewbResp = {
            'ewb_status': this.ewbStatus.ewb_status,
            'ewb_resp': this.ewbStatus,
          };
          this.http
          .patch(
            'https://myeinvewb-default-rtdb.firebaseio.com/ewaybills/' + this.fireBase.name + '.json',
            ewbResp
          )
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
    console.log("I am in Print console");
			let data: any = this.ewbStatus;
			let fileName: any = this.docNo + '_response.json';

			// Create a blob of the data
			let fileToSave = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			// Save the file
			saveAs(fileToSave, fileName);
			console.log("File Downloaded");
  }

  onewbPrint() {
    let invPdf = {
      'ewb': this.ewbStatus.govt_response.EwbNo,
      'gstin': this.ewbStatus.ewb_request.SellerDtls.Gstin,
      'prnttyp': 'DETAILED'
    }
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/ewbpdf.php', invPdf, {responseType: 'blob'}
      )
      .subscribe((responseData) => {
        console.log(responseData);
        this.ewbPrint = responseData;
        this.fileUrl = URL.createObjectURL(this.ewbPrint);
        window.open(this.fileUrl); 
      });    
  }

}
