// Array para armazenar paletas de cores salvas
let array = JSON.parse(localStorage.getItem('savedPalettes')) || [];

// Array para armazenar as cores geradas
let colors = [];

// Função para misturar duas cores com base em uma porcentagem
function mixColor(color1, color2, percent) {
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

    const mixed = [
        Math.round(c1[0] + (c2[0] - c1[0]) * percent),
        Math.round(c1[1] + (c2[1] - c1[1]) * percent),
        Math.round(c1[2] + (c2[2] - c1[2]) * percent)
    ];

    return `#${mixed.map(num => num.toString(16).padStart(2, '0')).join('')}`;
}

// Função para gerar uma paleta de cores
function generatePalette() {
    let baseColor = document.getElementById('baseColor').value;
    const hexInput = document.getElementById('hexColor').value;

    if (hexInput && /^#[0-9a-fA-F]{6}$/.test(hexInput)) {
        baseColor = hexInput;
    }

    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = '';

    colors = [];  // Limpa as cores geradas

    // Tons mais claros
    for (let i = 100; i > 0; i -= 10) {
        const color = mixColor(baseColor, '#ffffff', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span>${i}%</span>
              <span class="hex">${color.toUpperCase()}</span>
          </div>`;
        paletteDiv.innerHTML += div;
        colors.push(color);
    }

    // Tons mais escuros
    for (let i = 10; i <= 100; i += 10) {
        const color = mixColor(baseColor, '#000000', i / 100);
        const div = `
          <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
              <span style="color: white;">${i}%</span>
              <span style="color: white;" class="hex">${color.toUpperCase()}</span>
          </div>`;
        paletteDiv.innerHTML += div;
        colors.push(color);
    }

    localStorage.setItem('colors', JSON.stringify(colors));
}

// Função para gerar cor aleatória
function generateRandomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    document.getElementById('baseColor').value = randomColor;
    document.getElementById('hexColor').value = randomColor;
    generatePalette();
}

// Função para salvar paleta
function savePalette() {
    let text = document.getElementById('hexColor').value;
    let color = document.getElementById('baseColor').value;

    let obj = {
        nome: text,
        corBase: color,
        paleta: colors
    };

    if (array.some(pal => pal.nome === obj.nome)) {
        const message = document.getElementById('customAlert');
        message.style.display = 'block';
        message.innerHTML = 'Não é possível salvar duas paletas iguais!';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
        return;
    }

    array.push(obj);
    localStorage.setItem('savedPalettes', JSON.stringify(array));

    const message = document.getElementById('customSuccess');
    message.style.display = 'block';
    message.innerHTML = 'Paleta salva!';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);

    updateSelectOptions();
}

// Função para carregar opções no select
function updateSelectOptions() {
    const selectElement = document.getElementById('meuSelect');
    selectElement.innerHTML = '';

    array.forEach(obj => {
        const option = document.createElement('option');
        option.value = obj.nome;
        option.textContent = obj.nome;
        selectElement.appendChild(option);
    });
}

// Função para carregar paleta salva ao clicar no novo botão
function loadSavedPalettes() {
    const selectedPaletteName = document.getElementById('meuSelect').value;
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes'));

    const selectedPalette = savedPalettes.find(palette => palette.nome === selectedPaletteName);

    if (selectedPalette) {
        colors = selectedPalette.paleta;
        const baseColor = selectedPalette.corBase;
        
        document.getElementById('baseColor').value = baseColor;
        document.getElementById('hexColor').value = baseColor;

        const paletteDiv = document.getElementById('palette');
        paletteDiv.innerHTML = '';

        // Renderiza a paleta salva
        selectedPalette.paleta.forEach((color, index) => {
            const percent = index <= 10 ? 100 - index * 10 : (index - 10 + 1) * 10;
            const colorStyle = index > 10 ? 'style="color: white;"' : '';
            const div = `
              <div onclick="copy('${color}')" class="color-box" style="background-color: ${color};">
                  <span ${colorStyle}>${percent}%</span>
                  <span ${colorStyle} class="hex">${color.toUpperCase()}</span>
              </div>`;
            paletteDiv.innerHTML += div;
        });
    }
}

// Função para excluir uma paleta salva
function deletePalette() {
    const selectedPaletteName = document.getElementById('meuSelect').value;

    if (!selectedPaletteName) {
        alert("Selecione uma paleta para excluir.");
        return;
    }

    // Filtra o array para remover a paleta com o nome selecionado
    array = array.filter(palette => palette.nome !== selectedPaletteName);

    // Atualiza o localStorage
    localStorage.setItem('savedPalettes', JSON.stringify(array));

    // Atualiza o select com as paletas restantes
    updateSelectOptions();

    // Limpa a exibição de cores
    document.getElementById('palette').innerHTML = '';

    // Limpa as entradas de cor e texto
    document.getElementById('baseColor').value = '';
    document.getElementById('hexColor').value = '';

    // Confirmação de exclusão
    alert("Paleta excluída com sucesso!");
}


// Função para copiar cor
function copy(valor) {
    navigator.clipboard.writeText(valor).then(() => {
        alert('Texto copiado para a área de transferência: ' + valor);
    }, () => {
        console.error('Falha ao copiar!');
    });
}

// Inicializa as opções ao carregar a página
updateSelectOptions();
