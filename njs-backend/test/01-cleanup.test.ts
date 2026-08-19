import { describe, test } from 'node:test';
import assert from 'node:assert';

import { userModel } from '../src/models/mongoose/user.model';
import { attributeGroupModel } from '../src/models/mongoose/attribute-group.model';
import { attributeTypeModel } from '../src/models/mongoose/attribute-type.model';
import { connectionTypeModel } from '../src/models/mongoose/connection-type.model';
import { connectionRuleModel } from '../src/models/mongoose/connection-rule.model';
import { itemTypeModel } from '../src/models/mongoose/item-type.model';
import { configurationItemModel } from '../src/models/mongoose/configuration-item.model';
import { connectionModel } from '../src/models/mongoose/connection.model';
import { historicCiModel } from '../src/models/mongoose/historic-ci.model';
import { historicConnectionModel } from '../src/models/mongoose/historic-connection.model';

describe('Pre-flight cleanup', () => {

  test('delete connection history', async () => {
    const result = await historicConnectionModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete configuration item history', async () => {
    const result = await historicCiModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing connections', async () => {
    const result = await connectionModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing configuration items', async () => {
    const result = await configurationItemModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing connection rules', async () => {
    const result = await connectionRuleModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing item types', async () => {
    const result = await itemTypeModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing connection types', async () => {
    const result = await connectionTypeModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing attribute types', async () => {
    const result = await attributeTypeModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing attribute groups', async () => {
    const result = await attributeGroupModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

  test('delete all existing users', async () => {
    const result = await userModel.deleteMany({});
    assert.ok(result.deletedCount >= 0);
  });

});
