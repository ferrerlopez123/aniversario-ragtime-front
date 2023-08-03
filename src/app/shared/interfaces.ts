export interface Boleto {
    _id?: string,
    name:string;
    surnames: string;
    package:Paquete[];
    soldDate: string;
    seller: string;
    status:string;
    total: number,
    paid: number,
    seat: string
  }

  export interface Paquete {
    name: string,
    price:number
  }

  export interface PostTicketResponse {
    _id:      string;
    name:     string;
    surnames: string;
    package:  Package[];
    soldDate: string;
    seller:   string;
    status:   string;
    total:    number;
    paid:     number;
    seat:     string;
    __v:      number;
}

export interface Package {
    name:  string;
    price: number;
}

export interface PatchTicketResponse {
  acknowledged:  boolean;
  modifiedCount: number;
  upsertedId:    null;
  upsertedCount: number;
  matchedCount:  number;
}

export interface DeleteTicketResponse {
  acknowledged: boolean;
  deletedCount: number;
}

export interface Seller {
  _id:  string;
  name: string;
  __v:  number;
}
