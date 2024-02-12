import { Component } from '@angular/core';
import { BasketService } from '../basket/basket.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  constructor(private basketServcie: BasketService,
    private toastr: ToastrService,
    private router: Router) {
  }

  placeOrder() {
    this.toastr.success('Order created successfully');
    this.basketServcie.deleteLocalBasket();
    this.router.navigate(['checkout/success']);
  }


}
