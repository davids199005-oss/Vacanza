

export interface IVacation {
    
    id: number;
    
    destination: string;
    
    description: string;
    
    startDate: Date;
    
    endDate: Date;
    
    price: string; 
    
    image: string;
}


export interface VacationWithLikes extends IVacation {
    
    likes: number;
    
    isLiked: boolean;
}
