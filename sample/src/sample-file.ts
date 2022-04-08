export class SampleFile {
    private variable: string;
    private no: number;

    constructor(variable: string, no: number) {
        this.variable = variable;
        this.no = no;
    }
    
    method(userId: string):string {
        return 'Hello World! from' + userId;    
    }
}