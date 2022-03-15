import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, Subscriber } from 'rxjs';


@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  readThis(inputValue: any) : Observable<any> {
    let file:File = inputValue.files[0]; 
    let myReader:FileReader = new FileReader();

    return Observable.create((observer: Subscriber<any>): void => {
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
      // console.log(myReader.result);
      observer.next(myReader.result);
    }  

      myReader.readAsText(file, "UTF-8");

      myReader.onerror = (error) => {
          console.log(error);
      }

    });
  }

  respDownload(irnStatus:any, docNo:string): Observable<any> {
    console.log("I am in Print console");
			let data: any = irnStatus;
			let fileName: any = docNo + '_response.json';

			// Create a blob of the data
			let fileToSave = new Blob([JSON.stringify(data)], {
				type: 'application/json',
			});

			// Save the file
      return Observable.create((observer: Subscriber<any>): void => {
			observer.next(saveAs(fileToSave, fileName));
			console.log("File Downloaded");
      });
  }

  printDoc(invPdf:any, doctyp:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => { 
    this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/' + doctyp + 'pdf.php', invPdf, {responseType:'blob'}
      )
      .subscribe((responseData) => {
        observer.next(responseData);
    });
  });
  }

  saveData(data:{}, doctyp:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => { 
      this.http
        .post(
          'https://myeinvewb-default-rtdb.firebaseio.com/' + doctyp +'.json',
          data
        )
        .subscribe((responseData) => {
          observer.next(responseData);
        });
      });    
  }

  generate(gendata:{}, doctyp:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => { 
      this.http
      .post(
        'http://ec2-3-110-62-197.ap-south-1.compute.amazonaws.com/einvewbreqres/php/' + doctyp + '.php', gendata
      ).subscribe((responseData) => {
        observer.next(responseData);
      });
    });
  }
  
  updateData(data:{}, doctyp:string, fbid:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => { 
      this.http
      .patch(
        'https://myeinvewb-default-rtdb.firebaseio.com/' + doctyp + '/' + fbid + '.json',
        data
      )
      .subscribe((responseData) => {
        observer.next(responseData);
      });
    });    
  }

  getData(doctyp:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => {
        this.http.get('https://myeinvewb-default-rtdb.firebaseio.com/' + doctyp + '.json')
        .subscribe((responseData) => {
          observer.next(responseData);
      });
    });
  }

  deleteData(doctyp:string, fbid:string): Observable<any> {
    return Observable.create((observer: Subscriber<any>): void => {
      this.http
      .delete(
        'https://myeinvewb-default-rtdb.firebaseio.com/' + doctyp + '/' + fbid + '.json')
        .subscribe((responseData) => {
          observer.next(responseData);
      });
    });
  }  
}
