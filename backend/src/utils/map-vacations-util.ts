

import type { VacationWithLikes } from "../models/vacations-model.ts";


export interface RawVacation {
  
  id: number;
  
  destination: string;
  
  description: string;
  
  startDate: string;
  
  endDate: string;
  price: string; 
  
  image: string;
  likes: string; 
  
  isLiked: 0 | 1;
}


export function mapVacation(vacation: RawVacation): VacationWithLikes {
  
  return {
    id: vacation.id,
    destination: vacation.destination,
    description: vacation.description,
    startDate: new Date(vacation.startDate),
    endDate: new Date(vacation.endDate),
    price: vacation.price,           
    image: vacation.image,
    likes: Number(vacation.likes),   
    isLiked: vacation.isLiked === 1,
  };
}
