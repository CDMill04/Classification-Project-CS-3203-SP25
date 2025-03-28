import os

# Class to upload Transcript.txt files and read Transcript.txt files for courses
class Transcript:
    def __init__(self):
        self.transcript = None
        self.studentName = None
        self.grade = None
        self.courses = []
    
    # Function to upload transcripts.
    def upload_transcript(self, file_path):
        # Checks if the file_path is valid and found.
        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Checks that the given file type is correct.
        valid_extensions = ('.txt',)
        _, extension = os.path.splitext(file_path)
        if extension.lower() not in valid_extensions:
            raise ValueError(f"Invalid file type: {extension}")
        
        self.transcript = file_path
        return self.transcript
    
    # Function to read the uploaded transcripts.
    def read_transcript(self):
        # Checks that a transcript has been uploaded and exists.
        if not self.transcript:
            raise ValueError("No transcript has been uploaded yet.")
        
        # Reads the studentName, grade, and courses from the transcript file.
        with open(self.transcript, 'r', encoding = 'utf-8') as f:
            for line in f:
                line = line.strip()

                # Record studentName.
                if line.startswith("Student Name: "):
                    self.studentName = line.replace("Student Name: ", "").strip()
                
                # Record grade.
                elif line.startswith("Grade: "):
                    self.grade = line.replace("Grade: ", "").strip()

                # Record courses.
                elif line and not line.startswith("Student Name: ") and not line.startswith("Grade: "):
                    self.courses.append(line)

        if not self.studentName or not self.grade:
            raise ValueError("Transcript file is not formatted correctly.")

        return(self.studentName, self.grade, self.courses)