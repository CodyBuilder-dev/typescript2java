import {separateFileNameFromPath, kebab2pascal, dirpath2package, separateRelativePathFromDirPath} from "./utils";

describe('Utility Test', () =>{
    describe('separateFileNameFromAbsPath', () => {
        test('', () => {
            expect(separateFileNameFromPath('/typescript2java/sample/src/sample-file.ts')).toEqual({
                'dirPath':'/typescript2java/sample/src/',
                'fileName':'sample-file.ts'
            })
            expect(()=> separateFileNameFromPath('/typescript2java/sample/src/sample-file.js')).toThrowError('not a typescript file')
        })
    })

    describe('separateRelativePathFromDirPath', () => {
        test('', () => {
            expect(separateRelativePathFromDirPath('/typescript2java/sample/src/sample-file.ts', 'sample')).toEqual('/src/sample-file.ts')
            expect(separateRelativePathFromDirPath('/typescript2java/sample/src/sample/sample-file.ts', 'sample')).toEqual('/src/sample/sample-file.ts')
        })
    })

    describe('dirpath2package', () => {
        test('', ()=>{
            expect(dirpath2package('/typescript2java/sample/source/sample-file.ts', 'org.demo','sample')).toEqual('org.demo.source')
            expect(dirpath2package('/typescript2java/sample/source/util/sample-file.ts', 'org.demo','sample')).toEqual('org.demo.source.util')
            expect(dirpath2package('/typescript2java/sample/source/dir-with-hyphen/sample-file.ts','org.demo','sample')).toEqual('org.demo.source.dir_with_hyphen')
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