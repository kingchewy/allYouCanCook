import { Component, OnInit } from '@angular/core';
import { Food } from '../../models/food';
import { FoodService } from '../../services/food.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { PictureService } from '../../services/picture.service';

/**
 * F O O D D E T A I L S   -    P A G E
 * 
 * Description:
 * Food picture, categories, recipe, condiments..... are managed here
 * CRUD of Food "Title, Subtitle, categories, condiments, preparation" to Firestore
 * 
 * Picture calls pictureservice and saves Foods image to Firestore Storage by using
 * the foodId as unique filename
 */

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: ['./food-details.page.scss'],
})
export class FoodDetailsPage implements OnInit {

  // FOOD
  food: Food;
  foodImagePath: string; //= 'src/assets/images/image-placeholder.svg';
  
  // trigger to enable edit of single details
  showEditPreparation: boolean = false;
  showEditCondiments: boolean = false;
  showEditTitleSubtitle: boolean = false;

  // changed value after details are edited (ready to CRUD)
  preparationToEdit: string = null;
  condimentsToEdit: string[] = null;
  titleToEdit: string = null;
  subtitleToEdit: string = null;
  
  // selection of apps possible categories
  foodCategories: Array<string> = [];

  // SUBSCRIPTIONS
  private foodSub: Subscription

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private foodService: FoodService,
    private alertController: AlertController,
    private pictureService: PictureService
  ) { 
    this.initializeData();
  }

  ngOnInit() {
  }

  // collection of methods that need to be called initial
  private initializeData():void{
    let foodId = this.route.snapshot.paramMap.get('id');
    this.subscribeFood(foodId);
    this.loadFoodPicture(foodId);
    this.getFoodCategories();
  }

  // subscribes the requested food that holds all the details except image
  private subscribeFood(foodId):void{
    this.foodSub = this.foodService.getFood(foodId)
      .subscribe( food => {
        this.food = food;
      })
  }

  // loads the saved image of the food (if available in firestore storage)
  private loadFoodPicture(foodId):void{
    this.pictureService.loadFoodPicture(foodId).then( picture => {
      this.foodImagePath = picture
    })
  }

  // get all possible food categories the app provides (for selection)
  private getFoodCategories(){
    this.foodService.getFoodCategories().then( categories => {
      
      categories.forEach(category => {
        console.log(category.data())
        this.foodCategories.push(category.data().name);
      });
    })
  }

  // updates the complete FOOD to firestore
  private updateFoodData():void{
    this.foodService.updateFood(this.food).then( () => {
      console.log("food successfully updated")
    })
  }

  // ALERT: alerts to select/set food-categories in a multi-selection alert
  async presentChooseCategories() {    
    const alert = await this.alertController.create({
      header: 'Kategorien wählen',
      inputs: this.loadInputCategories(),
      buttons: [
        {
          text: 'abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (selectedCategories: Array<string>) => {
            this.setCategories(selectedCategories);
          }
        }
      ]
    });
    await alert.present();
  }
  
  //  ALERT HELPER METHOD
  // creates the array of categories available as input in the alertbox
  private loadInputCategories():Array<{}>{
    let input = [];
    
    this.foodCategories.forEach( category => {
      let categoryObject = {
        name: category,
        type: 'checkbox',
        label: category,
        value: category,
        checked: this.isFoodChecked(category)
      }
      input.push(categoryObject);
    });
    return input;
  }
  
  //  ALERT HELPER METHOD:
  // for checked-state in select checks if a food has the provided category
  private isFoodChecked(category: string):boolean{
    if(!this.food.category ){
      return false;
    }
    console.log("test", this.food.category);
    return this.food.category.includes(category);
  }
  
  // ALERT HELPER METHOD: save and set selected categories
  private setCategories(selectedCategories: Array<string>){
    this.food.category = selectedCategories;
    this.foodService.updateFoodCategories(this.food).then( () => {
      console.log("successfully updated categories!");
    })
  }


  // enable to edit title & subtitle (from template)
  private editTitleSubtitle():void{
    let title = this.food.title;
    this.titleToEdit = title;

    if(this.food.description){
      let subtitle = this.food.description;
      this.subtitleToEdit = subtitle;
    } else {
      this.subtitleToEdit = "";
    }
    this.showEditTitleSubtitle = true;
  }

  // save title & subtitle after is was enabled to edit (from template)
  private saveTitleSubtitle():void{
    this.food.title = this.titleToEdit;
    this.food.description = this.subtitleToEdit;
    this.updateFoodData();
    this.titleToEdit = null;
    this.subtitleToEdit = null;
    this.showEditTitleSubtitle = false;
  }

  // cancel editing title & subtitle (from template)
  private cancelEditingTitleSubtitle():void{
    this.subtitleToEdit = null;
    this.titleToEdit = null;
    this.showEditTitleSubtitle = false;
  }

  // enable to edit preparation (from template)
  private editPreparation():void{
    if(this.food.recipe.preparation){
      let preparation = this.food.recipe.preparation;
      this.preparationToEdit = preparation;
    } else {
      this.preparationToEdit = '';
    }
    this.showEditPreparation = true;
  }

  // save preparation after editing (from template)
  private savePreparation():void{
    this.food.recipe.preparation = this.preparationToEdit;
    this.updateRecipe();
    this.preparationToEdit = null;
    this.showEditPreparation = false;
  }
  
  // cancel editing preparation (from template)
  private cancelEditingPreparation():void{
    this.preparationToEdit = null;
    this.showEditPreparation = false;
  }

  // enable to edit condiments (from tempate)
  private editCondiments():void{
    this.condimentsToEdit = [];
    if(this.food.recipe.condiments){
        this.food.recipe.condiments.forEach( condiment => {
        this.condimentsToEdit.push(condiment);
      })
    } else {
    }
    this.showEditCondiments = true;
  }

  // save condiments after editing ( from tempalte )
  private saveCondiments():void{
    this.food.recipe.condiments = this.condimentsToEdit;
    console.log(this.condimentsToEdit)
    this.updateRecipe();
    this.condimentsToEdit = null;
    this.showEditCondiments = false;
  }
  
  // cancel to edit condiments (from template)
  private cancelEditingCondiments():void{
    this.condimentsToEdit = null;
    this.showEditCondiments = false;
  }

  // update the complete recipe, called after any detail has been editied
  private updateRecipe():void{
    this.foodService.updateRecipe(this.food)
      .then( () => {
        console.log("Recipe successfully updated!")
      })
  }

  // add a new empty string to condiments Array
  // this string is displayed as new row/condiment in template
  addCondiment(){
    this.condimentsToEdit.push("");
  }

  // use pictureservice to take a picture of the food
  takePicture(){
    this.pictureService.takeFoodPicture().then( imageData => {
      const base64imageData = 'data:image/jpeg;base64,' + imageData;
      this.foodImagePath = base64imageData;

      this.pictureService.storeFoodPicture(this.food.id, base64imageData)
      .then( snapshot => {
        console.log("new FoodImage uploaded successfully")
      })
    })
  }

  // template makes use of this method, to track condiments in ngFor by index
  trackByFn(index, item) {
    return index;  
  }

  private goBack():void{
    if(this.foodSub){
      this.foodSub.unsubscribe();
    }
    this._location.back();
  }

}
