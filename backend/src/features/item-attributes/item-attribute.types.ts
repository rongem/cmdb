export type AttributeValueType = 'string' | 'int' | 'decimal' | 'datetime' | 'bool' | 'enum';

export type ItemAttributeValue =
  | { type: 'string'; value: string }
  | { type: 'int'; value: number }
  | { type: 'decimal'; value: number }
  | { type: 'datetime'; value: string }
  | { type: 'bool'; value: boolean }
  | { type: 'enum'; value: string; enumValueId?: number | null };

export type ItemAttribute = {
  id: string;
  itemId: string;
  key: string;
  value: ItemAttributeValue;
  createdAt: string;
  updatedAt: string;
};

export type CreateItemAttributeInput = {
  itemId: string;
  key: string;
  value: ItemAttributeValue;
};

export type UpdateItemAttributeInput = Partial<CreateItemAttributeInput> & {
  id: string;
};
