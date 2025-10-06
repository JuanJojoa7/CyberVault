class User {
    constructor(name, email, password, isAdmin = false) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.isOnline = false;
        this.history = [];
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name} and my email is ${this.email}.`);
    }

    setIsOnline(isOnline) {
        this.isOnline = isOnline;
    }
}

module.exports = User;