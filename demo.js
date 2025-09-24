const ShoppingTracker = require('./index.js');

async function demo() {
    console.log('🛒 Shopping Price Tracker Demo\n');
    
    const tracker = new ShoppingTracker();
    
    // Add some sample items
    console.log('Adding sample items...');
    tracker.addItem('iPhone 15', 'electronics', 800);
    tracker.addItem('Milk', 'groceries', 3.99);
    tracker.addItem('Bread', 'groceries', 2.50);
    tracker.addItem('Running Shoes', 'clothing', 120);
    
    console.log('\n' + '='.repeat(50));
    
    // List all items
    tracker.listItems();
    
    console.log('='.repeat(50));
    
    // Update prices
    tracker.updatePrices();
    
    console.log('\n' + '='.repeat(50));
    
    // Add more price history for better demo
    console.log('Simulating price changes over time...');
    tracker.updatePrices();
    tracker.updatePrices();
    
    console.log('\n' + '='.repeat(50));
    
    // Find best deals
    tracker.findBestDeals();
    
    console.log('\n' + '='.repeat(50));
    console.log('Demo completed! 🎉');
    console.log('Run "npm start" to use the interactive interface.');
}

demo().catch(console.error);