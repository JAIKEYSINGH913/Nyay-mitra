import os
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.permission import Permission
from appwrite.role import Role

# Configuration
ENDPOINT = 'https://cloud.appwrite.io/v1'
PROJECT_ID = '69ea8a7a002018cfcf34'
API_KEY = 'standard_abfbc805d9bb21f276dbb5c90276a4fcffcc42d789d010b383f70071e67b3d34b83d8bc54c2881b8debf77445c9fd9842034170a8f2645827e77a0ef012530fae355b912b1b0621bea99c48c83eeca6c019b67b7a215a4e047b093ddf73cffbad0464286d1909236949b05fe5d1f05a7b82944e82c9a02c82c2ae744d078dfb4'

DATABASE_ID = 'nyay_mitra'
COLLECTIONS = {
    'profiles': 'profiles',
    'chat_history': 'chat_history',
    'messages': 'messages',
    'service_history': 'service_history'
}

client = Client()
client.set_endpoint(ENDPOINT)
client.set_project(PROJECT_ID)
client.set_key(API_KEY)

databases = Databases(client)

def setup():
    print(f"--- Initializing Appwrite for Project: {PROJECT_ID} ---")
    
    # 1. Create Database
    try:
        databases.create(DATABASE_ID, 'Nyay-Mitra Core Database')
        print(f"[OK] Created Database: {DATABASE_ID}")
    except Exception as e:
        if 'already exists' in str(e).lower():
            print(f"[INFO] Database {DATABASE_ID} already exists.")
        else:
            print(f"[ERROR] Error creating database: {e}")

    # 2. Create Collections & Attributes
    
    # PROFILES
    try:
        databases.create_collection(DATABASE_ID, COLLECTIONS['profiles'], 'User Profiles', [
            Permission.read(Role.users()),
            Permission.update(Role.users()),
        ])
        print(f"[OK] Created Collection: profiles")
    except Exception as e:
        print(f"[INFO] Profiles collection status: {e}")

    # Add attributes & Indexes (Independent of creation)
    attrs = [
        ('username', 'string', 100, True),
        ('fullName', 'string', 200, True),
        ('email', 'string', 255, True),
        ('phone', 'string', 20, False),
        ('dob', 'string', 20, False),
        ('isProfileComplete', 'boolean', None, False)
    ]
    
    for attr_name, attr_type, size, required in attrs:
        try:
            if attr_type == 'string':
                databases.create_string_attribute(DATABASE_ID, COLLECTIONS['profiles'], attr_name, size, required)
            elif attr_type == 'boolean':
                databases.create_boolean_attribute(DATABASE_ID, COLLECTIONS['profiles'], attr_name, required)
            print(f"[OK] Attribute '{attr_name}' verified.")
        except: pass

    # Create Unique Indexes
    idxs = [
        ('unique_username', 'unique', ['username']),
        ('unique_email', 'unique', ['email']),
        ('unique_phone', 'unique', ['phone'])
    ]
    for idx_id, idx_type, idx_attrs in idxs:
        try:
            databases.create_index(DATABASE_ID, COLLECTIONS['profiles'], idx_id, idx_type, idx_attrs)
            print(f"[OK] Index '{idx_id}' verified.")
        except Exception as idx_err:
            if 'already exists' in str(idx_err).lower():
                print(f"[INFO] Index '{idx_id}' already exists.")
            else:
                print(f"[INFO] Index '{idx_id}' setup: {idx_err}")

    # CHAT HISTORY
    try:
        databases.create_collection(DATABASE_ID, COLLECTIONS['chat_history'], 'Chat History', [
            Permission.read(Role.users()),
            Permission.write(Role.users()),
        ])
        print(f"[OK] Created Collection: chat_history")
        databases.create_string_attribute(DATABASE_ID, COLLECTIONS['chat_history'], 'userId', 50, True)
        databases.create_string_attribute(DATABASE_ID, COLLECTIONS['chat_history'], 'title', 255, True)
        databases.create_datetime_attribute(DATABASE_ID, COLLECTIONS['chat_history'], 'createdAt', True)
    except Exception as e:
        print(f"[INFO] Chat history info: {e}")

    # MESSAGES
    try:
        databases.create_collection(DATABASE_ID, COLLECTIONS['messages'], 'Chat Messages', [
            Permission.read(Role.users()),
            Permission.write(Role.users()),
        ])
        print(f"[OK] Created Collection: messages")
        databases.create_string_attribute(DATABASE_ID, COLLECTIONS['messages'], 'chatId', 50, True)
        databases.create_string_attribute(DATABASE_ID, COLLECTIONS['messages'], 'role', 20, True)
        databases.create_string_attribute(DATABASE_ID, COLLECTIONS['messages'], 'content', 5000, True)
        databases.create_datetime_attribute(DATABASE_ID, COLLECTIONS['messages'], 'timestamp', True)
    except Exception as e:
        print(f"[INFO] Messages info: {e}")

    print("\n--- Setup Complete ---")
    print("Your Appwrite environment is now synchronized with the frontend code.")

if __name__ == "__main__":
    setup()
