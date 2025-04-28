#include <iostream>
#include <string>
#include <vector>
#include <cassert>

class Backlog {
private:
    std::vector<std::string> features; // Stores features
    bool is_open;
    std::string name;

public:
    // Constructor
    Backlog() : is_open(false), name("Default Backlog") {}

    // Opens the backlog
    void openBacklog() { is_open = true; }

    // Closes the backlog
    void closeBacklog() { is_open = false; }

    // Checks if backlog is open
    bool isOpen() const { return is_open; }

    // Renames the backlog
    void rename(const std::string& newName) { name = newName; }

    // Creates a new backlog (resets it)
    void createBacklog() { features.clear(); is_open = true; }

    // Deletes backlog (empties it and closes)
    void deleteBacklog() { features.clear(); is_open = false; }

    // Adds a feature
    void addFeature(const std::string& feature) { features.push_back(feature); }

    // Edits a feature at a given index
    bool editBacklog(int index, const std::string& newFeature) {
        if (index < 0 || index >= features.size()) return false;
        features[index] = newFeature;
        return true;
    }

    // Gets backlog as a formatted string
    std::string getBacklog() const {
        std::string result;
        for (const auto& feature : features) {
            result += feature + "\n";
        }
        return result;
    }

    // Returns the number of features
    int size() const { return features.size(); }

    // Gets backlog name
    std::string getName() const { return name; }
};

// ** Unit Tests **

// Test opening backlog
void testOpenBacklog() {
    Backlog backlog;
    backlog.openBacklog();
    std::cout << (backlog.isOpen() ? "1\n" : "0\n");
}

// Test closing backlog
void testCloseBacklog() {
    Backlog backlog;
    backlog.openBacklog();
    backlog.closeBacklog();
    std::cout << (!backlog.isOpen() ? "1\n" : "0\n");
}

// Test renaming backlog
void testRenameBacklog() {
    Backlog backlog;
    backlog.rename("Sprint 1 Features");
    std::cout << (backlog.getName() == "Sprint 1 Features" ? "1\n" : "0\n");
}

// Test creating backlog
void testCreateBacklog() {
    Backlog backlog;
    backlog.createBacklog();
    std::cout << (backlog.isOpen() && backlog.size() == 0 ? "1\n" : "0\n");
}

// Test deleting backlog
void testDeleteBacklog() {
    Backlog backlog;
    backlog.addFeature("Feature 1");
    backlog.deleteBacklog();
    std::cout << (!backlog.isOpen() && backlog.size() == 0 ? "1\n" : "0\n");
}

// Test editing backlog (valid index)
void testEditBacklogPositive() {
    Backlog backlog;
    backlog.addFeature("Old Feature");
    bool edited = backlog.editBacklog(0, "New Feature");
    std::cout << (edited && backlog.getBacklog() == "New Feature\n" ? "1\n" : "0\n");
}

// Test editing backlog (invalid index)
void testEditBacklogNegative() {
    Backlog backlog;
    backlog.addFeature("Old Feature");
    bool edited = backlog.editBacklog(5, "New Feature"); // Invalid index
    std::cout << (!edited ? "1\n" : "0\n");
}

// ** Run All Tests **
int main() {
    std::cout << "All unit tests output 1 for success, 0 for failure.\n\n";

    std::cout << "Test Open Backlog: "; testOpenBacklog();
    std::cout << "Test Close Backlog: "; testCloseBacklog();
    std::cout << "Test Rename Backlog: "; testRenameBacklog();
    std::cout << "Test Create Backlog: "; testCreateBacklog();
    std::cout << "Test Delete Backlog: "; testDeleteBacklog();
    std::cout << "Test Edit Backlog - Positive: "; testEditBacklogPositive();
    std::cout << "Test Edit Backlog - Negative: "; testEditBacklogNegative();

    return 0;
}
