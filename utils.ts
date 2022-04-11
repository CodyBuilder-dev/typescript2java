export const createIndent = (level: number) => {
    return ' '.repeat(level*2)
}

export const separateFileNameFromPath = (path: string) => {
    // find last .ts
    const regex = /[A-z0-9.-]*.ts$/
    const result = path.match(regex)

    if (result)
        return {
            dirPath: path.slice(0,result["index"]),
            fileName: result[0]
        };
    else
        throw new Error('not a typescript file')
}

export const separateRelativePathFromDirPath = (dirPath: string, projectRoot: string) => {
    // Find first matching dir name from left
    const result = dirPath.match(projectRoot);
    if (result) {
        return dirPath.slice(Number(result['index']) + result[0].length);
    }
    else
        throw new Error('project root not matching')
}

export const dirpath2package = (dirpath: string, groupName: string, projectRoot: string): string => {
    const relativePath = separateRelativePathFromDirPath(dirpath,projectRoot)
    const relativeDirName = separateFileNameFromPath(relativePath).dirPath;

    return groupName + relativeDirName.replace(/\//g,'.').replace(/[.]$/,'');
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