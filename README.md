# 🏥 PAS - Portal de Acesso à Saúde

Uma aplicação web moderna para localização e consulta de unidades de saúde, desenvolvida como Trabalho de Conclusão de Curso (TCC) do SENAI.

## 📋 Sobre o Projeto

O PAS (Portal de Acesso à Saúde) é uma plataforma que permite aos usuários encontrar unidades de saúde próximas, visualizar informações detalhadas sobre serviços disponíveis, especialidades médicas e tempos de espera em tempo real.

### ✨ Funcionalidades Principais

- 🔍 **Busca Inteligente**: Pesquisa por nome de unidades com autocomplete
- 📍 **Localização por Proximidade**: Filtro por distância usando geolocalização
- ⏰ **Filtro por Disponibilidade**: Busca por unidades com atendimento 24h
- 🏥 **Filtros Avançados**: Por especialidade médica e categoria de unidade
- 🗺️ **Mapa Interativo**: Visualização das unidades em mapa com marcadores
- 📱 **Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- 🌙 **Tema Escuro/Claro**: Alternância entre modos de visualização
- ✨ **Animações Suaves**: Transições e animações para melhor UX

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.5.3** - Framework React para produção
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset JavaScript com tipagem estática
- **CSS Modules** - Estilização com escopo local
- **Open Street Map** - Biblioteca para mapas interativos

### Backend/API
- **API REST** - Integração com backend Node.js
- **Geocoding API** - Conversão de CEP para coordenadas
- **Nominatim (OpenStreetMap)** - Serviço de geocodificação

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/senai-tcc-pas.git
   cd senai-tcc-pas
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

```bash
npm run dev      # Executa em modo de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Executa build de produção
npm run lint     # Executa linting do código
```

## 📁 Estrutura do Projeto

```
senai-tcc-pas/
├── app/                          # Diretório principal do Next.js 13+
│   ├── api/                      # API Routes
│   │   └── geocoding/            # Endpoint de geocodificação
│   ├── components/               # Componentes reutilizáveis
│   │   ├── filtro/              # Componente de filtros
│   │   ├── iconText/            # Componente de ícone + texto
│   │   ├── infocard/            # Cards informativos
│   │   ├── map/                 # Componente do mapa
│   │   ├── searchbar/           # Barra de pesquisa
│   │   ├── specialty/           # Componente de especialidades
│   │   ├── unitCard/            # Card de unidade de saúde
│   │   └── unitInfo/            # Informações detalhadas da unidade
│   ├── context/                 # Context API do React
│   │   ├── FiltroContext.tsx    # Gerenciamento de filtros
│   │   └── ThemeContext.tsx     # Gerenciamento de tema
│   ├── hooks/                   # Custom hooks
│   │   └── useGeolocation.tsx   # Hook de geolocalização
│   ├── utils/                   # Utilitários
│   │   ├── geocoding.ts         # Funções de geocodificação
│   │   └── timeFormatter.ts     # Formatação de tempo
│   ├── filtro/                  # Página de filtros
│   ├── inicio/                  # Página inicial
│   ├── login/                   # Página de login
│   ├── mapa/                    # Página do mapa
│   ├── perfil-e-configuracoes/  # Página de perfil
│   ├── unidades/                # Página de unidades
│   ├── global.css               # Estilos globais e variáveis CSS
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página raiz
├── public/                      # Arquivos estáticos
└── README.md                    # Este arquivo
```

## 🎨 Sistema de Design

### Variáveis CSS
O projeto utiliza um sistema robusto de variáveis CSS para consistência visual:

- **Cores principais**: Azuis (#134879, #134E83)
- **Cores de sistema**: Sucesso, erro, aviso, info
- **Cores de tema**: Suporte completo a modo claro/escuro
- **Responsividade**: Breakpoints para mobile, tablet e desktop

### Componentes Principais

#### 🔍 SearchBar
- Busca com autocomplete
- Ícone de filtro com rotação animada (180°)
- Dropdown com resultados da pesquisa

#### 🗺️ LocationMap
- Mapa interativo com Leaflet
- Marcadores personalizados para unidades
- Popups informativos com dados das unidades

#### 🏥 UnitCard
- Animações de entrada escalonadas
- Informações de tempo de espera
- Botão "Saber mais" com hover effects

## 🔧 Funcionalidades Técnicas

### Sistema de Filtros

#### Filtro por Distância
- Geolocalização automática do usuário
- Fallback para Jandira (-23.5381, -46.9042)
- Cálculo de distância usando fórmula de Haversine
- Geocodificação de CEP via API Nominatim
- Cache inteligente com TTL de 24 horas

#### Filtro por Disponibilidade
- Tratamento local (não via API)
- Filtro por unidades 24h
- Combinação com outros filtros

#### Filtros Avançados
- Por especialidade médica
- Por categoria de unidade (UBS, Hospital, etc.)

### Sistema de Temas
- Context API para gerenciamento global
- Persistência no localStorage
- Detecção automática da preferência do sistema
- Transições suaves entre temas

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints otimizados:

- **Desktop**: > 1440px
- **Laptop**: 1024px - 1440px
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Mobile Small**: < 480px

## 🔗 API Integration

### Endpoints Utilizados
- `GET /v1/pas/unidades/` - Lista todas as unidades
- `POST /v1/pas/unidades/filtrar` - Filtros por especialidade/categoria
- `GET /v1/pas/unidades/{id}` - Detalhes de uma unidade específica
- `GET /v1/pas/unidades/nome/{nome}` - Busca por nome

### Geocoding API
- Endpoint interno: `/api/geocoding?cep={cep}`
- Integração com Nominatim (OpenStreetMap)
- Cache automático para otimização

## 🎯 Melhorias Implementadas

### Animações
- ✨ UnitCards com animação slideInUp
- ✨ Delays escalonados para múltiplos cards
- ✨ Ícone de filtro com rotação 180° animada
- ✨ Transições suaves em hover effects

### Performance
- 🚀 Debounce em filtros e busca
- 🚀 Cache de geocodificação
- 🚀 Lazy loading do mapa
- 🚀 Memoização de componentes

### UX/UI
- 🎨 Sistema de tema claro/escuro
- 🎨 Feedback visual em todas as interações
- 🎨 Loading states informativos
- 🎨 Mensagens de erro amigáveis

## 👥 Equipe de Desenvolvimento

- **Desenvolvedor Principal**: [Vitor Paes Rodrigues](linkedin.com/in/vitorpaesrodrigues)
- **Co-desenvolvedor**: [Nicolas Silva de Almeida](linkedin.com/in/nicolas-almeida-b53b16327)
- **Instituição**: SENAI
