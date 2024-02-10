<template>
    <div class="quotation-paper">
        <!-- Header -->
        <div class="header">
            <h1>Quotation</h1>
            <p>Date: {{ currentDate }}</p>
        </div>

        <!-- Quotation Details -->
        <div class="quotation-details">
            <div>
                <strong>Customer:</strong>
                <p>{{ customerName }}</p>
            </div>
            <div>
                <strong>Contact:</strong>
                <p>{{ customerContact }}</p>
            </div>
            <div>
                <strong>Email:</strong>
                <p>{{ customerEmail }}</p>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <td>{{ item.name }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.quantity * item.price }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Total -->
        <div class="total">
            <p><strong>Total:</strong> {{ calculateTotal }}</p>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            currentDate: new Date().toLocaleDateString(),
            customerName: "John Doe",
            customerContact: "+1 123 456 789",
            customerEmail: "john.doe@example.com",
            items: [
                { name: "Product 1", description: "Description of Product 1", quantity: 1, price: 10 },
                { name: "Product 2", description: "Description of Product 2", quantity: 2, price: 20 },
                { name: "Product 3", description: "Description of Product 3", quantity: 1, price: 15 }
            ]
        };
    },
    computed: {
        calculateTotal() {
            return this.items.reduce((total, item) => total + (item.quantity * item.price), 0);
        }
    }
};
</script>
  
<style scoped>
.quotation-paper {
    font-family: Arial, sans-serif;
    width: 210mm;
    height: 297mm;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ccc;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

.quotation-details {
    margin-bottom: 20px;
}

.items-table {
    width: 100%;
    border-collapse: collapse;
}

.items-table th,
.items-table td {
    border: 1px solid #ccc;
    padding: 8px;
}

.total {
    margin-top: 20px;
}
</style>
  