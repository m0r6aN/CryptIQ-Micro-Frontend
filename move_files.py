import os
import shutil

def move_files(source_base, destination_base):
    # Loop through batch folders
    for i in range(1, 18):  # From Batch_1 to Batch_17
        batch_folder = f"CryptIQ_Micro_Frontend_Batch_{i}"
        source_path = os.path.join(source_base, batch_folder, "services")
        
        if not os.path.exists(source_path):
            print(f"Skipping {batch_folder}: services folder not found")
            continue
        
        # Loop through service folders
        for service_folder in os.listdir(source_path):
            source_service_path = os.path.join(source_path, service_folder)
            destination_service_path = os.path.join(destination_base, "services", service_folder)
            
            if not os.path.isdir(source_service_path):
                continue
            
            # Create destination folder if it doesn't exist
            os.makedirs(destination_service_path, exist_ok=True)
            
            # Move files
            for item in os.listdir(source_service_path):
                s = os.path.join(source_service_path, item)
                d = os.path.join(destination_service_path, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
            
            print(f"Moved contents of {service_folder} from {batch_folder}")

# Set your source and destination base paths
source_base = r"D:\Repos\CryptIQ-Micro-Frontend"
destination_base = r"D:\Repos\CryptIQ-Micro-Frontend"

# Run the script
move_files(source_base, destination_base)