export class StatusCode {
    Name: string;
    Description: string;
    Color: string;
}

export class StatusCodes {
    Booked: StatusCode;
    Error: StatusCode;
    Fault: StatusCode;
    InProduction: StatusCode;
    RepairPending: StatusCode;
    PendingScrap: StatusCode;
    PrepareForScrap: StatusCode;
    Scrapped: StatusCode;
    Stored: StatusCode;
    Unknown: StatusCode;
    Unused: StatusCode;
}
