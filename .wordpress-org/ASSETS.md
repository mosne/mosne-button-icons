# WordPress.org plugin assets

Add the following files in this directory before publishing or running the asset-update workflow:

| File | Size | Notes |
|------|------|--------|
| `banner-1544x500.png` | 1544×500 | High-DPI banner |
| `banner-772x250.png` | 772×250 | Standard banner |
| `icon-256x256.png` | 256×256 | High-DPI icon |
| `icon-128x128.png` | 128×128 | Standard icon |
| `screenshot-1.png` (or `.jpg`) | — | Referenced in `readme.txt` |
| `screenshot-2.png` (or `.jpg`) | — | Referenced in `readme.txt` |
| `screenshot-3.png` (or `.jpg`) | — | Referenced in `readme.txt` |

After uploading assets and updating `readme.txt` screenshot captions, run the GitHub Action **Update Readme and Assets on WordPress.org** (`update-readme.yml`) with `SVN_USERNAME` / `SVN_PASSWORD` secrets configured.
