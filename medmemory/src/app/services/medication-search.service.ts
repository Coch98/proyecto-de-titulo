import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private baseUrl = 'https://api.fda.gov/drug/label.json';

  constructor(private http: HttpClient) {}

  buscarMedicamento(nombre: string): Observable<any> {
    const url = `${this.baseUrl}?search=openfda.brand_name:${nombre}&limit=1`;
    return this.http.get(url);
  }
}
