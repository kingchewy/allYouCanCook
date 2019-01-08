import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingList } from '../models/shoppingList';

/**
 * O W N E R - OF - S H O P P I N G L I S T   -    P I P E
 * 
 * Description:
 * takes an array of shoppinglists and a UID as argument
 * returns an array of shoppinglists the user(UID) is owner of
 */

@Pipe({
  name: 'ownerOfShoppinglist'
})
export class OwnerOfShoppinglistPipe implements PipeTransform {

  transform(shoppingLists: ShoppingList[], userId: string):ShoppingList[] {
    return shoppingLists.filter( list => list.roles[userId] == 1)     
  }

}
