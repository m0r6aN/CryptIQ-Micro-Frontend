import os

def rename_ai_based_files(root_dir):
    # Walk through all files and subdirectories in the given directory
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            # Check if the filename starts with "ai_based_"
            if filename.startswith("ai_based_"):
                # New filename without the "ai_based_" prefix
                new_filename = filename.replace("ai_based_", "", 1)
                old_filepath = os.path.join(dirpath, filename)
                new_filepath = os.path.join(dirpath, new_filename)
                
                # Rename the file
                os.rename(old_filepath, new_filepath)
                print(f"Renamed: {old_filepath} -> {new_filepath}")

# Replace with the root directory you want to scan
root_directory = "D:/Repos/CryptIQ-Micro-Frontend/services"
rename_ai_based_files(root_directory)
