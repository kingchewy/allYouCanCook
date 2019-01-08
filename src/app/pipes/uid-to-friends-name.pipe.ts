import { Pipe, PipeTransform } from '@angular/core';
import { FriendService } from '../services/friend.service';
import { map} from 'rxjs/operators';

/**
 * U I D   T O   F R I E N D S N A M E  -    P I P E
 * 
 * Description:
 * takes a users UID of a friend as argument
 * returns the friends dislplay/nickname as a string
 */

@Pipe({
  name: 'uidToFriendsName'
})
export class UidToFriendsNamePipe implements PipeTransform {

  constructor(
    private friendService: FriendService
  ){}
  
  transform(value: string){

    return this.friendService.friends$.pipe(
      map( friends => {
                        if(friends){
                          return friends.find( friend => friend.id === value).nickname
                        }
                      }
      )
  )}
}