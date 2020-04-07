import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Guid, FullConfigurationItem, FullConnection } from 'backend-access';

@Component({
  selector: 'app-multi-delete-connections',
  templateUrl: './multi-delete-connections.component.html',
  styleUrls: ['./multi-delete-connections.component.scss']
})
export class MultiDeleteConnectionsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() items: FullConfigurationItem[];
  connectedItems: Map<Guid, FullConnection[]> = new Map();
  connectedItemIds: Guid[] = [];
  connections: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // extract all target ids from connections
    const targets: Guid[] = [];
    this.items.forEach(item => item.connectionsToLower.forEach(conn => {
      if (!targets.includes(conn.targetId)) {
        targets.push(conn.targetId);
      }
    }));
    // check if target is connected to all items and place it into new array if so
    targets.forEach(guid => {
      const connections: FullConnection[] = [];
      const found = this.items.every(item => {
        if (item.connectionsToLower.findIndex(conn => conn.targetId === guid) === -1) {
          return false;
        }
        connections.push(item.connectionsToLower.find(conn => conn.targetId === guid));
        return true;
      });
      if (found === true) {
        this.connectedItems.set(guid, connections);
        this.connectedItemIds.push(guid);
      }
    });
    // build form
    this.connections = this.form.get('connectionsToDelete') as FormArray;
    this.connectedItemIds.forEach(guid => this.connections.push(this.fb.group({
      delete: false,
      connectionType: this.connectedItems.get(guid)[0].typeId, // wrong, could be more than one connection type!!!
      targetId: guid,
    })));
  }

  getItemName(guid: Guid) {
    return this.connectedItems.get(guid)[0].targetType + ': ' +
      this.connectedItems.get(guid)[0].targetName;
  }
}
