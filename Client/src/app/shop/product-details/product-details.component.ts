import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'xng-breadcrumb/lib/types/breadcrumb';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{

  constructor(private shopService: ShopService,
              private activatedRoute: ActivatedRoute,
              private breadcrumbService: BreadcrumbService,
              private basketService: BasketService) {
      this.breadcrumbService.set('@productDetails', '');
  }

  product?: Product;
  quantity = 1;
  quantityInBasket = 0;

  getProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      this.shopService.getProduct(+id).subscribe({
        next: product => {
          this.product = product;
          this.breadcrumbService.set('@productDetails', product.name);
          this.basketService.basketSource$.pipe(take(1)).subscribe({
            next: basket => {
              const item = basket?.items.find(x => x.id === +id);
              if(item) {
                this.quantity = item.quantity;
                this.quantityInBasket = item.quantity;
              }
            }
          });
        },
        error: error => console.log(error)
      })
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    this.quantity--;
  }

  updateBasket() {
    if(this.product) {
      if(this.quantity > this.quantityInBasket) {
        const quantityToAdd = this.quantity - this.quantityInBasket;
        this.quantityInBasket += quantityToAdd;
        this.basketService.addItemToBasket(this.product, quantityToAdd);
      }
      else {
        const quantityToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= quantityToRemove;
        this.basketService.removeItemFromBasket(this.product.id, quantityToRemove);
      }
    }
  }

  get buttonText() {
    return this.quantityInBasket === 0 ? 'Add to basket' : 'Update basket';
  }

  ngOnInit(): void {
    this.getProduct();
  }
}
