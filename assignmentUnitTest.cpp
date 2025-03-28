#include <iostream>
#include <fstream>
#include <vector>
#include <string>

class AssignmentDatabase {
private:
    std::string filename = "assignments.txt";

public:
    // Method to upload an assignment
    std::string uploadAssignment(const std::string& user_role, const std::string& teacher_id, const std::string& assignment) {
        if (user_role != "teacher") {
            return "Access Denied";
        }
        if (teacher_id.empty() || assignment.empty()) {
            return "Missing Information";
        }
        std::ofstream file(filename, std::ios::app);
        if (!file) {
            return "Error Opening File";
        }
        file << "Teacher ID: " << teacher_id << " | Assignment: " << assignment << "\n";
        file.close();
        return "Assignment Uploaded";
    }

    // Method to view assignments
    std::string viewAssignments(const std::string& user_role) {
        if (user_role != "admin") {
            return "Access Denied";
        }
        std::ifstream file(filename);
        if (!file) {
            return "Error Opening File";
        }
        std::string line;
        while (std::getline(file, line)) {
            std::cout << line << std::endl;
        }
        file.close();
        return "Assignments Displayed";
    }
};

int main() {
    AssignmentDatabase db;
    
    try {
        std::cout << "Uploading assignment (success case): " << db.uploadAssignment("teacher", "T123", "Math Homework") << std::endl;
        std::cout << "Uploading assignment (failure case - wrong role): " << db.uploadAssignment("student", "T123", "Science Homework") << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Exception occurred during upload: " << e.what() << std::endl;
    }
    
    try {
        std::cout << "Viewing assignments (success case): " << db.viewAssignments("admin") << std::endl;
        std::cout << "Viewing assignments (failure case - wrong role): " << db.viewAssignments("teacher") << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Exception occurred during view: " << e.what() << std::endl;
    }
    
    return 0;
}