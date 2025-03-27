#include <iostream>
#include <exception>
using namespace std;

class UINotEnabledException : public exception { //This is the exception class for the entire UI not being enabled
    public:
     const char* what() const throw() { 
        return "The UI is not enabled or implemented correctly";
    }
};

class FeatureNotImplementedException : public exception { //This is the exception class for some features not being implemented correctly
public:
    const char* what() const throw() {
        return "The feature is not implemented or available";
    }
};

class ProgramLooks { //This is the test class for the UI
    protected:
    bool UIEnabled; //The actual UI enabled indicator

    public: //These that follow are functions and methods to test and measure UI workability
    ProgramLooks(bool enabled) : UIEnabled(enabled) {}
    bool getUIEnabled() const;
    bool testUIEnabled();
    bool testFeatureImplement(int numAspects);
};

bool ProgramLooks::getUIEnabled() const { //A getter for the UIEnabled
    return UIEnabled;
}


bool ProgramLooks::testUIEnabled() { //This one actually tests if the UI is on
    bool trueEnabled = false; //Sets the value to false and sees if that remains true
    trueEnabled = getUIEnabled();
    if (trueEnabled) {
        return true;
    } else {
        throw UINotEnabledException(); //Throws an exception if not
    }
};

bool ProgramLooks::testFeatureImplement(int numAspects) { //This one checks to make sure that the aspects of the features work
    if (numAspects < 0) {
        throw FeatureNotImplementedException(); //If it is less than 0, error
    } else if (numAspects == 0) {
        cout << "UI is enabled but empty." << endl; //Otherwise its enabled
        return false;
    } else if (numAspects > 100) {
        throw FeatureNotImplementedException(); //If it is over 100, error
    } else {
        cout << "UI is handling " << numAspects << " aspects correctly." << endl; //If it reaches this, it works
        return true;
    }
}

int main() {

    try {
        ProgramLooks uiTest(true); //Set the value to true or false
        
        //Test UIEnabled
        cout << "Testing UI Enabled: " << (uiTest.testUIEnabled() ? "Working" : "Not Working") << endl;
        
        //Test Feature Implementation with different numAspects values
        int testValues[] = {-1, 0, 5, 75, 120};
        for (int i = 0; i < 5; i++) {
            try {
                cout << "Testing Feature Implementation with " << testValues[i] << " aspects: ";
                bool result = uiTest.testFeatureImplement(testValues[i]);
                cout << (result ? "Success" : "Failure") << endl;
            } catch (const exception& e) {
                cout << "Error: " << e.what() << endl;
            }
        }
    } catch (const exception& e) { //Catch exceptions
        cout << "Exception caught: " << e.what() << endl;
    }
    return 0;
}
