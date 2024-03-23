import { createDbConnection } from "../db";
import { Product } from "../models/Product";

const db = createDbConnection();

export const fetchAllProducts = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.*, pp.price, pp.priceDate
FROM products p
LEFT JOIN product_prices pp ON p.id = pp.productId
ORDER BY p.id, pp.priceDate DESC;`;

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as Product[]);
    });
  });
};

export const saveProductsToDatabase = async (
  products: Product[],
  searchQuery: string,
): Promise<void> => {
  const insertProductQuery = `INSERT INTO products (name, image, url, createdAt, searchQuery) VALUES (?, ?, ?, ?, ?)`;

  products.forEach((product) => {
    db.run(
      insertProductQuery,
      [product.title, product.imgSrc, product.url, new Date(), searchQuery],
      function (err) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        const productId = this.lastID; // The newly inserted product ID.
        saveProductPrice(productId, parseInt(product.price));
      },
    );
  });
};

export const saveProductPrice = async (
  productId: number,
  price: number,
  priceDate: Date = new Date(),
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO product_prices (productId, price, priceDate) VALUES (?, ?, ?);`;
    db.run(sql, [productId, price, priceDate], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log(`Price data inserted with rowid ${this.lastID}`);
      resolve();
    });
  });
};

export const fetchProductsByQuery = async (userQuery: string): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const words = userQuery.split(" ").filter(Boolean);

    const sql = `
      SELECT * FROM products
      WHERE ${words.map(() => `(name LIKE ? OR searchQuery LIKE ?)`).join(" AND ")}
      ORDER BY createdAt DESC;`;

    //@ts-ignore
    const params = words.reduce((acc, word) => [...acc, `%${word}%`, `%${word}%`], []);

    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as Product[]);
    });
  });
};

export const toggleProductTracking = (productId: number, shouldTrack: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE products SET tracked = ? WHERE id = ?`;
    db.run(sql, [shouldTrack ? 1 : 0, productId], function (err) {
      if (err) {
        reject(err);
      } else {
        console.log(`Row(s) updated: ${this.changes}`);
        resolve();
      }
    });
  });
};

export const fetchTrackedProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM products WHERE tracked = 1;`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows as Product[]);
    });
  });
};

export const fetchProductById = (productId: number): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM products WHERE id = ?;`;

    db.all(sql, [productId], (err, product) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(product[0] as Product[]);
    });
  });
};
