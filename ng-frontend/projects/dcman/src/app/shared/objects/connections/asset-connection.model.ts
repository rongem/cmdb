import { Guid } from 'backend-access';
import { Asset } from '../prototypes/asset.model';
import { AppConfigService } from '../../app-config.service';

export class AssetConnection {
    id: Guid;
    containerItem: Asset;
    // embeddedItem: Asset;
    connectionType: Guid;
    private slot$: string;
    private minSlot$: number;
    private maxSlot$: number;
    private unit$: string;
    get minSlot() { return this.minSlot$; }
    get maxSlot() { return this.maxSlot$; }

    get slot() { return this.slot$; }
    set slot(value: string) {
        const regex = new RegExp('^[0-9][0-9]?(-[0-9][0-9]?)?$');
        if (!value.match(regex)) {
            this.slot = '1';
            this.minSlot$ = 1;
            this.maxSlot$ = 1;
        } else {
            this.slot$ = value;
            if (value.includes('-')) {
                const slots = value.split('-');
                this.minSlot$ = +slots[0];
                this.maxSlot$ = +slots[1];
                if (this.minSlot$ > this.maxSlot$) {
                    this.minSlot$ = this.maxSlot$;
                }
            } else {
                this.minSlot$ = +value;
                this.maxSlot$ = this.minSlot$;
            }
        }
    }

    get content() { return this.unit$ + ': ' + this.slot; }
    set content(value: string) {
        if (value.startsWith(AppConfigService.objectModel.OtherText.HeightUnit + ':') ||
            value.startsWith(AppConfigService.objectModel.OtherText.Slot + ':')) {
            const val = value.split(':');
            this.unit$ = val[0];
            this.slot = val[1].trim();
        }
    }

    isInSlot(slot: number) {
        return slot <= this.maxSlot && slot >= this.minSlot;
    }
}
