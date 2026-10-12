import sys
from pathlib import Path

root = Path(__file__).resolve().parent
css = (root / "style.css").read_text()
js = (root / "script.js").read_text()


def build(title, body, out):
    h = (root / "head.html").read_text().replace("__TITLE__", title).replace("__CSS__", css)
    t = (root / "tail.html").read_text().replace("__JS__", js)
    Path(out).write_text(h + Path(body).read_text() + t)


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3])
