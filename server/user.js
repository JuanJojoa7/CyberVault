class User {
    constructor(name, email, password, isAdmin) {
        this.isAdmin = false;
        this.isOnline = false;
        this.name = name;
        this.email = email;
        this.password = password;
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