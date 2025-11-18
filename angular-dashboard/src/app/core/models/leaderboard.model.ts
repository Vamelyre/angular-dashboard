export type WeekType = 'I' | 'II' | 'III' | 'IV';


// all random except place 
export interface LeaderboardItem {
  customerId: number;   
  loginName: string;    
  place: number;        
  week: WeekType;       
}
