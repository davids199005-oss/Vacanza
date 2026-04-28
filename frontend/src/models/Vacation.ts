

export interface IVacation {
    
    id: number;
    
    destination: string;
    
    description: string;
    
    startDate: string;
    
    endDate: string;
    
    price: string;
    
    image: string ;
}

export interface VacationWithLikes extends IVacation {
    
    likes: number;
    
    isLiked: boolean;
}

export interface VacationFormData {
    
    destination: string;
    
    description: string;
    
    startDate: string;
    
    endDate: string;
    
    price: number;
    
    image?: File;
}
