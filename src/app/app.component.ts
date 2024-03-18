import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpFromBracket,
  faDownload,
  faPalette,
  faShuffle,
  faEllipsis
} from '@fortawesome/free-solid-svg-icons';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import html2canvas from 'html2canvas';

extend([mixPlugin]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'color-swatches';
  @ViewChild('colorPalletes')
  public colorPalletes!: ElementRef;

  @ViewChild('canvas') public canvas!: ElementRef;
  @ViewChild('downloadLink') public downloadLink!: ElementRef;

  public displayColors: Array<string> = [];
  public curColorSwatches: Array<string> = [];
  public curColorCode: string = '';
  public faShuffle = faShuffle;
  public faCopy = faCopy;
  public faPalette = faPalette;
  public faDownload = faDownload;
  public faHeart = faHeart;
  public faEllipsis = faEllipsis;
  public faArrowUpFromBracket = faArrowUpFromBracket;
  public colorPalleteOffsetStart: number = 0;
  public colorPalleteOffsetEnd: number = 0;
  public isToastShow: boolean = false;
  public customColor: string = '';
  public repeatArray = Array.from(Array(10).keys());
  constructor() {
    this.generateColor();
  }

  ngAfterViewInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.colorPalleteOffsetStart =
      this.colorPalletes.nativeElement.getBoundingClientRect().left;
    this.colorPalleteOffsetEnd =
      this.colorPalletes.nativeElement.getBoundingClientRect().right;

    // console.log(this.colorPalleteOffsetWidth);
  }

  public generateColor() {
    this.displayColors = [];
    for (let i = 0; i < 5; i++) {
      this.generateColorCode();
      if (!this.displayColors.includes(this.curColorCode)) {
        this.displayColors.push(this.curColorCode);
        this.curColorCode = '';
        // console.log(this.displayColors);
      }
    }
  }

  public generateColorCode() {
    this.curColorCode =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase();
  }

  public addColorEvent(event: any) {
    if (
      event.clientX < this.colorPalleteOffsetStart ||
      event.clientX > this.colorPalleteOffsetEnd
    ) {
      if (event.clientX > this.colorPalleteOffsetEnd) {
        this.displayColors.shift();
        this.generateColorCode();
        this.displayColors.push(this.curColorCode);
      } else if (event.offsetX < this.colorPalleteOffsetStart) {
        this.displayColors.pop();
        this.generateColorCode();
        this.displayColors.unshift(this.curColorCode);
      }
    }
  }

  public copyColorCode(color: any) {
    navigator.clipboard.writeText(color);
    this.isToastShow = true;
    setTimeout(() => {
      this.isToastShow = false;
    }, 1000);
  }

  public colorPaleteChange(event: any) {
    this.displayColors = [];
    this.displayColors.push(event.target.value);
    this.lightenColorCode();
    this.darkenColorCode();
    console.log(this.displayColors);
  }

  public lightenColorCode() {
    for (let i = 1; i <= 2; i++) {
      let lightenValue = colord(this.curColorCode)
        .tints(1)
        .map((c) => c.toHex());
      let newColor = colord(this.customColor)
        .mix(lightenValue[0], (i * 10) / 100)
        .toHex();
      this.displayColors.unshift(newColor);
    }
  }

  public darkenColorCode() {
    for (let i = 1; i <= 2; i++) {
      let darkenValue = colord(this.curColorCode).darken(0.5).toHex();
      let newColor = colord(this.customColor)
        .mix(darkenValue[0], (i * 20) / 100)
        .toHex();
      this.displayColors.push(newColor);
    }
  }

  public downloadImage() {
    html2canvas(this.colorPalletes.nativeElement).then((canvas: any) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
    });
  }

  public generateSwatches(color: any) {
    this.curColorSwatches = [];
    let darken = colord(color)
      .shades(5)
      .map((c) => c.toHex().toUpperCase());
    let lighten = colord(color)
      .tones(6)
      .map((c) => c.toHex().toUpperCase());
    lighten.reverse().pop();
    this.curColorSwatches.push(...darken);
    this.curColorSwatches.unshift(...lighten);
    console.log(this.curColorSwatches);
  }
}
