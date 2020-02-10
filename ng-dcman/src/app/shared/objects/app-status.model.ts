export class AppStatusCode {
    Name: string;
    Description: string;
    Color: string;
}

export class AppStatusCodes {
    Stored: AppStatusCode;
      Unused: AppStatusCode;
      Booked: AppStatusCode;
      InProduction: AppStatusCode;
      PrepareForScrap: AppStatusCode;
      PendingScrap: AppStatusCode;
      Scrapped: AppStatusCode;
      Unknown: AppStatusCode;
      Error: AppStatusCode;
}
