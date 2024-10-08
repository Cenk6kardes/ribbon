import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisassociateDialogService {
  private showDialogSubject = new BehaviorSubject<boolean>(false);
  public showDialog$: Observable<boolean> = this.showDialogSubject.asObservable();
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public data$: Observable<any> = this.dataSubject.asObservable();
  private refreshSubject = new BehaviorSubject<boolean>(false);
  public refresh$: Observable<boolean> = this.refreshSubject.asObservable();

  constructor() { }

  openDialog() {
    this.showDialogSubject.next(true);
  }

  closeDialog() {
    this.showDialogSubject.next(false);
  }

  setData(data: any): void {
    this.dataSubject.next(data);
  }

  triggerTableRefresh(refresh: boolean) {
    this.refreshSubject.next(refresh);
  }
}
