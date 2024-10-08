import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceTriggerService {

  private triggerSubject = new Subject<void>();

  triggerMaintenanceUpdate() {
    this.triggerSubject.next();
  }

  getMaintenanceTrigger() {
    return this.triggerSubject.asObservable();
  }
}
