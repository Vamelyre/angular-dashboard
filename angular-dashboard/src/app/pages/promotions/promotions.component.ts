import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService, LeaderboardItem, WeekType } from '../../core/services/leaderboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  // --- Wheel state ---
  inputSector: number | null = null;
  errorMessage = '';
  spinning = false;
  wheelRotation = 0; // degrees
  // for display
  lastResultSector: number | null = null;

  // --- Leaderboard state ---
  items: LeaderboardItem[] = [];
  visible: LeaderboardItem[] = [];
  activeFilter: WeekType | 'ALL' = 'ALL';
  weeks: (WeekType | 'ALL')[] = ['I', 'II', 'III', 'IV', 'ALL'];

  constructor(private lb: LeaderboardService) {}

  ngOnInit(): void {
    this.items = this.lb.generate(80);
    this.visible = [...this.items];
  }

  // ---------- Wheel logic ----------
  validateInput(): boolean {
    if (this.inputSector == null || Number.isNaN(this.inputSector)) {
      this.errorMessage = 'გთხოვთ შეიყვანოთ ნომერი 1-დან 10-მდე';
      return false;
    }
    const n = Number(this.inputSector);
    if (n < 1 || n > 10) {
      this.errorMessage = 'აღნიშნული სექტორი ვერ მოიძებნა';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  spinWheel(): void {
    if (!this.validateInput()) return;
    if (this.spinning) return;

    const sector = Number(this.inputSector);
    // sector angle math: 10 sectors -> 36deg each
    const sectorAngle = 360 / 10; // 36
    // target center angle for the sector (1-based)
    const targetCenter = (sector - 1) * sectorAngle + sectorAngle / 2; // degrees

    // We want the wheel to rotate so that the target sector lands under the pointer at top (0°).
    // If wheel element's rotation is wheelRotation, and we set final rotation R such that
    // (R + targetCenter) % 360 === 0  => R = 360*k - targetCenter
    // pick random spins k for nicer animation
    const spins = 3 + Math.floor(Math.random() * 3); // 3..5 spins
    const finalRotation = 360 * spins - targetCenter;

    // compute CSS-friendly rotation (cumulative)
    const start = this.wheelRotation % 360;
    const end = start + finalRotation;

    this.spinning = true;
    // set transition via inline style on the wheel element (we modify wheelRotation and rely on binding)
    // We'll do a timed animation using setTimeout to clear spinning after transition duration
    // Duration based on spins (0.8s per spin)
    const duration = 800 * spins + 400; // ms

    // animate by updating wheelRotation and letting CSS transition handle it
    // increase wheelRotation to end value
    this.wheelRotation = end;

    // After animation ends, set final normalized rotation and record result
    setTimeout(() => {
      // normalize rotation to 0..360 and compute landed sector
      const normalized = ((360 - (this.wheelRotation % 360)) + 360) % 360; // angle where pointer points
      // compute sector index
      const landedSector = Math.floor(normalized / sectorAngle) + 1;
      this.lastResultSector = landedSector;
      this.spinning = false;
    }, duration);
  }

  // ---------- Leaderboard logic ----------
  setFilter(w: WeekType | 'ALL') {
    this.activeFilter = w;
    if (w === 'ALL') {
      this.visible = [...this.items];
    } else {
      this.visible = this.items.filter(it => it.week === w);
      // If after filtering there are less than 10, we ensure at least 10 by adding generated extras
      if (this.visible.length < 10) {
        const need = 10 - this.visible.length;
        const extras: LeaderboardItem[] = [];
        for (let i = 0; i < need; i++) {
          extras.push({
            customerId: Math.floor(100000 + Math.random() * 900000),
            loginName: 'extra' + Math.random().toString(36).slice(2, 8),
            place: this.items.length + extras.length + 1,
            week: w as WeekType
          });
        }
        this.visible = [...this.visible, ...extras];
      }
    }
    // Sort visible by place
    this.visible.sort((a, b) => a.place - b.place);
  }
}
