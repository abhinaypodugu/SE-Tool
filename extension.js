// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
let globalMsg;
// const webview_1 = require("./webview");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "errortest" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('errortest.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		{
			var out = vscode.languages.getDiagnostics();
		}
		// Display a message box to the user
		vscode.window.showInformationMessage("cool");
		console.log(out);

		// formation of the error selection list
		let errorMessages = [];
		out.forEach((value) => {
			value[1].forEach((value) => {
				let error = value.message;
				if (value.source !== undefined) {
					error += ' ' + value.source;
				}
				errorMessages.push(error);
			});
		});

		// show the selection window
		vscode.window.showQuickPick(errorMessages)
			// process the response
			.then((value) => {
				if (value !== undefined)
					openBrowser(value);
			});
		
	});
	context.subscriptions.push(disposable);

// ----------------------------------------------------------------------------------------------------------------------------------------------------
	
	let stackOverdlowView = vscode.commands.registerCommand('extension.StackOverflow View', () => {
		globalMsg = '';
		// Create and show panel
		const panel = vscode.window.createWebviewPanel('stackOverflow', 'StackOverflow View', vscode.ViewColumn.Two, {
			enableScripts: true
		});

		{
			var out = vscode.languages.getDiagnostics();
		}

		console.log(out);

		// formation of the error selection list
		let errorMessages = [];
		let displayContent = '';
		out.forEach((value) => {
			value[1].forEach((value) => {
				let error = value.message;
				if (value.source !== undefined) {
					error += ' in ' + value.source;
				}
				error = error.replace(/[']/g, "");
				error = error.replace("Undefined variable:", "");
				error = " \"" + error + "\" ";
				errorMessages.push(error);
				console.log(error);
			});
		});

		errorMessages.forEach((value) => {
			displayContent += " <div id='search' class='Msgcard' onclick=' errorclick( " + value + " ) ' ><p> " + value + " </p></div> "
		});
		globalMsg = displayContent;

		// And set its HTML content
		panel.webview.html = getHtmlContent();
	});
	context.subscriptions.push(stackOverdlowView);
}



function getHtmlContent() {
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Integrated Stackoverflow Search</title>
			<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap" rel="stylesheet">
			<link rel="stylesheet" href="https://firebasestorage.googleapis.com/v0/b/setool-f6043.appspot.com/o/view.css?alt=media&token=51a6ffb5-00d4-4172-bb12-a95b6a9d3fdb">
			<style>
			body{
				background-color:#ddd !important;
			}
			</style>
		</head>
		<body>
			<div style="padding:20px;">
				<h3 style="color:#111;font-weight:bold;">Errors</h3>
								${globalMsg}

				<div id="answers" style="margin-top:20px;">
				</div>
			</div>
			<script src="https://firebasestorage.googleapis.com/v0/b/setool-f6043.appspot.com/o/helper.js?alt=media&token=7608f3a2-f889-44a6-9b7f-603a778aea7c"></script>
		</body>
	</html>`
	;
}


// this method is called when your extension is deactivated
function deactivate() {
	
}

function openBrowser(str) {
	console.log(str);
	let searchQuery = "https://www.google.com/search?q=" + encodeURI(str + ' site:stackoverflow.com');
	vscode.env.openExternal(vscode.Uri.parse(searchQuery));
}

module.exports = {
	activate,
	deactivate
}
