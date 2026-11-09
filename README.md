# Portfolio

Personal portfolio of Denis Crismariu. A static site with no build step, hosted on GitHub Pages.

## Layout

```text
index.html        Page shell
content.js        All text, links and media references
assets/css/       Styles
assets/js/        Page rendering, hero animation, chart renderer
assets/data/      Thesis network and chart data
assets/img/       Photo and favicon
assets/media/     One folder of clips, images and papers per project
```

## Edit the content

All text and links live in [`content.js`](content.js). Add a link with `{ label, url }`, or add an object to `sections` to get a new block and nav entry. The comments at the top of the file list the available fields.

## Add photos and videos

Put files in `assets/media/<project>` and add a `media` entry to the project in `content.js`. Keep clips short and small (ideally under 10 MB), since GitHub rejects files over 100 MB. To shrink a recording and make a poster image:

```sh
ffmpeg -i input.mp4 -an -vf scale=960:-2 -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart assets/media/demo/clip.mp4
ffmpeg -ss 1 -i assets/media/demo/clip.mp4 -frames:v 1 assets/media/demo/clip.jpg
```

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

In the repository settings, go to **Pages**, choose **Deploy from a branch**, and select `master` and `/ (root)`. Every push to `master` then updates the site at https://crismariudenis.github.io/Portofolio/.
