import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-insurance-setup',
  templateUrl: './insurance-setup.component.html'
})
export class InsuranceSetupComponent implements OnInit {
  showMainContent = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateMainContentVisibility();

    // Subscribe to route changes to toggle visibility dynamically
    this.router.events.subscribe(() => {
      this.updateMainContentVisibility();
    });
  }
  private updateMainContentVisibility(): void {
    // Hide main content if the URL includes "add", "edit", or "detail"
    const hiddenRoutes = ['/add', '/edit', '/detail'];
    this.showMainContent = !hiddenRoutes.some((path) => this.router.url.includes(path));
  }
}

