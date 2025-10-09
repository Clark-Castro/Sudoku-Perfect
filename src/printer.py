import os
import sys


def inspect_and_output_files(directory="."):
    """
    Recursively iterates through all files in the given directory and its subdirectories,
    prints the absolute file path, and then prints the entire content of the file.
    It automatically ignores the script file itself.

    Handles exceptions for binary files (UnicodeDecodeError) and permission issues.
    """
    # Determine the absolute path of the running script for self-exclusion
    # sys.argv[0] holds the path used to execute the script.
    try:
        script_path = os.path.abspath(sys.argv[0])
    except IndexError:
        # Fallback in case sys.argv[0] is not available (e.g., in some environments)
        script_path = ""

    # Resolve the directory path for a clear output
    abs_directory = os.path.abspath(directory)
    print(f"--- Starting recursive file inspection in directory: {abs_directory} ---")
    print(f"--- Excluding the script file: {script_path} ---\n")

    file_count = 0

    # Use os.walk to iterate recursively through directories and files
    for root, dirs, files in os.walk(directory):
        # Iterate over all files found in the current directory (root)
        for filename in files:
            file_path = os.path.join(root, filename)

            # CRITICAL: Check if the current file is the inspection script itself
            if os.path.abspath(file_path) == script_path:
                print(
                    f"[Skipping] Ignoring the inspection script itself: {os.path.abspath(file_path)}"
                )
                continue  # Skip to the next file

            file_count += 1

            # Print file location and name
            print("=" * 70)
            # Use os.path.abspath(file_path) to ensure the full absolute path is displayed
            print(f"FILE: {os.path.abspath(file_path)}")
            print("=" * 70)
            print("CONTENT START:")

            try:
                # Open and read the entire content of the file using UTF-8 encoding
                # This is the standard encoding for text files.
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Print the content
                print(content)

            except UnicodeDecodeError:
                # This typically happens when trying to read binary files (like images or executables)
                # with a text reader.
                print(f"[Warning] Could not read content for {file_path}.")
                print(
                    "The file appears to be a binary file or uses a non-UTF-8 text encoding."
                )

            except PermissionError:
                # Handle files that the script doesn't have permission to read
                print(f"[Error] Permission denied to read file {file_path}.")

            except Exception as e:
                # Catch any other unexpected errors during file reading
                print(
                    f"[Error] An unexpected error occurred while processing {file_path}: {e}"
                )

            print("CONTENT END\n")
            print("~" * 70)  # Visual separation for the next file

    if file_count == 0:
        print(
            "No files found in this directory or its subdirectories (excluding the inspection script)."
        )


if __name__ == "__main__":
    # If you run the script with an argument (e.g., python file_inspector.py /path/to/dir),
    # it uses that path. Otherwise, it defaults to the current directory ('.').
    target_directory = sys.argv[1] if len(sys.argv) > 1 else "."
    inspect_and_output_files(target_directory)
