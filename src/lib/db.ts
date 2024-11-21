import Dexie from 'dexie';

export interface User {
  id?: string;
  username: string;
  hashedPassword: string;
}

export interface Entry {
  id?: string;
  userId: string;
  title: string;
  content: string;
  pageNumber: number;
  createdAt: Date;
  updatedAt: Date;
  size: number;
}

export class DabriaDB extends Dexie {
  users!: Dexie.Table<User, string>;
  entries!: Dexie.Table<Entry, string>;

  constructor() {
    super('DabriaDB');
    this.version(1).stores({
      users: '++id, username',
      entries: '++id, userId, pageNumber, title, *userIdAndPage'
    }).upgrade(tx => {
      // Create compound index during upgrade
      return tx.table('entries').toCollection().modify(entry => {
        entry.userIdAndPage = `${entry.userId}-${entry.pageNumber}`;
      });
    });
  }
}

const db = new DabriaDB();

// Add hooks for compound index maintenance
db.entries.hook('creating', (primKey, obj) => {
  obj.userIdAndPage = `${obj.userId}-${obj.pageNumber}`;
});

db.entries.hook('updating', (mods, primKey, obj) => {
  if (mods.userId || mods.pageNumber) {
    return {
      ...mods,
      userIdAndPage: `${mods.userId || obj.userId}-${mods.pageNumber || obj.pageNumber}`
    };
  }
});

export { db };