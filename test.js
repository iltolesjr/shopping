const fs = require('fs');
const path = require('path');
const ShoppingTracker = require('./index.js');

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('🧪 Running Shopping Tracker Tests\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new TestRunner();

// Clean up test data file before tests
const testDataFile = path.join(__dirname, 'shopping_data.json');
if (fs.existsSync(testDataFile)) {
    fs.unlinkSync(testDataFile);
}

runner.test('ShoppingTracker can be instantiated', async () => {
    const tracker = new ShoppingTracker();
    if (!tracker) throw new Error('Failed to create tracker instance');
});

runner.test('Can add items to shopping list', async () => {
    const tracker = new ShoppingTracker();
    const item = tracker.addItem('Test Item', 'groceries', 25.99);
    
    if (!item) throw new Error('Failed to add item');
    if (item.name !== 'Test Item') throw new Error('Item name not set correctly');
    if (item.category !== 'groceries') throw new Error('Item category not set correctly');
    if (item.targetPrice !== 25.99) throw new Error('Target price not set correctly');
});

runner.test('Can list items', async () => {
    const tracker = new ShoppingTracker();
    tracker.addItem('Item 1', 'groceries');
    tracker.addItem('Item 2', 'electronics');
    
    if (tracker.items.length < 2) throw new Error('Items not added correctly');
});

runner.test('Can remove items', async () => {
    const tracker = new ShoppingTracker();
    const item = tracker.addItem('Test Item');
    const initialCount = tracker.items.length;
    
    const removed = tracker.removeItem(item.id);
    if (!removed) throw new Error('Failed to remove item');
    if (tracker.items.length !== initialCount - 1) throw new Error('Item count not updated');
});

runner.test('Price updates work', async () => {
    const tracker = new ShoppingTracker();
    tracker.addItem('Test Item');
    
    tracker.updatePrices();
    
    const item = tracker.items[0];
    if (item.priceHistory.length === 0) throw new Error('Price history not updated');
    if (typeof item.priceHistory[0].price !== 'number') throw new Error('Price not set as number');
});

runner.test('Best deals finder works', async () => {
    const tracker = new ShoppingTracker();
    tracker.addItem('Test Item');
    
    // Add some price history manually for testing
    tracker.items[0].priceHistory = [
        { price: 50.00, date: new Date().toISOString(), source: 'Test' },
        { price: 45.00, date: new Date().toISOString(), source: 'Test' }
    ];
    
    // This should not throw an error
    tracker.findBestDeals();
});

runner.test('Data persistence works', async () => {
    const tracker1 = new ShoppingTracker();
    tracker1.addItem('Persistent Item', 'test');
    
    // Create new instance - should load saved data
    const tracker2 = new ShoppingTracker();
    if (tracker2.items.length === 0) throw new Error('Data not persisted');
    
    // Find the persistent item (it might not be the first one due to previous tests)
    const persistentItem = tracker2.items.find(item => item.name === 'Persistent Item');
    if (!persistentItem) throw new Error('Data not loaded correctly');
});

// Run tests
runner.run().then(success => {
    // Clean up test data file after tests
    if (fs.existsSync(testDataFile)) {
        fs.unlinkSync(testDataFile);
    }
    
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});