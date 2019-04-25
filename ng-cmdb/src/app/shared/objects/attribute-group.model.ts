import { Guid } from 'guid-typescript';

export class AttributeGroup {
    groupId: Guid;
    groupName: string;

    constructor({ GroupId, GroupName }) {
        this.groupId = GroupId;
        this.groupName = GroupName;
    }
}