import {sampleDecorator} from "./sample-decorator";

// Variable Statements
var a = 10;
let b = 5;
let c: string ='10';
let d;
d= 10;
const e = Number('10');

// IF/While/Try Statements

function promFunc(): Promise<string> {
    return null;
}

// Function Declarations
const sampleFunc = (name: string) => {
    return `this is ${name} util function!`;
}

function sampleFunc2 (a: number= 10,
                b: SomeClass, c: 'Y' | 'N'){
    if(a % 2) {
        return
    } else {
        return
    }
}

// Enum Declaration
enum f {
    A = "1",
    B = 'test',
    C = 3,
}

// Class Declaration
class SomeClass {
    constructor(private some: string = `${process.env.NODE_ENV}-env`){}
}

// Interface Declaration
interface SomeInterface {
    do1(var1: string);
    execute();
    do2():string;
}

class ImplClass implements SomeInterface{
    private _var1: number;
    private _instance1: SomeClass;

    constructor(var1: number, var2: SomeClass, private var3: string){
        this._var1 =var1;
        this._instance1 = var2;
    }

    get vari1(): number {
        return this.vari1;
    }

    execute(){
        try {
            const f = 10;
            this._var1 = 3;
            this.do2();

            this._var1 = Number(this.do2())
        } catch(e) {

        }
    }

    do2() {
        console.log('do2')
        return sampleFunc('do2');
    }
}


// Public Class
export class SampleFile {
    private variable: string;
    private no: number;

    constructor(variable: string, no: number) {
        this.variable = variable;
        this.no = no;
    }

    @sampleDecorator(false)
    method(userId: string):string {
        return 'Hello World! from' + userId;    
    }
}