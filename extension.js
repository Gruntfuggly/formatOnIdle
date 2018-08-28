var vscode = require( 'vscode' ),
    path = require( 'path' );

function activate( context )
{
    function go( e )
    {
        var editor = vscode.window.activeTextEditor;
        var version = editor.document.version;

        if( !lastVersion || version > lastVersion )
        {
            lastVersion = version;
            clearTimeout( formatTimeout );
            if( vscode.workspace.getConfiguration( 'autoAlign' ).enabled[ getExtension() ] )
            {
                var delay = vscode.workspace.getConfiguration( 'autoAlign' ).delay;
                if( e && ( e.kind && e.kind == vscode.TextEditorSelectionChangeKind.Mouse ) )
                {
                    delay = 0;
                }

                formatTimeout = setTimeout( function()
                {
                    if( !e || e.kind === undefined || e.kind == vscode.TextEditorSelectionChangeKind.Keyboard )
                    {
                        align( vscode.workspace.getConfiguration( 'autoAlign' ).enabled[ getExtension() ] === true );
                    }
                    positionCursor();
                    setTimeout( decorate, 100 );
                }, delay );
            }
        }
    }

    vscode.window.onDidChangeTextEditorSelection( go );
    vscode.window.onDidChangeActiveTextEditor( function( e )
    {
        var enabled = vscode.workspace.getConfiguration( 'autoAlign' ).enabled[ getExtension() ];
        vscode.commands.executeCommand( 'setContext', 'auto-align-enabled', enabled );
        if( enabled )
        {
            go();
        }
    } );

    var editor = vscode.window.activeTextEditor;

    if( editor && editor.document )
    {
        go( {} );
    }
}

exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
