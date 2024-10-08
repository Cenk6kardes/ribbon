import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AssociateFormService } from '../../../services/associate-form.service';
import { FormGroup } from '@angular/forms';
import {
  ProtocolInfo,
  SupportedProtocols,
  protocolInfoList
} from '../../../models/gwControllers';
@Component({
  selector: 'app-signal-protocol',
  templateUrl: './signal-protocol.component.html',
  styleUrls: ['./signal-protocol.component.scss']
})
export class SignalProtocolComponent implements OnInit, OnChanges {
  @Input() signalProtocols: SupportedProtocols[];
  form: FormGroup;
  protocols: ProtocolInfo[];
  constructor(private formService: AssociateFormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['signalProtocols'] && this.signalProtocols) {
      this.transformProtocolType(this.signalProtocols);
      this.handleProtocolTypeChange(this.protocols[0]);
    }
  }

  ngOnInit(): void {
    this.form = this.formService.signalProtocol;
  }

  get getProtocolPort(){
    return this.form.get('protocolPort');
  }

  transformProtocolType(supportedProtocols: SupportedProtocols[]) {
    const protocolTypes: ProtocolInfo[] = supportedProtocols.flatMap((prot) => {
      const protocolInfo = protocolInfoList.find(
        (info) => info.protocolValue === prot.protocol.__value
      );

      if (protocolInfo) {
        protocolInfo.version = prot.version;
        return [protocolInfo];
      }

      return [];
    });
    this.protocols = protocolTypes;
  }

  keyPreventFn(event: any) {
    const forbiddenKeyCodes = ['+', 'e', 'E', ',', '-', '.']; // plus, e, comma, minus, dot
    if (forbiddenKeyCodes.includes(event.key)) {
      event.preventDefault();
    }
  }

  handleProtocolTypeChange(selectedProtocolType: ProtocolInfo) {
    this.form.setValue({
      protocolType: selectedProtocolType.protocolType,
      protocolPort: selectedProtocolType.protocolPort,
      protocolVersion: selectedProtocolType.version
    });
    this.form.updateValueAndValidity();
  }
}
