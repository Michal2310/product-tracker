CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    image TEXT,
    url TEXT,
    createdAt DATETIME,
    searchQuery TEXT,
    tracked BOOLEAN DEFAULT 0
);

CREATE TABLE product_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    price FLOAT,
    priceDate DATETIME,
    FOREIGN KEY(productId) REFERENCES products(id)
);