// Angular import
import { Component, OnInit, Renderer2, ViewEncapsulation, inject } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { BerryConfig } from 'src/app/app-config';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/theme.service';

@Component({
  selector: 'app-configuration',
  imports: [SharedModule, RouterModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationComponent implements OnInit {
  private location = inject(Location);
  private renderer = inject(Renderer2);
  private locationStrategy = inject(LocationStrategy);
  private themeService = inject(ThemeService);

  // public method
  styleSelectorToggle!: boolean; // open configuration menu
  berryConfig!: BerryConfig; // theme Config
  windowWidth: number; // screen width
  layout!: string; // sidebar navigation
  themeMode!: boolean; // layoutMode type
  rtlLayout!: boolean; // rtl type
  boxContainer!: boolean; // box container flag
  setFontFamily!: string; // fontFamily
  bodyColor!: string; // berry Customizes
  sidebar_caption_hide!: boolean; // sidebar menu caption
  resetLayoutType!: string; // default layout
  landingPage!: boolean;
  active = 1;

  // Constructor
  constructor() {
    this.setThemeLayout();
    this.windowWidth = window.innerWidth;
  }

  // Life cycle events
  ngOnInit() {
    this.layout = BerryConfig.layout;
    this.setMenuOrientation(this.layout);
    this.styleSelectorToggle = false;
    this.themeMode = BerryConfig.isDarkMode;
    this.setDarkLayout(this.themeMode);
    this.setFontFamily = BerryConfig.font_family;
    this.fontFamily(this.setFontFamily);
    this.bodyColor = BerryConfig.theme_color;
    this.SetBodyColor(this.bodyColor);
    this.rtlLayout = BerryConfig.isRtl_layout;
    this.setRtlLayout(this.rtlLayout);
    this.boxContainer = this.windowWidth >= 1025 ? BerryConfig.isBox_container : false;
    this.setBoxContainer(this.boxContainer);
    this.sidebar_caption_hide = BerryConfig.sidebar_caption_hide;
    this.captionShow(this.sidebar_caption_hide);
    this.landingPage = this.themeService.isLandingPage();
  }

  // public method

  // sidebar layout change
  setThemeLayout() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    switch (current_url) {
      case baseHref + '/layout/vertical':
        BerryConfig.layout = 'vertical';
        break;

      case baseHref + '/layout/compact':
        BerryConfig.layout = 'compact';
        break;

      case baseHref + '/layout/horizontal':
        BerryConfig.layout = 'horizontal';
        break;
    }
  }

  // change main layout dark and light
  setDarkLayout(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.body, 'berry-dark');
      document.querySelector('html')?.classList.add('dark');
      this.themeMode = true;
    } else {
      this.renderer.removeClass(document.body, 'berry-dark');
      document.querySelector('html')?.classList.remove('dark');
      this.SetBodyColor('preset-1');
      this.fontFamily('Roboto');
      this.themeMode = false;
    }
    this.themeService.isDarkTheme.set(this.themeMode);
  }

  // default mode
  setResetLayout(layout: string) {
    if (layout === 'reset') {
      this.ngOnInit();
    }
  }

  // ser rtl and ltr theme mode
  setRtlLayout(layout: boolean) {
    if (layout) {
      this.renderer.addClass(document.body, 'berry-rtl');
      this.renderer.removeClass(document.body, 'berry-ltr');
      this.rtlLayout = true;
    } else {
      this.renderer.removeClass(document.body, 'berry-rtl');
      this.renderer.addClass(document.body, 'berry-ltr');
      this.rtlLayout = false;
    }
    this.themeService.isRtlTheme.set(this.rtlLayout);
  }

  // sidebar menu caption show and hide
  captionShow(hide: boolean) {
    if (hide) {
      document.querySelector('.coded-navbar')?.classList.add('caption-hide');
      this.sidebar_caption_hide = true;
    } else {
      document.querySelector('.coded-navbar')?.classList.remove('caption-hide');
      this.sidebar_caption_hide = false;
    }
  }

  // set box container
  setBoxContainer(boxContainer: boolean) {
    if (boxContainer) {
      document.querySelector('.coded-content')?.classList.add('container');
      this.boxContainer = true;
    } else {
      document.querySelector('.coded-content')?.classList.remove('container');
      this.boxContainer = false;
    }
    this.themeService.isBoxLayout.set(boxContainer);
  }

  // set font family
  fontFamily(font: string) {
    this.setFontFamily = font;
    this.renderer.removeClass(document.body, 'Roboto');
    this.renderer.removeClass(document.body, 'Poppins');
    this.renderer.removeClass(document.body, 'Inter');
    this.renderer.addClass(document.body, font);
  }

  // set theme different color
  SetBodyColor(background: string) {
    this.bodyColor = background;
    document.querySelector('body')?.part.remove('preset-1');
    document.querySelector('body')?.part.remove('preset-2');
    document.querySelector('body')?.part.remove('preset-3');
    document.querySelector('body')?.part.remove('preset-4');
    document.querySelector('body')?.part.remove('preset-5');
    document.querySelector('body')?.part.remove('preset-6');
    document.querySelector('body')?.part.remove('preset-7');
    document.querySelector('body')?.part.add(background);
    this.themeService.theme.set(background);
  }

  setMenuOrientation(layout: string) {
    this.layout = layout;
    document.querySelector('.coded-navbar')?.classList.remove('compact');
    document.querySelector('.coded-navbar')?.classList.remove('horizontal');
    document.querySelector('.coded-navbar')?.classList.remove('vertical');
    document.querySelector('.coded-navbar')?.classList.add(layout);
    this.themeService.themeLayout.set(layout);
  }
}
