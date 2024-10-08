import { InterfaceBrowserService } from 'src/app/modules/interface-browser/services/interface-browser.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import {
  IConfirm,
  IInterfaceBrowser,
  IOptionsForInterfaceBrowser
} from '../../../models/interface-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-interface-inputs',
  templateUrl: './interface-inputs.component.html',
  styleUrls: ['./interface-inputs.component.scss']
})
export class InterfaceInputsComponent implements OnInit, OnChanges {
  @Input() isAddInterface: boolean;
  @Input() options: IOptionsForInterfaceBrowser;
  @Input() identifier: string;
  @Output() closeDialogEmitter = new EventEmitter();
  @Output() fetchEmitter = new EventEmitter();
  isInprocess = false;
  form: FormGroup;
  translateResults: any;
  primaryButton: string;

  confirmAddInterface: IConfirm = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => {}
  };

  constructor(
    private fb: FormBuilder,
    private interfaceBrowserService: InterfaceBrowserService,
    private translateService: TranslateInternalService,
    private commonService: CommonService
  ) {
    this.translateResults = this.translateService.translateResults;
  }

  ngOnInit(): void {
    this.initForm();
    this.form.reset();
  }

  initForm() {
    this.form = this.fb.group({
      v52InterfaceId: [
        '',
        { nonNullable: true, validators: Validators.required }
      ],
      gwcId: ['', { nonNullable: true, validators: Validators.required }],
      siteGwcLoc: ['', { nonNullable: true, validators: Validators.required }],
      v5ProvRef: [this.options.provIds[0], { nonNullable: true, validators: Validators.required }],
      v5RingTableRef: [
        this.options.ringIds[0],
        { nonNullable: true, validators: Validators.required }
      ],
      v5SigTableRef: [
        this.options.sigIds[0],
        { nonNullable: true, validators: Validators.required }
      ],
      maxlinesSelector: [
        this.options.maxlinesSelector[0],
        { nonNullable: true, validators: Validators.required }
      ],
      maxlines: ['', { nonNullable: true, validators: Validators.required }],
      linkMapTable: this.fb.array([])
    });

    for (let i = 1; i <= 16; i++) {
      this.linkMapTable.push(this.fb.control('', { nonNullable: true }));
    }

    this.primaryButton = this.isAddInterface
      ? this.translateResults.COMMON.ADD
      : this.translateResults.COMMON.SAVE;

    if(!this.isAddInterface){
      this.form.get('maxlines')?.disable();
      this.form.get('gwcId')?.disable();
      this.form.get('siteGwcLoc')?.disable();
      this.form.updateValueAndValidity();
    }
  }

  get linkMapTable(): FormArray {
    return this.form.get('linkMapTable') as FormArray;
  }
  get v5ProvRef() {
    return this.form.controls['v5ProvRef'] as FormControl;
  }
  get v5RingTableRef() {
    return this.form.controls['v5RingTableRef'] as FormControl;
  }
  get v5SigTableRef() {
    return this.form.controls['v5SigTableRef'] as FormControl;
  }
  get maxlinesSelector() {
    return this.form.controls['maxlinesSelector'] as FormControl;
  }
  get v52InterfaceId() {
    return this.form.get('v52InterfaceId') as FormControl;
  }

  getInterfaceTemplate(id: string) {
    this.form.reset();
    // this.initForm();
    this.isInprocess = true;
    this.interfaceBrowserService
      .getInterfaceBrowserTemplate(id)
      .pipe(
        map((res) => {
          if (res.rc.__value !== 0) {
            this.commonService.showErrorMessage(res.responseMsg);
          }
          if(res.rc.__value === 0){
            return res.responseData.___v52Interface;
          }
        })
      )
      .subscribe({
        next: (res: IInterfaceBrowser) => {
          this.isInprocess = false;
          res.linkMapTable.forEach(
            (element: { epGrp: string; linkId: string }) => {
              this.linkMapTable
                .at(Number(element.linkId) - 1)
                .patchValue(element.epGrp);
            }
          );
          this.form.patchValue({
            gwcId: res.gwcId,
            maxlines: res.maxlines,
            maxlinesSelector: res.maxlinesSelector,
            siteGwcLoc: res.siteGwcLoc,
            v5ProvRef: res.v5ProvRef,
            v5RingTableRef: res.v5RingTableRef,
            v5SigTableRef: res.v5SigTableRef,
            v52InterfaceId: res.v52InterfaceId
          });
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['identifier'] && this.identifier && !this.isAddInterface) {
      this.getInterfaceTemplate(this.identifier);
    }
  }

  fetch(event: any) {
    this.fetchEmitter.emit(event.target.id);
  }

  onFormSubmit(confirm: boolean) {
    let links: Object[] = [];
    let isGapDetected = false;

    for (let i = 0; i < 16; i++) {
      const link = this.linkMapTable.at(i).value;
      if (link.length > 0) {
        // If a gap was detected before this filled link, set the flag to true
        if (isGapDetected) {
          this.commonService.showErrorMessage(
            this.translateResults.INTERFACE_BROWSER.ERROR.GAP_DETECTED
          );
          return;
        }
        links = [...links, { linkId: i + 1, epGrp: link }];
      } else {
        if (links.length > 0) {
          isGapDetected = true;
        }
      }
    }
    const interfaceObj = this.form.getRawValue();
    interfaceObj.linkMapTable = links;

    if (!this.isAddInterface) {
      this.modifyInterface(interfaceObj, confirm);
    } else {
      if (confirm) {
        this.confirmAddInterface.title = this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.ADD_CONFIRM.TITLE;
        this.confirmAddInterface.titleAccept = this.translateResults.COMMON.OK;
        this.confirmAddInterface.titleReject = this.translateResults.COMMON.CANCEL;
        this.confirmAddInterface.content = this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.ADD_CONFIRM.CONTENT;

        this.confirmAddInterface.isShowConfirmDialog = true;
        this.confirmAddInterface.handleAccept = (isAccept: boolean) => {
          if (isAccept) {
            this.addInterface(interfaceObj);
            this.closeConfirmDialog();
          } else {
            this.closeConfirmDialog();
          }
        };
      } else {
        this.closeDialog(false);
      }
    }
  }

  closeConfirmDialog() {
    this.confirmAddInterface.isShowConfirmDialog = false;
    this.confirmAddInterface.title = '';
    this.confirmAddInterface.titleAccept = '';
    this.confirmAddInterface.titleReject = '';
    this.confirmAddInterface.content = '';
  }

  addInterface(interfaceItem: IInterfaceBrowser) {
    this.isInprocess = true;
    this.interfaceBrowserService
      .addNewInterfaceBrowser(interfaceItem)
      .subscribe({
        next: (response: any) => {
          this.isInprocess = false;
          if (response.rc.__value !== 0) {
            this.commonService.showErrorMessage(response.responseMsg);
            return;
          }
          const mssg =
            this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(
              /{{action}}/,
              'added'
            );
          this.commonService.showSuccessMessage(mssg);
          this.closeDialog(true);
        },
        error: (err) => {
          this.commonService.showAPIError(err);
          this.isInprocess = false;
        }
      });
  }

  modifyInterface(interfaceItem: IInterfaceBrowser, confirm: boolean) {
    if (confirm && this.identifier) {
      this.isInprocess = true;
      this.interfaceBrowserService
        .modifyInterfaceBrowser(interfaceItem, this.identifier)
        .subscribe({
          next: (response) => {
            this.isInprocess = false;
            if (response.rc.__value !== 0) {
              this.commonService.showErrorMessage(response.responseMsg);
              return;
            }
            const mssg =
              this.translateResults.INTERFACE_BROWSER.V5_RING_VIEW.FIELD_LABEL.SUCCESS.replace(
                /{{action}}/,
                'modified'
              );
            this.commonService.showSuccessMessage(mssg);
            this.closeDialog(true);
            this.getInterfaceTemplate(this.v52InterfaceId.value);
          },
          error: (err) => {
            this.isInprocess = false;
            this.commonService.showAPIError(err);
          }
        });
    } else if (!confirm) {
      this.getInterfaceTemplate(this.identifier);
    }
  }

  closeDialog(isChanged: boolean) {
    this.closeDialogEmitter.emit(isChanged);
  }
}
