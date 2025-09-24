#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class ShoppingTracker {
    constructor() {
        this.dataFile = path.join(__dirname, 'shopping_data.json');
        this.items = this.loadData();
    }

    loadData() {
        try {
            if (fs.existsSync(this.dataFile)) {
                const data = fs.readFileSync(this.dataFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.log('Error loading data, starting fresh:', error.message);
        }
        return [];
    }

    saveData() {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(this.items, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving data:', error.message);
            return false;
        }
    }

    addItem(name, category = 'general', targetPrice = null) {
        const item = {
            id: Date.now(),
            name: name.trim(),
            category: category.toLowerCase(),
            targetPrice: targetPrice,
            priceHistory: [],
            dateAdded: new Date().toISOString(),
            lastChecked: null
        };
        
        this.items.push(item);
        this.saveData();
        console.log(`✅ Added "${name}" to your shopping list`);
        return item;
    }

    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            this.saveData();
            console.log(`🗑️  Removed "${removedItem.name}" from your shopping list`);
            return true;
        }
        console.log('❌ Item not found');
        return false;
    }

    listItems() {
        if (this.items.length === 0) {
            console.log('📝 Your shopping list is empty');
            return;
        }

        console.log('\n📋 Your Shopping List:');
        console.log('═'.repeat(50));
        
        this.items.forEach((item, index) => {
            const currentPrice = item.priceHistory.length > 0 
                ? item.priceHistory[item.priceHistory.length - 1].price 
                : 'Not tracked';
            
            console.log(`${index + 1}. ${item.name}`);
            console.log(`   Category: ${item.category}`);
            console.log(`   Current Price: $${currentPrice}`);
            if (item.targetPrice) {
                console.log(`   Target Price: $${item.targetPrice}`);
            }
            console.log(`   Added: ${new Date(item.dateAdded).toLocaleDateString()}`);
            console.log('');
        });
    }

    // Mock price tracking - in real implementation, this would fetch from actual retailers
    updatePrices() {
        console.log('🔍 Checking prices for your items...\n');
        
        this.items.forEach(item => {
            // Simulate price fluctuation
            const basePrice = 10 + Math.random() * 90; // Random price between $10-$100
            const variation = (Math.random() - 0.5) * 10; // ±$5 variation
            const newPrice = Math.max(1, basePrice + variation);
            
            const priceEntry = {
                price: Math.round(newPrice * 100) / 100,
                date: new Date().toISOString(),
                source: 'Mock Store'
            };
            
            item.priceHistory.push(priceEntry);
            item.lastChecked = new Date().toISOString();
            
            // Keep only last 30 price entries to avoid unlimited growth
            if (item.priceHistory.length > 30) {
                item.priceHistory = item.priceHistory.slice(-30);
            }
        });
        
        this.saveData();
        console.log('✅ Price update completed!');
    }

    findBestDeals() {
        console.log('\n💰 Best Deals Today:');
        console.log('═'.repeat(50));
        
        const deals = this.items
            .filter(item => item.priceHistory.length > 1)
            .map(item => {
                const prices = item.priceHistory;
                const currentPrice = prices[prices.length - 1].price;
                const previousPrice = prices.length > 1 ? prices[prices.length - 2].price : currentPrice;
                const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
                
                return {
                    ...item,
                    currentPrice,
                    previousPrice,
                    avgPrice,
                    savings: previousPrice - currentPrice,
                    savingsPercent: ((previousPrice - currentPrice) / previousPrice * 100),
                    belowAverage: currentPrice < avgPrice
                };
            })
            .filter(item => item.savings > 0 || item.belowAverage)
            .sort((a, b) => b.savingsPercent - a.savingsPercent);

        if (deals.length === 0) {
            console.log('No significant deals found today. Check back tomorrow!');
            return;
        }

        deals.forEach((deal, index) => {
            const emoji = index === 0 ? '🏆' : deal.savingsPercent > 10 ? '🔥' : '💵';
            console.log(`${emoji} ${deal.name}`);
            console.log(`   Current: $${deal.currentPrice.toFixed(2)}`);
            
            if (deal.savings > 0) {
                console.log(`   Was: $${deal.previousPrice.toFixed(2)}`);
                console.log(`   You save: $${deal.savings.toFixed(2)} (${deal.savingsPercent.toFixed(1)}%)`);
            }
            
            if (deal.belowAverage && deal.savings <= 0) {
                console.log(`   Below average price of $${deal.avgPrice.toFixed(2)}`);
            }
            
            if (deal.targetPrice && deal.currentPrice <= deal.targetPrice) {
                console.log(`   🎯 Target price reached!`);
            }
            
            console.log('');
        });
    }

    showMenu() {
        console.log('\n🛒 Shopping Price Tracker');
        console.log('═'.repeat(30));
        console.log('1. Add item');
        console.log('2. Remove item');
        console.log('3. List items');
        console.log('4. Update prices');
        console.log('5. Find best deals');
        console.log('6. Exit');
        console.log('');
    }

    async run() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (prompt) => {
            return new Promise((resolve) => {
                rl.question(prompt, resolve);
            });
        };

        console.log('Welcome to Shopping Price Tracker! 🛒');
        
        while (true) {
            this.showMenu();
            const choice = await question('Choose an option (1-6): ');

            switch (choice.trim()) {
                case '1':
                    const name = await question('Item name: ');
                    const category = await question('Category (optional): ') || 'general';
                    const targetPriceInput = await question('Target price (optional): ');
                    const targetPrice = targetPriceInput ? parseFloat(targetPriceInput) : null;
                    this.addItem(name, category, targetPrice);
                    break;

                case '2':
                    this.listItems();
                    if (this.items.length > 0) {
                        const itemNum = await question('Enter item number to remove: ');
                        const index = parseInt(itemNum) - 1;
                        if (index >= 0 && index < this.items.length) {
                            this.removeItem(this.items[index].id);
                        } else {
                            console.log('❌ Invalid item number');
                        }
                    }
                    break;

                case '3':
                    this.listItems();
                    break;

                case '4':
                    this.updatePrices();
                    break;

                case '5':
                    this.findBestDeals();
                    break;

                case '6':
                    console.log('👋 Thanks for using Shopping Price Tracker!');
                    rl.close();
                    return;

                default:
                    console.log('❌ Invalid option, please try again');
            }

            await question('\nPress Enter to continue...');
        }
    }
}

// Allow both CLI usage and module import
if (require.main === module) {
    const tracker = new ShoppingTracker();
    tracker.run().catch(console.error);
}

module.exports = ShoppingTracker;