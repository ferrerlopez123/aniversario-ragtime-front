import { AfterViewChecked, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import { Boleto } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  name:string = '';
  price!: number;
  package: string  = ''
  dataQr: string = '';
  seat!:any
  imagenCreada! : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Boleto) { 
  }

  ngOnInit(): void {
    let ticket = {...this.data}
    delete ticket._id;
    this.dataQr = JSON.stringify(ticket);
    let packagesName: string [] = [];
    this.name = `${ticket.name} ${ticket.surnames}`;
    this.price = ticket.total;
    this.seat = ticket.seat === '' || !ticket.seat ? null : ticket.seat
    ticket.package.forEach(value => {
      packagesName?.push(value.name)
    })
    this.package = packagesName.join(',');
  }

  crearImagen() {
    let boletoName = `boleto-${this.name.replace(' ','-')}.png`
    html2canvas(document.querySelector("#contenido")!,
    {useCORS: true,
    allowTaint: true,
    width:298,}).then(canvas => {
 
      this.saveAs(canvas.toDataURL(), boletoName);
 
    });
  }

  saveAs(uri:any, filename: any) {

    let link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}


}
