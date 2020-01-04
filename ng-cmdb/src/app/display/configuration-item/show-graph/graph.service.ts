import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromSelectDisplay from 'src/app/display/store/display.selectors';

import { DisplayServiceModule } from 'src/app/display/display-service.module';
import { Guid } from 'src/app/shared/guid';
import { PositionSize } from '../../objects/position-size.model';

@Injectable({providedIn: DisplayServiceModule})
export class GraphService {
    private lines: Map<string, PositionSize> = new Map();
    private currentId: Guid;

    constructor(private store: Store<fromApp.AppState>) {
        this.store.select(fromSelectDisplay.selectDisplayConfigurationItem).subscribe(state => {
            if (state.id !== this.currentId) {
                this.currentId = state.id;
                this.lines = new Map();
            }
        });
    }

    addLine(id: string, positionSize: PositionSize) {
        this.lines.set(id, positionSize);
    }

    getLinesForId(id: Guid) {
        const keys = Array.from(this.lines.keys()).filter(key => key.startsWith(id.toString() + ':'));
        const lines: PositionSize[] = [];
        keys.forEach(key => lines.push(this.lines.get(key)));
        return lines;
    }
}
