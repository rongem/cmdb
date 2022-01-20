import { ColumnMap } from 'backend-access';

export class Column {
    orderNumber: number;
    caption: string;
    targetType?: string;
    targetId?: string;
    constructor(i: number, name: string, caption: string) {
        this.orderNumber = i;
        this.caption = caption;
        this.name = name;
    }

    get columnMap(): ColumnMap {
        return { targetType: this.targetType, targetId: this.targetId };
    }

    get name() {
        if (['name', '<ignore>'].includes(this.targetType)) {
            return this.targetType;
        }
        let short = this.targetType.substring(0, 1);
        if (this.targetType === 'connection to lower') {
            short = 'ctl';
        }
        if (this.targetType === 'connection to upper') {
            short = 'ctu';
        }
        return short + ':' + this.targetId;
    }

    set name(value: string) {
        const s = value.split(':');
        switch (s[0]) {
            case 'name':
            case '<ignore>':
                this.targetType = s[0];
                this.targetId = undefined;
                break;
            case 'a':
                this.targetType = 'attribute';
                this.targetId = s[1];
                break;
            case 'ctl':
                this.targetType = 'connection to lower';
                this.targetId = s[1];
                break;
            case 'ctu':
                    this.targetType = 'connection to upper';
                    this.targetId = s[1];
                    break;
        }
    }
}
