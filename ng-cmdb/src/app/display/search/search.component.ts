import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  visibilityState = false;
  resultListToforeground = false;
  resultSubscription: Subscription;
  visibilitySubscription: Subscription;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.resultSubscription = this.searchService.resultListChanged.subscribe(() => {
      this.toggleVisibility(this.searchService.resultListPresent);
    });
    this.visibilitySubscription = this.searchService.visibilityChanged.subscribe((state: boolean) => {
      this.toggleVisibility(this.searchService.resultListPresent);
    });
  }

  ngOnDestroy() {
    this.resultSubscription.unsubscribe();
    this.visibilitySubscription.unsubscribe();
  }

  toggleVisibility(resultListToforeground: boolean) {
    if (this.visibilityState === false || this.resultListToforeground === resultListToforeground) {
      this.visibilityState = !this.visibilityState;
    }
    this.resultListToforeground = resultListToforeground;
  }

  resultListPresent() {
    return this.searchService.resultListPresent;
  }
}
