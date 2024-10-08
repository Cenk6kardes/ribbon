import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalProtocolComponent } from './signal-protocol.component';
import { AppModule } from 'src/app/app.module';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SignalProtocolComponent', () => {
  let component: SignalProtocolComponent;
  let fixture: ComponentFixture<SignalProtocolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignalProtocolComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(SignalProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call transformProtocolType and handleProtocolTypeChange when signalProtocols change', () => {
    const mockSignalProtocols = [
      {
        port: 2,
        protocol: {
          __value: 3
        },
        version: '1'
      }
    ];
    const changes = {
      signalProtocols: {
        currentValue: mockSignalProtocols,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    };
    const protocols = [
      {
        protocolType: 'string',
        protocolPort: 'string',
        protocolValue: 2,
        version: 'string'
      }
    ];
    component.protocols = protocols;
    component.signalProtocols = mockSignalProtocols;
    spyOn(component, 'transformProtocolType');
    spyOn(component, 'handleProtocolTypeChange');

    component.ngOnChanges(changes);

    expect(component.transformProtocolType).toHaveBeenCalledWith(
      mockSignalProtocols
    );
    expect(component.handleProtocolTypeChange).toHaveBeenCalledWith(
      component.protocols[0]
    );
  });

  it('should transform supportedProtocols and update protocols', () => {
    const mockSupportedProtocols = [
      {
        port: 2,
        protocol: {
          __value: 3
        },
        version: '1'
      }
    ];
    component.transformProtocolType(mockSupportedProtocols);
    expect(component.protocols.length).toBe(mockSupportedProtocols.length);
  });

  it('should update form values based on selected protocol type', () => {
    const selectedProtocolType = {
      protocolType: 'string',
      protocolPort: 'string',
      protocolValue: 2,
      version: 'string'
    };
    component.handleProtocolTypeChange(selectedProtocolType);
    expect(component.form.get('protocolType')?.value).toEqual(
      'string'
    );
    expect(component.form.get('protocolPort')?.value).toEqual(
      'string'
    );
    expect(component.form.get('protocolVersion')?.value).toEqual('string');
  });

  it('should prevent default for forbidden key codes', () => {
    const event = { key: '+', preventDefault: jasmine.createSpy('preventDefault') };
    component.keyPreventFn(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
