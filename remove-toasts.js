const fs = require('fs');
const path = require('path');
const workspace = 'c:\\Users\\hudar\\Documents\\[1] Huda Rasyad Wicaksono\\[3] Project\\[1] Project Website\\LPPM';
const files = [
  "components/shop/shop-header.tsx",
  "components/shop/book-card.tsx",
  "app/(shop)/profil/page.tsx",
  "app/(shop)/pembayaran/va/page.tsx",
  "app/(shop)/pembayaran/page.tsx",
  "app/(shop)/dashboard/page.tsx",
  "app/(shop)/checkout/page.tsx",
  "app/(auth)/verifikasi-otp/page.tsx",
  "app/(auth)/reset-password/page.tsx",
  "app/(auth)/login/page.tsx",
  "app/(auth)/forgot-password/page.tsx",
  "app/(auth)/daftar/page.tsx"
];

for (const f of files) {
  const fullPath = path.join(workspace, f);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace if/else toasts
  content = content.replace(/if\s*\([^)]+\)\s*toast\.success\([^)]+\);\s*else\s*toast\.error\(([^)]+)\);/g, 'if (!result.ok) toast.error($1);');
  
  // Replace remaining toast.success and toast.info
  content = content.replace(/[ \t]*toast\.success\([^)]+\);?\r?\n/g, '');
  content = content.replace(/[ \t]*toast\.info\([^)]+\);?\r?\n/g, '');
  content = content.replace(/onClick=\{\(\)\s*=>\s*toast\.info\([^)]+\)\}/g, 'onClick={() => {}}');
  
  fs.writeFileSync(fullPath, content, 'utf8');
}
