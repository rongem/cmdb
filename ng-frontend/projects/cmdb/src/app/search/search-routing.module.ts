import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search.component';
import { SearchNeighborComponent } from './search-neighbor/search-neighbor.component';

const searchRoutes: Routes = [
    { path: '', pathMatch: 'full', component: SearchComponent},
    { path: 'configuration-item/:id/neighbor', component: SearchNeighborComponent },
];

@NgModule({
    imports: [ RouterModule.forChild(searchRoutes) ],
    exports: [ RouterModule ]
})
export class SearchRoutingModule {}
