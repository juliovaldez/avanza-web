// Angular imports
import { Component, HostBinding, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";

// Services
import { AuthService, ScreenService } from "@services/core";
import { SpinnerService } from "@services/core/";

// Components
import {
  SideNavOuterToolbarComponent,
  SingleCardComponent,
} from "@components/layout";
import { UnauthenticatedContentComponent } from "./unauthenticated-content";
import { FooterComponent } from "@components/layout";

// Third party imports
import { DxLoadPanelModule } from "devextreme-angular";
import { locale, loadMessages } from "devextreme/localization";
import * as esMessages from "devextreme/localization/messages/es.json";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideNavOuterToolbarComponent,
    UnauthenticatedContentComponent,
    DxLoadPanelModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [ScreenService],
})
export class AppComponent implements OnInit {
  lOCATE: string = "es";
  @HostBinding("class") get getClass() {
    return Object.keys(this.screen.sizes)
      .filter((cl) => this.screen.sizes[cl])
      .join(" ");
  }
  loadingVisible = false;
  constructor(
    private authService: AuthService,
    private screen: ScreenService,
    private spinnerService: SpinnerService
  ) {
    this.initMessages();
    locale(this.lOCATE);

    this.spinnerService.SpinnerState.subscribe((state: number) => {
      setTimeout(() => {
        this.loadingVisible = state > 0;
      });
    });
    this.spinnerService.Activate();
  }

  initMessages() {
    loadMessages(esMessages);
  }

  isAuthenticated() {
    return this.authService.loggedIn;
  }
  ngOnInit(): void {
    const interval = setInterval(() => {
      const element = document.getElementById("Layer_1");
      if (element) {
        const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        element.dispatchEvent(clickEvent);
        clearInterval(interval);
        this.spinnerService.Desactivate();
      } else {
        console.warn("Elemento no encontrado, reintentando...");
      }
    }, 1);

    setTimeout(() => {
      clearInterval(interval);
      this.spinnerService.Desactivate();
    }, 1000);
  }
}
