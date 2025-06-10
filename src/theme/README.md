# Arquitetura de Temas

Esta pasta contém a estrutura de arquivos para gerenciamento de temas e estilos da aplicação.

## Estrutura de Arquivos

```
theme/
├── colors/
│   ├── _base.scss         # Cores base da aplicação
│   ├── _theme.scss        # Variáveis de tema baseadas nas cores
│   └── _dark-theme.scss   # Sobrescritas para tema escuro
├── mixins/
│   ├── _functions.scss   # Funções auxiliares para cores
│   └── _mixins.scss      # Mixins reutilizáveis
├── _index.scss           # Ponto de entrada principal
└── variables.scss        # Variáveis globais e configurações
```

## Como Usar

### Importando o Tema

Para usar o tema em qualquer arquivo SCSS, importe o arquivo principal:

```scss
@use 'theme' as *;
```

### Cores

As cores são definidas em `colors/_base.scss` e disponibilizadas como variáveis CSS. Use as variáveis diretamente:

```scss
.my-element {
  background-color: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast);
}
```

### Mixins

Use os mixins para estilos comuns:

```scss
.my-button {
  @include button-variant(var(--ion-color-primary));
}

.my-card {
  @include card-style();
}

.my-input {
  @include input-style();
}
```

### Responsividade

Use os mixins de responsividade:

```scss
.my-element {
  padding: var(--spacing-md);
  
  @include respond-to('md') {
    padding: var(--spacing-lg);
  }
}
```

## Tema Escuro

O tema escuro é aplicado automaticamente com base nas preferências do sistema. Para forçar um tema específico, adicione a classe `ion-theme-light` ou `ion-theme-dark` ao elemento `html`.

## Adicionando Novas Cores

1. Adicione a nova cor em `colors/_base.scss`
2. Atualize `colors/_theme.scss` para incluir as variáveis CSS necessárias
3. Se necessário, adicione estilos específicos para o tema escuro em `colors/_dark-theme.scss`

## Boas Práticas

1. **Sempre use variáveis CSS** em vez de valores fixos
2. **Reutilize mixins** para estilos comuns
3. **Mantenha a consistência** usando os espaçamentos e bordas definidos
4. **Teste sempre** em ambos os temas (claro/escuro)
5. **Documente** novas cores e estilos adicionados

## Personalização

Para personalizar o tema, edite os arquivos na pasta `colors/`. As principais cores a serem personalizadas são:

- `primary`: Cor principal da aplicação
- `secondary`: Cor secundária
- `success`: Para indicar sucesso
- `warning`: Para alertas
- `danger`: Para erros e ações perigosas
- `neutral`: Para tons de cinza e neutros
