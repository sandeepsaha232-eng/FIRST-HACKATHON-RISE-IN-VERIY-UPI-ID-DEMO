import sys
import pkg_resources

print("🔍 Python Path:", sys.path)
try:
    installed = {pkg.key for pkg in pkg_resources.working_set}
    print("📦 Installed Packages:", installed)
    if 'passlib' in installed:
        print("✅ passlib is installed")
    else:
        print("❌ passlib is MISSING from working_set")
except Exception as e:
    print("⚠️ Could not list packages:", e)

from app.main import app

# Vercel looks for 'app' variable in this file
