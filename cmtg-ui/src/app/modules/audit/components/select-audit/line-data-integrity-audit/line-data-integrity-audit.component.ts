import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';

import { IChangeDataPickList, ITreeNodePickList } from 'src/app/shared/modules/tree-pick-list/models/tree-pick-list';
import {
  CGranularLineTreeInitData,
  COptionsLineDataIntegrity,
  EDataIntegrity,
  EGranularLineType,
  IConfirmRunAudit,
  IDialogConfirm,
  IGranularAuditDataOfAudit,
  IGranularLineTree,
  IGroupedKeysLargeLineNode,
  INodeNameNumber
} from '../../../models/audit';
import { TreePickListComponent } from 'src/app/shared/modules/tree-pick-list/tree-pick-list.component';
import { AuditService } from '../../../services/audit.service';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { CommonService } from 'src/app/services/common.service';
import { AuditSubjectService } from '../../../services/audit-subject.service';

@Component({
  selector: 'app-line-data-integrity-audit',
  templateUrl: './line-data-integrity-audit.component.html',
  styleUrls: ['./line-data-integrity-audit.component.scss']
})
export class LineDataIntegrityAuditComponent implements OnInit, OnDestroy {
  @ViewChild(TreePickListComponent, { static: true }) treePickListComponent!: TreePickListComponent;

  @Input() nameControl: string;
  @Input() showMessagesDescription = true;
  @Input() showConfirmIntegrity = true;
  @Input() integrityAuditDefault = false;
  @Output() statusConfigurationToSave = new EventEmitter();
  @Output() statusConfigurationToRun = new EventEmitter();

  optionsLineDataIntegrity = COptionsLineDataIntegrity;
  selectedGroupChk: Array<string> = [];
  granularAuditDataChange: IGranularAuditDataOfAudit;
  granularAuditDataChangeSubscription: Subscription;

  treeDataSource: ITreeNodePickList<{ type: number }>[] = [];
  dataSource: ITreeNodePickList<{ type: number }>[] = [];
  dataTarget: ITreeNodePickList<{ type: number }>[] = [];
  blockTreePickList = false;
  translateResults: any;

  confirmDialogData: IDialogConfirm = {
    title: '',
    content: '',
    titleReject: '',
    titleAccept: '',
    isShowConfirmDialog: false,
    data: undefined
  };

  confirmIntegrityAudit: IConfirmRunAudit = {
    title: '',
    content: '',
    isShowConfirmDialog: false,
    titleAccept: '',
    titleReject: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleAccept: (isAccept: boolean) => { }
  };

  nameFormFieldOptions = 'options';
  nameFormFieldTreePick = 'treePick';
  panelMessagesData = {
    content: ''
  };

  constructor(
    public rootFormGroup: FormGroupDirective,
    private auditService: AuditService,
    private translateInternalService: TranslateInternalService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    public auditSubjectService: AuditSubjectService) {
    this.translateResults = this.translateInternalService.translateResults;
  }

  get getFormFieldConfiguration() {
    return this.rootFormGroup.form.get(this.nameControl);
  }

  get getFormFieldTreePick(): FormControl<ITreeNodePickList<{ type: number }>[]> | null {
    return this.getFormFieldConfiguration?.get(this.nameFormFieldTreePick) as FormControl<ITreeNodePickList<{ type: number }>[]>;
  }

  get getFormFieldOptions(): FormControl<string[]> | null {
    return this.getFormFieldConfiguration?.get(this.nameFormFieldOptions) as FormControl<string[]>;
  }

  ngOnInit() {
    this.panelMessagesData.content = this.translateResults.AUDIT.MESSAGE.LINE_DATA_AUDIT_REPORT_WARNING;
    this.handleChangeSelectedGroupChk(false);
    this.confirmDialogData.title = this.translateResults.AUDIT.HEADER.WARNING;
    this.confirmDialogData.content = this.translateResults.AUDIT.MESSAGE.SELECT_GRANULAR_LINE_TREE_REPLACE;
    this.confirmDialogData.titleAccept = this.translateResults.AUDIT.BUTTON_LABEL.REPLACE;
    this.confirmDialogData.titleReject = this.translateResults.COMMON.CLOSE;
    this.granularAuditDataChangeSubscription = this.auditSubjectService.granularAuditDataChangeSubject.subscribe({
      next: (granularData) => {
        this.granularAuditDataChange = granularData;
        this.getTreeSource();
      }
    });
  }

  handleChangeSelectedGroupChk(markAsDirty = true, internalShowConfirm = false, chkInteractValue?: string) {
    if (
      this.showConfirmIntegrity &&
      internalShowConfirm &&
      chkInteractValue &&
      chkInteractValue === COptionsLineDataIntegrity[0].value &&
      this.selectedGroupChk.includes(COptionsLineDataIntegrity[0].value)
    ) {
      this.confirmIntegrityAudit.isShowConfirmDialog = true;
      this.confirmIntegrityAudit.title = this.translateResults.AUDIT.HEADER.IS_DN_AUDITED;
      this.confirmIntegrityAudit.content = this.translateResults.AUDIT.MESSAGE.INTEGRITY_AUDIT_CONFIRM_CALL_AGENT;
      this.confirmIntegrityAudit.titleAccept = this.translateResults.COMMON.YES;
      this.confirmIntegrityAudit.titleReject = this.translateResults.COMMON.NO;
      this.confirmIntegrityAudit.handleAccept = (isAccept: boolean) => {
        if (isAccept) {
          this.confirmIntegrityAudit.isShowConfirmDialog = false;
          this.cdr.detectChanges();
          this.confirmIntegrityAudit.title = this.translateResults.AUDIT.HEADER.CONFIRM;
          this.confirmIntegrityAudit.content = this.translateResults.AUDIT.MESSAGE.INTEGRITY_AUDIT_CONFIRM_INCLUDING_DN;
          this.confirmIntegrityAudit.handleAccept = (isAccept1: boolean) => {
            if (isAccept1) {
              // yes-yes
              this.confirmIntegrityAudit.isShowConfirmDialog = false;
              this.setValueFormFieldOptions(markAsDirty);
            } else {
              // yes-no
              this.selectedGroupChk = this.selectedGroupChk.filter(n => n !== COptionsLineDataIntegrity[0].value);
              this.setValueFormFieldOptions(markAsDirty);
              this.confirmIntegrityAudit.isShowConfirmDialog = false;
            }
          };
          this.confirmIntegrityAudit.isShowConfirmDialog = true;
        } else {
          this.confirmIntegrityAudit.isShowConfirmDialog = false;
          this.cdr.detectChanges();
          this.confirmIntegrityAudit.title = this.translateResults.AUDIT.HEADER.CONFIRM;
          this.confirmIntegrityAudit.content = this.translateResults.AUDIT.MESSAGE.INTEGRITY_AUDIT_CONFIRM_EXCEPT_DN;
          this.confirmIntegrityAudit.handleAccept = (isAccept1: boolean) => {
            if (isAccept1) {
              // no-yes
              this.confirmIntegrityAudit.isShowConfirmDialog = false;
              this.setValueFormFieldOptions(markAsDirty);
            } else {
              // no-no
              this.selectedGroupChk = this.selectedGroupChk.filter(n => n !== COptionsLineDataIntegrity[0].value);
              this.setValueFormFieldOptions(markAsDirty);
              this.confirmIntegrityAudit.isShowConfirmDialog = false;
            }
          };
          this.confirmIntegrityAudit.isShowConfirmDialog = true;
        }
      };
    } else {
      this.setValueFormFieldOptions(markAsDirty);
    }
  }

  setValueFormFieldOptions(markAsDirty = true) {
    this.getFormFieldOptions?.setValue(this.selectedGroupChk);
    if (markAsDirty) {
      this.getFormFieldOptions?.markAsDirty();
    }
    const configurationOptions = this.getFormFieldOptions?.value || [];
    const integrityAuditSelected = configurationOptions.indexOf(COptionsLineDataIntegrity[0].value) > -1;
    this.blockTreePickList = integrityAuditSelected ? true : false;
  }

  handleChangeTreePickList(selectedItemsTree: IChangeDataPickList) {
    const selectedData = selectedItemsTree.disabled ? [] : selectedItemsTree.target;
    const granularLineGWCData = selectedData.filter(n => n.data?.type === EGranularLineType.SmallLine
      || n.data?.type === EGranularLineType.LargeLine);
    const granularLineLGRPData = selectedData.filter(n => n.data?.type === EGranularLineType.LGRP);
    if (granularLineGWCData.length > 0 && granularLineLGRPData.length > 0) {
      this.confirmDialogData.data = selectedItemsTree;
      this.confirmDialogData.isShowConfirmDialog = true;
      return;
    }
    this.setValueFieldTreePick(selectedData, selectedItemsTree);
  }

  handleConfirm(event: boolean) {
    this.confirmDialogData.isShowConfirmDialog = false;
    if (event) {
      this.treePickListComponent.dataTarget = this.confirmDialogData.data.nodeLeafSelectedItemsSource;
      this.treePickListComponent.selectedItemsTarget = [];
      this.setValueFieldTreePick(this.treePickListComponent.dataTarget, this.confirmDialogData.data);
      this.confirmDialogData.data = undefined;
    } else {
      const nodeLeafSelected = this.confirmDialogData.data.nodeLeafSelectedItemsSource;
      this.treePickListComponent.dataTarget = this.treePickListComponent.dataTarget.filter((n) => {
        const arrKey = [];
        for (let i = 0; i < nodeLeafSelected.length; i++) {
          arrKey.push(nodeLeafSelected[i].key);
        }
        if (arrKey.length === 0) {
          return false;
        } else {
          return !arrKey.includes(n.key);
        }
      });
      this.setValueFieldTreePick(this.treePickListComponent.dataTarget, this.confirmDialogData.data);
      this.confirmDialogData.data = undefined;
    }
  }

  setValueFieldTreePick(value: ITreeNodePickList<{ type: number }>[], selectedItemsTree: IChangeDataPickList) {
    this.getFormFieldTreePick?.setValue(value);
    if (!selectedItemsTree.changeBySetDefault) {
      this.getFormFieldTreePick?.markAsDirty();
    }
    this.checkStatusConfigurationToRun(selectedItemsTree);
  }

  getTreeSource() {
    forkJoin({
      nodeNameNumber: this.auditService.getNodeNameNumber(),
      granularLineTree: this.auditService.getGranularLineTree()
    }).subscribe(({ nodeNameNumber, granularLineTree }) => {
      nodeNameNumber.list.sort((a, b) => a.nodeName.toLowerCase().localeCompare(b.nodeName.toLowerCase()));
      granularLineTree.sort((a, b) => a.gwName.toLowerCase().localeCompare(b.gwName.toLowerCase()));
      this.convertDataForTreeSource(nodeNameNumber, granularLineTree);
      this.setDefaultLineDataIntegrity();
    });
  }

  setDefaultLineDataIntegrity() {
    if (this.granularAuditDataChange) {
      this.cdr.detectChanges();
      const granularAuditDataTemp = this.granularAuditDataChange.granularAudit.data;
      const allNodeLeafDataSource = this.getAllNodeLeafDataSource();
      // set value tree pick list
      if (allNodeLeafDataSource && allNodeLeafDataSource.length > 0) {
        const targetTemp: ITreeNodePickList<{ type: number }>[] = [];
        granularAuditDataTemp.map((item) => {
          const node = allNodeLeafDataSource.find(n => n.data.type === item.type && n.label === item.data);
          if (node) {
            targetTemp.push(node);
          }
        });
        if (targetTemp.length > 0) {
          this.dataTarget = targetTemp;
          this.getFormFieldTreePick?.setValue(this.dataTarget);
        }
      }
      // set value checkbox configurationGroup
      const configurationOptions = [];
      if (this.granularAuditDataChange.granularAudit.options === 1) {
        configurationOptions.push(COptionsLineDataIntegrity[1].value);
      }
      if (this.integrityAuditDefault) {
        configurationOptions.push(COptionsLineDataIntegrity[0].value);
      }
      this.selectedGroupChk = configurationOptions;
      this.handleChangeSelectedGroupChk(false);
    }
  }

  convertDataForTreeSource(nodeNameData: INodeNameNumber, granularLineTreeData: IGranularLineTree[]) {
    this.treeDataSource = [];
    this.treeDataSource.push(CGranularLineTreeInitData);
    // #region add data for LGRP
    const LGRPChildrenTemp: ITreeNodePickList<{ type: number }>[] = [];
    nodeNameData.list.map((nodeNameItem, index) => {
      const newItem: ITreeNodePickList<{ type: number }> =
        { 'key': '0-1-' + index, label: nodeNameItem.nodeName, data: { type: EGranularLineType.LGRP } };
      LGRPChildrenTemp.push(newItem);
    });
    const LGRPData = this.treeDataSource[0].children?.find(n => n.key === '0-1');
    if (LGRPData) {
      LGRPData.children = LGRPChildrenTemp;
    }
    // #endregion

    const GWCNode = this.treeDataSource[0].children?.find(n => n.key === '0-0');
    const smallLineNode = GWCNode?.children?.find(n => n.key === '0-0-0');
    const largeLineNode = GWCNode?.children?.find(n => n.key === '0-0-1');
    const granularSmallLineNodeData = granularLineTreeData.filter(n => n.type === 0);
    const granularLargeLineNodeData = granularLineTreeData.filter(n => n.type === 1);

    // #region add data for GWC > Small Line
    if (smallLineNode) {
      const smallLineNodeTemp: ITreeNodePickList<{ type: number }>[] = [];
      granularSmallLineNodeData.map((smallLineItem, index) => {
        const newItem: ITreeNodePickList<{ type: number }> =
          { key: '0-0-0-' + index, label: smallLineItem.gwcId, data: { type: EGranularLineType.SmallLine } };
        smallLineNodeTemp.push(newItem);
      });
      smallLineNode.children = smallLineNodeTemp;
    }
    // #endregion

    // #region add data for GWC > large Line
    if (largeLineNode) {
      const largeLineNodeTemp: ITreeNodePickList<{ type: number }>[] = [];
      // group by gwcId
      const groupedKeysLargeLineNodeData = granularLargeLineNodeData.reduce((group: IGroupedKeysLargeLineNode, item) => {
        if (!group[item.gwcId]) {
          group[item.gwcId] = [];
        }
        group[item.gwcId].push(item);
        return group;
      }, {});
      // end
      Object.keys(groupedKeysLargeLineNodeData).map((key, index) => {
        const valueGroup = groupedKeysLargeLineNodeData[key];
        const newItem: ITreeNodePickList<{ type: number }> = { key: '0-0-1-' + index, label: key, children: [] };
        valueGroup.map((itemValueGroup: any, indexChild) => {
          if (itemValueGroup.gwName !== '') {
            const newItemChild: ITreeNodePickList<{ type: number }> =
              { key: newItem.key + `-${indexChild}`, label: itemValueGroup.gwName, data: { type: EGranularLineType.LargeLine } };
            newItem.children?.push(newItemChild);
          }
        });
        if (newItem.children && newItem.children?.length > 0) {
          largeLineNodeTemp.push(newItem);
        }
      });
      largeLineNode.children = largeLineNodeTemp;
    }
    // #endregion
    this.dataSource = this.treeDataSource;
  }

  getAllNodeLeafDataSource() {
    const allNodeLeaf = this.treePickListComponent.getAllNodeLeafDataSource();
    return allNodeLeaf;
  }

  checkStatusConfigurationToSave() {
    this.statusConfigurationToSave.emit(this.getFormFieldConfiguration?.invalid);
  }

  checkStatusConfigurationToRun(selectedItemsTree: { target: ITreeNodePickList<{ type: number }>[], disabled: boolean }) {
    const valueSelected = this.getFormFieldTreePick?.value || [];
    if (selectedItemsTree.disabled || (valueSelected.length > 0)) {
      this.statusConfigurationToRun.emit(false);
      return;
    }
    this.statusConfigurationToRun.emit(true);
  }

  handleNodeSelectSource(event: { nodeLeafSelected: ITreeNodePickList[] }) {
    const granularLineGWCData = event.nodeLeafSelected.filter(n => n.data?.type === EGranularLineType.SmallLine
      || n.data?.type === EGranularLineType.LargeLine);
    const granularLineLGRPData = event.nodeLeafSelected.filter(n => n.data?.type === EGranularLineType.LGRP);
    if (granularLineGWCData.length > 0 && granularLineLGRPData.length > 0) {
      this.commonService.showErrorMessage(this.translateResults.AUDIT.MESSAGE.SELECT_GRANULAR_LINE_TREE);
      this.treePickListComponent.selectedItemsSource = [];
    }
  }

  ngOnDestroy(): void {
    if (this.granularAuditDataChangeSubscription) {
      this.granularAuditDataChangeSubscription.unsubscribe();
    }
  }
}
