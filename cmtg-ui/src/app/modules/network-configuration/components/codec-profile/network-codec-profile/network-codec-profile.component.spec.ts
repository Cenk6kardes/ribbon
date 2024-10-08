import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCodecProfileComponent } from './network-codec-profile.component';
import { SafePipe } from 'src/app/shared/pipes/safe.pipe';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateInternalService } from 'src/app/services/translate-internal.service';
import { NetworkConfigurationService } from '../../../services/network-configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { of, throwError } from 'rxjs';
import { mapCodecSelectionToNumber, mapPacketizationRateToNumber, mapT38ToNumber } from '../models/network-codec-profile';

describe('NetworkCodecProfileComponent', () => {
  let component: NetworkCodecProfileComponent;
  let fixture: ComponentFixture<NetworkCodecProfileComponent>;
  const translate = {
    translateResults: {
      COMMON: {
        DELETE: 'Delete',
        OK: 'OK',
        CLOSE: 'Close',
        ACTION: 'Action',
        RUN: 'Run',
        CANCEL: 'Cancel',
        ERROR: 'Error',
        ADD: 'Add',
        YES: 'Yes',
        NO: 'No'
      },
      CODEC_PROFILE: {
        HEADER: {
          TITLE: 'Codec Profile',
          GENERAL_NETWORK_SETTING: 'General Network Setting'
        },
        TABS: {
          NETWORK_CODEC_PROFILE: 'Network Codec Profile',
          DQOS_CONF: 'DQoS Configuration'
        },
        NETWORK_CODEC_PROFILE: {
          NEW_PROFILE: 'New Profile',
          FORM: {
            NAME: 'Name',
            CODEC_SELECTION: 'Codec Selection',
            PACKETIZATION_RATE: 'Packetization Rate',
            T_38: 'T-38',
            RFC2833: 'RFC2833',
            COMFORT_NOISE: 'Comfort Noise',
            BEARER_TYPE_DEFAULT: 'Bearer Type Default',
            NETWORK_DEFAULT: 'Network Default'
          },
          ADD: {
            TITLE: 'Add New Network Codec Profile',
            NAME: 'Profile Name',
            PACKETIZATION_RATE: 'Packetization Rate',
            T_38: 'T-38',
            RFC2833: 'RFC2833',
            COMFORT_NOISE: 'Comfort Noise',
            SET_DEFAULT: 'Set as Network Default',
            CANCEL_INFO_TITLE: 'Profile has not been stored',
            CANCEL_INFO_BODY:
              'You have changed this profile setting. The change will be lost if you close this dialog.<br><br>Do you wish to continue?',
            INVALID_CODEC_SELECTION_TITLE: 'Invalid Codec Selection',
            INVALID_CODEC_SELECTION_BODY:
              'Codec selection is invalid. Please modify it and try again.' +
              '<br>Please consult the GWCEM Help panels for further information on the supported combinations.',
            ADD_ERROR_MESSAGE: 'Can not add network codec profile.',
            NAME_EXISTS_ERROR: {
              TITLE: 'Add Network Codec Profile Error',
              MESSAGE: 'The network codec profile name /{{codecName}}/ is already in use.'
            }
          },
          DELETE: {
            TITLE: 'Delete Network Codec Profile',
            DELETE_DIALOG_MESSAGE: 'This operation will delete the selected network codec profile: ',
            CONFIRM_TO_CONTINUE_MESSAGE: 'Do you wish to continue?',
            DELETE_ERROR_MESSAGE: 'Can not delete network codec profile.'
          },
          EDIT: {
            TITLE:'Edit Network Codec Profile',
            NAME: 'Profile Name',
            PACKETIZATION_RATE: 'Packetization Rate',
            T_38: 'T-38',
            RFC2833: 'RFC2833',
            COMFORT_NOISE: 'Comfort Noise',
            SET_DEFAULT: 'Set as Network Default',
            EDIT_ERROR_MESSAGE: 'Can not edit network codec profile.'
          }
        }
      }
    }
  };

  const messageContent = '200 OK';

  const ntwkCodecProfileData = {
    name: 'tst',
    bearerPath: 1,
    defaultCodec: 2,
    preferredCodec: 1,
    alternativeCodec: 4,
    packetizationRate: 2,
    t38: 1,
    rfc2833: 1,
    comfortNoise: 0,
    bearerTypeDefault: 0,
    networkDefault: 0
  };

  const formData = {
    name: 'test',
    packetizationRate: '20 ms',
    t38: 'OFF',
    rfc2833: false,
    comfortNoise: true,
    networkDefault: false,
    codecSelectionOrder: [
      { name: 'PCMA' },
      { name: 'PCMU' }
    ]
  };

  const getNtwkCodecProfileResponse = {
    'count': 3,
    'ncpList': [
      {
        'name': 'default',
        'bearerPath': {
          '__value': 1
        },
        'defaultCodec': {
          '__value': 1
        },
        'preferredCodec': {
          '__value': 4
        },
        'alternativeCodec': {
          '__value': 2
        },
        'packetizationRate': {
          '__value': 2
        },
        't38': {
          '__value': 0
        },
        'rfc2833': {
          '__value': 1
        },
        'comfortNoise': {
          '__value': 1
        },
        'bearerTypeDefault': {
          '__value': 1
        },
        'networkDefault': {
          '__value': 1
        }
      },
      {
        'name': 'largeSDP1',
        'bearerPath': {
          '__value': 1
        },
        'defaultCodec': {
          '__value': 2
        },
        'preferredCodec': {
          '__value': 1
        },
        'alternativeCodec': {
          '__value': 4
        },
        'packetizationRate': {
          '__value': 2
        },
        't38': {
          '__value': 1
        },
        'rfc2833': {
          '__value': 1
        },
        'comfortNoise': {
          '__value': 1
        },
        'bearerTypeDefault': {
          '__value': 0
        },
        'networkDefault': {
          '__value': 0
        }
      },
      {
        'name': 'test1',
        'bearerPath': {
          '__value': 1
        },
        'defaultCodec': {
          '__value': 2
        },
        'preferredCodec': {
          '__value': 1
        },
        'alternativeCodec': {
          '__value': 4
        },
        'packetizationRate': {
          '__value': 2
        },
        't38': {
          '__value': 1
        },
        'rfc2833': {
          '__value': 1
        },
        'comfortNoise': {
          '__value': 0
        },
        'bearerTypeDefault': {
          '__value': 0
        },
        'networkDefault': {
          '__value': 0
        }
      }
    ]
  };

  const errorAdd = {
    'errorCode': '500',
    'message': 'message = The network codec profile name (tst) is already in use. details = '
  };

  const errorDelete = {
    'errorCode': '500',
    'message': 'message = Error occured during operation for deleting network codec profile: test. Network Codec Profile (test)'+
      ' does not exist in the database. details = com.nortel.ptm.gwcem.exceptions'
  };

  const errorEdit = {
    'errorCode': '500',
    'message': 'message = Error occured during operation for changing network codec profile: test. Network Codec Profile (test)'+
      ' does not exist in the database. details = com.nortel.ptm.gwcem.exceptions'
  };

  const codecList = [
    { name: 'G.729' },
    { name: 'PCMA' },
    { name: 'PCMU' },
    { name: 'G.726-32' },
    { name: 'G.723-1' },
    { name: 'EVRC' },
    { name: 'EVRC0' },
    { name: 'AAL2-G726-32' },
    { name: 'BV16' },
    { name: 'AMR' },
    { name: 'G726-24' }
  ];

  const networkConfigurationService = jasmine.createSpyObj('networkConfigurationService',
    ['getNtwkCodecProfile', 'addNwkCodecProfile', 'deleteNwkCodecProfile', 'editNwkCodecProfile']);

  const commonService = jasmine.createSpyObj('commonService', ['showAPIError']);

  const mockEventEmitter = new EventEmitter<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkCodecProfileComponent, SafePipe ],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TranslateInternalService, useValue: translate },
        { provide: NetworkConfigurationService, useValue: networkConfigurationService },
        { provide: CommonService, useValue: commonService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NetworkCodecProfileComponent);
    component = fixture.componentInstance;
    networkConfigurationService.getNtwkCodecProfile.and.returnValue(of(getNtwkCodecProfileResponse));
    networkConfigurationService.addNwkCodecProfile.and.returnValue(of(messageContent));
    networkConfigurationService.deleteNwkCodecProfile.and.returnValue(of(messageContent));
    networkConfigurationService.editNwkCodecProfile.and.returnValue(of(messageContent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getNtwkCodecProfile() should call with error ', () => {
    networkConfigurationService.getNtwkCodecProfile.and.returnValue(throwError('error'));

    component.getNtwkCodecProfile();

    expect(networkConfigurationService.getNtwkCodecProfile).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(commonService.showAPIError).toHaveBeenCalledWith('error');
  });

  it('should refreshTable()', () => {
    spyOn(component, 'getNtwkCodecProfile');

    component.refreshTable();

    expect(component.getNtwkCodecProfile).toHaveBeenCalled();
  });

  // Add Network Codec Profile
  it('should call addNtwkCodecProfile() with same name ', () => {
    component.data = [{
      name: 'tst',
      packetizationRate: '',
      t38: '',
      rfc2833: '',
      comfortNoise: '',
      networkDefault: '',
      codecSelection: '',
      bearerPath: '',
      bearerTypeDefault: ''
    }];

    component.addNtwkCodecProfile(ntwkCodecProfileData);

    expect(component.showCodecNameExistsErrorDialog).toBeTrue();
    expect(component.alreadyExistsMessage).toEqual('The network codec profile name tst is already in use.');
  });

  it('should call addNtwkCodecProfile()', () => {
    spyOn(component, 'closeAddNwkCodecProfile');
    spyOn(component, 'refreshTable');
    component.isLoading = true;

    component.addNtwkCodecProfile(ntwkCodecProfileData);

    expect(networkConfigurationService.addNwkCodecProfile).toHaveBeenCalledWith(ntwkCodecProfileData);
    expect(component.isLoading).toBeFalse();
    expect(component.closeAddNwkCodecProfile).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('addNtwkCodecProfile() should call with error ', () => {
    networkConfigurationService.addNwkCodecProfile.and.returnValue(throwError(errorAdd));

    component.addNtwkCodecProfile(ntwkCodecProfileData);

    expect(networkConfigurationService.addNwkCodecProfile).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.showAddErrorDialog).toBeTrue();
  });

  it('should call closeAddErrorDialog()', () => {
    spyOn(component, 'closeAddNwkCodecProfile');
    component.closeAddErrorDialog();

    expect(component.showAddErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
    expect(component.closeAddNwkCodecProfile).toHaveBeenCalled();
  });

  it('should call closeCodecNameExistsErrorDialog()', () => {
    component.closeCodecNameExistsErrorDialog();

    expect(component.showCodecNameExistsErrorDialog).toBe(false);
    expect(component.alreadyExistsMessage).toBe('');
  });

  it('should call addNewNwkCodecProfileBtn()', () => {
    component.addNewNwkCodecProfileBtn();

    expect(component.showAddNwkCodecProfile).toBe(true);
  });

  it('should call closeAddNwkCodecProfile()', () => {
    spyOn(component, 'initCodec');
    component.closeAddNwkCodecProfile();

    expect(component.showAddNwkCodecProfile).toBe(false);
    expect(component.networkCodecProfileFormGroup.value).toEqual({
      name: '',
      packetizationRate: '10 ms',
      t38: 'OFF',
      rfc2833: false,
      comfortNoise: false,
      networkDefault: false,
      codecSelectionOrder: null
    });
    // expect(component.showDetailsBtn).toBe(true);
    expect(component.initCodec).toHaveBeenCalled();
  });

  it('should call addNetworkCodecProfileFormFooterHandler() with event=true, codecSelectionOrder length > 3', () => {
    spyOn(component, 'checkPCMAorPCMUavailable');
    const event = true;
    component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([
      { name: 'G.729' },
      { name: 'PCMA' },
      { name: 'PCMU' },
      { name: 'G.726-32' }
    ]);

    component.addNetworkCodecProfileFormFooterHandler(event);

    expect(component.showInfoAboutInvalidCodec).toBe(true);
  });

  it('should call addNetworkCodecProfileFormFooterHandler() with event=true, codecSelectionOrder length < 3,PCMA and PCMU isnt available',
    () => {
      spyOn(component, 'setDataForRequest');
      spyOn(component, 'addNtwkCodecProfile');
      const event = true;
      component.networkCodecProfileFormGroup.setValue(formData);
      component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([
        { name: 'G.729' },
        { name: 'PCMA' },
        { name: 'PCMU' }
      ]);

      component.addNetworkCodecProfileFormFooterHandler(event);
      const data = component.setDataForRequest();
      expect(component.addNtwkCodecProfile).toHaveBeenCalledWith(data);
    }
  );

  it('should call addNetworkCodecProfileFormFooterHandler() with event=false without dirty', () => {
    const event = false;
    spyOn(component, 'closeAddNwkCodecProfile');
    component.networkCodecProfileFormGroup.setValue(formData);

    component.addNetworkCodecProfileFormFooterHandler(event);

    expect(component.closeAddNwkCodecProfile).toHaveBeenCalled();
  });

  it('should call addNetworkCodecProfileFormFooterHandler() with event=false with dirty', () => {
    const event = false;
    component.networkCodecProfileFormGroup.setValue(formData);
    component.networkCodecProfileFormGroup.markAsDirty();

    component.addNetworkCodecProfileFormFooterHandler(event);

    expect(component.showInfoAboutCancelOptionDialog).toBe(true);
  });

  it('should call closeCancelOptionDialog()', () => {
    component.closeCancelOptionDialog();

    expect(component.showInfoAboutCancelOptionDialog).toBe(false);
  });

  it('should call closeInfoAboutCancelOptionDialog() with event=true', () => {
    spyOn(component, 'closeAddNwkCodecProfile');
    spyOn(component, 'closeCancelOptionDialog');
    const event = true;

    component.closeInfoAboutCancelOptionDialog(event);

    expect(component.closeAddNwkCodecProfile).toHaveBeenCalled();
    expect(component.closeCancelOptionDialog).toHaveBeenCalled();
    expect(component.showEditNwkCodecProfile).toBe(false);
  });

  it('should call closeInfoAboutCancelOptionDialog() with event=false', () => {
    spyOn(component, 'closeCancelOptionDialog');
    const event = false;

    component.closeInfoAboutCancelOptionDialog(event);

    expect(component.closeCancelOptionDialog).toHaveBeenCalled();
  });

  it('should call closeInfoAboutInvalidCodec()', () => {
    component.closeInfoAboutInvalidCodec();

    expect(component.showInfoAboutInvalidCodec).toBe(false);
  });

  // Delete Network Codec Profile
  it('should call deleteNtwkCodecProfile()', () => {
    spyOn(component, 'closeDeleteNtwkCodecProfile');
    spyOn(component, 'refreshTable');
    component.isLoading = true;
    const profileName = 'test';

    component.deleteNtwkCodecProfile(profileName);

    expect(networkConfigurationService.deleteNwkCodecProfile).toHaveBeenCalledWith(profileName);
    expect(component.isLoading).toBeFalse();
    expect(component.closeDeleteNtwkCodecProfile).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should call deleteNtwkCodecProfile(), error', () => {
    networkConfigurationService.deleteNwkCodecProfile.and.returnValue(throwError(errorDelete));
    component.isLoading = true;
    const profileName = 'test';

    component.deleteNtwkCodecProfile(profileName);

    expect(networkConfigurationService.deleteNwkCodecProfile).toHaveBeenCalledWith(profileName);
    expect(component.isLoading).toEqual(false);
    expect(component.detailsText).toBe(
      'Error occured during operation for deleting network codec profile: test.'+
      ' Network Codec Profile (test) does not exist in the database. ');
    expect(component.messageText).toBe(translate.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.DELETE.DELETE_ERROR_MESSAGE);
    expect(component.showDeleteErrorDialog).toBe(true);
  });

  it('should call closeDeleteNtwkCodecProfile()', () => {
    component.closeDeleteNtwkCodecProfile();

    expect(component.showDeleteConfirmPopup).toBe(false);
  });

  it('should call deleteNtwkCodecProfileFooterHandler() with event=true', () => {
    spyOn(component, 'deleteNtwkCodecProfile');
    component.deleteSelectedDataWithName = 'test';
    const event = true;

    component.deleteNtwkCodecProfileFooterHandler(event);

    expect(component.deleteNtwkCodecProfile).toHaveBeenCalledWith(component.deleteSelectedDataWithName);
  });

  it('should call deleteNtwkCodecProfileFooterHandler() with event=false', () => {
    spyOn(component, 'closeDeleteNtwkCodecProfile');
    const event = false;

    component.deleteNtwkCodecProfileFooterHandler(event);

    expect(component.closeDeleteNtwkCodecProfile).toHaveBeenCalled();
  });

  it('should call showOrHideButtonClick()', () => {
    component.showOrHideButtonClick();

    expect(component.showDetailsBtn).toBe(component.showDetailsBtn);
  });


  it('should call closeDeleteErrorDialog()', () => {
    spyOn(component, 'closeDeleteNtwkCodecProfile');

    component.closeDeleteErrorDialog();

    expect(component.showDeleteErrorDialog).toBeFalse();
    expect(component.showDetailsBtn).toBeTrue();
    expect(component.closeDeleteNtwkCodecProfile).toHaveBeenCalled();
  });

  // Edit Network Codec Profile
  it('should call editNtwkCodecProfile()', () => {
    spyOn(component, 'closeEditNwkCodecProfile');
    spyOn(component, 'refreshTable');
    component.isLoading = true;

    component.editNtwkCodecProfile(ntwkCodecProfileData);

    expect(networkConfigurationService.editNwkCodecProfile).toHaveBeenCalledWith(ntwkCodecProfileData);
    expect(component.isLoading).toBeFalse();
    expect(component.closeEditNwkCodecProfile).toHaveBeenCalled();
    expect(component.refreshTable).toHaveBeenCalled();
  });

  it('should call editNtwkCodecProfile(), error', () => {
    networkConfigurationService.editNwkCodecProfile.and.returnValue(throwError(errorEdit));
    component.isLoading = true;

    component.editNtwkCodecProfile(ntwkCodecProfileData);

    expect(networkConfigurationService.editNwkCodecProfile).toHaveBeenCalledWith(ntwkCodecProfileData);
    expect(component.isLoading).toEqual(false);
    expect(component.detailsText).toBe(
      'Error occured during operation for changing network codec profile: test.'+
      ' Network Codec Profile (test) does not exist in the database. ');
    expect(component.messageText).toBe(translate.translateResults.CODEC_PROFILE.NETWORK_CODEC_PROFILE.EDIT.EDIT_ERROR_MESSAGE);
    expect(component.showEditErrorDialog).toBe(true);
  });

  it('should call setDataForRequest()', () => {
    component.networkCodecProfileFormGroup.setValue(formData);

    const result = component.setDataForRequest();

    expect(result.name).toEqual('test');
    expect(result.bearerPath).toEqual(1);
    expect(result.bearerTypeDefault).toEqual(1);
    expect(result.packetizationRate).toEqual(mapPacketizationRateToNumber['20 ms']);
    expect(result.t38).toEqual(mapT38ToNumber['OFF']);
    expect(result.rfc2833).toEqual(0);
    expect(result.comfortNoise).toEqual(1);
    expect(result.networkDefault).toEqual(0);
    expect(result.preferredCodec).toEqual(mapCodecSelectionToNumber['PCMA']);
    expect(result.defaultCodec).toEqual(mapCodecSelectionToNumber['PCMU']);
    expect(result.alternativeCodec).toEqual(mapCodecSelectionToNumber['<none>']);
  });

  it('should call closeEditNwkCodecProfile()', () => {
    spyOn(component, 'initCodec');
    component.closeEditNwkCodecProfile();

    expect(component.showEditNwkCodecProfile).toBe(false);
    expect(component.initCodec).toHaveBeenCalled();
  });

  it('should call closeEditErrorDialog()', () => {
    component.closeEditErrorDialog();

    expect(component.showEditErrorDialog).toBe(false);
    expect(component.showDetailsBtn).toBe(true);
  });

  it('should call editNetworkCodecProfileFormFooterHandler() with event=true, codecSelectionOrder length > 3', () => {
    spyOn(component, 'checkPCMAorPCMUavailable');
    const event = true;
    component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([
      { name: 'G.729' },
      { name: 'PCMA' },
      { name: 'PCMU' },
      { name: 'G.726-32' }
    ]);

    component.editNetworkCodecProfileFormFooterHandler(event);

    expect(component.showInfoAboutInvalidCodec).toBe(true);
  });

  it('should call editNetworkCodecProfileFormFooterHandler() with event=true, codecSelectionOrder length < 3,PCMA and PCMU isnt available',
    () => {
      const event = true;
      component.networkCodecProfileFormGroup.setValue(formData);
      component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([
        { name: 'G.729' }
      ]);

      component.editNetworkCodecProfileFormFooterHandler(event);
      expect(component.showInfoAboutInvalidCodec).toBe(true);
    }
  );

  it('should call editNetworkCodecProfileFormFooterHandler() with event=true, codecSelectionOrder length < 3,PCMA and PCMU available',
    () => {
      spyOn(component, 'setDataForRequest');
      spyOn(component, 'editNtwkCodecProfile');
      const event = true;
      const setEditFormData = {
        name: 'test',
        packetizationRate: '20 ms',
        t38: 'OFF',
        rfc2833: false,
        comfortNoise: true,
        networkDefault: false,
        codecSelectionOrder: [
          {name: 'PCMA'},
          {name: 'PCMU'}
        ]
      };
      component.networkCodecProfileFormGroup.setValue(setEditFormData);
      component.checkPCMAorPCMUavailable();

      component.editNetworkCodecProfileFormFooterHandler(event);
      expect(component.setDataForRequest).toHaveBeenCalled();
      expect(component.editNtwkCodecProfile).toHaveBeenCalled();
    }
  );

  it('should call editNetworkCodecProfileFormFooterHandler() with event=false with dirty', () => {
    const event = false;
    component.networkCodecProfileFormGroup.setValue(formData);
    component.networkCodecProfileFormGroup.markAsDirty();

    component.editNetworkCodecProfileFormFooterHandler(event);

    expect(component.showInfoAboutCancelOptionDialog).toBe(true);
  });

  it('should call editNetworkCodecProfileFormFooterHandler() with event=false without dirty', () => {
    const event = false;
    spyOn(component, 'closeEditNwkCodecProfile');

    component.networkCodecProfileFormGroup.setValue(formData);

    component.editNetworkCodecProfileFormFooterHandler(event);

    expect(component.closeEditNwkCodecProfile).toHaveBeenCalled();
  });

  // other helper functions
  it('should call onChangeTargetData()', () => {
    spyOn(component.networkCodecProfileFormGroup, 'updateValueAndValidity');

    component.codecSelectionOrder = [
      { name: 'G.729' },
      { name: 'PCMA' },
      { name: 'PCMU' }
    ];
    component.onChangeTargetData();

    expect(component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].value)
      .toEqual(component.codecSelectionOrder);
    expect(component.networkCodecProfileFormGroup.dirty)
      .toBeTrue();
    expect(component.networkCodecProfileFormGroup.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should check if at least one available codec is selected', () => {
    component.codecList = codecList;

    component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([
      { name: 'G.729' }
    ]);

    const result = component.checkIsAtLeastOneAvailableCodec();

    expect(result).toBeTruthy();
  });

  it('should check if at least one available codec is not selected', () => {
    component.codecList = codecList;
    component.networkCodecProfileFormGroup.controls['codecSelectionOrder'].setValue([]);

    const result = component.checkIsAtLeastOneAvailableCodec();

    expect(result).toBeFalsy();
  });

});
