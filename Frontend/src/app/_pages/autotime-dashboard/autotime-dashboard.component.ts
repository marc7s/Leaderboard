import { Component, OnInit } from '@angular/core';
import { User } from '@shared/api';
import { TimeSummary } from '@shared/dataStructures';
import { Subscription, interval } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { Option } from 'src/app/option';

@Component({
  selector: 'app-autotime-dashboard',
  templateUrl: './autotime-dashboard.component.html',
  styleUrls: ['./autotime-dashboard.component.sass']
})
export class AutoTimeDashboardComponent implements OnInit {

  userID: number | null = null;
  userOptions: Option[] = [];
  users: User[] = [];
  sessionUsers: Option[] = [];
  autoTimeRunning: boolean = false;
  previousTimes: TimeSummary[] = [];
  updateSubscription?: Subscription;
  updateToggle: boolean = false;
  isSetup = false;
  isEditor = false;
  wakeLockSentinel: WakeLockSentinel | null = null;

  constructor(private api: ApiService) { 
    this.setup();
  }

  subscribeToPreviousTimes(): void {
    this.updateSubscription?.unsubscribe();
    if(this.autoTimeRunning)
      this.updateSubscription = interval(3000).subscribe(() => this.updatePreviousTimes());
    this.updatePreviousTimes()
  }

  setup(): void {
    this.api.checkAutoTimeRunning().subscribe(user => {
      this.autoTimeRunning = true;
      this.userID = user?.id ?? null;
      this.isSetup = true;
      this.subscribeToPreviousTimes();
      this.acquireWakeLock();
    });
    
    this.api.getUsers().subscribe(users => {
      this.users = users;
      this.sessionUsers = users.map(u => ({ value: u.id, display: u.username }));
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.updateSubscription?.unsubscribe();
    this.releaseWakeLock();
  }

  async acquireWakeLock(): Promise<void> {
    if('wakeLock' in navigator)
      this.wakeLockSentinel = await navigator.wakeLock.request("screen");
  }

  async releaseWakeLock(): Promise<void> {
    this.wakeLockSentinel?.release();
    this.wakeLockSentinel = null;
  }

  updatePreviousTimes(): void {
    if(!this.api)
      return;

    this.api.getAutoTimeSessionTimes().subscribe(times => {
      this.previousTimes = times;
      this.updateToggle = !this.updateToggle;
    });
  }

  enableEditor(): void {
    this.isEditor = true;
  }

  selectUser(): void {
    const selectedUser = this.users.find(u => u.id == this.userID);
    
    if(!selectedUser)
      return;
    
    this.api.setAutoTimeCurrentUser(selectedUser).subscribe(userID => {
      if(selectedUser.id != userID)
        console.warn(`AutoTime current user set to ${userID}, but ${selectedUser.id} was selected`);
      this.userID = userID ?? null;
    });
  }
}
