function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('AutoFill Docs');
  menu.addItem('Create New Docs', 'createNewGoogleDocs')
  menu.addToUi();
}


function createNewGoogleDocs() {
  //Este valor deve ser o id do seu modelo de documento google docs
  const googleDocTemplate = DriveApp.getFileById('1IS7gDKxHFmkFFsfQYKZXNdEzTnfjc4JgeWR74ulBdNw');
  
  //Este valor deve ser o id da pasta onde você deseja que seus documentos completos sejam armazenados
  const destinationFolder = DriveApp.getFolderById('1Xtvo62KT6LSov8qQnD41OQnjNER4rcku')
  //Aqui, armazenamos a planilha como uma variável
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data') 

  //Agora obtemos todos os valores como uma matriz 2D
  //getDataRange()
  const rows = sheet.getDataRange().getValues(); 
  
  //Comece a processar cada linha da planilha
  rows.forEach(function(row, index){
    //Aqui, verificamos se esta linha são os cabeçalhos, em caso afirmativo, pulamos
    if (index === 0) return;
    //Aqui, verificamos se um documento já foi gerado observando o 'Document Link', se assim for, o ignoramos
    if (row[6]) return;
    //Usando os dados de linha em um modelo, fazemos uma cópia de nosso documento de modelo em nossa pasta de destino
    const copy = googleDocTemplate.makeCopy(`${row[0]}` , destinationFolder)

    //Assim que tivermos a cópia, nós a abrimos usando o DocumentApp
    const doc = DocumentApp.openById(copy.getId())
    //Todo o conteúdo está no corpo, então temos isso para edição
    const body = doc.getBody();
        
    //Nesta linha, dividimos o conteúdo de "planos" e atribuimos em pelo menos duas variáveis
    const [nome, sobrenome] = row[0].split(" ");

    //Nesta linha, fazemos uma formatação de data amigável
    const friendlyDate = new Date(row[5]).toLocaleDateString();
    
    //Nessas linhas, substituímos nossos tokens de substituição por valores de nossa linha de planilha
    body.replaceText('{{Nome}}', nome);
    body.replaceText('{{Sobrenome}}', sobrenome);
    body.replaceText('{{Telefone}}', row[1]);
    body.replaceText('{{E-mail}}', row[2]);
    body.replaceText( '{{Cidade}}' , row[3]);
    body.replaceText('{{Estado}}', row[4]); 
    body.replaceText('{{Data}}', friendlyDate);
    
    
    //Tornamos nossas alterações permanentes salvando e fechando o documento
    doc.saveAndClose(); 

    //Documento modificado é exportado como um arquivo PDF
    //var docblob = doc.getBlob();
    //docblob.setName(doc.getName() + ".pdf");
    
    //o arquivo PDF criado é colocado na pasta raiz (como salvar em pasta específica????)    
    //docpdf = DriveApp.createFile(docblob);   
    
    
    //Armazene o url do nosso novo documento em uma variável
    const url = doc.getUrl();
    //Escreva esse valor de volta na coluna 'Link do Documento' na planilha. 
    sheet.getRange(index + 1, 7).setValue(url)
    
  })
  
}