# 🚀 Jogo do Foguete - Calcule e Pinte

Um jogo educativo interativo que combina matemática e criatividade, onde os jogadores resolvem cálculos para pintar um foguete espacial.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Como Jogar](#como-jogar)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Uso](#instalação-e-uso)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Jogo do Foguete - Calcule e Pinte** é uma aplicação web educativa desenvolvida para tornar o aprendizado de matemática mais divertido e interativo. O jogo apresenta um foguete espacial detalhado com diferentes partes que precisam ser pintadas através da resolução de cálculos matemáticos.

### 🎨 Características Principais

- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Três Níveis de Dificuldade**: Adição, Subtração e Multiplicação
- **Interação Intuitiva**: Clique ou arraste e solte para pintar
- **Feedback Visual**: Animações e efeitos visuais atrativos
- **Design Espacial**: Tema espacial com estrelas e gradientes

## ✨ Funcionalidades

### 🎮 Mecânicas de Jogo

- **9 Áreas Pintáveis**: Planeta, Sol, Topo do Foguete, Janela, Base, Chamas, Cabeça do Astronauta, Torso e Pernas
- **Sistema de Cores**: 5 cores únicas que podem ser reutilizadas
- **Cálculos Dinâmicos**: Geração automática de cálculos baseados na dificuldade
- **Feedback Imediato**: Mensagens de sucesso e erro em tempo real

### 📱 Responsividade

- **Desktop**: Layout otimizado para telas grandes
- **Tablet**: Adaptação automática para telas médias
- **Mobile**: Interface touch-friendly com gestos otimizados

### 🎯 Níveis de Dificuldade

1. **Fácil**: Apenas adições
2. **Médio**: Adições e subtrações
3. **Difícil**: Adições, subtrações e multiplicações

## 🎮 Como Jogar

### 📝 Instruções Básicas

1. **Escolha a Dificuldade**: Selecione o nível no menu superior
2. **Analise os Cálculos**: Cada parte do foguete tem um cálculo matemático
3. **Resolva e Pinte**: 
   - Clique em uma cor da lista
   - Clique na área correspondente ao resultado
   - Ou arraste a cor até a área desejada
4. **Complete o Foguete**: Pinte todas as 9 áreas para vencer

### 🎨 Métodos de Pintura

#### Método 1: Clique Duplo
1. Clique na cor desejada
2. Clique na área do foguete correspondente

#### Método 2: Drag and Drop
1. Arraste a cor da lista
2. Solte sobre a área correta do foguete

#### Método 3: Clique Direto nas Caixas
1. Clique diretamente nas caixas de cálculo
2. A cor selecionada será aplicada automaticamente

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com animações e responsividade
- **JavaScript (ES6+)**: Lógica do jogo e interações
- **SVG**: Gráficos vetoriais para o foguete

### Recursos Especiais
- **CSS Grid & Flexbox**: Layout responsivo
- **CSS Animations**: Efeitos visuais suaves
- **Touch Events**: Suporte completo para dispositivos móveis
- **Drag & Drop API**: Interação intuitiva

## 📁 Estrutura do Projeto

```
Jogo-de-calculo-e-pintar/
├── index.html          # Estrutura principal da página
├── style.css           # Estilos e animações
├── script.js           # Lógica do jogo
└── README.md           # Documentação do projeto
```

### 📄 Arquivos Principais

#### `index.html`
- Estrutura HTML semântica
- SVG detalhado do foguete espacial
- Elementos de interface do usuário
- Meta tags para responsividade

#### `style.css`
- **Reset e Configurações Base**: Normalização de estilos
- **Efeitos de Fundo**: Gradientes e estrelas animadas
- **Animações**: Keyframes para efeitos visuais
- **Layout Responsivo**: Media queries para diferentes telas
- **Estilos de Jogo**: Cores, botões e elementos interativos

#### `script.js`
- **Configurações**: Constantes e configurações do jogo
- **Classes Utilitárias**: ResponsiveUtils, GameState, UIManager
- **Gerenciadores**: ColorManager, MathManager, ClickDetector
- **Controlador Principal**: GameController com toda a lógica
- **Eventos**: Handlers para clique, drag & drop e touch

## 🚀 Instalação e Uso

### 📋 Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desenvolvimento)

### ⚡ Instalação Rápida

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/Jogo-de-calculo-e-pintar.git
   cd Jogo-de-calculo-e-pintar
   ```

2. **Abra o arquivo**:
   - Duplo clique em `index.html`
   - Ou use um servidor local:
     ```bash
     python -m http.server 8000
     # Acesse http://localhost:8000
     ```

### 🌐 Deploy Online

O projeto pode ser facilmente hospedado em:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Qualquer servidor web estático**

## 🎨 Personalização

### 🎯 Modificando Dificuldades

Edite o arquivo `script.js` na seção `GAME_CONFIG`:

```javascript
const GAME_CONFIG = {
    maxNumber: 18,        // Número máximo para cálculos
    minNumber: 4,         // Número mínimo para cálculos
    feedbackDuration: 3000, // Duração das mensagens de feedback
    // ... outras configurações
};
```

### 🎨 Alterando Cores

Modifique as cores padrão no CSS:

```css
.difficulty-select option {
    background-color: #000000;  /* Cor do fundo do pop-up */
    color: #ffffff;             /* Cor do texto */
}
```

### 📱 Ajustando Responsividade

Edite as media queries no `style.css`:

```css
@media (max-width: 768px) {
    .rocket {
        width: 100%;
        max-width: 400px;
        height: 300px;
    }
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### 🐛 Reportando Bugs

Se encontrar algum bug, por favor:
1. Verifique se o problema já foi reportado
2. Crie uma issue com detalhes do problema
3. Inclua informações sobre seu navegador e sistema operacional

### 💡 Sugestões de Melhorias

Algumas ideias para futuras versões:
- [ ] Sistema de pontuação
- [ ] Cronômetro
- [ ] Mais níveis de dificuldade
- [ ] Sons e música
- [ ] Modo multiplayer
- [ ] Salvamento de progresso

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Inspiração em jogos educativos clássicos
- Comunidade de desenvolvedores web
- Testadores e feedback da comunidade

## 📞 Contato

- **Projeto**: [Jogo do Foguete - Calcule e Pinte](https://github.com/seu-usuario/Jogo-de-calculo-e-pintar)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/Jogo-de-calculo-e-pintar/issues)

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no repositório!**
