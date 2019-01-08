import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingList } from '../models/shoppingList';

/**
 * S H A R E D   S H O P P I N G L I S T   -    P I P E
 * 
 * Description:
 * takes an array of shoppinglists and a UID as argument
 * returns an array of shoppinglists the user(UID) has a shared role of
 * -> role "2" == read permission
 * -> role "3" == write permission
 */

@Pipe({
  name: 'sharedShoppinglist'
})
export class SharedShoppinglistPipe implements PipeTransform {

 
  transform(shoppingLists: ShoppingList[], userId: string):ShoppingList[] {
    return shoppingLists.filter( list => list.roles[userId] == 2 || list.roles[userId] == 3)     
  }

}
