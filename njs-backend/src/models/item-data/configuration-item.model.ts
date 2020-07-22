export class ConfigurationItem {
    id!: string;
    typeId!: string;
    type?: string;
    name!: string;
    lastChange?: Date;
    version?: number;
    responsibleUsers?: string[];
}
