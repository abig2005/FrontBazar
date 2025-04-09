import { Component, inject, Renderer2, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { SharedModule } from './theme/shared/shared.module';
import { ToastService } from './theme/shared/service/toast.service';
import { ThemeService } from './theme/shared/service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent, SharedModule]
})
export class AppComponent  implements OnInit {
  title = 'Sistema de ventas ';
  constructor(public toastService: ToastService) {} // Inyección del servicio como público
  ngOnInit(): void {
    this.setDarkLayout(false)
  }
  private themeService = inject(ThemeService);


  private renderer = inject(Renderer2);


    // change main layout dark and light
    setDarkLayout(isDark: boolean) {
      console.log('isDark', isDark);
    
      if (isDark) {
        this.renderer.addClass(document.body, 'berry-dark');
        document.querySelector('html')?.classList.add('dark');
        this.SetBodyColor('preset-2');
        this.fontFamily('Roboto');
        this.themeService.isDarkTheme.set(true);
      } else {
        this.renderer.removeClass(document.body, 'berry-dark');
        document.querySelector('html')?.classList.remove('dark');
        this.SetBodyColor('preset-1'); // Cambia a un preset claro
        this.fontFamily('Poppins'); // Cambia la fuente si es necesario
        this.themeService.isDarkTheme.set(false);
      }
    }

    SetBodyColor(background: string) {
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

      // set font family
  fontFamily(font: string) {
    this.renderer.removeClass(document.body, 'Roboto');
    this.renderer.removeClass(document.body, 'Poppins');
    this.renderer.removeClass(document.body, 'Inter');
    this.renderer.addClass(document.body, font);
  }

}
