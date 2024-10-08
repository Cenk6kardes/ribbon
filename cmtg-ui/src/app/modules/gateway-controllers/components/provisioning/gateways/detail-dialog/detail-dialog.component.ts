import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent {
  @Input() showDialog = false;
  @Input() dynamicContent: any;
  @Output() closeDetailDialog: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  closeDialog(): void {
    this.showDialog = false;
    this.closeDetailDialog.emit();
  }

  onDetailDialog(event: boolean) {
    if (!event) {
      this.showDialog = false;
      this.closeDetailDialog.emit();
    }
  }
}
