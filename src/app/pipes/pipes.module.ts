import { NgModule } from '@angular/core';
import { OwnerOfShoppinglistPipe } from './owner-of-shoppinglist.pipe';
import { SharedShoppinglistPipe } from './shared-shoppinglist.pipe';
import { UidToFriendsNamePipe } from './uid-to-friends-name.pipe';
@NgModule({
	declarations: [
        OwnerOfShoppinglistPipe,
        SharedShoppinglistPipe,
        UidToFriendsNamePipe,
    ],
	imports: [],
	exports: [
        OwnerOfShoppinglistPipe,
        SharedShoppinglistPipe,
        UidToFriendsNamePipe
    ]
})
export class PipesModule {}