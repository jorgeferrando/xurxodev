import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import * as fs from "fs";
import * as path from "path";

type StorageData = {
  users: Array<{
    id: string;
    email: string;
    name: string;
    password: string;
  }>;
  emails: string[];
  names: string[];
  passwords: string[];
};

export class InMemoryStorage {
  private static instance: InMemoryStorage;
  private storageFile: string;
  private data: StorageData;

  private constructor() {
    this.storageFile = path.join(process.cwd(), ".domain-storage.json");
    this.data = this.loadData();
  }

  static getInstance(): InMemoryStorage {
    if (!InMemoryStorage.instance) {
      InMemoryStorage.instance = new InMemoryStorage();
    }
    return InMemoryStorage.instance;
  }

  private loadData(): StorageData {
    try {
      if (fs.existsSync(this.storageFile)) {
        const content = fs.readFileSync(this.storageFile, "utf-8");
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn("Could not load storage file, starting fresh");
    }

    return {
      users: [],
      emails: [],
      names: [],
      passwords: [],
    };
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.storageFile, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  addUser(user: User): void {
    this.data.users.push({
      id: user.id,
      email: user.email.getValue(),
      name: user.name.getValue(),
      password: user.password.getValue(),
    });
    this.saveData();
  }

  addEmail(email: Email): void {
    if (!this.data.emails.includes(email.getValue())) {
      this.data.emails.push(email.getValue());
      this.saveData();
    }
  }

  addName(name: Name): void {
    if (!this.data.names.includes(name.getValue())) {
      this.data.names.push(name.getValue());
      this.saveData();
    }
  }

  addPassword(password: Password): void {
    if (!this.data.passwords.includes(password.getValue())) {
      this.data.passwords.push(password.getValue());
      this.saveData();
    }
  }

  getAllUsers(): User[] {
    return this.data.users
      .map((u) => {
        try {
          const email = Email.create(u.email);
          const name = Name.create(u.name);
          const password = Password.create(u.password);
          return User.reconstruct(u.id, email, name, password);
        } catch {
          return null;
        }
      })
      .filter((user): user is User => user !== null);
  }

  getAllEmails(): Email[] {
    return this.data.emails
      .map((e) => {
        try {
          return Email.create(e);
        } catch {
          return null;
        }
      })
      .filter((email): email is Email => email !== null);
  }

  getAllNames(): Name[] {
    return this.data.names
      .map((n) => {
        try {
          return Name.create(n);
        } catch {
          return null;
        }
      })
      .filter((name): name is Name => name !== null);
  }

  getAllPasswords(): Password[] {
    return this.data.passwords
      .map((p) => {
        try {
          return Password.create(p);
        } catch {
          return null;
        }
      })
      .filter((password): password is Password => password !== null);
  }

  clear(): void {
    this.data = {
      users: [],
      emails: [],
      names: [],
      passwords: [],
    };
    this.saveData();
  }
}
