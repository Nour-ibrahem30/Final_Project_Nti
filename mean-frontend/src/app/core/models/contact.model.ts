export interface IContact {
  _id: string;
  name: string;
  email: string;
 message: string;
 isRead:boolean;
 createdAt:string;
}

export interface IContactRes {
  success: boolean;
  message: string;
  data: IContact[];

}

export interface IContactBody {
  isRead: boolean;
}

