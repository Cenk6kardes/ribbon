interface IRestErrorResponse {
  errorCode: string;
  message: string;
}

interface IPreferences {
  refresh: {
    checked: boolean;
    second: number;
  };
  termination: {
    checked: boolean;
    hour: number;
    minute: number;
  };
  cpdRequest: boolean;
}

export interface IStatusLog {
  time: string;
  message: string;
}
