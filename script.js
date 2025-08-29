/* ============================================================================
   CONFIGURAÇÕES DO JOGO
   ============================================================================ */
const GAME_CONFIG = {
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    maxNumber: 18,
    minNumber: 4,
    feedbackDuration: 3000,
    animationDuration: 800,
    clickAreas: {
        planet: { x: [30, 170], y: [30, 170] },
        sun: { x: [580, 780], y: [20, 140] },
        'rocket-top': { x: [120, 320], y: [150, 235] },
        'rocket-window': { x: [190, 270], y: [235, 285] },
        'rocket-bottom': { x: [120, 320], y: [285, 375] },
        'rocket-flame': { x: [165, 275], y: [372, 435] },
        'astronaut-head': { x: [480, 580], y: [200, 290] },
        'astronaut-torso': { x: [480, 580], y: [290, 375] },
        'astronaut-legs': { x: [480, 580], y: [360, 445] }
    },
    areaNames: {
        'planet': 'planeta',
        'sun': 'sol',
        'rocket-top': 'topo do foguete',
        'rocket-window': 'janela do foguete',
        'rocket-bottom': 'base do foguete',
        'rocket-flame': 'chamas do foguete',
        'astronaut-head': 'cabeça do astronauta',
        'astronaut-torso': 'torso do astronauta',
        'astronaut-legs': 'pernas do astronauta'
    }
};

/* ============================================================================
   UTILITÁRIOS PARA RESPONSIVIDADE - OTIMIZADOS
   ============================================================================ */
class ResponsiveUtils {
    static isMobile() {
        return window.innerWidth <= 767;
    }
    
    static isTablet() {
        return window.innerWidth > 767 && window.innerWidth <= 1199;
    }
    
    static isDesktop() {
        return window.innerWidth >= 1200;
    }
    
    static getScreenSize() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }
    
    static getTextScale() {
        const screenSize = this.getScreenSize();
        const scales = {
            'mobile': 0.7,
            'tablet': 0.85,
            'desktop': 1.0
        };
        return scales[screenSize] || 1.0;
    }
    
    // Debounce otimizado com throttle para melhor performance
    static debounce(func, wait) {
        let timeout;
        let lastCall = 0;
        return function executedFunction(...args) {
            const now = Date.now();
            if (now - lastCall < wait) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    lastCall = now;
                    func(...args);
                }, wait);
            } else {
                lastCall = now;
                func(...args);
            }
        };
    }
}

/* ============================================================================
   CLASSE PARA GERENCIAR O ESTADO DO JOGO
   ============================================================================ */
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.calculations = {
            planet: 0,
            sun: 0,
            rocketTop: 0,
            rocketWindow: 0,
            rocketBottom: 0,
            rocketFlame: 0,
            astronautHead: 0,
            astronautTorso: 0,
            astronautLegs: 0
        };
        this.selectedColor = null;
        this.selectedNumber = null;
        this.gameNumbers = [];
        this.paintedAreas = new Set();
        this.usedNumbers = new Set();
        this.difficulty = 'facil';
        // Novo: rastrear quantas áreas cada número pode pintar
        this.numberAreaCount = new Map();
        // Novo: rastrear quantas áreas cada número já pintou
        this.numberPaintedCount = new Map();
    }

    setCalculation(area, value) {
        this.calculations[area] = value;
    }

    getCalculation(area) {
        return this.calculations[area];
    }

    setSelectedColor(color) {
        this.selectedColor = color;
    }

    getSelectedColor() {
        return this.selectedColor;
    }

    setSelectedNumber(number) {
        this.selectedNumber = number;
    }

    getSelectedNumber() {
        return this.selectedNumber;
    }

    setGameNumbers(numbers) {
        this.gameNumbers = numbers;
        // Novo: calcular quantas áreas cada número pode pintar
        this.calculateNumberAreaCount();
    }

    getGameNumbers() {
        return this.gameNumbers;
    }

    addPaintedArea(area) {
        this.paintedAreas.add(area);
        // Novo: incrementar contador de áreas pintadas para o número usado
        // Usar o mapeamento correto de áreas
        const areaMapping = {
            'planet': 'planet',
            'sun': 'sun',
            'rocket-top': 'rocketTop',
            'rocket-window': 'rocketWindow',
            'rocket-bottom': 'rocketBottom',
            'rocket-flame': 'rocketFlame',
            'astronaut-head': 'astronautHead',
            'astronaut-torso': 'astronautTorso',
            'astronaut-legs': 'astronautLegs'
        };
        const mappedArea = areaMapping[area];
        if (mappedArea) {
            const areaNumber = this.getCalculation(mappedArea);
            if (areaNumber) {
                const currentCount = this.numberPaintedCount.get(areaNumber) || 0;
                const newCount = currentCount + 1;
                this.numberPaintedCount.set(areaNumber, newCount);
            }
        }
    }

    isPainted(area) {
        return this.paintedAreas.has(area);
    }

    addUsedNumber(number) {
        this.usedNumbers.add(number);
    }

    isNumberUsed(number) {
        return this.usedNumbers.has(number);
    }

    isGameComplete() {
        return this.paintedAreas.size === 9;
    }

    setDifficulty(level) {
        this.difficulty = level;
    }

    getDifficulty() {
        return this.difficulty;
    }

    // Novo: calcular quantas áreas cada número pode pintar
    calculateNumberAreaCount() {
        this.numberAreaCount.clear();
        this.numberPaintedCount.clear();
        
        // Contar quantas áreas cada número pode pintar
        // Usar os nomes corretos das áreas que são definidos no MathManager
        const areaNames = ['planet', 'sun', 'rocketTop', 'rocketWindow', 'rocketBottom', 'rocketFlame', 'astronautHead', 'astronautTorso', 'astronautLegs'];
        
        areaNames.forEach(areaName => {
            const number = this.getCalculation(areaName);
            if (number) {
                const currentCount = this.numberAreaCount.get(number) || 0;
                const newCount = currentCount + 1;
                this.numberAreaCount.set(number, newCount);
                // Inicializar contador de áreas pintadas
                this.numberPaintedCount.set(number, 0);
            }
        });
    }

    // Novo: verificar se um número está completo (todas as áreas pintadas)
    isNumberComplete(number) {
        const totalAreas = this.numberAreaCount.get(number) || 0;
        const paintedAreas = this.numberPaintedCount.get(number) || 0;
        // Um número está completo quando todas as áreas que ele pode pintar foram pintadas
        return totalAreas > 0 && paintedAreas >= totalAreas;
    }

    // Novo: obter todos os números completos
    getCompletedNumbers() {
        const completed = [];
        this.numberAreaCount.forEach((totalAreas, number) => {
            if (this.isNumberComplete(number)) {
                completed.push(number);
            }
        });
        return completed;
    }
}

/* ============================================================================
   CLASSE PARA GERENCIAR A INTERFACE DO USUÁRIO
   ============================================================================ */
class UIManager {
    /* ===== FEEDBACK E MENSAGENS ===== */
    static showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type} show`;

        setTimeout(() => {
            feedback.classList.remove('show');
        }, GAME_CONFIG.feedbackDuration);
    }

    /* ===== GERENCIAMENTO DOS TEXTOS DE CÁLCULO ===== */
    static updateCalculationText(area, text) {
        const elementId = this.getCalculationTextId(area);
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            this.adjustTextPosition(element, area);
            // Tornar a box de cálculo interativa
            this.makeCalculationBoxInteractive(element, area);
        }
    }

    static adjustTextPosition(element, area) {
        const screenSize = ResponsiveUtils.getScreenSize();
        const scale = ResponsiveUtils.getTextScale();
        
        // Ajustar tamanho da fonte baseado no dispositivo
        const baseSizes = {
            'planet': 16,
            'sun': 14,
            'rocket-top': 12,
            'rocket-window': 12,
            'rocket-bottom': 12,
            'rocket-flame': 12,
            'astronaut-head': 13,
            'astronaut-torso': 12,
            'astronaut-legs': 12
        };
        
        const baseSize = baseSizes[area] || 12;
        const adjustedSize = Math.max(8, Math.floor(baseSize * scale));
        element.style.fontSize = `${adjustedSize}px`;
        
        // Ajustar padding baseado no tamanho da fonte
        const padding = Math.max(2, Math.floor(4 * scale));
        element.style.padding = `${padding}px ${padding * 2}px`;
    }

    static hideCalculationText(area) {
        const elementId = this.getCalculationTextId(area);
        const element = document.getElementById(elementId);
        if (element) {
            // Usar transição suave para esconder a caixa de cálculo
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            
            // Remover completamente após a transição
            setTimeout(() => {
                element.classList.add('hidden');
            }, 300);
        }
        
        // Esconder também a linha correspondente
        this.hideCalculationLine(area);
    }
    
    static hideCalculationLine(area) {
        const lineMapping = {
            planet: 'planet-calc-line',
            sun: 'sun-calc-line',
            rocketTop: 'rocket-top-calc-line',
            rocketWindow: 'rocket-window-calc-line',
            rocketBottom: 'rocket-bottom-calc-line',
            rocketFlame: 'rocket-flame-calc-line',
            astronautHead: 'astronaut-head-calc-line',
            astronautTorso: 'astronaut-torso-calc-line',
            astronautLegs: 'astronaut-legs-calc-line'
        };
        
        const lineClass = lineMapping[area];
        if (lineClass) {
            const lineElement = document.querySelector(`.${lineClass}`);
            if (lineElement) {
                // Usar transição suave para esconder a linha
                lineElement.style.opacity = '0';
                lineElement.style.transform = 'scale(0.8)';
                
                // Remover completamente após a transição
                setTimeout(() => {
                    lineElement.style.display = 'none';
                }, 300);
            }
        }
    }

    static showAllCalculationTexts() {
        const textElements = document.querySelectorAll('.sum-text');
        textElements.forEach(element => {
            // Ajustar posição baseado no dispositivo atual
            const area = this.getElementArea(element);
            if (area) {
                // Verificar se a área já foi pintada
                const areaMapping = {
                    'planet': 'planet',
                    'sun': 'sun',
                    'rocket-top': 'rocketTop',
                    'rocket-window': 'rocketWindow',
                    'rocket-bottom': 'rocketBottom',
                    'rocket-flame': 'rocketFlame',
                    'astronaut-head': 'astronautHead',
                    'astronaut-torso': 'astronautTorso',
                    'astronaut-legs': 'astronautLegs'
                };
                const mappedArea = areaMapping[area];
                
                // Se a área foi pintada, manter escondida
                if (gameController && gameController.gameState && gameController.gameState.isPainted(area)) {
                    element.classList.add('hidden');
                    element.style.opacity = '0';
                    element.style.transform = 'scale(0.8)';
                } else {
                    // Resetar todas as propriedades de transição para áreas não pintadas
                    element.classList.remove('hidden');
                    element.style.opacity = '';
                    element.style.transform = '';
                    
                    // Limpar estados visuais de drag/drop
                    element.classList.remove('drag-over-calc', 'drop-success-calc');
                    
                    // Ajustar posição
                    this.adjustTextPosition(element, area);
                    // Garantir que a box seja interativa
                    this.makeCalculationBoxInteractive(element, area);
                }
            }
        });
        
        // Mostrar apenas as linhas de áreas não pintadas
        this.showAllCalculationLines();
    }
    
    static getElementArea(element) {
        const classList = element.className;
        if (classList.includes('planet-calc')) return 'planet';
        if (classList.includes('sun-calc')) return 'sun';
        if (classList.includes('rocket-top-calc')) return 'rocket-top';
        if (classList.includes('rocket-window-calc')) return 'rocket-window';
        if (classList.includes('rocket-bottom-calc')) return 'rocket-bottom';
        if (classList.includes('rocket-flame-calc')) return 'rocket-flame';
        if (classList.includes('astronaut-head-calc')) return 'astronaut-head';
        if (classList.includes('astronaut-torso-calc')) return 'astronaut-torso';
        if (classList.includes('astronaut-legs-calc')) return 'astronaut-legs';
        return null;
    }
    
    static showAllCalculationLines() {
        const lineMapping = {
            'planet-calc-line': 'planet',
            'sun-calc-line': 'sun',
            'rocket-top-calc-line': 'rocket-top',
            'rocket-window-calc-line': 'rocket-window',
            'rocket-bottom-calc-line': 'rocket-bottom',
            'rocket-flame-calc-line': 'rocket-flame',
            'astronaut-head-calc-line': 'astronaut-head',
            'astronaut-torso-calc-line': 'astronaut-torso',
            'astronaut-legs-calc-line': 'astronaut-legs'
        };
        
        Object.entries(lineMapping).forEach(([lineClass, area]) => {
            const lineElement = document.querySelector(`.${lineClass}`);
            if (lineElement) {
                // Verificar se a área foi pintada
                if (gameController && gameController.gameState && gameController.gameState.isPainted(area)) {
                    // Manter linha escondida se a área foi pintada
                    lineElement.style.display = 'none';
                    lineElement.style.opacity = '0';
                    lineElement.style.transform = 'scale(0.8)';
                } else {
                    // Resetar todas as propriedades de transição para áreas não pintadas
                    lineElement.style.display = '';
                    lineElement.style.opacity = '';
                    lineElement.style.transform = '';
                }
            }
        });
    }

    static getCalculationTextId(area) {
        const mapping = {
            planet: 'planetSumText',
            sun: 'sunSumText',
            rocketTop: 'rocketTopSumText',
            rocketWindow: 'rocketWindowSumText',
            rocketBottom: 'rocketBottomSumText',
            rocketFlame: 'rocketFlameSumText',
            astronautHead: 'astronautHeadSumText',
            astronautTorso: 'astronautTorsoSumText',
            astronautLegs: 'astronautLegsSumText'
        };
        return mapping[area];
    }

    static makeCalculationBoxInteractive(element, area) {
        // Remover eventos anteriores para evitar duplicação
        if (element._clickHandler) {
            element.removeEventListener('click', element._clickHandler);
            element.removeEventListener('dragover', element._dragoverHandler);
            element.removeEventListener('dragleave', element._dragleaveHandler);
            element.removeEventListener('drop', element._dropHandler);
            if (element._touchHandler) {
                element.removeEventListener('touchstart', element._touchHandler);
            }
        }
        
        // Tornar clicável
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'pointer';
        
        // Adicionar classe para estilização
        element.classList.add('interactive-calc');
        
        // Handler de clique otimizado
        element._clickHandler = (e) => {
            e.stopPropagation();
            if (!gameController || !gameController.gameState) {
                return;
            }
            
            const selectedColor = gameController.gameState.getSelectedColor();
            
            if (!selectedColor) {
                UIManager.showFeedback('🎨 Primeiro escolha uma cor!', 'error');
                return;
            }
            
            if (gameController.gameState.isPainted(area)) {
                UIManager.showFeedback('🖌️ Esta área já foi pintada!', 'error');
                return;
            }
            
            gameController.processAreaClick(area, selectedColor);
        };
        
        // Handler de dragover otimizado
        element._dragoverHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.classList.add('drag-over-calc');
            
            const rocket = document.getElementById('rocket');
            if (rocket) {
                rocket.classList.remove('drag-over');
            }
        };
        
        // Handler de dragleave otimizado
        element._dragleaveHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const rect = element.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                element.classList.remove('drag-over-calc');
                
                const rocket = document.getElementById('rocket');
                if (rocket) {
                    const rocketRect = rocket.getBoundingClientRect();
                    if (x >= rocketRect.left && x <= rocketRect.right && 
                        y >= rocketRect.top && y <= rocketRect.bottom) {
                        rocket.classList.add('drag-over');
                    }
                }
            }
        };
        
        // Handler de drop otimizado
        element._dropHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.classList.remove('drag-over-calc');
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                
                if (!gameController || !gameController.gameState) {
                    return;
                }
                
                if (gameController.gameState.isPainted(area)) {
                    UIManager.showFeedback('🖌️ Esta área já foi pintada!', 'error');
                    return;
                }
                
                gameController.handleDragAndDrop(area, data.color, data.number);
                
                // Feedback visual otimizado
                element.classList.add('drop-success-calc');
                setTimeout(() => {
                    element.classList.remove('drop-success-calc');
                }, 200); // Reduzido de 300ms para 200ms
                
            } catch (error) {
                console.error('Erro ao processar drop na box de cálculo:', error);
            }
        };
        
        // Adicionar eventos
        element.addEventListener('click', element._clickHandler);
        element.addEventListener('dragover', element._dragoverHandler);
        element.addEventListener('dragleave', element._dragleaveHandler);
        element.addEventListener('drop', element._dropHandler);
        
        // Suporte para dispositivos móveis otimizado
        if (ResponsiveUtils.isMobile()) {
            element._touchHandler = (e) => {
                e.preventDefault();
                element._clickHandler(e);
            };
            element.addEventListener('touchstart', element._touchHandler, { passive: false });
        }
    }

    /* ===== GERENCIAMENTO DAS OPÇÕES DE COR ===== */
    static createColorOptions(gameNumbers, colors) {
        const container = document.getElementById('colorOptions');
        container.innerHTML = '';

        gameNumbers.forEach((number, index) => {
            const option = document.createElement('div');
            option.className = 'color-option';
            option.draggable = true; // Tornar arrastável
            option.dataset.number = number;
            option.dataset.color = colors[index];
            
            // Restaurar o clique nas cores
            option.onclick = () => {
                if (gameController) {
                    gameController.selectColor(option, colors[index], number);
                }
            };
            
            // Usar touchstart para melhor resposta em dispositivos móveis
            if (ResponsiveUtils.isMobile()) {
                option.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (gameController) {
                        gameController.selectColor(option, colors[index], number);
                    }
                });
            }

            option.innerHTML = `
                <span class="number">${number}</span>
                <div class="color-circle" style="background-color: ${colors[index]}"></div>
            `;

            container.appendChild(option);
        });
    }

    static clearColorSelection() {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }

    static selectColorOption(element) {
        this.clearColorSelection();
        element.classList.add('selected');
    }

    static markColorAsUsed(number) {
        const options = document.querySelectorAll('.color-option');
        options.forEach(option => {
            const optionNumber = parseInt(option.querySelector('.number').textContent);
            if (optionNumber === number) {
                option.classList.add('used');
                
                // Novo: verificar se o número está completo e aplicar estilo verde
                if (gameController && gameController.gameState && gameController.gameState.isNumberComplete(number)) {
                    option.classList.add('completed');
                }
            }
        });
    }

    static resetColorOptions() {
        document.querySelectorAll('.color-option').forEach(option => {
            option.style.opacity = '1';
            option.style.pointerEvents = 'auto';
            option.classList.remove('selected', 'used', 'completed');
        });
    }

    /* ===== ANIMAÇÕES E EFEITOS VISUAIS ===== */
    static addSuccessAnimation() {
        const rocket = document.getElementById('rocket');
        rocket.classList.add('success');
        setTimeout(() => rocket.classList.remove('success'), GAME_CONFIG.animationDuration);
    }

    static updateColorOptionsState() {
        if (!gameController || !gameController.gameState) {
            return; // Sair se gameController não estiver disponível
        }
        
        const options = document.querySelectorAll('.color-option');
        options.forEach(option => {
            const optionNumber = parseInt(option.querySelector('.number').textContent);
            
            // Remover classes anteriores
            option.classList.remove('used', 'completed');
            
            // Verificar se o número foi usado
            if (gameController.gameState.isNumberUsed(optionNumber)) {
                option.classList.add('used');
                
                // Verificar se está completo
                if (gameController.gameState.isNumberComplete(optionNumber)) {
                    option.classList.add('completed');
                }
            }
        });
    }
}

/* ============================================================================
   CLASSE PARA GERENCIAR AS CORES DOS ELEMENTOS
   ============================================================================ */
class ColorManager {
    static updateElementColor(elementType, color) {
        const svg = document.querySelector('.rocket svg');
        const elements = this.getElementsForType(svg, elementType);
        
        // Aplicar cor usando requestAnimationFrame para melhor performance
        requestAnimationFrame(() => {
            elements.forEach(el => {
                if (el.getAttribute('fill') !== 'black' && 
                    el.getAttribute('fill') !== '#FFFFFF' && 
                    el.getAttribute('fill') !== '#333333' &&
                    el.getAttribute('fill') !== '#666666' &&
                    el.getAttribute('fill') !== '#555555' &&
                    el.getAttribute('fill') !== '#777777') {
                    el.style.fill = color;
                }
                
                // Para o sol, também colorir os raios (fill)
                if (elementType === 'sun' && (el.classList.contains('sun-rays') || el.classList.contains('sun-main'))) {
                    el.style.fill = color;
                }
                
                // Para o planeta, colorir o contorno também
                if (elementType === 'planet' && (el.classList.contains('planet-main') || el.classList.contains('planet-crater'))) {
                    el.style.stroke = color;
                }
            });
        });

        // Efeitos de sombreamento simplificados para melhor performance
        requestAnimationFrame(() => {
            if (elementType === 'planet') {
                const glowOuter = svg.querySelectorAll('.planet-glow-outer');
                const glowInner = svg.querySelectorAll('.planet-glow-inner');
                const highlights = svg.querySelectorAll('.planet-highlight');

                glowOuter.forEach(g => { g.style.opacity = '0.15'; });
                glowInner.forEach(g => { g.style.opacity = '0.25'; });
                highlights.forEach((h, idx) => {
                    const values = ['0.35', '0.25', '0.18', '0.18'];
                    h.style.opacity = values[idx % values.length];
                });
            }

            if (elementType === 'sun') {
                const sunGlows = svg.querySelectorAll('.sun-glow');
                sunGlows.forEach((g, idx) => {
                    g.style.opacity = idx === 0 ? '0.9' : '0.65';
                });
            }

            if (elementType === 'rocket-top') {
                const shading = svg.querySelectorAll('.rocket-top-shading');
                shading.forEach(s => { s.style.opacity = '0.6'; });
            }

            if (elementType === 'astronaut-head') {
                const headHighlights = svg.querySelectorAll('.astronaut-head[fill="#FFFFFF"]');
                headHighlights.forEach((h, idx) => {
                    const target = idx < 2 ? '0.7' : '0.5';
                    h.style.opacity = target;
                });
            }

            if (elementType === 'rocket-window') {
                const windowHighlights = svg.querySelectorAll('.rocket-window[fill="#FFFFFF"]');
                windowHighlights.forEach((h, idx) => {
                    const target = idx === 0 ? '0.8' : '0.6';
                    h.style.opacity = target;
                });
            }
        });
    }

    static getElementsForType(svg, elementType) {
        const selectors = {
            'planet': '.planet-main, .planet-crater',
            'sun': '.sun-main, .sun-rays, .sun-glow',
            'rocket-top': '.rocket-top',
            'rocket-window': '.rocket-window',
            'rocket-bottom': '.rocket-bottom',
            'rocket-flame': '.rocket-flames',
            'astronaut-head': '.astronaut-head',
            'astronaut-torso': '.astronaut-torso',
            'astronaut-legs': '.astronaut-legs'
        };

        return svg.querySelectorAll(selectors[elementType] || '');
    }

    static resetColors() {
        const svg = document.querySelector('.rocket svg');
        const elements = svg.querySelectorAll('rect, polygon, circle, ellipse, path, g');
        
        elements.forEach(el => {
            // Resetar fill personalizado
            if (el.style.fill) {
                el.style.fill = '';
            }
            
            // Resetar stroke personalizado - CORREÇÃO PRINCIPAL
            if (el.style.stroke) {
                el.style.stroke = '';
            }

            // Resetar opacidade ajustada via estilo inline
            if (el.style.opacity) {
                el.style.opacity = '';
            }

            // Resetar filtro (drop-shadow) se aplicado
            if (el.style.filter) {
                el.style.filter = '';
            }
        });
        
        const rocket = document.getElementById('rocket');
        rocket.classList.remove('painted', 'success', 'drag-over', 'drop-success');
    }

    static generateRandomColors(count) {
        const colors = [];
        const baseHue = Math.floor(Math.random() * 360);
        for (let i = 0; i < count; i++) {
            const hueStep = 360 / count;
            const hueJitter = (Math.random() * 20) - 10;
            const hue = Math.round((baseHue + i * hueStep + hueJitter + 360) % 360);
            const saturation = 70 + Math.floor(Math.random() * 16);
            const lightness = 50 + Math.floor(Math.random() * 11);
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        return colors;
    }
}

/* ============================================================================
   CLASSE PARA GERENCIAR OS CÁLCULOS MATEMÁTICOS
   ============================================================================ */
class MathManager {
    static getRandomNumber(min = GAME_CONFIG.minNumber, max = GAME_CONFIG.maxNumber) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateCalculation(targetResult = null, operation = '+') {
        if (targetResult !== null) {
            switch (operation) {
                case '+': {
                    const num1 = this.getRandomNumber(1, Math.min(targetResult - 1, 9));
                    const num2 = targetResult - num1;
                    return { num1, num2, result: targetResult, text: `${num1} + ${num2}` };
                }
                case '-': {
                    const num1 = this.getRandomNumber(Math.min(targetResult + 1, 18), 18);
                    const num2 = num1 - targetResult;
                    return { num1, num2, result: targetResult, text: `${num1} - ${num2}` };
                }
                case 'x': {
                    // limitar fatores para manter target dentro de 4..18
                    const factors = [];
                    for (let a = 2; a <= 9; a++) {
                        for (let b = 2; b <= 9; b++) {
                            if (a * b === targetResult) factors.push([a, b]);
                        }
                    }
                    if (factors.length === 0) {
                        // fallback para soma caso não existam fatores inteiros
                        const num1 = this.getRandomNumber(2, Math.min(targetResult - 2, 9));
                        const num2 = targetResult - num1;
                        return { num1, num2, result: targetResult, text: `${num1} + ${num2}` };
                    }
                    const [num1, num2] = factors[Math.floor(Math.random() * factors.length)];
                    return { num1, num2, result: targetResult, text: `${num1} x ${num2}` };
                }
            }
        }

        // sem target predefinido: gerar de acordo com operação
        const a = this.getRandomNumber(1, 9);
        const b = this.getRandomNumber(1, 9);
        if (operation === '+') return { num1: a, num2: b, result: a + b, text: `${a} + ${b}` };
        if (operation === '-') {
            const x = this.getRandomNumber(2, 18);
            const y = this.getRandomNumber(1, Math.min(9, x - 1));
            return { num1: x, num2: y, result: x - y, text: `${x} - ${y}` };
        }
        // multiplicação
        const m = this.getRandomNumber(2, 9);
        const n = this.getRandomNumber(2, 9);
        return { num1: m, num2: n, result: m * n, text: `${m} x ${n}` };
    }

    static generateUniqueCalculations(difficulty = 'facil') {
        const calculations = {};
        const areas = ['planet', 'sun', 'rocketTop', 'rocketWindow', 'rocketBottom', 'rocketFlame', 'astronautHead', 'astronautTorso', 'astronautLegs'];
        
        // Geramos apenas 5 números únicos para as cores
        const targetNumbers = [];
        const usedNumbers = new Set();
        
        while (targetNumbers.length < 5) {
            const num = this.getRandomNumber(6, 16);
            if (!usedNumbers.has(num)) {
                targetNumbers.push(num);
                usedNumbers.add(num);
            }
        }

        // Em dificuldade difícil, garantir que exista pelo menos um número que seja produto de fatores entre 2..9
        if (difficulty === 'dificil') {
            const isProductNumber = (n) => {
                for (let a = 2; a <= 9; a++) {
                    if (n % a === 0) {
                        const b = n / a;
                        if (b >= 2 && b <= 9 && Number.isInteger(b)) return true;
                    }
                }
                return false;
            };
            const hasProduct = targetNumbers.some(isProductNumber);
            if (!hasProduct) {
                // escolher um produto válido no intervalo e substituir algum alvo
                const candidateProducts = [6, 8, 9, 10, 12, 14, 15, 16];
                const available = candidateProducts.filter(n => !usedNumbers.has(n));
                const chosen = (available.length ? available : candidateProducts)[Math.floor(Math.random() * (available.length ? available.length : candidateProducts.length))];
                const replaceIndex = Math.floor(Math.random() * targetNumbers.length);
                usedNumbers.delete(targetNumbers[replaceIndex]);
                targetNumbers[replaceIndex] = chosen;
                usedNumbers.add(chosen);
            }
        }

        // Duplicamos alguns números para ter 9 áreas com apenas 5 cores
        const allNumbers = [...targetNumbers];
        while (allNumbers.length < 9) {
            const randomIndex = Math.floor(Math.random() * targetNumbers.length);
            allNumbers.push(targetNumbers[randomIndex]);
        }

        // Embaralhamos os números para distribuir aleatoriamente
        const shuffledNumbers = [...allNumbers].sort(() => Math.random() - 0.5);

        const operationsByDifficulty = {
            'facil': ['+'],
            'medio': ['+', '-'],
            'dificil': ['+', '-', 'x']
        };
        const ops = operationsByDifficulty[difficulty] || ['+'];

        // atribuir operações aleatórias inicialmente
        const opsForAreas = areas.map(() => ops[Math.floor(Math.random() * ops.length)]);

        // garantir pelo menos uma subtração no médio
        if (difficulty === 'medio' && !opsForAreas.includes('-')) {
            const idx = Math.floor(Math.random() * opsForAreas.length);
            opsForAreas[idx] = '-';
        }

        // garantir pelo menos uma multiplicação no difícil
        if (difficulty === 'dificil' && !opsForAreas.includes('x')) {
            // escolher um índice cuja resposta alvo seja um produto válido
            const isProductNumber = (n) => {
                for (let a = 2; a <= 9; a++) {
                    if (n % a === 0) {
                        const b = n / a;
                        if (b >= 2 && b <= 9 && Number.isInteger(b)) return true;
                    }
                }
                return false;
            };
            const candidateIdx = shuffledNumbers.findIndex(isProductNumber);
            const idx = candidateIdx !== -1 ? candidateIdx : Math.floor(Math.random() * opsForAreas.length);
            opsForAreas[idx] = 'x';
        }

        areas.forEach((area, index) => {
            calculations[area] = this.generateCalculation(shuffledNumbers[index], opsForAreas[index]);
        });

        // Verificação final e correção defensiva
        const hasMinus = Object.values(calculations).some(c => c.text.includes('-'));
        const hasTimes = Object.values(calculations).some(c => c.text.includes('x'));

        if (difficulty === 'medio' && !hasMinus) {
            const idx = Math.floor(Math.random() * areas.length);
            calculations[areas[idx]] = this.generateCalculation(shuffledNumbers[idx], '-');
        }

        if (difficulty === 'dificil' && !hasTimes) {
            const isProductNumber = (n) => {
                for (let a = 2; a <= 9; a++) {
                    if (n % a === 0) {
                        const b = n / a;
                        if (b >= 2 && b <= 9 && Number.isInteger(b)) return true;
                    }
                }
                return false;
            };
            let idx = shuffledNumbers.findIndex(isProductNumber);
            if (idx === -1) idx = Math.floor(Math.random() * areas.length);
            calculations[areas[idx]] = this.generateCalculation(shuffledNumbers[idx], 'x');
        }

        return { 
            calculations, 
            uniqueResults: targetNumbers
        };
    }
}

/* ============================================================================
   CLASSE PARA DETECÇÃO DE CLIQUES NAS ÁREAS
   ============================================================================ */
class ClickDetector {
    static getClickedArea(clientX, clientY) {
        const svg = document.querySelector('.rocket svg');
        const rect = svg.getBoundingClientRect();
        const svgX = (clientX - rect.left) * (800 / rect.width);
        const svgY = (clientY - rect.top) * (600 / rect.height);

        for (const [area, bounds] of Object.entries(GAME_CONFIG.clickAreas)) {
            if (svgX >= bounds.x[0] && svgX <= bounds.x[1] && 
                svgY >= bounds.y[0] && svgY <= bounds.y[1]) {
                return area;
            }
        }

        return null;
    }
    
    static getClickedAreaFromTouch(touchX, touchY) {
        return this.getClickedArea(touchX, touchY);
    }
}

/* ============================================================================
   CONTROLADOR PRINCIPAL DO JOGO
   ============================================================================ */
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.newGame();
        this.setupResponsiveHandlers();
    }

    /* ===== CONFIGURAÇÃO DE EVENTOS ===== */
    setupEventListeners() {
        const rocket = document.getElementById('rocket');
        
        // Eventos para desktop
        rocket.addEventListener('click', (e) => {
            this.handleRocketClick(e.clientX, e.clientY);
        });
        
        // Eventos para dispositivos móveis
        rocket.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleRocketClick(touch.clientX, touch.clientY);
        }, { passive: false });

        // Eventos de drag and drop
        this.setupDragAndDrop();

        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            // Sincronizar dificuldade inicial com o seletor
            this.gameState.setDifficulty(difficultySelect.value || 'facil');
            difficultySelect.addEventListener('change', (e) => {
                const level = e.target.value;
                this.gameState.setDifficulty(level);
                if (gameController) {
                    this.newGame();
                }
            });
        }
    }

    /* ===== CONFIGURAÇÃO DE DRAG AND DROP ===== */
    setupDragAndDrop() {
        const rocket = document.getElementById('rocket');
        const dragIndicator = document.getElementById('dragIndicator');
        
        // Eventos de drag para as cores - otimizados
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('color-option')) {
                const number = parseInt(e.target.dataset.number);
                const color = e.target.dataset.color;
                
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    number: number,
                    color: color
                }));
                
                e.target.style.opacity = '0.5';
                e.target.classList.add('dragging');
                
                // Mostrar indicador de drag
                dragIndicator.textContent = number;
                dragIndicator.style.backgroundColor = color;
                dragIndicator.classList.add('show');
                
                e.dataTransfer.setDragImage(dragIndicator, 20, 20);
            }
        });

        // Otimizar evento drag com throttling
        let dragTimeout;
        document.addEventListener('drag', (e) => {
            if (e.target.classList.contains('color-option')) {
                if (dragTimeout) return;
                dragTimeout = requestAnimationFrame(() => {
                    dragIndicator.style.left = (e.clientX - 20) + 'px';
                    dragIndicator.style.top = (e.clientY - 20) + 'px';
                    dragTimeout = null;
                });
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('color-option')) {
                e.target.style.opacity = '1';
                e.target.classList.remove('dragging');
                dragIndicator.classList.remove('show');
                if (dragTimeout) {
                    cancelAnimationFrame(dragTimeout);
                    dragTimeout = null;
                }
            }
        });

        // Eventos de drop no foguete
        rocket.addEventListener('dragover', (e) => {
            e.preventDefault();
            rocket.classList.add('drag-over');
        });

        rocket.addEventListener('dragleave', (e) => {
            const rect = rocket.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                rocket.classList.remove('drag-over');
            }
        });

        rocket.addEventListener('drop', (e) => {
            e.preventDefault();
            rocket.classList.remove('drag-over');
            dragIndicator.classList.remove('show');
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const clickedArea = ClickDetector.getClickedArea(e.clientX, e.clientY);
                
                if (clickedArea) {
                    if (gameController) {
                        this.handleDragAndDrop(clickedArea, data.color, data.number);
                        // Feedback visual otimizado
                        rocket.classList.add('drop-success');
                        setTimeout(() => {
                            rocket.classList.remove('drop-success');
                        }, 200); // Reduzido de 300ms para 200ms
                    }
                } else {
                    UIManager.showFeedback('🎯 Solte a cor em uma área com cálculo!', 'error');
                }
            } catch (error) {
                console.error('Erro ao processar drop:', error);
            }
        });

        // Suporte para dispositivos móveis otimizado
        if (ResponsiveUtils.isMobile()) {
            let draggedElement = null;
            let startX, startY;
            let isDragging = false;
            let touchTimeout;

            document.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('color-option')) {
                    draggedElement = e.target;
                    const touch = e.touches[0];
                    startX = touch.clientX;
                    startY = touch.clientY;
                    isDragging = false;
                    e.target.style.opacity = '0.5';
                    e.target.classList.add('dragging');
                    
                    const number = parseInt(e.target.dataset.number);
                    const color = e.target.dataset.color;
                    dragIndicator.textContent = number;
                    dragIndicator.style.backgroundColor = color;
                    dragIndicator.style.left = (touch.clientX - 20) + 'px';
                    dragIndicator.style.top = (touch.clientY - 20) + 'px';
                    dragIndicator.classList.add('show');
                }
            }, { passive: false });

            document.addEventListener('touchmove', (e) => {
                if (draggedElement) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const deltaX = Math.abs(touch.clientX - startX);
                    const deltaY = Math.abs(touch.clientY - startY);
                    
                    if (touchTimeout) return;
                    touchTimeout = requestAnimationFrame(() => {
                        dragIndicator.style.left = (touch.clientX - 20) + 'px';
                        dragIndicator.style.top = (touch.clientY - 20) + 'px';
                        touchTimeout = null;
                    });
                    
                    if (deltaX > 10 || deltaY > 10) {
                        isDragging = true;
                        rocket.classList.add('drag-over');
                    }
                }
            }, { passive: false });

            document.addEventListener('touchend', (e) => {
                if (draggedElement && isDragging) {
                    const touch = e.changedTouches[0];
                    const endX = touch.clientX;
                    const endY = touch.clientY;
                    
                    const deltaX = Math.abs(endX - startX);
                    const deltaY = Math.abs(endY - startY);
                    
                    if (deltaX > 30 || deltaY > 30) {
                        const clickedArea = ClickDetector.getClickedArea(endX, endY);
                        if (clickedArea) {
                            const number = parseInt(draggedElement.dataset.number);
                            const color = draggedElement.dataset.color;
                            if (gameController) {
                                this.handleDragAndDrop(clickedArea, color, number);
                                
                                rocket.classList.add('drop-success');
                                setTimeout(() => {
                                    rocket.classList.remove('drop-success');
                                }, 200); // Reduzido de 300ms para 200ms
                            }
                        } else {
                            UIManager.showFeedback('🎯 Solte a cor em uma área com cálculo!', 'error');
                        }
                    }
                    
                    rocket.classList.remove('drag-over');
                    draggedElement.style.opacity = '1';
                    draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    isDragging = false;
                    dragIndicator.classList.remove('show');
                    if (touchTimeout) {
                        cancelAnimationFrame(touchTimeout);
                        touchTimeout = null;
                    }
                } else if (draggedElement) {
                    draggedElement.style.opacity = '1';
                    draggedElement.classList.remove('dragging');
                    draggedElement = null;
                    dragIndicator.classList.remove('show');
                }
            });
        }
    }

    /* ===== PROCESSAMENTO DE DRAG AND DROP ===== */
    handleDragAndDrop(area, color, number) {
        if (this.gameState.isPainted(area)) {
            UIManager.showFeedback('🖌️ Esta área já foi pintada!', 'error');
            return;
        }

        const correctAnswer = this.getCorrectAnswerForArea(area);

        if (number === correctAnswer) {
            this.handleCorrectAnswer(area, color, number);
        } else {
            this.handleIncorrectAnswer(area, correctAnswer);
        }
    }
    
    /* ===== CONFIGURAÇÃO DE HANDLERS RESPONSIVOS ===== */
    setupResponsiveHandlers() {
        // Debounced resize handler otimizado
        const debouncedResize = ResponsiveUtils.debounce(() => {
            this.handleResize();
        }, 100); // Reduzido de 250ms para 100ms
        
        window.addEventListener('resize', debouncedResize);
        
        // Handler para mudança de orientação em dispositivos móveis
        window.addEventListener('orientationchange', () => {
            // Reduzido timeout para melhor responsividade
            setTimeout(() => {
                this.handleResize();
            }, 50);
        });
    }
    
    handleResize() {
        // Ajustar posições dos textos de cálculo quando a tela muda de tamanho
        // Usar requestAnimationFrame para melhor performance
        requestAnimationFrame(() => {
            UIManager.showAllCalculationTexts();
        });
    }

    /* ===== INICIALIZAÇÃO DE NOVO JOGO ===== */
    newGame() {
        // Preservar a dificuldade selecionada ao resetar o estado
        const maintainedDifficulty = this.gameState.getDifficulty() || (document.getElementById('difficultySelect')?.value || 'facil');
        this.gameState.reset();
        this.gameState.setDifficulty(maintainedDifficulty);

        const currentDifficulty = maintainedDifficulty;
        const { calculations, uniqueResults } = MathManager.generateUniqueCalculations(currentDifficulty);
        
        Object.entries(calculations).forEach(([area, calc]) => {
            this.gameState.setCalculation(area, calc.result);
            UIManager.updateCalculationText(area, calc.text);
        });

        const shuffledNumbers = [...uniqueResults].sort(() => Math.random() - 0.5);
        this.gameState.setGameNumbers(shuffledNumbers);

        const randomColors = ColorManager.generateRandomColors(5);
        UIManager.createColorOptions(shuffledNumbers, randomColors);

        ColorManager.resetColors();
        UIManager.resetColorOptions();
        UIManager.showAllCalculationTexts();
        
        // Garantir que todos os estados visuais sejam limpos
        const rocket = document.getElementById('rocket');
        if (rocket) {
            rocket.classList.remove('drag-over', 'drop-success');
        }
        
        // Limpar também os estados das boxes de cálculo
        document.querySelectorAll('.sum-text.interactive-calc').forEach(element => {
            element.classList.remove('drag-over-calc', 'drop-success-calc');
        });
        
        // Novo: atualizar estado visual das cores após inicialização
        if (gameController) {
            UIManager.updateColorOptionsState();
        }
    }

    /* ===== SELEÇÃO DE CORES ===== */
    selectColor(element, color, number) {
        UIManager.selectColorOption(element);
        this.gameState.setSelectedColor(color);
        this.gameState.setSelectedNumber(number);
    }

    /* ===== PROCESSAMENTO DE CLIQUES NO FOGUETE ===== */
    handleRocketClick(clientX, clientY) {
        if (!gameController || !gameController.gameState) {
            return; // Sair se gameController não estiver disponível
        }
        
        const selectedColor = this.gameState.getSelectedColor();
        
        if (!selectedColor) {
            UIManager.showFeedback('🎨 Primeiro escolha uma cor!', 'error');
            return;
        }

        const clickedArea = ClickDetector.getClickedArea(clientX, clientY);
        
        if (!clickedArea) {
            UIManager.showFeedback('🎯 Clique dentro de uma das áreas com cálculo!', 'error');
            return;
        }

        if (this.gameState.isPainted(clickedArea)) {
            UIManager.showFeedback('🖌️ Esta área já foi pintada!', 'error');
            return;
        }

        this.processAreaClick(clickedArea, selectedColor);
    }

    processAreaClick(area, selectedColor) {
        const correctAnswer = this.getCorrectAnswerForArea(area);
        const selectedNumber = this.gameState.getSelectedNumber();

        if (selectedNumber === correctAnswer) {
            this.handleCorrectAnswer(area, selectedColor, selectedNumber);
        } else {
            this.handleIncorrectAnswer(area, correctAnswer);
        }
    }

    getCorrectAnswerForArea(area) {
        const areaMapping = {
            'planet': 'planet',
            'sun': 'sun',
            'rocket-top': 'rocketTop',
            'rocket-window': 'rocketWindow',
            'rocket-bottom': 'rocketBottom',
            'rocket-flame': 'rocketFlame',
            'astronaut-head': 'astronautHead',
            'astronaut-torso': 'astronautTorso',
            'astronaut-legs': 'astronautLegs'
        };

        const mappedArea = areaMapping[area];
        return this.gameState.getCalculation(mappedArea);
    }

    /* ===== PROCESSAMENTO DE RESPOSTAS ===== */
    handleCorrectAnswer(area, color, number) {
        ColorManager.updateElementColor(area, color);
        
        this.gameState.addPaintedArea(area);
        
        // Adicionar classe painted para ativar efeitos de brilho
        const rocket = document.getElementById('rocket');
        rocket.classList.add('painted');
        
        // Esconder o texto do cálculo quando for pintado corretamente
        const areaMapping = {
            'planet': 'planet',
            'sun': 'sun',
            'rocket-top': 'rocketTop',
            'rocket-window': 'rocketWindow',
            'rocket-bottom': 'rocketBottom',
            'rocket-flame': 'rocketFlame',
            'astronaut-head': 'astronautHead',
            'astronaut-torso': 'astronautTorso',
            'astronaut-legs': 'astronautLegs'
        };
        const mappedArea = areaMapping[area];
        UIManager.hideCalculationText(mappedArea);
        
        this.gameState.addUsedNumber(number);
        
        UIManager.markColorAsUsed(number);
        
        // Novo: atualizar estado visual de todas as cores
        if (gameController) {
            UIManager.updateColorOptionsState();
        }
        
        UIManager.showFeedback('🎉 Parabéns! Você acertou!', 'success');
        UIManager.addSuccessAnimation();
        
        if (this.gameState.isGameComplete()) {
            setTimeout(() => {
                UIManager.showFeedback('🚀 Parabéns! Você completou o foguete! Clique em "Novo Jogo" para jogar novamente.', 'success');
            }, 1000);
        }
    }

    handleIncorrectAnswer(area, correctAnswer) {
        const areaName = GAME_CONFIG.areaNames[area];
        UIManager.showFeedback(
            `❌ Ops! Tente novamente!`, 
            'error'
        );
    }
}

/* ============================================================================
   INICIALIZAÇÃO DO JOGO
   ============================================================================ */
// Variável global para o controlador do jogo
let gameController;

// Função de inicialização que será chamada quando o DOM estiver pronto
function initializeGame() {
    gameController = new GameController();
}

// Função global para compatibilidade
function newGame() {
    if (gameController) {
        gameController.newGame();
    }
}

// Inicializar o jogo quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
