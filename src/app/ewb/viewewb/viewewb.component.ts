import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) {
    
  }

  ngOnInit() {
    this.http.get('https://myeinvewb-default-rtdb.firebaseio.com/ewaybills.json')
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
      this.http
        .post(
          'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/ewbpdf.php', invPdf, {responseType: 'blob'}
        )
        .subscribe((responseData) => {
          this.fileUrl = URL.createObjectURL(responseData);
          window.open(this.fileUrl);    
    });
  }

  onDelete(i){
    let firebaseId = this.fireId[i];
    this.http
    .delete(
      'https://myeinvewb-default-rtdb.firebaseio.com/ewaybills/' + firebaseId + '.json'
    )
    .subscribe((responseData) => {
      console.log(responseData);
      if (responseData == null) {
        this.data.splice(i, 1);
        alert('Document Deleted');
      }
    });
  }

}

