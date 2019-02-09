import { Review } from './review';
import { Product } from './product';

export class Shop
{
	area: string;
	location: string;
	products: Product; 
	reviews: Review; 
	shopId: number;
	shopName: string;	
	imgPath: string;	
		
	constructor()
	{
	}
}