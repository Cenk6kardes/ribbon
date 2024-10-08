export interface IRestErrorResponse {
  errorCode: string;
  message: string;
}

export interface IPreferences {
  refresh: {
    checked: boolean;
    second: number;
  };
  confirmation: {
    checked: boolean;
  };
}

