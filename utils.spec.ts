import {separateDirPathAndFileName, kebab2pascal, dirpath2package} from "./utils";

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

    describe('dirpath2package', () => {
        test('', ()=>{
            expect(dirpath2package('/typescript2java/sample/source/sample-file.ts', 'org.demo','sample')).toEqual('org.demo.source')
            expect(dirpath2package('/typescript2java/sample/source/util/sample-file.ts', 'org.demo','sample')).toEqual('org.demo.source.util')
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