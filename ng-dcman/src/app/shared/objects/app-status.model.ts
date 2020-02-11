export class AppStatusCode {
    Name: string;
    Description: string;
    Color: string;
}

export class AppStatusCodes {
    Booked: AppStatusCode;
    Error: AppStatusCode;
    Fault: AppStatusCode;
    InProduction: AppStatusCode;
    RepairPending: AppStatusCode;
    PendingScrap: AppStatusCode;
    PrepareForScrap: AppStatusCode;
    Scrapped: AppStatusCode;
    Stored: AppStatusCode;
    Unknown: AppStatusCode;
    Unused: AppStatusCode;
}
