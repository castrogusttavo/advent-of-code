import { readFileSync } from 'fs'

function main(): void {
    const input: string[] = readInput('input.txt')
    day1(input)
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

function readInput(name: string): string[] {
    const input: string = readFileSync(`./${name}`, 'utf8')
    return input.split('\n')
}

main()