##Sessione 4/4/2016 - [XE One Day Real App](http://www.xedotnet.org/eventi/one-day-real-app) 
#Angular e Typescript un binomio perfetto

###PRE-REQUISITI
- Installare [node.js](https://nodejs.org/en/download/)
- Installare [VS Code](https://code.visualstudio.com/#alt-downloads)
- Installare typescript e tsd da NPM	`npm i -g typescript tsd`

###CODICE TS
Il codice Typescript che mostra come gestire in Angular 1.x un progetto basato sulla 
component architecture e' nella cartella	[/App_Plugins/xeCustom/xeModule/](App_Plugins/xeCustom/xeModule)

Per compilare i file TS e far generare in modo continuo l'app_bundle.js basta eseguire
il 	`buildTS.bat`	, oppure se entrate in VSCode basta premre `CTRL+SHIFT+B`

###ESEMPIO SU UMBRACO
Per poter provare il codice e' necessario aver installato [Umbraco](https://umbraco.com/download) 
seguendo le istruzioni della sessione di [Davide Contin](http://www.xedotnet.org/eventi/one-day-real-app)

Una volta installato Umbraco basta copiare il contenuto di queste 2 cartelle 
`App_Code` e `App_Plugins` per registrare e gestire una sezione custom su Umbraco

Inoltre e' necessario lanciare lo script `MODIFDB.sql` sul database di Umbraco in
modo da creare la tabella `Xe_EventSubscription` e caricarci dentro dei dati di esempio

Infine per visualizzare le pagine e' necessario accedere al backend di Umbraco da
http://your_local_site/umbraco autentificarsi come amministratore, e poi nella sezione
Users abilitare per il proprio utente la sezione [xeCustom] spuntandola.

###FAKE UMBRACO
E' possibile eseguire in locale una pagina (FAKE) che simula il minimo dell'ambiente Umbraco 
necessario a far girare l'applicazione e senza bisogno di IIS e Umbraco installato!
- Dalla cartella root del progetto installare *json-server* eseguendo   `npm install`
- Per lanciare il server usare il comando   `npm start`     e poi aprire [http://localhost:3000](http://localhost:3000)  