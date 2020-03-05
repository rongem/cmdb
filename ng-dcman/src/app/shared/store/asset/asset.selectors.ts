import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromApp from 'src/app/shared/store/app.reducer';
import * as fromAsset from './asset.reducer';
import * as fromSelectBasics from 'src/app/shared/store/basics/basics.selectors';

import { Room } from 'src/app/shared/objects/asset/room.model';
import { Rack } from 'src/app/shared/objects/asset/rack.model';
import { Guid } from 'src/app/shared/guid';
import { BladeEnclosure } from 'src/app/shared/objects/asset/blade-enclosure.model';
import { RackMountable } from 'src/app/shared/objects/asset/rack-mountable.model';

export const selectState = createFeatureSelector<fromAsset.State>(fromApp.ASSET);
export const selectRacks = createSelector(selectState, state => state.racks);
export const selectEnclosures = createSelector(selectState, state => state.enclosures);
export const selectRackservers = createSelector(selectState, state => state.rackServers);
export const selectReady = createSelector(selectState, state =>
    state.racksReady && state.enclosuresReady && state.rackServersReady);

export const ready = createSelector(fromSelectBasics.ready, selectReady, (previousReady, thisReady) => previousReady && thisReady);

export const selectRacksInRoom = createSelector(selectRacks, (racks: Rack[], room: Room) =>
    racks.filter(r => r.connectionToRoom && r.connectionToRoom.room === room)
);
export const selectUnmountedRacks = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.connectionToRoom)
);
export const selectRacksWithoutModel = createSelector(selectRacks, (racks: Rack[]) =>
    racks.filter(r => !r.model)
);

export const selectEnclosuresInRack = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], rack: Rack) =>
    enclosures.filter(e => e.assetConnection && e.assetConnection.containerItem === rack)
);
export const selectUnmountedEnclosures = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.filter(e => !e.assetConnection)
);
export const selectEnclosuresWithoutModel = createSelector(selectEnclosures, (enclosures: BladeEnclosure[]) =>
    enclosures.filter(e => !e.model)
);

export const selectServersInRack = createSelector(selectRackservers, (servers: RackMountable[], rack: Rack) =>
    servers.filter(s => s.assetConnection && s.assetConnection.containerItem === rack)
);
export const selectUnmountedRackServers = createSelector(selectRackservers, (servers: RackMountable[]) =>
    servers.filter(s => !s.assetConnection)
);
export const selectRackServersWithoutModel = createSelector(selectRackservers, (servers: RackMountable[]) =>
    servers.filter(s => !s.model)
);

export const selectRack = createSelector(selectRacks, (racks: Rack[], id: Guid) => racks.find(r => r.id === id));
export const selectEnclousre = createSelector(selectEnclosures, (enclosures: BladeEnclosure[], id: Guid) =>
    enclosures.find(e => e.id === id)
);
export const selectRackServer = createSelector(selectRackservers, (servers: RackMountable[], id: Guid) => servers.find(s => s.id === id));
