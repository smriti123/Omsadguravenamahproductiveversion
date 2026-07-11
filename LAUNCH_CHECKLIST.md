# Launch Checklist

Before every upload or live deployment, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-site-preflight.ps1
```

Or double-click:

```text
pre-deploy-check.bat
```

Do not upload if the check fails.

This catches:

- Broken UTF-8 / mojibake Hindi text.
- The wrong or corrupted active JS bundle.
- Missing service-worker cache updates for changed assets.
- Missing `सत्संग-अंश` / excerpts wiring.
- Missing mobile hero spacing fixes.
- Invalid excerpts fallback JSON.

Avoid editing generated files like `assets/index-*.js` inside hosting file managers or old Windows editors. Upload them as UTF-8/binary-safe files.
