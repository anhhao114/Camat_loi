import os
from pathlib import Path

base_dir = Path(r"d:\Downloads\Lop11")

count = 0
for css_file in base_dir.rglob("*.css"):
    # Bỏ qua style.css chính và shared-styles.css ở thư mục gốc
    if css_file.parent == base_dir:
        continue
        
    try:
        content = css_file.read_text(encoding="utf-8")
        
        # Tìm dòng @import (nếu có)
        import_line = ""
        for line in content.splitlines():
            if line.strip().startswith("@import"):
                import_line = line.strip()
                break
                
        # Nếu không có, tự tạo dựa trên độ sâu thư mục
        if not import_line:
            rel_path = css_file.relative_to(base_dir)
            depth = len(rel_path.parts) - 1
            if depth == 1:
                import_line = "@import url('../shared-styles.css');"
            elif depth == 2:
                import_line = "@import url('../../shared-styles.css');"
                
        # Ghi đè file chỉ với dòng @import
        new_content = f"/* Tự động làm sạch để dùng theme Thanh Xuân */\n{import_line}\n"
        css_file.write_text(new_content, encoding="utf-8")
        print(f"Cleaned {css_file.relative_to(base_dir)}")
        count += 1
    except Exception as e:
        print(f"Error processing {css_file.name}: {e}")

print(f"Total cleaned CSS files: {count}")
