export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
}

export interface IFAQRes {
  success: boolean;
  message: string;
  data: IFAQ[];

}

export interface IFAQBody {
  question: string;
  answer: string;
  isActive: boolean;
}

