# LabManager Mobile

Aplicativo mobile para gerenciamento de laboratórios acadêmicos desenvolvido com React Native e Expo.

## 📱 Funcionalidades

- **Instituições**: CRUD completo com validação de CNPJ, telefone e email
- **Cursos**: Gerenciamento com seleção de instituição e turnos
- **Professores**: Cadastro com validação de email e telefone
- **Disciplinas**: Vinculação com cursos e professores
- **Laboratórios**: Gestão por tipo e capacidade
- **Blocos de Aulas**: Configuração de horários com validação por turno

## 🛠️ Tecnologias

- **React Native** com Expo
- **React Native Paper** para UI
- **React Navigation** para navegação
- **Axios** para requisições HTTP
- **Máscaras** para CNPJ e telefone
- **Validações** em tempo real

## 🚀 Como executar

### Pré-requisitos

- Node.js 16+
- Expo CLI (`npm install -g @expo/cli`)
- Backend rodando em `http://localhost:3000`

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

### Executar no dispositivo

1. **Android**: `npm run android` ou escaneie o QR code com o Expo Go
2. **iOS**: `npm run ios` ou escaneie o QR code com a câmera
3. **Web**: `npm run web`

### Configuração de IP

Para testar em dispositivo físico, altere a URL base em `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://SEU_IP:3000/api/v1';
```

Exemplo: `http://192.168.1.100:3000/api/v1`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── common/
│   │   ├── MobileInput.js          # Input com validação e máscaras
│   │   ├── MobileSelectRemoto.js   # Select para opções remotas
│   │   └── MobileList.js           # Lista reutilizável de cards
│   └── Instituicoes/
│       └── InstituicoesScreen.js   # Tela de instituições
├── screens/
│   ├── CursosScreen.js             # Tela de cursos
│   ├── ProfessoresScreen.js        # Tela de professores
│   ├── DisciplinasScreen.js        # Tela de disciplinas
│   ├── LaboratoriosScreen.js       # Tela de laboratórios
│   └── BlocosScreen.js             # Tela de blocos
├── services/
│   └── api.js                      # Serviços HTTP com tratamento de erros
└── utils/
    └── masks.js                    # Utilitários de máscaras e validação
```

## 🎯 Componentes Reutilizáveis

### MobileInput

Input com validação automática e máscaras:

```javascript
<MobileInput
  label="CNPJ *"
  value={formData.cnpj}
  onChangeText={(text) => setFormData({ ...formData, cnpj: text })}
  mask="cnpj"
  required
  forceShowError={showErrors}
/>
```

**Props principais:**
- `label`: Label do campo
- `mask`: Tipo de máscara (cnpj, telefone)
- `required`: Campo obrigatório
- `minLength/maxLength`: Validação de tamanho
- `forceShowError`: Força exibição de erro

### MobileSelectRemoto

Select para opções carregadas remotamente:

```javascript
<MobileSelectRemoto
  label="Instituição"
  value={formData.instituicaoId}
  onValueChange={(value) => setFormData({ ...formData, instituicaoId: value })}
  options={instituicoesOptions}
  required
  placeholder="Selecione uma instituição"
/>
```

### MobileList

Lista de cards com ações:

```javascript
<MobileList
  data={items}
  renderItem={renderCustomItem}
  onEdit={handleEdit}
  onDelete={handleDelete}
  emptyMessage="Nenhum item encontrado"
/>
```

## 🔧 Validações Implementadas

- **CNPJ**: Formato e 14 dígitos
- **Telefone**: 10-13 dígitos com máscara
- **Email**: Formato válido
- **Horários**: Validação por turno (Manhã: 05:00-13:00, Tarde: 13:00-21:00, Noite: 21:00-05:00)
- **Campos obrigatórios**: Validação em tempo real

## 📱 Exemplo de Uso - Professores

### Listagem
```javascript
const renderProfessorItem = (professor) => (
  <>
    <Title>{professor.nome}</Title>
    <Paragraph>Email: {professor.email}</Paragraph>
    <Paragraph>Telefone: {professor.telefone || 'N/A'}</Paragraph>
    <Chip mode="outlined">
      {professor.status ? 'Ativo' : 'Inativo'}
    </Chip>
  </>
);
```

### Formulário
```javascript
<MobileInput
  label="Nome *"
  value={formData.nome}
  onChangeText={(text) => setFormData({ ...formData, nome: text })}
  required
  minLength={3}
  maxLength={100}
  forceShowError={showErrors}
/>

<MobileInput
  label="Email *"
  value={formData.email}
  onChangeText={(text) => setFormData({ ...formData, email: text })}
  keyboardType="email-address"
  required
  forceShowError={showErrors}
/>
```

## 🌐 Integração com Backend

Todos os serviços incluem tratamento de erros:

- **Timeout**: 10 segundos
- **404**: "Recurso não encontrado"
- **409**: Mensagem específica do servidor
- **500**: "Erro interno do servidor"
- **Conexão**: "Erro de conexão com o servidor"

## 📋 Funcionalidades por Tela

### Instituições
- ✅ CRUD completo
- ✅ Validação CNPJ, telefone, email
- ✅ Campos obrigatórios: nome, sigla, CNPJ

### Cursos
- ✅ CRUD completo
- ✅ Seleção de instituição
- ✅ Múltiplos turnos (Manhã, Tarde, Noite)
- ✅ Campos obrigatórios: nome, instituição, turnos

### Professores
- ✅ CRUD completo
- ✅ Validação email e telefone
- ✅ Campos obrigatórios: nome, email

### Disciplinas
- ✅ CRUD completo
- ✅ Vinculação com curso e professor
- ✅ Validação carga horária
- ✅ Campos obrigatórios: nome, carga horária, curso

### Laboratórios
- ✅ CRUD completo
- ✅ Tipos predefinidos
- ✅ Validação capacidade
- ✅ Campos obrigatórios: nome, tipo, capacidade, instituição

### Blocos de Aulas
- ✅ CRUD completo
- ✅ Validação horários por turno
- ✅ Ordem numérica
- ✅ Campos obrigatórios: turno, dia, horários, ordem

## 🔍 Descobrir IP da Máquina

### Windows
```cmd
ipconfig
```

### macOS/Linux
```bash
ifconfig | grep inet
```

### Alternativa
```bash
hostname -I
```

O IP geralmente começa com `192.168.` ou `10.0.`.