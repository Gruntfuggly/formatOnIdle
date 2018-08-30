# v0.0.11 - 2018-08-30
- Use document version to trigger format

# v0.0.10 - 2018-08-30
- Improve cursor positioning after the format

# v0.0.9 - 2018-08-30
- Don't use onDidChangeTextDocument otherwise the update can become recursive

# v0.0.8 - 2018-08-29
- Use all editor settings for simplicity

# v0.0.7 - 2018-08-29
- Apply edits from formatDocumentProvider instead of calling editor.action.format

# v0.0.6 - 2018-08-29
- Only trigger when selection events are from the keyboard or mouse

# v0.0.5 - 2018-08-29
- Reset format trigger on cursor movement too

# v0.0.4 - 2018-08-29
- Add default delay details to README.md

# v0.0.3 - 2018-08-29
- Only show the button when the current file has an available formatter

# v0.0.2 - 2018-08-29
- Fix links in README.md

# v0.0.1 - 2018-08-29
- Initial release
