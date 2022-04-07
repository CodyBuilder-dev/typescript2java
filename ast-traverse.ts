import {Project, SourceFile, SyntaxKind } from "ts-morph";
import * as fs from 'fs';

const traverse = (source: SourceFile,sb: string): string => {
    console.log('=========' + source.compilerNode.fileName + '===============')
    for (const statement of source.compilerNode.statements) {
        sb = statementParser(statement,sb);
    }
    return sb;
}


const statementParser = (statement: any, sb: string) => {
    if (!statement) return sb;

    switch(statement.kind) {
        case SyntaxKind.ImportDeclaration:
            return sb;
        case SyntaxKind.ClassDeclaration:
            sb += classDeclarationHandler(statement, sb)
            return sb;
        case SyntaxKind.InterfaceDeclaration:
            sb += interfaceDeclarationHandler(statement,sb);
            return sb;
        case SyntaxKind.MethodSignature:
            sb = methodSignatureHandler(statement, sb);
            return sb;
        case SyntaxKind.Decorator:
            sb += statement.getText();
            sb += '\n';
            return sb;
        case SyntaxKind.ExportKeyword:
            sb += 'public '
            return sb;
        case SyntaxKind.PrivateKeyword:
            sb += 'private '
            return sb;
        case SyntaxKind.ReadonlyKeyword:
            sb += 'final '
            return sb;
        case SyntaxKind.StaticKeyword:
            sb += 'static '
            return sb;
        case SyntaxKind.PropertyDeclaration:
            sb = propertyDeclarationHandler(statement, sb);
            sb += ';'
            return sb;
        case SyntaxKind.Constructor:
            sb = constructorHandler(statement, sb);
            return sb;
        case SyntaxKind.GetAccessor:
        case SyntaxKind.MethodDeclaration:
            sb = methodDeclarationHandler(statement, sb);
            return sb;
        case SyntaxKind.Parameter:
            sb = parameterHandler(statement,sb)
            return sb;
        case SyntaxKind.VariableStatement:
            sb = variableStatementHandler(statement, sb);
            return sb;
        case SyntaxKind.IfStatement:
        case SyntaxKind.TryStatement:
        case SyntaxKind.WhileStatement:
            sb += statement.getText() + '\n';
            return sb;
        case SyntaxKind.ExpressionStatement:
            sb += statement.getText() + '\n';
            return sb;
        case SyntaxKind.Block:
            sb = blockHandler(statement, sb);
            return sb;
        case SyntaxKind.BinaryExpression:
        case SyntaxKind.CallExpression:
            sb += statement.getText();
            return sb;
        default:
            return sb;
    }
}

const interfaceDeclarationHandler = (interfaceDeclaration: any, sb: string) => {
    if (interfaceDeclaration.decorators){
        for (const decorator of interfaceDeclaration.decorators)
            sb = statementParser(decorator,sb);
    }
    if (interfaceDeclaration.modifiers) {
        for (const modifier of interfaceDeclaration.modifiers)
            sb = statementParser(modifier,sb);
    }
    sb += 'interface ' + interfaceDeclaration.name.escapedText + ' ';
    if (interfaceDeclaration.heritageClauses) {
        for (const heritage of interfaceDeclaration.heritageClauses)
            sb += heritage.getText() + ' ';
    }
    sb += '{\n';
    if(interfaceDeclaration.members) {
        for (const member of interfaceDeclaration.members)
            sb = statementParser(member,sb);
    }
    sb += '}\n'
    return sb;
}

const classDeclarationHandler = (classDeclaration: any, sb: string) => {
    if (classDeclaration.decorators){
        for (const decorator of classDeclaration.decorators)
            sb = statementParser(decorator,sb);
    }
    if (classDeclaration.modifiers) {
        for (const modifier of classDeclaration.modifiers)
            sb = statementParser(modifier,sb);
    }
    sb += 'class ' + classDeclaration.name.escapedText + ' ';
    if (classDeclaration.heritageClauses) {
        for (const heritage of classDeclaration.heritageClauses)
            sb += heritage.getText() + ' ';
    }
    sb += '{\n';
    if(classDeclaration.members) {
        for (const member of classDeclaration.members) {
            sb = statementParser(member,sb);
            sb += '\n';
        }
    }
    sb += '}\n'
    return sb;
}


const constructorHandler = (constructor: any, sb: string) => {
    sb += constructor.parent.name.escapedText +'('
    if (constructor.parameters.length) {
        for (const parameter of constructor.parameters) {
            sb = statementParser(parameter,sb)
            sb += ',\n'
        }
        sb = sb.slice(0, -2);
    }
    sb += ') \n';
    // 그냥 body 통으로 반환하기
    sb += constructor.body.getText() + '\n';
    // or statement단위로 분석해서 반환하기
    // sb = statementParser(constructor.body,sb);

    return sb;
}

const methodDeclarationHandler = (methodDeclaration: any, sb: string) => {
    if(methodDeclaration.type)
        sb += paramTypeTranslator(methodDeclaration) + ' '
    sb += methodDeclaration.name.escapedText + '(';
    if (methodDeclaration.parameters.length) {
        for (const parameter of methodDeclaration.parameters) {
            sb = statementParser(parameter,sb)
            sb += ',\n'
        }
        sb = sb.slice(0,-2)
    }
    sb += ') \n';

    // Just return body
    if (methodDeclaration.body)
        sb += methodDeclaration.body.getText() + '\n';
    // or parse statements
    // sb = statementParser(methodDeclaration.body,sb);

    return sb;
}
const methodSignatureHandler = (methodSignature: any, sb: string) => {
    sb += methodSignature.name.escapedText + '(';
    if (methodSignature.parameters.length) {
        for (const parameter of methodSignature.parameters) {
            sb = statementParser(parameter,sb)
            sb += ',\n'
        }
        sb = sb.slice(0,-2)
    }
    sb += '); \n';
    return sb;
}
const propertyDeclarationHandler = (propertyDeclaration: any, sb: string) => {
    if (propertyDeclaration.decorators) {
        for (const decorator of propertyDeclaration.decorators)
            sb = statementParser(decorator,sb)
    }
    if(propertyDeclaration.modifiers){
        for(const modifier of propertyDeclaration.modifiers)
            sb = statementParser(modifier, sb)
            sb += ' '
    }
    if (propertyDeclaration.type)
        sb += paramTypeTranslator(propertyDeclaration)
    sb += ' '
    sb += propertyDeclaration.name.escapedText;

    return sb;
}


const parameterHandler = (parameter: any, sb: string) => {
    if (parameter.decorators) {
        for (const decorator of parameter.decorators)
            sb = statementParser(decorator,sb)
    }
    if (parameter.modifiers) {
        for (const modifier of parameter.modifiers)
            sb = statementParser(modifier,sb)
    }
    sb += paramTypeTranslator(parameter) + ' ' +parameter.name.getText();
    return sb
}

const paramTypeTranslator = (statement: any) => {
    if (statement.type) {
        if (statement.type.kind == SyntaxKind.ArrayType) {
            switch(statement.type.elementType.kind) {
                case SyntaxKind.StringKeyword:
                    return 'String[]';
                case SyntaxKind.NumberKeyword:
                    return 'int[]';
                case SyntaxKind.BooleanKeyword:
                    return 'boolean[]';
                case SyntaxKind.ObjectKeyword:
                    return 'Object[]';
                case SyntaxKind.AnyKeyword:
                    return 'any[]';
                case SyntaxKind.TypeLiteral:
                    return statement.type.elementType.getText()
                default:
                    return statement.type.elementType.typeName.escapedText + '[]';
            }
        } else if (statement.type.kind == SyntaxKind.UnionType) {
            return statement.type.getText();
        } else {
            switch(statement.type.kind) {
                case SyntaxKind.StringKeyword:
                    return 'String';
                case SyntaxKind.NumberKeyword:
                    return 'int';
                case SyntaxKind.VoidKeyword:
                    return 'void';
                case SyntaxKind.BooleanKeyword:
                    return 'boolean';
                case SyntaxKind.ObjectKeyword:
                    return 'Object';
                case SyntaxKind.AnyKeyword:
                    return '';
                default:
                    return statement.type.typeName.escapedText;
            }
        }
    } else {
        return ' '
    }
}

const blockHandler = (block: any, sb: string): string => {
    for (const statement of block.statements)
        sb = statementParser(statement,sb)
    return sb;
}

const variableStatementHandler = (variableStatement: any, sb: string): string => {
    for (const variableDeclation of variableStatement.declarationList.declarations) {
        sb += paramTypeTranslator(variableDeclation) + ' ' + variableDeclation.name.getText() + '\n';
    }
    return sb
}


// ======================main entrypoint=======================
const project = new Project();
project.addSourceFilesAtPaths("sample/**/*.ts");

const sourceFiles = project.getSourceFiles();
for (const sourceFile of sourceFiles) {
    let sb = '';
    sb = traverse(sourceFile,sb);
    fs.writeFileSync(sourceFile.compilerNode.fileName+'.java',sb)
}