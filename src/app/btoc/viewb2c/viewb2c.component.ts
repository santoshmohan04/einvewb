import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('https://myeinvewb-default-rtdb.firebaseio.com/b2cqr.json')
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
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/b2cpdf.php', invPdf, {responseType: 'blob'}
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
      'https://myeinvewb-default-rtdb.firebaseio.com/b2cqr/' + firebaseId + '.json'
    )
    .subscribe((responseData) => {
      console.log(responseData);
      if (responseData == null) {
        // const index = this.data.indexOf(i);
        this.data.splice(i, 1);
        alert('Document Deleted');
      }
    });
  }

}
