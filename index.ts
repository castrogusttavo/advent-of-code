import { readFileSync } from 'fs'

function main(): void {
    const input: string[] = readInput('input.txt')

    // day1(input)
    // day2(input)
    // day3(input)
    // day4(input)
    // day5(input)
    // day6(input)
    // day7(input)
    day8(input)
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

function day6(lines: string[]): void {
    let map: string[][] = lines.map((line: string): string[] => line.split(''))
    let directions: string[] = ['^', '>', 'v', '<'] // Representação das direções (cima, direita, baixo, esquerda)
    let dx: number[] = [0, 1, 0, -1] // Deslocamento em x para cada direção
    let dy: number[] = [-1, 0, 1, 0] // Deslocamento em y para cada direção
    let x: number = 0, y: number = 0, dirIndex: number = 0

    // Encontrar a posição e direção inicial do guarda
    for (let i: number = 0; i < map.length; i++) {
        for (let j: number = 0; j < map[i].length; j++) {
            if (directions.includes(map[i][j])) {
                x = j
                y = i
                dirIndex = directions.indexOf(map[i][j])
                break
            }
        }
    }

    // Simular o movimento do guarda e obter as posições visitadas
    let visitedPositions: Set<string> = new Set<string>()
    let currentX: number = x
    let currentY: number = y
    let currentDir: number = dirIndex

    while (true) {
        let state: string = `${currentX},${currentY}`
        visitedPositions.add(state)

        let nextX: number = currentX + dx[currentDir]
        let nextY: number = currentY + dy[currentDir]

        // Verificar se o guarda está fora do mapa
        if (nextY < 0 || nextY >= map.length || nextX < 0 || nextX >= map[0].length) {
            break
        }

        // Verificar a próxima célula
        if (map[nextY][nextX] === '#') {
            // Virar à direita
            currentDir = (currentDir + 1) % 4
        } else {
            // Andar para frente
            currentX = nextX
            currentY = nextY
        }
    }

    // Verificar quantos obstáculos são necessários inserir para que o guarda fique em loop
    let obstacles: number = 0

    const simulateGuardWithObstruction: (obstructionX: number, obstructionY: number) => boolean = (obstructionX: number, obstructionY: number): boolean => {
        let visited: Set<string> = new Set<string>()
        let tempX: number = x
        let tempY: number = y
        let tempDir: number = dirIndex

        // Adicionar obstrução temporária
        map[obstructionY][obstructionX] = '#'

        while (true) {
            let state: string = `${tempX}, ${tempY}, ${tempDir}`
            if (visited.has(state)) {
                // O guarda revisitou a mesma posição/direção -> ciclo detectado
                map[obstructionY][obstructionX] = '.'
                return true
            }
            visited.add(state)

            let nextX: number = tempX + dx[tempDir]
            let nextY: number = tempY + dy[tempDir]

            if (nextY < 0 || nextY >= map.length || nextX < 0 || nextX >= map[0].length) {
                // O guarda saiu do mapa
                map[obstructionY][obstructionX] = '.'
                return false
            }

            if (map[nextY][nextX] === '#') {
                // Obstrução encontrada, vire à direita
                tempDir = (tempDir + 1) % 4
            } else {
                // Avance na direção atual
                tempX = nextX
                tempY = nextY
            }
        }
    }

    for (let i: number = 0; i < map.length; i++) {
        for (let j: number = 0; j < map[i].length; j++) {
            if (map[i][j] === '.' && !(i === y && j === x)) {
                // Testar obstrução nessa posição
                if (simulateGuardWithObstruction(j, i)) {
                    obstacles++
                }
            }
        }
    }

    console.log(visitedPositions.size)
    console.log(obstacles)
}

function day7(lines: string[]): void {
    const equations: { target: number, values: number[] }[] = lines.map((line: string): {
        target: number,
        values: number[]
    } => {
        const [left, right] = line.split(": ");
        return {target: parseInt(left), values: right.split(" ").map(Number)};
    })
    let totalCorrectEquations: number = 0
    let totalCalibrateEquations: number = 0

    // Função para avaliar a expressão
    const evaluateExpression: (values: number[], operator: string[]) => number = (values: number[], operators: string[]): number => {
        let result: number = values[0]

        // Avalia a expressão com base nos operadores
        for (let i: number = 0; i < operators.length; i++) {
            if (operators[i] === '+') {
                result += values[i + 1]
            } else if (operators[i] === '*') {
                result *= values[i + 1]
            } else if (operators[i] === '||') {
                result = parseInt(result.toString() + values[i + 1].toString())
            }
        }
        return result
    }

    // Função para encontrar os operadores válidos
    const findValidOperators: (target: number, values: number[], possibleOperators: string[] ) => boolean = (target: number, values: number[], possibleOperators: string[]): boolean => {
        const operatorCount: number = values.length - 1;
        const allowedOperators: number = possibleOperators.length;

        // Tenta todas as combinações possíveis de operadores
        for (let i: number = 0; i < Math.pow(allowedOperators, operatorCount); i++) {
            const operators: string[] = []
            let n: number = i

            // Converte o número para a base 'allowedOperators'
            for (let j: number = 0; j < operatorCount; j++) {
                operators.push(possibleOperators[n % allowedOperators])
                n = Math.floor(n / allowedOperators)
            }

            const result: number = evaluateExpression(values, operators)
            if (result === target) {
                return true
            }
        }

        return false
    }

    // Filtra as equações válidas
    const validEquations: { target: number, values: number[] }[] = equations.filter((equation: { target: number, values: number[] }): boolean => {
        return findValidOperators(equation.target, equation.values, ['+', '*'])
    })

    totalCorrectEquations = validEquations.reduce((acc: number, curr: { target: number, values: number[] }): number => acc + curr.target, 0)

    // Filtra as equações válidas com o operador '||'
    const calibrateEquations: { target: number, values: number[] }[] = equations.filter((equation: { target: number, values: number[] }): boolean => {
        return findValidOperators(equation.target, equation.values, ['+', '*', '||'])
    })

    totalCalibrateEquations = calibrateEquations.reduce((acc: number, curr: { target: number, values: number[] }): number => acc + curr.target, 0)

    console.log(totalCorrectEquations)
    console.log(totalCalibrateEquations)
}

function day8(lines: string[]): void {
// Função para encontrar todas as antenas no mapa
    function findAntennas(map: string[]): { x: number; y: number; freq: string }[] {
        const antennas = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const char = map[y][x];
                if (char !== ".") {
                    antennas.push({ x, y, freq: char });
                }
            }
        }
        return antennas;
    }

    // Função para calcular o MDC
    function gcd(a: number, b: number): number {
        return b === 0 ? Math.abs(a) : gcd(b, a % b);
    }

    // Função para calcular os antinodos
    function calculateAntinodes(map: string[]): number {
        // Remover caracteres \r das linhas, caso existam
        const cleanMap = map.map((line) => line.replace(/\r/g, ""));

        const antennas = findAntennas(cleanMap);
        const antinodes = new Set<string>();

        // Para cada par de antenas com a mesma frequência
        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const a1 = antennas[i];
                const a2 = antennas[j];

                if (a1.freq === a2.freq) {
                    // Calcular a distância entre as antenas
                    const dx = a2.x - a1.x;
                    const dy = a2.y - a1.y;

                    // Verificar se existe uma relação de 2:1 nas distâncias
                    const antinode1X = a1.x - dx;
                    const antinode1Y = a1.y - dy;
                    const antinode2X = a2.x + dx;
                    const antinode2Y = a2.y + dy;

                    // Adicionar as coordenadas válidas
                    antinodes.add(`${antinode1X},${antinode1Y}`);
                    antinodes.add(`${antinode2X},${antinode2Y}`);
                }
            }
        }

        // Filtro para manter os antinodos dentro dos limites do mapa
        const uniqueAntinodes = Array.from(antinodes).filter((coord) => {
            const [x, y] = coord.split(",").map(Number);
            return x >= 0 && x < cleanMap[0].length && y >= 0 && y < cleanMap.length;
        });

        return uniqueAntinodes.length;
    }

    // Função para calcular os antinodos único
    function calculateUniqueAntinodes(map: string[]): number {
        const cleanMap = map.map((line) => line.replace(/\r/g, ""));
        const antennas = findAntennas(cleanMap);
        const antinodes = new Set<string>();
        const rows = cleanMap.length;
        const cols = cleanMap[0].length;

        // Para cada par de antenas com a mesma frequência
        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const a1 = antennas[i];
                const a2 = antennas[j];

                if (a1.freq === a2.freq) {
                    let dx = a2.x - a1.x;
                    let dy = a2.y - a1.y;
                    const g = gcd(dx, dy);
                    dx /= g;
                    dy /= g;

                    // Fixar direção para unicidade
                    if (dx < 0 || (dx === 0 && dy < 0)) {
                        dx = -dx;
                        dy = -dy;
                    }

                    // Forma normal da linha: dx*y - dy*x = K
                    const K = dx * a1.y - dy * a1.x;
                    const lineKey = `${dx},${dy},${K}`;

                    // Gerar os antinodos ao longo da linha
                    function rangeForDimension(pos: number, d: number, limit: number): [number, number] {
                        if (d === 0) {
                            if (pos < 0 || pos >= limit) return [1, -1];
                            return [-Infinity, Infinity];
                        } else if (d > 0) {
                            const minM = Math.ceil(-pos / d);
                            const maxM = Math.floor((limit - 1 - pos) / d);
                            return [minM, maxM];
                        } else {
                            const minM = Math.ceil((limit - 1 - pos) / d);
                            const maxM = Math.floor(-pos / d);
                            return [minM, maxM];
                        }
                    }

                    const [minMx, maxMx] = rangeForDimension(a1.x, dx, cols);
                    const [minMy, maxMy] = rangeForDimension(a1.y, dy, rows);
                    const minM = Math.max(minMx, minMy);
                    const maxM = Math.min(maxMx, maxMy);

                    if (minM <= maxM) {
                        for (let m = minM; m <= maxM; m++) {
                            const x = a1.x + m * dx;
                            const y = a1.y + m * dy;
                            antinodes.add(`${x},${y}`);
                        }
                    }
                }
            }
        }

        // Filtrar antinodos dentro dos limites do mapa
        const uniqueAntinodes = Array.from(antinodes).filter((coord) => {
            const [x, y] = coord.split(",").map(Number);
            return x >= 0 && x < cols && y >= 0 && y < rows;
        });

        return uniqueAntinodes.length;
    }

    const totalAntinodes = calculateAntinodes(lines);
    const uniqueAntinodes = calculateUniqueAntinodes(lines);

    console.log(totalAntinodes);
    console.log(uniqueAntinodes)
}


function readInput(name: string): string[] {
    const input: string = readFileSync(`./${name}`, 'utf8')
    return input.split('\n')
}

main()