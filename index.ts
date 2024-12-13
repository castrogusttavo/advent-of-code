import { readFileSync } from 'fs'

function main(): void {
    const input: string[] = readInput('input.txt')

    // day1(input)
    // day2(input)
    // day3(input)
    day4(input)
}

function day1 (lines: string[]): void {
    let totalDistance: number = 0
    let totalSimilarity: number = 0
    let leftList: number[] = []
    let rightList: number[] = []

    // Separa as linhas em direita e esquerda e inseri os valores no arrays
    lines.forEach((line: string): void => {
        let [left, right] = line.trim().split(/\s+/)
        leftList.push(parseInt(left))
        rightList.push(parseInt(right))
    })

    // Ordenação
    leftList.sort()
    rightList.sort()

    // Distância entre as coordenadas => |x1 - x2|
    leftList.map((value: number, index: number): void => {
        totalDistance += Math.abs(rightList[index] - value)
    })

    // Pontuação de Similaridade => |value * number of repetitions|
    leftList.map((value: number): void => {
        totalSimilarity += (rightList.filter((rightValue: number): boolean => rightValue === value).length) * value
    })

    console.log("Total distance: ", totalDistance)
    console.log("Total similarity: ", totalSimilarity)
}

function day2(lines: string[]): void {
        const safeReports: number[][] = lines
        .map((line: string): number[] => line.split(" ").map((num: string): number => parseInt(num, 10)))
        .filter((numList: number[]): any => {
            const diffs: number[] = numList.map((num: number, i: number): number => num - numList[i - 1])
            diffs.shift()
            return (
                diffs.every((d: number): boolean => d >= -3 && d < 0) || diffs.every((d: number): boolean => d <= 3 && d > 0)
            )
        })

    const safeReports2: number[][] = lines
        .map((line: string): number[] => line.split(" ").map((num: string): number => parseInt(num, 10)))
        .filter((numList: number[]): any => {
            const isSafeLine:(list: number[]) => boolean = (list: number[]): boolean => {
                const diffs: number[] = list.map((num: number, i: number): number => num - list[i -1])
                diffs.shift()
                return (
                    diffs.every((d: number): boolean => d >= -3 && d < 0) || diffs.every((d: number): boolean => d <= 3 && d > 0)
                )
            }

            if (isSafeLine(numList)) return true

            for (let i: number = 0; i < numList.length; i++) {
                const modifiedList: number[] = [...numList]
                modifiedList.splice(i, 1)
                if (isSafeLine(modifiedList)) return true
            }

            return false
        })

    console.log(safeReports.length)
    console.log(safeReports2.length)
}

function day3(lines: string[]): void{
    // Define o regex para encontrar os valores de x e y
    const regex: RegExp = /mul\((\d+),(\d+)\)/g
    let match: RegExpMatchArray | null
    let totalMul: number = 0

    // Itera sobre as linhas e encontra os valores de x e y
    lines.forEach((line: string): void => {
        while ((match = regex.exec(line))) {
            totalMul += parseInt(match[1]) * parseInt(match[2])
        }
    })

    let text: string = lines.join('\n').replace(/don't\(\)[\s\S]*?do\(\)/g, '');
    let totalMul2: number = 0;

    while ((match = regex.exec(text)) !== null) {
        totalMul2 += parseInt(match[1]) * parseInt(match[2]);
    }

    console.log(totalMul);
    console.log(totalMul2);
}

function day4(lines: string[]): void {
    const matrix: string[][] = lines.map((line: string): string[] => line.split(''))
    let XmasTotal: number = 0
    let MasTotal: number = 0

    const getChar: (x: number, y: number) => string = (x: number, y: number): string => matrix[y]?.[x] || ''

    const isXmasPattern: (x: number, y: number) => number = (x: number, y: number): number => {
        if (getChar(x, y) !== 'X') return 0

        const directions: number[][] = [
            [1,0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [-1, 1], [1, -1], [-1, -1]
        ]

        return directions.reduce((count: number, [dx, dy]: number[]): number => {
            const sequence: string = Array.from({ length: 4 }, (_: number, i: number): string => getChar(x + i * dx, y + i * dy)).join('')
            return count + (sequence === 'XMAS' ? 1 : 0)
        }, 0)
    }

    const isMasPattern: (x: number, y: number) => boolean = (x: number, y: number): boolean => {
        const diagonals: string[] = [
            getChar(x - 1, y - 1) + getChar(x, y) + getChar(x + 1, y + 1),
            getChar(x - 1, y + 1) + getChar(x, y) + getChar(x + 1, y - 1)
        ]
        return diagonals.every((diagonal: string): boolean => diagonal === 'MAS' || diagonal === 'SAM')
    }

    for (let y: number = 0; y < matrix.length; y++) {
        for (let x: number = 0; x < matrix[0].length; x++) {
            XmasTotal += isXmasPattern(x, y)
        }
    }

    for (let y: number = 1; y < matrix.length - 1; y++) {
        for (let x: number = 1; x < matrix[0].length - 1; x++) {
            if (isMasPattern(x, y)) MasTotal++
        }
    }

    console.log(XmasTotal)
    console.log(MasTotal)
}

function readInput(name: string): string[] {
    const input: string = readFileSync(`./${name}`, 'utf8')
    return input.split('\n')
}

main()