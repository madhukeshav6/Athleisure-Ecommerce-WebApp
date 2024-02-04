import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{

  constructor(public basketService: BasketService,
    public accountService: AccountService) {
      
  }

  ngOnInit(): void {
    this.hideMenuEventListener();
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  showMenu() {
    var navMenu = document.getElementById('nav-menu');
    var navToggle = document.getElementById('nav-toggle');

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu?.classList.add('show-menu');
      });
    }
  }

  hideMenu() {
    var navMenu = document.getElementById('nav-menu');
    var navClose = document.getElementById('nav-close');

    if (navClose) {
      navClose.addEventListener('click', () => {
        navMenu?.classList.remove('show-menu');
      });
    }
  }

  hideMenuEventListener() {
    var closeElements = document.querySelectorAll('.close__on__click');
    var navMenu = document.getElementById('nav-menu');

    closeElements.forEach(element => {
      element.addEventListener('click', () => {
        navMenu?.classList.remove('show-menu');
      })
    });
  }
}
