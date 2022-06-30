const fs = require('fs');

const log = console.log;

function leArquivosCsv() {
    var dirCsv = ['consulta_cand2'];
    for (let k = 0; k < dirCsv.length; k++) {
      var conta = 0;  
  
    //   log(dirCsv[k])
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
            if (s == '""')
                s = '#NULO#'
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
        log(query);
      })
    }
  }

function leArquivosSql() {
    var dirSql = fs.readdirSync('./sql');
    dirSql.forEach(d => exec(d));
  }

function exec(caminho) {

    var arqSql = fs.readFileSync('./sql/'+caminho);
    var linha = arqSql.toString().split(/\r?\n/);
  
      // console.log(linha[0].toString());      
      log(linha);
}


leArquivosSql();
leArquivosCsv();