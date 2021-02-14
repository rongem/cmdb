export interface IRestConnectionRule {
    id: string;
    upperItemTypeId: string;
    connectionTypeId: string;
    lowerItemTypeId: string;
    maxConnectionsToUpper: number;
    maxConnectionsToLower: number;
    validationExpression: string;
}
