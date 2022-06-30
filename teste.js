const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const log = console.log;

var dirCsv = fs.readdirSync('./csv');
var dirTxt = fs.readdirSync('./txt');

for (let k = 0; k < dirCsv.length; k++) {

    
    var retCsv = fs.readFileSync('./csv/'+dirCsv[k], 'utf-8');
    var retFormato = fs.readFileSync('./txt/'+dirTxt[k], 'utf-8');

    var csvSplit = retCsv.split(/\r?\n/);
    var formatoSplit = retFormato.split(/\r?\n/);
    var tamanho = formatoSplit.length;
    
    
    
    let j = 0;
    
    csvSplit.forEach(linha => {
    let query = 'insert into bem_candidato values (';
    var splites = linha.split(';');
    
    splites.forEach((s) => {
        let f = formatoSplit[j];
        
        if (f == 'date' || f == 'time' || f == 'varchar(255)') {
            query += `'${s.toString().replace(/"/g, '').replace(/,/g, '.')}'`
        }
        else
        query += `${s.toString().replace(/"/g, '').replace(/,/g, '.')}`
        
        j++; 
        
        if (j < tamanho)
        query += ','
        if (j == tamanho)
        j = 0;
    })
    
    query += ')';
    log(query);
})
}
