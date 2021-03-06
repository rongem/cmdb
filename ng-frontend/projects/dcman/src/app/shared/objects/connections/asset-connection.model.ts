import { Asset } from '../prototypes/asset.model';
import { ExtendedAppConfigService } from '../../app-config.service';
import { llcc } from '../../store/functions';

export class AssetConnection {
    id: string;
    containerItemId: string;
    // embeddedItemId: string;
    connectionTypeId: string;
    private slot$: string;
    private minSlot$: number;
    private maxSlot$: number;
    private unit$: string;
    get minSlot() { return this.minSlot$; }
    get maxSlot() { return this.maxSlot$; }

    get slot() { return this.slot$; }
    set slot(value: string) {
        const regex = new RegExp('^[1-9][0-9]?(-[1-9][0-9]?)?$');
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
        const regex = new RegExp('[1-9][0-9]?(-[1-9][0-9]?)?');
        if (value.startsWith(ExtendedAppConfigService.objectModel.OtherText.HeightUnit + ':') ||
            value.startsWith(ExtendedAppConfigService.objectModel.OtherText.Slot + ':')) {
            const val = value.split(':');
            this.unit$ = val[0];
            this.slot = val[1].trim();
        } else if (value.match(regex).length >= 1) {
            this.slot = value.match(regex)[0];
        } else {
            console.log(value, value.match(regex));
        }
    }

    get unit() { return this.unit$; }
    set unit(value: string) {
        if (llcc(value, ExtendedAppConfigService.objectModel.OtherText.HeightUnit)) {
            this.unit$ = ExtendedAppConfigService.objectModel.OtherText.HeightUnit;
        } else if (llcc(value, ExtendedAppConfigService.objectModel.OtherText.Slot)) {
            this.unit$ = ExtendedAppConfigService.objectModel.OtherText.Slot;
        }
    }

    isInSlot(slot: number) {
        return slot <= this.maxSlot && slot >= this.minSlot;
    }
}
