import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class ConfigService {
    configUrl = 'http://www.cloudpharma.org/backendpharma/public/index.php/api/produit/getBuyedProducts';
    constructor(private http: HttpClient) { }



    getConfig() {
        return this.http.post(this.configUrl,{});
    }
}