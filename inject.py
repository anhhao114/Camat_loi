import os
from pathlib import Path

base_dir = Path(r"d:\Downloads\Lop11")
petals_js = base_dir / "petals.js"

count: int = 0
for html_file in base_dir.rglob("*.html"):
    if html_file.name == "index.html" and html_file.parent == base_dir:
        continue
        
    rel_path = os.path.relpath(petals_js, html_file.parent)
    rel_url = rel_path.replace("\\", "/")
    
    script_tag = f'<script src="{rel_url}"></script>'
    
    try:
        content = html_file.read_text(encoding="utf-8")
        if "petals.js" not in content:
            if "</body>" in content:
                new_content = content.replace("</body>", f"{script_tag}\n</body>")
            else:
                new_content = content + f"\n{script_tag}\n"
            html_file.write_text(new_content, encoding="utf-8")
            print(f"Injected into {html_file.relative_to(base_dir)}")
            count += 1 # type: ignore
    except Exception as e:
        print(f"Error processing {html_file.name}: {e}")

print(f"Total injected: {count}")
