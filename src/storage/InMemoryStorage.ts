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
        const emailResult = Email.create(u.email);
        const nameResult = Name.create(u.name);
        const passwordResult = Password.create(u.password);

        if (emailResult.isFailure() || nameResult.isFailure() || passwordResult.isFailure()) {
          return null;
        }

        const userResult = User.reconstruct(
          u.id,
          emailResult.getValue(),
          nameResult.getValue(),
          passwordResult.getValue()
        );

        return userResult.isSuccess() ? userResult.getValue() : null;
      })
      .filter((user): user is User => user !== null);
  }

  getAllEmails(): Email[] {
    return this.data.emails
      .map((e) => {
        const result = Email.create(e);
        return result.isSuccess() ? result.getValue() : null;
      })
      .filter((email): email is Email => email !== null);
  }

  getAllNames(): Name[] {
    return this.data.names
      .map((n) => {
        const result = Name.create(n);
        return result.isSuccess() ? result.getValue() : null;
      })
      .filter((name): name is Name => name !== null);
  }

  getAllPasswords(): Password[] {
    return this.data.passwords
      .map((p) => {
        const result = Password.create(p);
        return result.isSuccess() ? result.getValue() : null;
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
