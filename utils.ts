export const createIndent = (level: number) => {
    return ' '.repeat(level*2)
}

export const extractFileName = (path: string) => {
    // find last .ts
    const regex = /[A-z0-9.-]*.ts$/
    const result = path.match(regex)

    if (result)
        return result[0];
    else
        throw new Error('not a typescript file')
}

const isLowerCase = (char: string | undefined): boolean => {
    if (char)
        return char == char.toLowerCase()
    else
        return false;
}

const isUpperCase = (char: string | undefined): boolean=> {
    if (char)
        return char == char.toUpperCase()
    else
        return false;
}

export const kebab2pascal = (filename: string) => {
    // convert kebab case to pascal case
    const stack:string[] = [];
    for (const char of filename) {
        if (!stack.length || stack.at(-1) == '-' || stack.at(-1) == '.') {
            while (stack.length && stack.at(-1) == '-' || stack.at(-1) == '.')
                stack.pop();
            stack.push(char.toUpperCase())
        } else {
            stack.push(char)
        }
    }
    // remove last 'Ts'
    stack.pop()
    stack.pop()

    return stack.join('') + '.java';
}