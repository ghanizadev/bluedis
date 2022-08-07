import { LangType } from "./i18n.dto";

const translation: LangType = {
  absolutettl: "TTL absoluta",
  actual: "Atual",
  addanewkey: "Adicionar nova chave",
  addedititem: "Adicionar/Editar item",
  additem: "Adicionar item",
  addkey: "Adicionar chave",
  addnewmember: "Adicionar novo membro",
  appearance: "Aparência",
  applicationiconmadeby: "ícone do aplicativo feito por",
  apply: "Aplicar",
  attention: "Atenção",
  author: "autor",
  cancel: "Cancelar",
  clearpreferences: "Limpar preferências",
  clicktoview: "Clique para visualizar",
  close: "Fechar",
  closethisconnection: "Fechar esta conexão",
  confirm: "Confirmar",
  confirmation: "Confirmação",
  connect: "Conectar",
  copyasjson: "Copiar como JSON",
  copykeyasjson: "Copiar chave como JSON",
  coreiconsmadeby: "ícones feitos por",
  darkmode: "Modo escuro",
  data: "Dados",
  database: "Banco de dados",
  doyoureallywanttodeletethesekeys: (count: number) =>
    `Você realmente deseja apagar ESTAS ${count} CHAVES?`,
  doyoureallywanttodeletethiskey: "Você realmente deseja apagar ESTA CHAVE?",
  doyoureallywanttowipeallstoreddatathisincludesallyourpreferencesandfavorites:
    "Você realmente deseja limpar todos os dados? Isso inclui todas as suas preferências e favoritos",
  edititem: "Editar item",
  editkey: "Editar chave",
  editttl: "Editar TTL",
  email: "correio eletrônico",
  expirationmilliseconds: "Validade (milisegundos)",
  expiresat: "Valido até",
  exportselected: "Exportar selecionados",
  favorites: "Favoritos",
  favoritethisconnection: "Favoritar esta conexão",
  font: "Fonte",
  fontsize: "Tamanho da fonte",
  from: "proveniente de",
  help: "Ajuda",
  host: "Endereço",
  index: "Índice",
  issues: "problemas",
  key: "Chave",
  keysaved: "A chave foi salva",
  language: "Idioma",
  lastupdate: "Última atualização",
  loadmore: "carregar mais",
  member: "Membro",
  name: "Nome",
  newitemhere: "Novo item aqui...",
  newkey: "Nova chave",
  nofavoritessofar: "Sem favoritos ainda...",
  notset: "indefinida",
  ok: "Entendido",
  openterminal: "Abrir terminal",
  password: "Senha",
  pickaname: "Selecione um nome",
  port: "Porta",
  refreshlist: "Atualizar tabela",
  region: "Região",
  remove: "Remover",
  removekey: "Apagar chave",
  removeproperty: "Remover propriedade",
  removeselected: "Remover selecionados",
  repository: "repositório",
  save: "Salvar",
  savekey: "Salvar chave",
  score: "Nota",
  search: "Procurar",
  searching: "procurando",
  settings: "Configurações",
  setttl: "Editar TTL",
  showingkeys: (count: number) => `exibindo ${count} chaves - `,
  showingallkeys: (count: number) => `exibindo todas ${count} chaves`,
  type: "Tipo",
  usetls: "Usar TLS",
  value: "Valor",
  wipedata: "Limpar dados",
};

export default translation;
