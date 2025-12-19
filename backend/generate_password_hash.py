#!/usr/bin/env python3
"""
Script to generate password hash for admin authentication.
Usage: python generate_password_hash.py <password>
"""
import sys
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

if len(sys.argv) < 2:
    print("Usage: python generate_password_hash.py <password>")
    print("\nExample:")
    print("  python generate_password_hash.py mypassword123")
    sys.exit(1)

password = sys.argv[1]
password_hash = pwd_context.hash(password)

print("\n" + "="*60)
print("Password Hash Generated:")
print("="*60)
print(f"\nADMIN_PASSWORD_HASH={password_hash}")
print("\n" + "="*60)
print("\nAdd this to your .env file:")
print(f"ADMIN_USERNAME=admin")
print(f"ADMIN_PASSWORD_HASH={password_hash}")
print("="*60 + "\n")

