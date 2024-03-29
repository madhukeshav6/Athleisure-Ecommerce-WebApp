import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { shopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{
  @ViewChild('search') searchTerm?: ElementRef;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams = new shopParams();
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDsc'}
  ]
  totalCount = 0;
  currentScreenWidth: any = -1;
  previousScreenWidth: any = -1;
  getProductsAfterResize: boolean = false;

  constructor(private shopService: ShopService) {

  }

  ngOnInit(): void {
    this.updateScreenWidth();
    this.determinePageSizeBasedOnScreenWidth();
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  updateScreenWidth() {
    this.previousScreenWidth = this.currentScreenWidth;
    this.currentScreenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.updateScreenWidth();
    this.determinePageSizeBasedOnScreenWidth();
  }

  determinePageSizeBasedOnScreenWidth() {

    if(this.previousScreenWidth === -1 && this.currentScreenWidth <= 1400) {
      this.shopParams.pageSize = 6;
    }

    if(this.previousScreenWidth === -1 && this.currentScreenWidth <= 768) {
      this.shopParams.pageSize = 4;
    }

    if(this.previousScreenWidth > 1400 && this.currentScreenWidth <= 1400) {
      this.shopParams.pageSize = 6;
      this.getProducts();
    }

    if(this.previousScreenWidth <= 1400 && this.currentScreenWidth > 1400) {
      this.shopParams.pageSize = 8;
      this.getProducts();
    }

    if(this.previousScreenWidth > 768 && this.currentScreenWidth <= 768) {
      this.shopParams.pageSize = 4;
      this.getProducts();
    }

    if(this.previousScreenWidth <= 768 && this.currentScreenWidth > 768) {
      this.shopParams.pageSize = 6;
      this.getProducts();
    }
  }
  
  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: response => this.types = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  onBrandSelected(event: any) {
    this.shopParams.brandId = event.target.value;
    //Resetting it to 1 whenever new records are fetched because of the following bug:
    //1. You are currently in page number 2
    //2. You apply a filter to select products with brandId = 2
    //3. Very few records are fetched such that the page number does not exceed 1
    //In this case, the current page is 2, but no records for that page
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(event: any) {
    this.shopParams.typeId = event.target.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if(this.shopParams.pageNumber != event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm?.nativeElement.value;
    this.getProducts();
  }

  onReset() {
    if(this.searchTerm) {
      this.searchTerm.nativeElement.value = '';
    }

    this.shopParams = new shopParams();
    this.getProducts();
  }

}
