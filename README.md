# Shopping Price Tracker 🛒

A command-line shopping price tracker that helps you manage your shopping list and find the best deals daily.

## Features

- ✅ **Item Management**: Add and remove items from your shopping list
- 📊 **Price Tracking**: Track price history for all your items
- 💰 **Deal Finder**: Automatically find the best deals and price drops
- 🎯 **Target Prices**: Set target prices and get notified when reached
- 📱 **Categories**: Organize items by categories (groceries, electronics, etc.)
- 💾 **Data Persistence**: Your shopping list is saved automatically

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Run the application:

```bash
npm start
```

## Usage

The application provides an interactive command-line interface with the following options:

1. **Add Item**: Add a new item to your shopping list with optional category and target price
2. **Remove Item**: Remove items from your shopping list
3. **List Items**: View all items in your shopping list with current prices
4. **Update Prices**: Check for new prices across all your items
5. **Find Best Deals**: Discover items with price drops and best deals
6. **Exit**: Close the application

### Example Usage

```bash
$ npm start

🛒 Shopping Price Tracker
═══════════════════════
1. Add item
2. Remove item  
3. List items
4. Update prices
5. Find best deals
6. Exit

Choose an option (1-6): 1
Item name: iPhone 15
Category (optional): electronics
Target price (optional): 800
✅ Added "iPhone 15" to your shopping list
```

## Testing

Run the test suite to verify functionality:

```bash
npm test
```

## How It Works

- **Mock Price Tracking**: Currently uses simulated price data for demonstration
- **Price History**: Maintains up to 30 recent price points per item
- **Deal Detection**: Identifies price drops and items below average price
- **Data Storage**: Uses JSON file for simple, portable data persistence

## Future Enhancements

- Integration with real retailer APIs
- Web scraping for price comparison
- Email/SMS notifications for deals
- Web interface
- Import/export shopping lists
- Price prediction algorithms

## License

MIT License