export type ConfigurationItemStatus = 'draft' | 'active' | 'retired';

export type ConfigurationItem = {
  id: string;
  name: string;
  type: string;
  status: ConfigurationItemStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateConfigurationItemInput = {
  name: string;
  type: string;
  status?: ConfigurationItemStatus;
  description?: string;
};

export type UpdateConfigurationItemInput = Partial<CreateConfigurationItemInput> & {
  id: string;
};
