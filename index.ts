import { readFileSync } from 'fs'

function main(): void {
    const input: string[] = readInput('input.txt')

    // day1(input)
    // day2(input)
    // day3(input)
    // day4(input)
    day5(input)
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
    // Separa as linhas em arrays de números
    const safeReports: number[][] = lines
        .map((line: string): number[] => line.split(" ").map((num: string): number => parseInt(num, 10)))
        .filter((numList: number[]): any => {
            const diffs: number[] = numList.map((num: number, i: number): number => num - numList[i - 1])
            diffs.shift()
            return (
                diffs.every((d: number): boolean => d >= -3 && d < 0) || diffs.every((d: number): boolean => d <= 3 && d > 0)
            )
        })

    // Separa as linhas em arrays de números e verifica se a linha é segura
    const safeReports2: number[][] = lines
        .map((line: string): number[] => line.split(" ").map((num: string): number => parseInt(num, 10)))
        .filter((numList: number[]): any => {
            // Função para verificar se a linha é segura
            const isSafeLine:(list: number[]) => boolean = (list: number[]): boolean => {
                const diffs: number[] = list.map((num: number, i: number): number => num - list[i -1])
                diffs.shift()
                return (
                    diffs.every((d: number): boolean => d >= -3 && d < 0) || diffs.every((d: number): boolean => d <= 3 && d > 0)
                )
            }

            if (isSafeLine(numList)) return true

            // Remove um número da lista e verifica se a linha é segura
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

    // Remove os valores de x e y entre don't() e do()
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

    // Função para pegar o caractere da matriz
    const getChar: (x: number, y: number) => string = (x: number, y: number): string => matrix[y]?.[x] || ''

    // Função para verificar se a sequência 'XMAS' está presente
    const isXmasPattern: (x: number, y: number) => number = (x: number, y: number): number => {
        if (getChar(x, y) !== 'X') return 0

        // Direções possíveis (jogo do Mario) => [direita, esquerda, baixo, cima, diagonal direita baixo, diagonal esquerda baixo, diagonal direita cima, diagonal esquerda cima]
        const directions: number[][] = [
            [1,0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [-1, 1], [1, -1], [-1, -1]
        ]

        // Verifica se a sequência 'XMAS' está presente em todas as direções
        return directions.reduce((count: number, [dx, dy]: number[]): number => {
            const sequence: string = Array.from({ length: 4 }, (_: number, i: number): string => getChar(x + i * dx, y + i * dy)).join('')
            return count + (sequence === 'XMAS' ? 1 : 0)
        }, 0)
    }

    // Função para verificar se a sequência 'MAS' está presente
    const isMasPattern: (x: number, y: number) => boolean = (x: number, y: number): boolean => {
        // Verifica se a sequência 'MAS' está presente nas diagonais
        const diagonals: string[] = [
            getChar(x - 1, y - 1) + getChar(x, y) + getChar(x + 1, y + 1),
            getChar(x - 1, y + 1) + getChar(x, y) + getChar(x + 1, y - 1)
        ]
        return diagonals.every((diagonal: string): boolean => diagonal === 'MAS' || diagonal === 'SAM')
    }

    // Itera sobre a matriz e verifica se as sequências estão presentes
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

function day5(lines: string[]): void {
    let totalSumMiddleValidPages: number = 0
    let totalSumMiddleOrderPages: number = 0
    let rules: string[] = []
    let pages: string[] = []

    // Separa as regras de ordenação das páginas de atualizações
    lines.forEach((line: string): void => {
        line.includes('|') ? rules.push(line) : pages.push(line)
    })

    // Função para verificar se a página segue as regras
    const isValidPageOrder: (page: string) => boolean = (page: string): boolean => {
        const pageArray: number[] = page.split(',').map(Number)

        return rules.every((rule: string): boolean => {
            const [left, right] = rule.split('|').map(Number)
            const leftIndex: number = pageArray.indexOf(left)
            const rightIndex: number = pageArray.indexOf(right)

            // A regra é valida se:
            // - Ambos os números não existirem
            // - Apenas um deles existir
            // - 'left' vier antes de 'right'
            return leftIndex === -1 || rightIndex === -1 || leftIndex < rightIndex
        })
    }

    const sortPage: (page: string) => string = (page: string): string => {
        const pageArray: number[] = page.split(',').map(Number)

        return pageArray.sort((a: number, b:number): 1 | -1 | 0 => {
            for (const rule of rules) {
                const [left, right] = rule.split('|').map(Number)
                if (a === left && b === right) return -1
                if (a === right && b === left) return 1
            }
            return 0
        })
        .join(',')
    }

    // Filtra as páginas válidas
    const validPages: string[] = pages.filter(isValidPageOrder)
    const invalidPages: string[] = pages.filter((page: string): boolean => !isValidPageOrder(page))
    const correctedPages: string[] = invalidPages.map(sortPage)

    // Calcula a soma das páginas centrais após as atualizações válidas
    totalSumMiddleValidPages = validPages
        .map((page: string): number => {
            const pageArray: number[] = page.split(',').map(Number)
            const middleIndex: number = Math.floor(pageArray.length / 2)
            return pageArray[middleIndex]
        })
        .reduce((a: number, b: number): number => a + b, 0)

    totalSumMiddleOrderPages = correctedPages
        .map((page: string): number => {
            const pageArray: number[] = page.split(',').map(Number)
            const middleIndex: number = Math.floor(pageArray.length / 2)
            return pageArray[middleIndex]
        })
        .reduce((a: number, b: number): number => a + b, 0)

    console.log(totalSumMiddleValidPages);
    console.log(totalSumMiddleOrderPages);
}

function readInput(name: string): string[] {
    const input: string = readFileSync(`./${name}`, 'utf8')
    return input.split('\n')
}

main()