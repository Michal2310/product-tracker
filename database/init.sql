CREATE TABLE products_search (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    image TEXT,
    url TEXT,
    price FLOAT,
    createdAt DATETIME,
    searchQuery TEXT
);

CREATE TABLE tracked_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    createdAt DATETIME,
    tracked BOOLEAN
);