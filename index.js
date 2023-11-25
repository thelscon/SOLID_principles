"use strict";
// Завдання 1: Принцип єдиної відповідальності (SRP)
//  - Створіть невелику програму, яка моделює бібліотечну систему.
//  - Реалізуйте класи для Книги, Бібліотеки та Користувача.
//  - Переконайтеся, що кожен клас дотримується принципу єдиної відповідальності.
//  - Наприклад, клас Книга повинен бути відповідальним за книжкові деталі, Бібліотека 
//     за бібліотечні операції, а Користувач за користувальницькі дані.
{
    class Book {
        _title;
        _author;
        _yearOfPublishing;
        get title() {
            return this._title;
        }
        get author() {
            return this._author;
        }
        get yearOfPublishing() {
            return this._yearOfPublishing;
        }
        constructor(title, author, yearOfPublishing) {
            this._title = title;
            this._author = author;
            this._yearOfPublishing = yearOfPublishing;
        }
    }
    class User {
        _name;
        _surname;
        _booksInUse = [];
        get name() {
            return this._name;
        }
        get surname() {
            return this._surname;
        }
        get booksInUse() {
            return this._booksInUse;
        }
        constructor(name, surname) {
            this._name = name;
            this._surname = surname;
        }
        rentBooks(library, books) {
            // берём книги в библитотеке
            this._booksInUse.push(...library.rentOutBooks(books));
        }
        returnBooks(library) {
            // возвращаем книги обратно
            const returnBooks = [...this._booksInUse];
            library.acceptingBooksFromRental(returnBooks);
            this._booksInUse.length = 0;
            return returnBooks;
        }
    }
    class Library {
        _name;
        _users = [];
        _books = [];
        get name() {
            return this._name;
        }
        get users() {
            return this._users;
        }
        get books() {
            return this._books;
        }
        constructor(name) {
            this._name = name;
        }
        addUser(user) {
            this._users.push(user);
        }
        rentOutBooks(books) {
            books.forEach(book => {
                const deletionIndex = this._books.indexOf(book);
                if (deletionIndex >= 0) {
                    this._books.splice(deletionIndex, 1);
                }
            });
            return books;
        }
        acceptingBooksFromRental(books) {
            this._books.push(...books);
        }
        orderForPurchaseOfNewLiterature(book) {
            return true;
        }
        cataloging() {
            // каталогизация
        }
        organizeExhibition(books) {
            // организация выставок книг
        }
    }
}
// Завдання 2: Принцип відкритості/закритості (OCP)
//     - Розробіть простий графічний редактор, який дозволяє користувачам малювати різні форми 
//         (наприклад, кола, прямокутники, трикутники).
//     - Застосуйте принцип відкритості/закритості для зручного розширення для додавання нових форм 
//         без змінення існуючого коду.
//     - Покажіть приклад додавання нової форми (наприклад, еліпса) без модифікації 
//         основної функціональності малювання.
{
    class GraphicsEditor {
        _listOfShape = [];
        get listOfShape() {
            return this._listOfShape;
        }
        addShape(shape) {
            this._listOfShape.push(shape);
        }
        shapeDrawing(shape) {
            shape.drawing();
        }
    }
    const GE = new GraphicsEditor;
    class Ellipse {
        drawing() {
            console.log('drawing Ellipse');
        }
        erase() {
            console.log('erase Ellipse');
        }
    }
    GE.addShape(new Ellipse());
    GE.addShape({
        id: 3,
        drawing() {
            console.log('drawing other figure');
        },
        erase() {
            console.log('erase other figure');
        }
    });
    // рисуем все фигуры
    GE.listOfShape.forEach(shape => shape.drawing());
}
// Завдання 3: Принцип підстановки Лісков (LSP)
//     - Створіть ієрархію геометричних фігур з класами, такими як Квадрат, Коло та Трикутник.
//     - Застосуйте принцип підстановки Ліскова, переконавшись, що об'єкти базового класу (наприклад, Фігура) 
//         можуть бути замінені об'єктами похідних класів без впливу на коректність програми.
//     - Покажіть приклад, де різні форми можуть використовуватися взаємозамінно.
{
    class Shape {
    }
    class Square extends Shape {
        side;
        constructor(side) {
            super();
            this.side = side;
        }
        calculateArea() {
            return this.side ** 2;
        }
    }
    class Circle extends Shape {
        radius;
        constructor(radius) {
            super();
            this.radius = radius;
        }
        calculateArea() {
            return Math.PI * this.radius ** 2;
        }
    }
    class Triangle extends Shape {
        baseOrBaseA;
        heightOrBaseB;
        baseC;
        constructor(baseOrBaseA, heightOrBaseB, baseC) {
            super();
            this.baseOrBaseA = baseOrBaseA;
            this.heightOrBaseB = heightOrBaseB;
            this.baseC = baseC;
        }
        calculateArea() {
            if (this.baseC) {
                const s = (this.baseOrBaseA + this.heightOrBaseB + this.baseC) / 2;
                return Math.sqrt(s * (s - this.baseOrBaseA) * (s - this.heightOrBaseB) * (s - this.baseC));
            }
            else {
                return (this.baseOrBaseA * this.heightOrBaseB) / 2;
            }
        }
    }
    // реализация Liskov Substitution Principle
    function printSumOfAreas(...shapes) {
        console.log(shapes.reduce((start, shape) => start + shape.calculateArea(), 0));
    }
    printSumOfAreas(new Square(4), new Square(3), new Circle(3), new Triangle(22, 12));
}
// Завдання 4: Принцип розділення інтерфейсу (ISP)
//     - Спроектуйте інтерфейс для Системи Управління Завданнями з методами, такими як createTask(), assignTask() та completeTask().
//     - Реалізуйте класи для різних типів користувачів (наприклад, Розробник, Менеджер).
//     - Застосуйте принцип розділення інтерфейсу, переконавшись, що кожен клас реалізує лише ті методи, які стосуються його ролі.
{
    class Task {
        nameTask;
        contentOfTheTask;
        constructor(nameTask, contentOfTheTask) {
            this.nameTask = nameTask;
            this.contentOfTheTask = contentOfTheTask;
        }
    }
    class TaskAndResult {
        task;
        resultTask;
        constructor(task, resultTask) {
            this.task = task;
            this.resultTask = resultTask;
        }
    }
    // interface ITaskManagementSystems extends ICreateTask , IAssignTask , ICompleteTask {
    //     readonly createTask : (task : ITask) => void
    //     readonly assignTask : (developer : IDeveloper , task : ITask) => void
    //     readonly completeTask : (task : ITask) => ITaskAndResult
    // }
    class Manager {
        assignTask(developer, task) {
            developer.createTask(task);
        }
    }
    class Developer {
        _tasks = [];
        _tasksAndResults = [];
        createTask(task) {
            this._tasks.push(task);
        }
        completeTask(task) {
            const taskAndResult = new TaskAndResult(task, 'result');
            this._tasksAndResults.push(taskAndResult);
            return taskAndResult;
        }
    }
}
// Завдання 5: Принцип інверсії залежностей (DIP)
//     - Розробіть систему обміну повідомленнями, де високорівневі модулі відправляють повідомлення низькорівневим модулям.
//     - Застосуйте принцип інверсії залежностей за допомогою введення залежностей або абстракцій, щоб високорівневі модулі 
//         залежали від абстракцій, а не від конкретних реалізацій.
//     - Продемонструйте, що зміна реалізації обміну повідомленнями не впливає на високорівневі модулі.
{
    class Viber {
        static _users = [];
        static sendMessage(userName, message) {
            const recipient = Viber._users.find(item => item.name === userName);
            if (recipient) {
                recipient.messages.push(message);
                return true;
            }
            else {
                return false;
            }
        }
    }
    class Telegram {
        static _users = [];
        static sendTelegram(telegram, userName) {
            const recipient = Telegram._users.find(item => item.name === userName);
            if (recipient) {
                recipient.telegrams.push(telegram);
                return true;
            }
            else {
                return false;
            }
        }
    }
    // с помощью сервиса оповещения AlertService реализуется Dependency Inversion Principle
    class AlertService {
        static notifyViaViber(userName, message) {
            return Viber.sendMessage(userName, message);
        }
        static notifyViaTelegram(message, userName) {
            return Telegram.sendTelegram(message, userName);
        }
        static broadcastNotification(userName, message) {
            return AlertService.notifyViaViber(userName, message) || AlertService.notifyViaTelegram(message, userName);
        }
    }
    class Bank {
        // оповещение пользователя, используя сервис оповещения
        sendNotification(notification, userName) {
            return AlertService.broadcastNotification(userName, notification);
        }
    }
}
