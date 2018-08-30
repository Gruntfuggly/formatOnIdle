var vscode = require( 'vscode' );
var path = require( 'path' );

var timer;
var button;

function activate( context )
{
    function isFormatterAvailable( done )
    {
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document )
        {
            vscode.commands.executeCommand( 'vscode.executeFormatDocumentProvider', editor.document.uri, {} ).then( function()
            {
                done( true );
            } ).catch( function()
            {
                done( false );
            } );
        }
        done( false );
    }

    function doFormat()
    {
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document )
        {
            var options = vscode.workspace.getConfiguration( 'editor' );
            vscode.commands.executeCommand( 'vscode.executeFormatDocumentProvider', editor.document.uri, options ).then( function( edits )
            {
                var workspaceEdit = new vscode.WorkspaceEdit();
                workspaceEdit.set( editor.document.uri, edits );
                vscode.workspace.applyEdit( workspaceEdit );
            } ).catch( {} );
        }
    }

    function getExtension()
    {
        var editor = vscode.window.activeTextEditor;
        if( editor && editor.document )
        {
            ext = path.extname( editor.document.fileName );
            if( ext && ext.length > 1 )
            {
                return ext.substr( 1 );
            }
        }
        return "";
    }

    function isEnabled()
    {
        var extension = getExtension();
        var enabled = vscode.workspace.getConfiguration( 'formatOnIdle' ).get( 'enabled' );
        return Object.keys( enabled ).length === 0 || ( extension.length > 0 && enabled[ extension ] );
    }

    function triggerFormat()
    {
        var delay = parseInt( vscode.workspace.getConfiguration( 'formatOnIdle' ).get( 'delay' ) );

        clearTimeout( timer );

        if( isEnabled() && delay > 0 )
        {
            timer = setTimeout( doFormat, delay );
        }
    }

    function updateButton()
    {
        var extension = getExtension();

        var enabled = isEnabled() === true;

        button.text = "$(watch) $(" + ( enabled ? "check" : "x" ) + ")";
        button.command = 'formatOnIdle.' + ( enabled ? 'disable' : 'enable' );
        button.tooltip = ( enabled ? 'Disable' : 'Enable' ) + " Format On Idle for ." + extension + " files";

        isFormatterAvailable( function( available )
        {
            if( extension.length > 0 && available )
            {
                button.show();
            }
            else
            {
                button.hide();
            }
        } );
    }

    function createButton()
    {
        if( button )
        {
            button.dispose();
        }

        button = vscode.window.createStatusBarItem(
            vscode.workspace.getConfiguration( 'formatOnIdle' ).get( 'buttonAlignment' ) + 1,
            vscode.workspace.getConfiguration( 'formatOnIdle' ).get( 'buttonPriority' ) );

        context.subscriptions.push( button );

        updateButton();
    }

    function configure( shouldEnable )
    {
        var enabled = vscode.workspace.getConfiguration( 'formatOnIdle' ).get( 'enabled' );
        var extension = getExtension();
        enabled[ extension ] = shouldEnable;
        vscode.workspace.getConfiguration( 'formatOnIdle' ).update( 'enabled', enabled, true );
    }

    context.subscriptions.push( vscode.window.onDidChangeTextEditorSelection( function( e )
    {
        if( e.kind === vscode.TextEditorSelectionChangeKind.Keyboard ||
            e.kind === vscode.TextEditorSelectionChangeKind.Mouse )
        {
            triggerFormat();
        }
    } ) );

    context.subscriptions.push( vscode.commands.registerCommand( 'formatOnIdle.enable', function() { configure( true ); } ) );
    context.subscriptions.push( vscode.commands.registerCommand( 'formatOnIdle.disable', function() { configure( false ); } ) );

    context.subscriptions.push( vscode.window.onDidChangeActiveTextEditor( function()
    {
        clearTimeout( timer );
        updateButton();
    } ) );

    vscode.workspace.onDidOpenTextDocument( function()
    {
        if( !button )
        {
            createButton();
        }
        else
        {
            clearTimeout( timer );
            updateButton();
        }
    } );

    context.subscriptions.push( vscode.workspace.onDidChangeConfiguration( function( e )
    {
        if(
            e.affectsConfiguration( 'formatOnIdle.delay' ) ||
            e.affectsConfiguration( 'formatOnIdle.enabled' ) )
        {
            triggerFormat();
            updateButton();
        }
        else if(
            e.affectsConfiguration( 'formatOnIdle.buttonAlignment' ) ||
            e.affectsConfiguration( 'formatOnIdle.buttonPriority' ) )
        {
            createButton();
        }
    } ) );
}

function deactivate()
{
    clearTimeout( timer );
}

exports.activate = activate;
exports.deactivate = deactivate;
