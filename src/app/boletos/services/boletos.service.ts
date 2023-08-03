import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Boleto, DeleteTicketResponse, PatchTicketResponse, PostTicketResponse, Seller } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BoletosService {
  private baseUrl: string = environment.baseUrl

  constructor(private http: HttpClient) {
   }

  getTicket():Observable<Boleto[]> {
    const url = `${this.baseUrl}/ticket`
    return this.http.get<Boleto[]>(url)
  }

  addTicket(ticket:Boleto):Observable<PostTicketResponse> {
    const url = `${this.baseUrl}/ticket`
    return this.http.post<PostTicketResponse>(url,ticket)
  }

  updateTicket(ticket:Boleto,id:string):Observable<PatchTicketResponse> {
    const url = `${this.baseUrl}/ticket/${id}`
    return this.http.patch<PatchTicketResponse>(url,ticket)
  }

  deleteTicket(id:string): Observable<DeleteTicketResponse> {
    const url = `${this.baseUrl}/ticket/${id}`
    return this.http.delete<DeleteTicketResponse>(url)
  }

  getSeller():Observable<Seller[]> {
    const url = `${this.baseUrl}/seller`
    return this.http.get<Seller[]>(url);
  }

  addSeller(name:string): Observable<Seller> {
    const url = `${this.baseUrl}/seller`
    return this.http.post<Seller>(url,{name});
  }
}
