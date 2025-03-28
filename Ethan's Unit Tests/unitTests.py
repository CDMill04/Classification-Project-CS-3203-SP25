import unittest
import os
from transcripts import Transcript

class TestTranscripts(unittest.TestCase):

    # Sets up a Transcript() object and example files to test with.
    def setUp(self):

        # Set up the directory of this file (in VSCode) as the file_path baseline.
        base_dir = os.path.dirname(__file__)


        self.handler = Transcript()
        self.good_txt = os.path.join(base_dir, "transcript.txt") # Should pass.
        self.bad_txt = os.path.join(base_dir, "fail.txt")        # Should fail due to being incorrectly formatted.
        self.bad_pdf = os.path.join(base_dir, "fail.pdf")        # Should fail due to being the wrong file type.

    # Tests that transcript.txt is correctly parsed for student name and grade.
    def test_good_txt_file(self):

        # Check that upload_transcript() uploads the file correctly.
        uploaded_file = self.handler.upload_transcript(self.good_txt)
        self.assertEqual(uploaded_file, self.good_txt)

        # Check that read_transcript() records the student's name and grade.
        name, grade, courses = self.handler.read_transcript()
        self.assertEqual(name, "John Doe")
        self.assertEqual(grade, "12")

        # Check that all three courses match their expected values.
        self.assertEqual(courses[0], "CS 3203: Software Engineering")
        self.assertEqual(courses[1], "CS 2113: Programming Abstractions and Principles")
        self.assertEqual(courses[2], "CS 4013: Artificial Intelligence")


    # Tests that fail.txt fails because it is formatted incorrectly.
    def test_incorrect_format(self):

        # Upload the file.
        uploaded_file = self.handler.upload_transcript(self.bad_txt)
        self.assertEqual(uploaded_file, self.bad_txt)

        # Assert that the file read failed because it is improperly formatted.
        with self.assertRaises(ValueError):
            self.handler.read_transcript()

    # Tests that fail.pdf fails because it is the incorrect file type.
    def test_incorrect_filetype(self):

        # Asserts that the file upload failed.
        with self.assertRaises(ValueError):
            self.handler.upload_transcript(self.bad_pdf)

# Run the unit tests.
if __name__ == '__main__':
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestTranscripts)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)