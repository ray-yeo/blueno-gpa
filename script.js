var courseGrade;
var courseDepartment;
var courseCode;
var courseName;
var courseWeight;


function processCourseGrade() {
    // Do something with the extracted information
    console.log("Course Grade:", courseGrade);

    // You can also call other functions or perform additional processing with courseGrade here
        // only grab courses that one has gotten a grade for
    var grade_dict = {"A": 4, "B": 3, "C":2};



    // Get the checkbox element by its id
    var option1Checkbox = document.getElementById('option1Checkbox');

    // Check if option1 is selected
    if (option1Checkbox.checked) {
        grade_dict["S*"] = 4;
        console.log('Option1 is selected');
    }

    // Get the checkbox element by its id
    var option2Checkbox = document.getElementById('option2Checkbox');

    // Check if option1 is selected
    if (option2Checkbox.checked) {
        grade_dict["S"] = 4;
        console.log('Option2 is selected');
        // Perform desired action for option1 being selected
    }

    // Get the checkbox element by its id
    var option3Checkbox = document.getElementById('option3Checkbox');

    var total_points = 0;
    var total_completed_courses = 0;
    var counter = 0;

    var course_included = [];



    if (option3Checkbox.checked) {
        console.log('Option3 is selected');
        for (var i = 0; i < courseGrade.length; i++) {
            if (!(courseGrade[i] in grade_dict)) {
            course_included.push(false);
            } else {
            total_points += grade_dict[courseGrade[i]] * parseFloat(courseWeight[counter]);
            total_completed_courses += parseFloat(courseWeight[counter]);
            course_included.push(true);
            }
            counter++;
        }
    } else {
        for (var i = 0; i < courseGrade.length; i++) {
            if (!(courseGrade[i] in grade_dict)) {
            course_included.push(false);
            } else {
            total_points += grade_dict[courseGrade[i]];
            total_completed_courses += 1;
            course_included.push(true);
            }
            counter++;
        }
    }
    // calculate GPA
    var GPA = total_points / total_completed_courses;
    let roundedNum = GPA.toFixed(2);
    console.log(roundedNum)
    document.getElementById("GPA").textContent = "GPA: " + roundedNum;
}


function calculateGPA() {
    var htmlString;

    var input = document.querySelector('input[name="uploaded_file"]');
    var uploadedFile = input.files[0]; // Assign the uploaded file to the variable

    if (!uploadedFile) {
        alert("No file selected");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var htmlString = e.target.result;

        // Create a new DOM parser
        var parser = new DOMParser();

        // Parse the HTML string into a Document object
        var doc = parser.parseFromString(htmlString, 'text/html');

        // Use BeautifulSoup-like syntax to select elements and extract information
        courseDepartment = Array.from(doc.querySelectorAll('td[width="20"][align="left"]')).map(td => td.textContent.trim());
        courseCode = Array.from(doc.querySelectorAll('td[width="40"][align="left"]')).map(td => td.textContent.trim());
        courseName = Array.from(doc.querySelectorAll('td[width="305"][align="left"]')).map(td => td.textContent.trim());
        courseGrade = Array.from(doc.querySelectorAll('td[width="55"][align="left"]')).map(td => td.textContent.trim());
        courseWeight = Array.from(doc.querySelectorAll('td[width="60"][align="right"]')).map(td => td.textContent.trim());
        console.log(courseGrade)

        processCourseGrade();
    };
    reader.readAsText(uploadedFile);
}
