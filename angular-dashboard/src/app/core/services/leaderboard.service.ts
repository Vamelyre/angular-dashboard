import { Injectable } from '@angular/core';

export type WeekType = 'I' | 'II' | 'III' | 'IV';

export interface LeaderboardItem {
  customerId: number;
  loginName: string;
  place: number;
  week: WeekType;
}

const WEEKS: WeekType[] = ['I', 'II', 'III', 'IV'];

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  // Generates an array and guarantees at least 10 items per week after filtering
  generate(total = 80): LeaderboardItem[] {
    const items: LeaderboardItem[] = [];

    // create base random items
    for (let i = 0; i < total; i++) {
      const week = WEEKS[Math.floor(Math.random() * WEEKS.length)];
      items.push({
        customerId: Math.floor(100000 + Math.random() * 900000),
        loginName: 'user' + Math.random().toString(36).slice(2, 8),
        place: Math.floor(Math.random() * 100) + 1,
        week
      });
    }

    // Ensure minimum 10 per week
    for (const w of WEEKS) {
      const count = items.filter(x => x.week === w).length;
      if (count < 10) {
        for (let j = 0; j < 10 - count; j++) {
          items.push({
            customerId: Math.floor(100000 + Math.random() * 900000),
            loginName: 'user' + Math.random().toString(36).slice(2, 8),
            place: items.length + 1,
            week: w
          });
        }
      }
    }

    // normalize place to unique ranking: sort by place then reassign 1..N
    items.sort((a, b) => a.place - b.place);
    return items.map((it, idx) => ({ ...it, place: idx + 1 }));
  }
}
