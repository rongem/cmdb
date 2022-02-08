export class ItemHistoryEntry {
    name?: string;
    type?: string;
    attributes?: {
      type?: string;
      value: string;
    }[];
    responsibleUsers?: string[];
}
