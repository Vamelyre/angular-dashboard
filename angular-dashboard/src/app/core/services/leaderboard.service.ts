import { Injectable } from '@angular/core';
import { LeaderboardItem, WeekType } from '../models/leaderboard.model';



const WEEKS: WeekType[] = ['I', 'II', 'III', 'IV'];



@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
    
  generate(count = 80): LeaderboardItem[] {
    const items: LeaderboardItem[] = [];

    for (let i = 0; i < count; i++) {
      const week = WEEKS[Math.floor(Math.random() * WEEKS.length)];
      items.push({
        customerId: Math.floor(100000 + Math.random() * 900000),
        loginName: 'user' + Math.random().toString(36).slice(2, 8),
        place: Math.floor(Math.random() * 500) + 1,
        week
      });
    }

    for (const w of WEEKS) {
      const c = items.filter(x => x.week === w).length;
      if (c < 10) {
        for (let j = 0; j < 10 - c; j++) {
          items.push({
            customerId: Math.floor(100000 + Math.random() * 900000),
            loginName: 'user' + Math.random().toString(36).slice(2, 8),
            place: items.length + 1,
            week: w
          });
        }
      }
    }

    return items.sort((a, b) => a.place - b.place);
  }
}
