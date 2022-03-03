import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  constructor(private http: HttpClient) {
    
  }

  ngOnInit() {
    this.http.get('https://myeinvewb-default-rtdb.firebaseio.com/einvoices.json')
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
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/einvpdf.php', invPdf, {responseType:'blob'}
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
      'https://myeinvewb-default-rtdb.firebaseio.com/einvoices/' + firebaseId + '.json'
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
