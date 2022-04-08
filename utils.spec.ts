import {separateDirPathAndFileName, kebab2pascal} from "./utils";

describe('Utility Test', () =>{
    describe('separateDirPathAndFileName', () => {
        test('', () => {
            expect(separateDirPathAndFileName('/typescript2java/sample/src/sample-file.ts')).toEqual({
                'dirPath':'/typescript2java/sample/src/',
                'fileName':'sample-file.ts'
            })
            expect(()=> separateDirPathAndFileName('/typescript2java/sample/src/sample-file.js')).toThrowError('not a typescript file')
        })
    })

    describe('kebab2pascal', () => {
        test('',() => {
            expect(kebab2pascal('file-name-like-this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file.name.like.this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file--name--like-this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file--name.-like-this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file--name..like-this..ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file.name.like..this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file-Name-like-this.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('file-nAme-like-this.ts')).toEqual('FileNAmeLikeThis.java')
            expect(kebab2pascal('FileNameLikeThis.ts')).toEqual('FileNameLikeThis.java')
            expect(kebab2pascal('File.Name.lIkeThis.ts')).toEqual('FileNameLIkeThis.java')
            expect(kebab2pascal('file-Name-Like-This.ts')).toEqual('FileNameLikeThis.java')
        })
    })
})