export class AttributeGroupMapping {
    private attributeGroupName$: string;
    private attributeTypeNames$: string[];
    private itemTypeNames$: string[];
    constructor(attributeGroupName: string, attributeTypeNames: string[], itemTypeNames: string[]) {
        this.attributeGroupName$ = attributeGroupName;
        this.attributeTypeNames$ = attributeTypeNames;
        this.itemTypeNames$ = itemTypeNames;
    }
    get attributeGroupName() { return this.attributeGroupName$; }
    get attributeTypeNames() { return this.attributeTypeNames$; }
    get itemTypeNames() { return this.itemTypeNames$; }
}
