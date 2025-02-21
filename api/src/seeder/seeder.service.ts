import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/user/user.schema';
import { Cocktail } from 'src/cocktail/cocktail.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Cocktail.name) private readonly cocktailModel: Model<Cocktail>,
  ) {}

  randomInt(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async seed() {
    console.log('Seeding commenced');

    console.log('Deleting existing documents:');
    process.stdout.write('Deleting users...');
    await this.userModel
      .deleteMany()
      .then(() => console.log('done'))
      .catch(() => console.log('skipped'));
    process.stdout.write('Deleting cocktails...');
    await this.cocktailModel
      .deleteMany()
      .then(() => console.log('done'))
      .catch(() => console.log('skipped'));

    try {
      console.log('Creating sample documents:');
      process.stdout.write('Creating users...');
      const users = await this.userModel.create(
        {
          email: 'admin@drinkalot.com',
          password: '1111',
          displayName: 'John Doe',
          avatarUrl: faker.image.personPortrait({ sex: 'male' }),
          role: 'admin',
        },
        {
          email: 'fantastic@gmail.com',
          password: '2222',
          displayName: 'Jane Doe',
          avatarUrl: faker.image.personPortrait({ sex: 'female' }),
        },
        {
          email: 'doting@outlook.com',
          password: '3333',
          displayName: 'Taylor Hebert',
          avatarUrl: faker.image.personPortrait({ sex: 'female' }),
        },
        {
          email: 'amused@rambler.com',
          password: '4444',
          displayName: 'Dorian Gray',
          avatarUrl: faker.image.personPortrait({ sex: 'male' }),
        },
      );
      console.log('done');

      process.stdout.write('Creating cocktails...');
      await this.cocktailModel.create(
        {
          user: users[this.randomInt(3)],
          name: 'Sweet Sangria',
          imageUrl: '/uploads/fixtures/sweet-sangria.jpg',
          recipe: `Dissolve the sugar in hot water and cool.
        Peel the citrus fruits and break into wedges.
        Mix the wine, sugar syrup, fruit, and Fresca in a pitcher and put in the fridge for a few hours.
        Serve in tall glasses with a straw.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Red wine', qty: '2 bottles' },
            { name: 'Sugar', qty: '1 cup' },
            { name: 'Hot water', qty: '2 cups' },
            { name: 'Apple', qty: '1 cup' },
            { name: 'Orange' },
            { name: 'Lime' },
            { name: 'Lemon' },
            { name: 'Fresca' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Sloe Gin Cocktail',
          imageUrl: '/uploads/fixtures/sloe-gin-cocktail.jpg',
          recipe: `Stir all ingredients with ice, strain into a cocktail glass, and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Sloe gin', qty: '2 oz' },
            { name: 'Dry Vermouth', qty: '1/4 tsp' },
            { name: 'Orange bitters', qty: '1 dash' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Sol Y Sombra',
          imageUrl: '/uploads/fixtures/sol-y-sombra.jpg',
          recipe: `Shake ingredients with ice, strain into a brandy snifter, and serve.
        (The English translation of the name of this drink is "Sun and Shade", and after sampling this drink, you'll understand why.
        Thanks, Kirby.
        )`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Brandy', qty: '1 1/2 oz' },
            { name: 'Anisette', qty: '1 1/2 oz' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Stone Sour',
          imageUrl: '/uploads/fixtures/stone-sour.jpg',
          recipe: `Shake ingredients with ice, strain into a brandy snifter, and serve.
        (The English translation of the name of this drink is "Sun and Shade", and after sampling this drink, you'll understand why.
Thanks, Kirby.
)`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Apricot brandy', qty: '1 oz' },
            { name: 'Orange juice', qty: '1 oz' },

            { name: 'Sweet and sour', qty: '1 oz' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Mojito',
          imageUrl: '/uploads/fixtures/mojito.jpg',
          recipe: `Muddle mint leaves with sugar and lime juice.
Add a splash of soda water and fill the glass with cracked ice.
Pour the rum and top with soda water.
Garnish and serve with straw.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Light rum', qty: '2-3 oz' },
            { name: 'Juice of 1 lime' },
            { name: 'Sugar', qty: '2 tsp' },
            { name: 'Mint', qty: '2-4' },
            { name: 'Soda water' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Old Fashioned',
          imageUrl: '/uploads/fixtures/old-fashioned.jpg',
          recipe: `Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water.
Muddle until dissolved.
Fill the glass with ice cubes and add whiskey.
Garnish with orange twist, and a cocktail cherry.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Bourbon', qty: '4.5 cL' },
            { name: 'Angostura bitters', qty: '2 dashes' },
            { name: 'Sugar', qty: '1 cube' },
            { name: 'Dash water' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Long Island Tea',
          imageUrl: '/uploads/fixtures/long-island-tea.jpg',
          recipe: `Combine all ingredients (except cola) and pour over ice in a highball glass.
Add the splash of cola for color.
Decorate with a slice of lemon and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Vodka', qty: '1/2 oz' },
            { name: 'Light rum', qty: '1/2 oz' },
            { name: 'Gin', qty: '1/2 oz' },
            { name: 'Tequilla', qty: '1/2 oz' },
            { name: 'Juice of 1/2 lemon' },
            { name: 'Coca-Cola', qty: '1 splash' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Negroni',
          imageUrl: '/uploads/fixtures/negroni.jpg',
          recipe: `Stir into glass over ice, garnish and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Gin', qty: '1 oz' },
            { name: 'Campari', qty: '1 oz' },
            { name: 'Sweet Vermouth', qty: '1 oz' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Whiskey Sour',
          imageUrl: '/uploads/fixtures/whiskey-sour.jpg',
          recipe: `Shake with ice.
Strain into chilled glass, garnish and serve.
If served 'On the rocks', strain ingredients into old-fashioned glass filled with ice.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Blended whiskey', qty: '2 oz' },
            { name: 'Juice of 1/2 lemon' },
            { name: 'Powdered sugar', qty: '1/2 tsp' },
            { name: 'Cherry', qty: '1' },
            { name: 'Lemon', qty: '1/2 slice' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Dry Martini',
          imageUrl: '/uploads/fixtures/dry-martini.jpg',
          recipe: `Straight: Pour all ingredients into mixing glass with ice cubes.
Stir well.
Strain in chilled martini cocktail glass.
Squeeze oil from lemon peel onto the drink, or garnish with olive.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Gin', qty: '1 2/3 oz' },
            { name: 'Dry Vermouth', qty: '1/3 oz' },
            { name: 'Olive', qty: '1' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Daiquiri',
          imageUrl: '/uploads/fixtures/daiquiri.jpg',
          recipe: `Pour all ingredients into shaker with ice cubes.
Shake well.
Strain in chilled cocktail glass.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Light rum', qty: '1 1/2 oz' },
            { name: 'Juice of 1/2 lime' },
            { name: 'Powdered sugar', qty: '1 tsp' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Margarita',
          imageUrl: '/uploads/fixtures/margarita.jpg',
          recipe: `Rub the rim of the glass with the lime slice to make the salt stick to it.
Take care to moisten only the outer rim and sprinkle the salt on it.
The salt should present to the lips of the imbiber and never mix into the cocktail.
Shake the other ingredients with ice, then carefully pour into the glass.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Tequilla', qty: '1 1/2 oz' },
            { name: 'Tripple sec', qty: '1/2' },
            { name: 'Lime juice', qty: '1 oz' },
            { name: 'Salt' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Manhattan',
          imageUrl: '/uploads/fixtures/manhattan.jpg',
          recipe: `Stirred over ice, strained into a chilled glass, garnished, and served up.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Sweet Vermouth', qty: '3/4 oz' },
            { name: 'Blended Bourbon', qty: '2 1/2 oz' },
            { name: 'Angostura bitters', qty: 'dash' },
            { name: 'Ice', qty: '2 or 3' },
            { name: 'Maraschino cherry', qty: '1' },
            { name: '1 Twist of orange peel' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Moscow Mule',
          imageUrl: '/uploads/fixtures/moscow-mule.jpg',
          recipe: `Combine vodka and ginger beer in a highball glass filled with ice.
Add lime juice.
Stir gently.
Garnish.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Vodka', qty: '2 oz' },
            { name: 'Lime juice', qty: '2 oz' },
            { name: 'Ginger ale', qty: '8 oz' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'After Dinner Cocktail',
          imageUrl: '/uploads/fixtures/after-dinner-cocktail.jpg',
          recipe: `Shake all ingredients (except lime wedge) with ice and strain into a cocktail glass.
Add the wedge of lime and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Apricot brandy', qty: '1 oz' },
            { name: 'Triple sec', qty: '1 oz' },
            { name: 'Juice of 1 lime' },
            { name: 'Lime', qty: '1' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'After Supper Cocktail',
          imageUrl: '/uploads/fixtures/after-supper-cocktail.jpg',
          recipe: `Shake all ingredients with ice, strain into a cocktail glass, and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Triple sec', qty: '1 oz' },
            { name: 'Apricot brandy', qty: '1 oz' },
            { name: 'Lemon juice', qty: '1/2 tsp' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Alabama Slammer',
          imageUrl: '/uploads/fixtures/alabama-slammer.jpg',
          recipe: `Pour all ingredients (except for lemon juice) over ice in a highball glass.
Stir, add a dash of lemon juice, and serve.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Southern Comfort', qty: '1 oz' },
            { name: 'Amaretto', qty: '1 oz' },
            { name: 'Sloe gin', qty: '1/2 oz' },
            { name: 'Lemon juice', qty: '1 dash' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Ramos Gin Fizz',
          imageUrl: '/uploads/fixtures/ramos-gin-fizz.jpg',
          recipe: `Prepare all the ingredients on the counter to be able to work well and quickly, especially the cream and egg white.
Pour all the ingredients into a shaker.
Shake vigorously for 1 minute: cream and egg white must be mixed perfectly, so don't rush.
Now open the shaker and put some ice and shake for 1-2 minutes.
It depends on how long you can resist! Pour into a highball glass, add a splash of soda and garnish to taste.
Ramos Gin Fizz was once drunk as an invigorating drink or even as a breakfast, try it as an aperitif and after dinner and you will discover a little gem now lost.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Gin', qty: '4.5 cL' },
            { name: 'Lemon juice', qty: '3 cL' },
            { name: 'Sugar Syrup', qty: '3 cl' },
            { name: 'Cream', qty: '6 cl' },
            { name: 'Egg White', qty: '1' },
            { name: 'Vanilla extract', qty: '1 drop' },
            { name: 'Soda Water', qty: '2 cl' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: 'Mauresque',
          imageUrl: '/uploads/fixtures/mauresque.jpg',
          recipe: `1 - Pour the Ricard (or pastis) 2 - Pour the orgeat syrup 3 - Finally pour the water and add ice cubes at your convenience.
Add the ice cubes at the end, otherwise the syrup and pastis do not mix well.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Ricard', qty: '3 cl' },
            { name: 'Orgeat Syrup', qty: '1 cl' },
            { name: 'Full Glass Water' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: "Planter's Punch",
          imageUrl: '/uploads/fixtures/planters-punch.jpg',
          recipe: `Squeeze an orange and strain the juice.
Put all the ingredients in a shaker filled with ice and shake for at least 12 seconds.
Strain into a highball glass and decorate with a pineapple wedge or fruit of your choice.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Dark Rum', qty: '4.5 cL' },
            { name: 'Orgeat Juice', qty: '3 cl' },
            { name: 'Pineapple Juice', qty: '3.5 cl' },
            { name: 'Grenadine', qty: '1 cl' },
            { name: 'Sugar Syrup', qty: '1 cl' },
            { name: 'Angostura Bitters', qty: '4 drops' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
        {
          user: users[this.randomInt(3)],
          name: "Cocktails Horse's Neck",
          imageUrl: '/uploads/fixtures/cocktail-horses-neck.jpg',
          recipe: `Wash and brush an organic, untreated lemon, then cut a spiral of lemon peel, using a citrus peel.
If it is too large, cut it with a sharp knife.
Put some ice in a tall tumbler glass, place the lemon peel inside and pour the cognac, add the ginger beer and let 2-3 drops of Angostura fall into it.
Easy to do, but once you try it you'll love it.`,
          isPublished: !!this.randomInt(5),
          ingredients: [
            { name: 'Cognac', qty: '4 cl' },
            { name: 'Ginger Beer', qty: '100 ml' },
            { name: 'Angostura Bitters', qty: '3 drops' },
            { name: 'Lemon Peel', qty: '1' },
          ],
          ratings: [
            ...Array.from({ length: this.randomInt(4, -7) }).map(() => ({
              user: users[this.randomInt(3)],
              rating: this.randomInt(10, 1),
            })),
          ],
        },
      );
      console.log('done');

      console.log('Seeding completed');
    } catch (e) {
      console.error(e);
    }
  }
}
