import { EnclosureMountable } from '../asset/enclosure-mountable.model';
import { BladeEnclosure } from '../asset/blade-enclosure.model';
import { SlotInformation } from './slot-information.model';

export class SlotContainer{
    position: number;
    height: number;
    width: number;
    mountables: EnclosureMountable[];
}

export class BackSideSlotcontainer{
    position: number;
    mountables: EnclosureMountable[];
}

export class EnclosureContainer {
    enclosure: BladeEnclosure;
    containers: SlotContainer[] = [];
    backSideContainers: BackSideSlotcontainer[] = [];
    backSideSlots: number[] = [];

    constructor(enclosure: BladeEnclosure) {
        this.enclosure = enclosure;
        if (enclosure.model.backSideSlots > 0) {
            this.backSideSlots = Array(enclosure.model.backSideSlots).fill(0).map((x, index) => index + 1);
        }
    }

    get id() { return this.enclosure.id; }

    get slotInformations() {
        const slots: SlotInformation[] = [];
        for (let index = 1; index < this.enclosure.model.height * this.enclosure.model.width + 1; index++) {
            slots.push({
                ...this.calculatePosition(index),
                index,
                occupied: this.hasContainerInPosition(index),
            });
        }
        return slots;
    }

    getSlotPositions(start: number, height: number, width: number) {
        // since the data may be invalid, will correct it here
        start = Math.floor(start);
        height = Math.floor(height);
        width = Math.floor(width);
        const highestPostion = this.enclosure.width * this.enclosure.height;
        if (start > highestPostion) { start = highestPostion; }
        if (start < 1) { start = 1; }
        if (height < 1) { height = 1; }
        if (width < 1) { width = 1; }
        if (height > this.enclosure.height) { height = this.enclosure.height; }
        if (width > this.enclosure.width) { width = this.enclosure.width; }
        const column = start % this.enclosure.width;
        if (column + width - 1 > this.enclosure.width) { width = this.enclosure.width + 1 - column; }
        const row = Math.floor(start / this.enclosure.width);
        if (row + height - 1 > this.enclosure.height) { height = this.enclosure.height + 1 - row; }
        const upperRow: number[] = [];
        // do the first row
        for (let index = start; index < start + width; index++) {
            upperRow.push(index);
        }
        let result = [...upperRow];
        // if more than one row, do the rest
        if (height > 1) {
            for (let index = 1; index < height; index++) {
                result = result.concat(upperRow.map(r => r + index * this.enclosure.width));
            }
        }
        return result;
    }

    getContainerForPosition(position: number) {
        const results = this.containers.filter(c => this.getSlotPositions(c.position, c.height, c.width).includes(Math.floor(position)));
        if (results.length > 1) {
            console.log(results);
            throw new Error('More than one container found, that should never happen!');
        }
        return results.length === 1 ? results[0] : undefined;
    }

    getContainerForExactPosition(position: number) {
        return this.containers.find(c => c.position === position);
    }

    hasContainerInPosition(position: number) {
        return !!this.getContainerForPosition(position);
    }

    hasContainerInExactPosition(position: number) {
        return !!this.getContainerForExactPosition(position);
    }

    private calculatePosition(slot: number) {
        return {
          column: (slot - 1) % this.enclosure.model.width + 1,
          row: Math.floor((slot - 1) / this.enclosure.model.width) + 1,
        };
    }
}
