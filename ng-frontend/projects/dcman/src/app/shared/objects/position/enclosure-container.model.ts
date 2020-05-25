import { EnclosureMountable } from '../asset/enclosure-mountable.model';
import { BladeEnclosure } from '../asset/blade-enclosure.model';

export class SlotContainer{
    position: number;
    height: number;
    width: number;
    mountables: EnclosureMountable[];
}

export class EnclosureContainer {
    enclosure: BladeEnclosure;
    containers: SlotContainer[] = [];

    constructor(enclosure: BladeEnclosure) {
        this.enclosure = enclosure;
    }
    get id() { return this.enclosure.id; }

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
        const result = [...upperRow];
        // if more than one row, do the rest
        if (height > 1) {
            for (let index = 1; index < height; index++) {
                result.concat(upperRow.map(r => r + index * width));
            }
        }
        return result;
    }

    getContainerForPosition(position: number): SlotContainer {
        const results = this.containers.filter(c => this.getSlotPositions(c.position, c.height, c.width).includes(Math.floor(position)));
        if (results.length > 1) { throw new Error('More than one container found, that should never happen!'); }
        return results.length === 1 ? results[0] : undefined;
    }
}
