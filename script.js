// Array para armazenar paletas de cores salvas
let array = [];

// Array para armazenar as cores geradas
let colors = [];

// Função para misturar duas cores com base em uma porcentagem
function mixColor(color1, color2, percent) {
    // Converte as cores hexadecimais em arrays RGB
    const c1 = [
        parseInt(color1.substring(1, 3), 16),
        parseInt(color1.substring(3, 5), 16),
        parseInt(color1.substring(5, 7), 16)
    ];

    const c2 = [
        parseInt(color2.substring(1, 3), 16),
        parseInt(color2.substring(3, 5), 16),
        parseInt(color2.substring(5, 7), 16)
    ];

    // Calcula a cor resultante com base na porcentagem
    const mixed = [
        Math.round(c1[0] + (c2[0] - c1[0]) * percent),
        Math.round(c1[1] + (c2[1] - c1[1]) * percent),
        Math.round(c1[2] + (c2[2] - c1[2]) * percent)
    ];

    // Retorna a cor resultante em formato hexadecimal
    return `#${mixed.map(num => num.toString(16).padStart(2, '0')).join('')}`;
}

// Função para gerar uma paleta de cores com base na cor de entrada
function generatePalette() {
    // Obtém a cor base do input ou da entrada de texto
    let baseColor = document.getElementById('baseColor').value;
    const hexInput = document.getElementById('hexColor').value;

    if (hexInput && /^#[0-9a-fA-F]{6}$/.test(hexInput)) {
        baseColor = hexInput;
    }

    const paletteDiv = document.getElementById('palette');

    paletteDiv.innerHTML = '';  // Limpa a paleta existente

    // Gera tons mais claros
    for (let i = 100; i >= 0; i -= 10) {
        const color = mixColor(baseColor, '#ffffff', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span>${i}%</span>
              <span class="hex">${color.toUpperCase()}</span>
          </div>`;
        paletteDiv.innerHTML += div;

        // Armazena as cores na matriz "colors"
        colors.push(color);
    }

    // Gera tons mais escuros
    for (let i = 10; i <= 100; i += 10) {
        const color = mixColor(baseColor, '#000000', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span style="color: white;">${i}%</span>
              <span style="color: white;" class="hex">${color.toUpperCase()}</span>
          </div>`;

        paletteDiv.innerHTML += div;

        // Armazena as cores na matriz "colors"
        colors.push(color);
    }

    // Armazena as cores no armazenamento local (localStorage)
    localStorage.setItem('colors', colors);
}

// Função para gerar uma cor hexadecimal aleatória
function generateRandomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    document.getElementById('baseColor').value = randomColor;
    document.getElementById('hexColor').value = randomColor;
    generatePalette();  // Gera a paleta com a cor aleatória
}

// Função para salvar uma paleta de cores
function savePalette() {
    // Obtém o nome da paleta e a cor base
    let text = document.getElementById('hexColor').value;
    let color = document.getElementById('baseColor').value;
    let corRepetida;

    // Cria um objeto para representar a paleta
    let obj = {
        nome: text,
        corBase: color,
        paleta: colors
    }

    // Verifica se a paleta com o mesmo nome já foi salva
    array.forEach(element => {
        if (element.nome == obj.nome) {
            const message = document.getElementById('customAlert');
            message.style.display = 'block';
            message.innerHTML = 'Não é possível salvar duas paletas iguais!';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
            corRepetida = true;
        }
    });

    // Se a paleta for repetida, não faz nada
    if (corRepetida) {
        return;
    }

    // Adiciona o objeto ao array de paletas
    array.push(obj);

    // Salva o array de paletas no armazenamento local
    localStorage.setItem('savedPalettes', JSON.stringify(array));

    // Limpa o array de cores
    colors = [];

    // Mostra uma mensagem de confirmação
    const message = document.getElementById('customSuccess');
    message.style.display = 'block';
    message.innerHTML = 'Paleta salva!';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);

    // Atualiza as opções do elemento 'select' com as paletas salvas
    var selectElement = document.getElementById('meuSelect');
    selectElement.innerHTML = null;
    if (localStorage.getItem('savedPalettes').length > 0) {
        JSON.parse(localStorage.getItem('savedPalettes')).forEach(obj => {
            selectElement.innerHTML += `
            <option value="${obj.nome}">${obj.nome}</option>
            `
        });
    } else {
        selectElement.innerHTML = null;
    }
}

// Função para carregar paletas de cores salvas
function loadSavedPalettes(event) {
    if (event.value && /^#[0-9a-fA-F]{6}$/.test(event.value)) {
        baseColor = event.value;
    }

    const paletteDiv = document.getElementById('palette');

    paletteDiv.innerHTML = '';  // Limpa a paleta existente

    // Gera tons mais claros e mais escuros da paleta selecionada
    for (let i = 100; i >= 0; i -= 10) {
        const color = mixColor(baseColor, '#ffffff', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span>${i}%</span>
              <span class="hex">${color.toUpperCase()}</span>
          </div>`;
        paletteDiv.innerHTML += div;
    }

    for (let i = 10; i <= 100; i += 10) {
        const color = mixColor(baseColor, '#000000', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span style="color: white;">${i}%</span>
              <span style="color: white;" class="hex">${color.toUpperCase()}</span>
          </div>`;

        paletteDiv.innerHTML += div;
    }

    // Atualiza as entradas de cor e texto com a paleta selecionada
    document.getElementById('baseColor').value = baseColor;
    document.getElementById('hexColor').value = baseColor;
}

// Função para copiar um valor para a área de transferência
function copy(valor) {
    navigator.clipboard.writeText(valor).then(() => {
        alert('Texto copiado para a área de transferência: ' + valor);
    }, () => {
        console.error('Falha ao copiar!');
    });
}
