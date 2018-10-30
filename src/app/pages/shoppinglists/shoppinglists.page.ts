import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '../../models/shoppingList';
import { ShoppinglistService } from '../../services/shoppinglist.service';

@Component({
  selector: 'app-shoppinglists',
  templateUrl: './shoppinglists.page.html',
  styleUrls: ['./shoppinglists.page.scss'],
})
export class ShoppinglistsPage implements OnInit {

  shoppingLists: ShoppingList[];

  constructor(
    private shoppingListService: ShoppinglistService,
  ) { }

  ngOnInit() {
    this.subscribeShoppingLists();
  }

  subscribeShoppingLists(){

  }

  createShoppingList(){
    
  }

  deleteShoppingList(){

  }

  renameShoppingList(){
    
  }

  addItemsToShoppingList(item: string, shoppingList: ShoppingList){

  }


}
