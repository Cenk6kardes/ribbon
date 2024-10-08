import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { IGranularAuditDataOfAudit } from '../models/audit';

@Injectable()
export class AuditSubjectService implements OnDestroy {

  granularAuditDataChangeSubject: Subject<IGranularAuditDataOfAudit> = new Subject<IGranularAuditDataOfAudit>();

  constructor() { }

  ngOnDestroy() {
    this.granularAuditDataChangeSubject.unsubscribe();
  }
}
