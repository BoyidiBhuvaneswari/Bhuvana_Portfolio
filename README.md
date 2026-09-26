# Bhuvaneswari Boyidi Portfolio

A static HTML, CSS, and JavaScript portfolio. No build step or package installation is required.

## Run locally

From this folder in PowerShell:

```powershell
py -m http.server 5500
```

Open <http://localhost:5500> and stop the server with `Ctrl+C`.

## Verify

Node.js is used only for repository checks; the website itself has no Node dependencies.

```powershell
npm.cmd test
```

`npm.cmd` avoids the common Windows PowerShell execution-policy restriction on `npm.ps1`.

The command checks JavaScript syntax, local asset and anchor links, image metadata, external-link hardening, keyboard semantics, dialog attributes, and reduced-motion safeguards.
