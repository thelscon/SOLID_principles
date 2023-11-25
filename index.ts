// Завдання 1: Принцип єдиної відповідальності (SRP)

//  - Створіть невелику програму, яка моделює бібліотечну систему.
//  - Реалізуйте класи для Книги, Бібліотеки та Користувача.
//  - Переконайтеся, що кожен клас дотримується принципу єдиної відповідальності.
//  - Наприклад, клас Книга повинен бути відповідальним за книжкові деталі, Бібліотека 
//     за бібліотечні операції, а Користувач за користувальницькі дані.
{
    interface IBook {
        readonly title : string ,
        readonly author : string ,
        readonly yearOfPublishing : Date
    }
    
    class Book implements IBook {
        private readonly _title : string
        private readonly _author : string
        private readonly _yearOfPublishing : Date
    
        public get title () : string {
            return this._title
        }
        public get author () : string {
            return this._author
        }
        public get yearOfPublishing () : Date {
            return this._yearOfPublishing
        }
    
        constructor (
            title : string ,
            author : string ,
            yearOfPublishing : Date
        ) {
            this._title = title
            this._author = author
            this._yearOfPublishing = yearOfPublishing
        }
    }
    
    interface IUser {
        readonly name : string ,
        readonly surname : string ,
        readonly booksInUse : Array<IBook>
    
        rentBooks : (library : ILibrary , books : Array<IBook>) => void
        returnBooks : (library : ILibrary) => Array<IBook>
    }
    
    class User implements IUser {
        private readonly _name : string 
        private readonly _surname : string
        private readonly _booksInUse : Array<IBook> = []
    
        public get name () : string {
            return this._name
        }
        public get surname () : string {
            return this._surname
        }
        public get booksInUse () : Array<IBook> {
            return this._booksInUse
        }
    
        constructor (
            name : string ,
            surname : string
        ) {
            this._name = name
            this._surname = surname
        }
    
        rentBooks (library : ILibrary , books : Array<IBook>) {
            // берём книги в библитотеке
            this._booksInUse.push (...library.rentOutBooks (books))
        }
        returnBooks (library : ILibrary) {
            // возвращаем книги обратно
            const returnBooks = [...this._booksInUse]
            library.acceptingBooksFromRental (returnBooks)
            this._booksInUse.length = 0
            return returnBooks
        }
    }
    
    interface ILibrary {
        readonly name : string
        readonly books : Array<IBook>
    
        rentOutBooks : (books : Array<IBook>) => Array<IBook>
        acceptingBooksFromRental : (books : Array<IBook>) => void
    
        orderForPurchaseOfNewLiterature : (book : IBook) => boolean     // заказ новой книги
        cataloging : () => void                                         // каталогизация
        organizeExhibition : (books : Array<IBook>) => void             // организация выставок
    }
    
    class Library implements ILibrary {
        private readonly _name : string
        private readonly _users : Array<IUser> = []
        private readonly _books : Array<IBook> = []
    
        public get name () : string {
            return this._name
        }
        public get users () : Array<IUser> {
            return this._users
        }
        public get books () : Array<IBook> {
            return this._books
        }
        
        constructor (name : string) {
            this._name = name
        }
    
        addUser (user : IUser) {
            this._users.push (user)
        }
    
        rentOutBooks (books : Array<IBook>) {
            books.forEach (book => {
                const deletionIndex = this._books.indexOf (book)
                if (deletionIndex >= 0) {
                    this._books.splice (deletionIndex , 1)
                }
            })
    
            return books
        }
        acceptingBooksFromRental (books : Array<IBook>) {
            this._books.push (...books)
        }
    
        orderForPurchaseOfNewLiterature (book : IBook) {
            return true
        }
        cataloging () {
            // каталогизация
        }
        organizeExhibition (books : Array<IBook>) {
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
    interface IShape {
        [index : keyof any] : any
    
        drawing : () => void
        // erase : () => void
    }
    
    interface IGraphicsEditor {
        // реализация Open-closed Principle, где каждая фигура списка должна обладать необходимыми возможностями (interface IShape)
        listOfShape : Array<IShape>
    
        shapeDrawing : (shape : IShape) => void
        // shapeErase : (shape : IShape) => void
    }
    
    class GraphicsEditor implements IGraphicsEditor {
        private readonly _listOfShape : Array<IShape> = []
    
        get listOfShape () : Array<IShape> {
            return this._listOfShape
        }
    
        addShape (shape : IShape) {
            this._listOfShape.push (shape)
        }
    
        shapeDrawing (shape : IShape) {
            shape.drawing ()
        }
        // shapeErase (shape: IShape) {
        //     shape.erase ()
        // }
    }
    
    const GE = new GraphicsEditor
    
    class Ellipse implements IShape {
        drawing () {
            console.log ('drawing Ellipse')
        }
        erase () {
            console.log ('erase Ellipse')
        }
    }
    
    GE.addShape (new Ellipse())
    GE.addShape ({
        id : 3 ,
        drawing () {
            console.log ('drawing other figure')
        } ,
        erase () {
            console.log ('erase other figure')
        }
    })
    
    // рисуем все фигуры
    GE.listOfShape.forEach (shape => shape.drawing ())
}



// Завдання 3: Принцип підстановки Лісков (LSP)
//     - Створіть ієрархію геометричних фігур з класами, такими як Квадрат, Коло та Трикутник.
//     - Застосуйте принцип підстановки Ліскова, переконавшись, що об'єкти базового класу (наприклад, Фігура) 
//         можуть бути замінені об'єктами похідних класів без впливу на коректність програми.
//     - Покажіть приклад, де різні форми можуть використовуватися взаємозамінно.
{
    interface IShape {
        calculateArea : () => number
    }
    
    abstract class Shape implements IShape {
        abstract calculateArea () : number
    }
    
    class Square extends Shape {
        constructor (
            public side : number
        ) {
            super ()
        }
    
        calculateArea () {
            return this.side**2
        }
    }
    
    class Circle extends Shape {
        constructor (
            public radius : number
        ) {
            super ()
        }
    
        calculateArea () {
            return Math.PI * this.radius**2
        }
    }
    
    class Triangle extends Shape {
        constructor (
            public baseOrBaseA : number ,
            public heightOrBaseB : number ,
            public baseC ?: number
        ) {
            super ()
        }
    
        calculateArea () {
            if (this.baseC) {
                const s = (this.baseOrBaseA + this.heightOrBaseB + this.baseC) / 2
                return Math.sqrt (s * (s - this.baseOrBaseA) * (s - this.heightOrBaseB) * (s - this.baseC))
            }
            else {
                return (this.baseOrBaseA * this.heightOrBaseB) / 2
            }
        }
    }
    
    // реализация Liskov Substitution Principle
    function printSumOfAreas (...shapes : Array<IShape>) : void {
        console.log (
            shapes.reduce ((start , shape) => start + shape.calculateArea () , 0)
        )
    }
    
    printSumOfAreas (
        new Square (4) ,
        new Square (3) ,
        new Circle (3) ,
        new Triangle (22 , 12)
    )
}



// Завдання 4: Принцип розділення інтерфейсу (ISP)
//     - Спроектуйте інтерфейс для Системи Управління Завданнями з методами, такими як createTask(), assignTask() та completeTask().
//     - Реалізуйте класи для різних типів користувачів (наприклад, Розробник, Менеджер).
//     - Застосуйте принцип розділення інтерфейсу, переконавшись, що кожен клас реалізує лише ті методи, які стосуються його ролі.
{
    interface ITask {
        readonly nameTask : string ,
        readonly contentOfTheTask : string
    }
    class Task implements ITask {
        constructor (
            public readonly nameTask : string ,
            public readonly contentOfTheTask : string
        ) {}
    }
    
    interface ITaskAndResult {
        readonly task : ITask , 
        readonly resultTask : string
    }
    class TaskAndResult implements ITaskAndResult {
        constructor (
            public readonly task : ITask ,
            public readonly resultTask : string
        ) {}
    }
    
    interface ICreateTask {
        readonly createTask : (task : ITask) => void
    }
    interface IAssignTask {
        readonly assignTask : (developer : IDeveloper , task : ITask) => void
    }
    interface ICompleteTask {
        readonly completeTask : (task : ITask) => ITaskAndResult
    }
    
    // interface ITaskManagementSystems extends ICreateTask , IAssignTask , ICompleteTask {
    //     readonly createTask : (task : ITask) => void
    //     readonly assignTask : (developer : IDeveloper , task : ITask) => void
    //     readonly completeTask : (task : ITask) => ITaskAndResult
    // }
    
    class Manager implements IAssignTask {
        assignTask (developer : IDeveloper , task : ITask) {
            developer.createTask (task)
        }
    }
    
    interface IDeveloper extends ICreateTask , ICompleteTask {}
    class Developer implements IDeveloper {
        private _tasks : Array<ITask> = []
        private _tasksAndResults : Array<ITaskAndResult> = []
    
        createTask (task : ITask) {
            this._tasks.push (task)
        }
        completeTask (task : ITask) {
            const taskAndResult = new TaskAndResult (task , 'result')
            this._tasksAndResults.push (taskAndResult)
            return taskAndResult
        }
    }
}



// Завдання 5: Принцип інверсії залежностей (DIP)
//     - Розробіть систему обміну повідомленнями, де високорівневі модулі відправляють повідомлення низькорівневим модулям.
//     - Застосуйте принцип інверсії залежностей за допомогою введення залежностей або абстракцій, щоб високорівневі модулі 
//         залежали від абстракцій, а не від конкретних реалізацій.
//     - Продемонструйте, що зміна реалізації обміну повідомленнями не впливає на високорівневі модулі.
{
    interface IBasicMessengerUser {
        name : string ,
    }
    interface IViberUser extends IBasicMessengerUser {
        messages : Array<string> ,
        email : string
    }
    interface ITelegramUser extends IBasicMessengerUser {
        telegrams : Array<string> ,
        phone : number
    }
    
    class Viber {
        private static readonly _users : Array<IViberUser> = []
    
        public static sendMessage (userName: string , message: string) {
            const recipient = Viber._users.find(item => item.name === userName)
            if (recipient) {
                recipient.messages.push (message)
                return true
            }
            else {
                return false
            }
        }
    }
    class Telegram {
        private static readonly _users : Array<ITelegramUser> = []
    
        public static sendTelegram (telegram : string , userName : string) {
            const recipient = Telegram._users.find(item => item.name === userName)
            if (recipient) {
                recipient.telegrams.push (telegram)
                return true
            }
            else {
                return false
            }
        }
    }
    
    // с помощью сервиса оповещения AlertService реализуется Dependency Inversion Principle
    class AlertService {
        private static notifyViaViber (userName : string , message : string) : boolean {
            return Viber.sendMessage (userName , message)
        }
        private static notifyViaTelegram (message : string , userName : string) : boolean {
            return Telegram.sendTelegram (message , userName)
        }
    
        public static broadcastNotification (userName : string , message : string) : boolean {
            return  AlertService.notifyViaViber (userName , message) || AlertService.notifyViaTelegram (message , userName)
        }
    }
    
    interface IBank {
        sendNotification : (notification : string , userName : string) => boolean 
    }
    class Bank implements IBank {
        // оповещение пользователя, используя сервис оповещения
        sendNotification (notification: string, userName: string) {
            return AlertService.broadcastNotification (userName , notification )
        }
    }
}

