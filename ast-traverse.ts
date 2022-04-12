import {Project, SourceFile, SyntaxKind } from "ts-morph";
import {dirpath2package, kebab2pascal, separateFileNameFromPath, writeFileWithMkdir} from "./utils";

const traverse = (source: SourceFile,sb: string): string => {
    console.log('=========' + source.compilerNode.fileName + '===============')
    for (const statement of source.compilerNode.statements) {
        sb = statementParser(statement,sb);
    }
    return sb;
}

const statementParser = (statement: any, sb: string): string => {
    if (!statement) return sb;

    switch(statement.kind) {
        case SyntaxKind.ImportDeclaration:
            return sb;

        case SyntaxKind.ClassDeclaration:
            sb = classDeclarationHandler(statement, sb)
            return sb;

        case SyntaxKind.InterfaceDeclaration:
            sb = interfaceDeclarationHandler(statement,sb);
            return sb;

        case SyntaxKind.EnumDeclaration:
            sb = enumDeclarationHandler(statement, sb);
            return sb;

        case SyntaxKind.EnumMember:
            sb = enumMemberHandler(statement, sb);
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

        case SyntaxKind.FunctionDeclaration:
        case SyntaxKind.GetAccessor:
        case SyntaxKind.MethodDeclaration:
            sb = methodDeclarationHandler(statement, sb);
            return sb;

        case SyntaxKind.Parameter:
            sb = parameterHandler(statement,sb)
            return sb;

        case SyntaxKind.VariableStatement:
            sb = variableStatementHandler(statement, sb);
            sb += '\n';
            return sb;

        case SyntaxKind.IfStatement:
            sb = ifStatementHandler(statement, sb);
            return sb;

        case SyntaxKind.WhileStatement:
            sb = whileStatementHandler(statement, sb);
            return sb;

        case SyntaxKind.TryStatement:
            sb = tryStatementHandler(statement, sb);
            return sb;

        case SyntaxKind.ExpressionStatement:
            sb += statement.getText() + '\n';
            return sb;

        case SyntaxKind.Block:
            sb = blockHandler(statement, sb);
            return sb;

        case SyntaxKind.BinaryExpression:
            sb = binaryExpressionHandler(statement,sb);
            return sb;

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


const enumDeclarationHandler = (enumDeclaraton: any, sb: string) => {
    sb += 'enum ' + enumDeclaraton.name.escapedText + '{\n';
    for(const member of enumDeclaraton.members) {
        sb = statementParser(member, sb);
    }

    sb += '}\n'
    return sb;
}

const enumMemberHandler = (enumMember: any, sb: string) => {
    sb += enumMember.name.escapedText;
    if (enumMember.initializer) {
        sb += '(' + initializerTypeTranslator(enumMember.initializer)  + ')';
    }
    sb += '\n';
    return sb;
}

const initializerTypeTranslator = (initializer: any) => {
    switch(initializer.kind) {
        case SyntaxKind.NumericLiteral:
            return initializer.text;
        case SyntaxKind.StringLiteral:
            return '"' + initializer.text + '"';
    }
}

const constructorHandler = (constructor: any, sb: string) => {
    if (constructor.parameters.length) {
        for (const parameter of constructor.parameters) {
            if (parameter.decorators) {
                for (const decorator of parameter.decorators)
                    sb = statementParser(decorator,sb)
            }
            if (parameter.modifiers) {
                for (const modifier of parameter.modifiers)
                    sb = statementParser(modifier,sb)
            }
            sb += paramTypeTranslator(parameter) + ' ' +parameter.name.getText() + ';\n';
        }
    }

    sb += constructor.parent.name.escapedText +'('
    if (constructor.parameters.length) {
        for (const parameter of constructor.parameters) {
            sb = statementParser(parameter,sb)
            sb += ','
        }
        sb = sb.slice(0, -1);
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
            sb += ','
        }
        sb = sb.slice(0,-1)
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
            sb += ','
        }
        sb = sb.slice(0,-1)
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
    sb += variableStatement.getText();
    return sb
}

export const ifStatementHandler = (ifStatement: any, sb: string): string => {
    // condition
    sb += 'if ('
    sb = statementParser(ifStatement.expression,sb)
    sb += ')\n'
    // then block
    sb = statementParser(ifStatement.thenStatement,sb)

    // else block
    sb += 'else';
    sb = statementParser(ifStatement.elseStatment,sb)
    return sb;
}

const whileStatementHandler = (whileStatement: any, sb: string): string => {
    // condition

    // block
    return sb;
}

const tryStatementHandler = (tryStatement: any, sb: string): string => {
    // try

    // catch
    return sb;
}

const binaryExpressionHandler = (binaryExpression: any, sb: string): string => {
    // left binary expression
    if (binaryExpression.left.kind == SyntaxKind.BinaryExpression) {
        sb = statementParser(binaryExpression.left,sb)
    } else {
        sb += binaryExpression.left.getText()
    }
    sb += ' '

    // operator
    sb += tokenHandler(binaryExpression.operatorToken)
    sb += ' '

    // right binary expression
    if (binaryExpression.right.kind == SyntaxKind.BinaryExpression) {
        sb = statementParser(binaryExpression.right,sb)
    } else {
        sb += binaryExpression.right.getText();
    }
    return sb;
}

const tokenHandler = (token: any): string => {
    switch(token.kind) {
        case SyntaxKind.EqualsEqualsEqualsToken :
            return token.getText()
        case SyntaxKind.ExclamationEqualsEqualsToken:
            return token.getText()
        default:
            return token.getText();
    }
}

// ======================main entrypoint=======================
const groupName = 'org.demo';
const projectRoot = 'sample';

const project = new Project();
project.addSourceFilesAtPaths(projectRoot + "/**/*.ts");


const sourceFiles = project.getSourceFiles();
for (const sourceFile of sourceFiles) {
    let sb = 'package ' + dirpath2package(sourceFile.compilerNode.fileName, groupName, projectRoot) + ';\n\n';
    sb = traverse(sourceFile,sb);

    const dirPath = separateFileNameFromPath(sourceFile.compilerNode.fileName).dirPath;
    const fileName = separateFileNameFromPath(sourceFile.compilerNode.fileName).fileName;
    writeFileWithMkdir(dirPath.replace(/-/g,'_') + kebab2pascal(fileName),sb)
}