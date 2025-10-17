import { Component, NgModule, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DxScrollViewModule, DxBoxModule } from "devextreme-angular";
import { ResponsiveService, widthsSpan } from "@services/core/";

@Component({
  selector: "app-single-card",
  standalone: true,
  imports: [CommonModule, DxScrollViewModule, DxBoxModule],
  templateUrl: "./single-card.component.html",
  styleUrls: ["./single-card.component.scss"],
  providers: [ResponsiveService],
})
export class SingleCardComponent {
  @Input()
  title!: string;

  @Input()
  description!: string;

  public widthsSpan: widthsSpan = new widthsSpan("100%", {
    xs: "100%",
    sm: "90%",
    md: "80%",
    lg: "60%",
    xl: "50%",
    xxl: "30%",
  });

  constructor(private responsiveService: ResponsiveService) {
    this.responsiveService.makeObserver(this.widthsSpan);
  }
}
