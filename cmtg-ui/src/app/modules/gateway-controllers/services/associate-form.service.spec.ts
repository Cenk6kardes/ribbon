import { TestBed } from '@angular/core/testing';

import { AssociateFormService } from './associate-form.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('AssociateFormService', () => {
  let service: AssociateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [AssociateFormService]
    });
    service = TestBed.inject(AssociateFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('mainFormGroup', () => {
    it('should be defined', () => {
      expect(service.mainFormGroup).toBeDefined();
    });
  });

  describe('gatewayInformation', () => {
    it('should be defined', () => {
      expect(service.gatewayInformation).toBeDefined();
    });

    it('should have name control', () => {
      expect(service.gatewayInformation.get('name')).toBeDefined();
    });

    it('should have ipAddress control', () => {
      expect(service.gatewayInformation.get('ipAddress')).toBeDefined();
    });
  });

  describe('signalProtocol', () => {
    it('should be defined', () => {
      expect(service.signalProtocol).toBeDefined();
    });

    it('should have protocolType control', () => {
      expect(service.signalProtocol.get('protocolType')).toBeDefined();
    });

    it('should have protocolPort control', () => {
      expect(service.signalProtocol.get('protocolPort')).toBeDefined();
    });
  });

  describe('gwcBackup', () => {
    it('should be defined', () => {
      expect(service.gwcBackup).toBeDefined();
    });

    it('should have lbl control', () => {
      expect(service.gwcBackup.get('lbl')).toBeDefined();
    });

    it('should have mgcsecipAddress control', () => {
      expect(service.gwcBackup.get('mgcsecipAddress')).toBeDefined();
    });
  });
});
