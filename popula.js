const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);

var pg = require('pg');

var connectionString = 'postrges://postgres:123456@localhost/eleicao'
var pgClient = new pg.Client(connectionString);

pgClient.connect();

const log = console.log;

async function conecta(query, tabela, conta) {

  try {
    var result = await pgClient.query(query);
    console.log(tabela + ' ' + conta);      

  }
  catch (err) {
    console.log(query);
    console.log(err);
    process.exit();
  }

}

var arquivosSql = [];

async function leArquivosSql() {
  var dirSql = fs.readdirSync('./sql');
    dirSql.forEach(d => execSql(d));
}

async function leArquivosCsv() {
  var dirCsv = ['bem_candidato', 'consulta_cand', 'consulta_coligacao', 'consulta_vagas', 'motivo_cassacao'];
  for (let k = 0; k < dirCsv.length; k++) {
    var conta = 0;  

    log(dirCsv[k])
    var retCsv = fs.readFileSync('./csv/' + dirCsv[k] + '.csv', 'utf-8');
    var retFormato = fs.readFileSync('./txt/' + dirCsv[k] + '.txt', 'utf-8');

    var csvSplit = retCsv.split(/\r?\n/);
    var formatoSplit = retFormato.split(/\r?\n/);
    var tamanho = formatoSplit.length;



    let j = 0;

    csvSplit.forEach(linha => {
      let query = `insert into ${dirCsv[k]} values (`;
      var splites = linha.split(';');

      splites.forEach((s) => {
        let f = formatoSplit[j];

        if (f == 'date' || f == 'time' || f == 'varchar') {
          if (s == '""' && f == 'varchar')
              s = '#NULO#'
          else if (s == '""' && f == 'date')
              s = '01/01/2001'
          else if (s == '""' && f == 'time')
              s = '00:00:00'
          query += `'${s.toString().replace(/"/g, '').replace(/,/g, '.')}'`
        }
        else {
          if (s == '""')
              s = '0'        
          query += `${s.toString().replace(/"/g, '').replace(/,/g, '.')}`
        }
        j++;

        if (j < tamanho)
          query += ','
        if (j == tamanho)
          j = 0;
      })

      query += ')';
      conta++;
      conecta(query, dirCsv[k], conta);
    })
    log(conta);
  }
}

function leArquivosSql() {
  var dirSql = fs.readdirSync('./sql');
  dirSql.forEach(d => exec(d));
}

function exec(caminho) {
  var arqSql = fs.readFileSync('./sql/'+caminho);
  // var linha = arqSql.toString().split(/\r?\n/);
  // log(linha);

  conecta(arqSql.toString());
}

//leArquivosSql();
leArquivosCsv();